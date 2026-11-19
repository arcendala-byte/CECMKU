"use server";

import { prisma } from "@/lib/database/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const electionIdSchema = z.string().min(1).max(191);

export async function calculateResultsAction(electionId: string) {
  const session = await requireAdmin();
  const parsedId = electionIdSchema.safeParse(electionId);
  if (!parsedId.success) return { error: "Invalid election." };

  try {
    const election = await prisma.election.findUnique({
      where: { id: parsedId.data },
      select: { id: true, status: true },
    });
    if (!election) return { error: "Election not found." };
    if (election.status !== "CLOSED" && election.status !== "RESULTS_PENDING") {
      return { error: "Results can only be calculated after voting has closed." };
    }

    await prisma.$transaction(async (tx) => {
      const positions = await tx.electionPosition.findMany({
        where: { electionId: election.id },
        include: { candidates: { select: { candidateId: true } } },
      });

      await tx.electionResult.deleteMany({
        where: { electionId: election.id, verified: false },
      });

      for (const position of positions) {
        for (const candidate of position.candidates) {
          const voteCount = await tx.ballotSelection.count({
            where: {
              positionId: position.id,
              candidateId: candidate.candidateId,
              ballot: { electionId: election.id },
            },
          });

          await tx.electionResult.create({
            data: {
              electionId: election.id,
              positionId: position.id,
              candidateId: candidate.candidateId,
              voteCount,
              verified: false,
            },
          });
        }
      }

      const changed = await tx.election.updateMany({
        where: { id: election.id, status: { in: ["CLOSED", "RESULTS_PENDING"] } },
        data: { status: "RESULTS_PENDING" },
      });
      if (changed.count !== 1) throw new Error("ELECTION_STATUS_CHANGED");

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "CALCULATE_RESULTS",
          entityType: "Election",
          entityId: election.id,
        },
      });
    });

    revalidatePath(`/admin/elections/${election.id}`);
    revalidatePath("/admin/results");
    revalidatePath("/results");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to calculate results. Refresh and try again." };
  }
}

export async function publishResultsAction(electionId: string) {
  const session = await requireAdmin();
  const parsedId = electionIdSchema.safeParse(electionId);
  if (!parsedId.success) return { error: "Invalid election." };

  try {
    const election = await prisma.election.findUnique({
      where: { id: parsedId.data },
      select: { id: true, status: true, _count: { select: { results: true } } },
    });
    if (!election) return { error: "Election not found." };
    if (election.status !== "RESULTS_PENDING" || election._count.results === 0) {
      return { error: "Calculate results before publishing them." };
    }

    await prisma.$transaction(async (tx) => {
      const changed = await tx.election.updateMany({
        where: { id: election.id, status: "RESULTS_PENDING" },
        data: { status: "PUBLISHED" },
      });
      if (changed.count !== 1) throw new Error("ELECTION_STATUS_CHANGED");

      await tx.electionResult.updateMany({
        where: { electionId: election.id },
        data: { verified: true, publishedAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "PUBLISH_RESULTS",
          entityType: "Election",
          entityId: election.id,
        },
      });
    });

    revalidatePath(`/admin/elections/${election.id}`);
    revalidatePath("/admin/results");
    revalidatePath("/results");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Failed to publish results. Refresh and try again." };
  }
}
