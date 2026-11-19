"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/database/prisma";
import { electionSchema, getElectionTransitionError } from "@/lib/elections/rules";

export async function createElectionAction(prevState: unknown, formData: FormData) {
  const session = await requireAdmin();
  const parsed = electionSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
  });
  if (!parsed.success) return { error: "Invalid form data", fieldErrors: parsed.error.flatten().fieldErrors };
  if (parsed.data.startAt <= new Date()) return { error: "The voting period must start in the future." };

  try {
    const election = await prisma.election.create({
      data: { ...parsed.data, status: "DRAFT", createdById: session.user.id },
    });
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "CREATE_ELECTION",
        entityType: "Election",
        entityId: election.id,
        electionId: election.id,
        metadata: JSON.stringify({ title: election.title }),
      },
    });
    revalidatePath("/admin/elections");
    return { success: true, electionId: election.id };
  } catch {
    return { error: "Failed to create election." };
  }
}

export async function updateElectionAction(prevState: unknown, formData: FormData) {
  await requireAdmin();
  const parsed = z.object({
    electionId: z.string().min(1).max(191),
    title: z.string().trim().min(3).max(160),
    description: z.string().trim().min(5).max(5000),
    startAt: z.coerce.date(),
    endAt: z.coerce.date(),
  }).safeParse({
    electionId: formData.get("electionId"),
    title: formData.get("title"),
    description: formData.get("description"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt"),
  });
  if (!parsed.success) return { error: "Invalid election details.", fieldErrors: parsed.error.flatten().fieldErrors };
  if (parsed.data.endAt <= parsed.data.startAt) return { error: "The end date must be after the start date." };

  try {
    const election = await prisma.election.findUnique({
      where: { id: parsed.data.electionId },
      select: { status: true },
    });
    if (!election) return { error: "Election not found." };
    if (!["DRAFT", "SCHEDULED"].includes(election.status)) {
      return { error: "Open and completed elections cannot be edited." };
    }
    await prisma.election.update({
      where: { id: parsed.data.electionId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        startAt: parsed.data.startAt,
        endAt: parsed.data.endAt,
      },
    });
    revalidatePath(`/admin/elections/${parsed.data.electionId}`);
    revalidatePath("/admin/elections");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to update election." };
  }
}

const positionSchema = z.object({
  electionId: z.string().min(1).max(191),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(2000),
  order: z.number().int().min(0).max(1000).default(0),
  mandatory: z.boolean().default(true),
});

export async function createPositionAction(prevState: unknown, formData: FormData) {
  const session = await requireAdmin();
  const orderValue = formData.get("order");
  const parsed = positionSchema.safeParse({
    electionId: formData.get("electionId"),
    title: formData.get("title"),
    description: formData.get("description"),
    order: orderValue ? Number(orderValue) : 0,
    mandatory: formData.get("mandatory") === "true",
  });
  if (!parsed.success) return { error: "Invalid form data", fieldErrors: parsed.error.flatten().fieldErrors };

  try {
    const election = await prisma.election.findUnique({
      where: { id: parsed.data.electionId },
      select: { status: true },
    });
    if (!election) return { error: "Election not found." };
    if (election.status !== "DRAFT") return { error: "Positions can only be changed while an election is a draft." };

    const position = await prisma.electionPosition.create({ data: parsed.data });
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "CREATE_ELECTION_POSITION",
        entityType: "ElectionPosition",
        entityId: position.id,
        electionId: parsed.data.electionId,
      },
    });
    revalidatePath(`/admin/elections/${parsed.data.electionId}`);
    return { success: true };
  } catch {
    return { error: "Failed to create position. It may already exist." };
  }
}

const assignCandidateSchema = z.object({
  electionId: z.string().min(1).max(191),
  positionId: z.string().min(1).max(191),
  candidateId: z.string().min(1).max(191),
});

export async function assignCandidateAction(prevState: unknown, formData: FormData) {
  const session = await requireAdmin();
  const parsed = assignCandidateSchema.safeParse({
    electionId: formData.get("electionId"),
    positionId: formData.get("positionId"),
    candidateId: formData.get("candidateId"),
  });
  if (!parsed.success) return { error: "Invalid data" };

  try {
    const [election, position, candidate] = await Promise.all([
      prisma.election.findUnique({ where: { id: parsed.data.electionId }, select: { status: true } }),
      prisma.electionPosition.findUnique({ where: { id: parsed.data.positionId }, select: { electionId: true, title: true } }),
      prisma.candidate.findUnique({
        where: { id: parsed.data.candidateId },
        select: {
          status: true,
          registrations: {
            where: { status: "APPROVED" },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { intendedPosition: true },
          },
        },
      }),
    ]);
    if (!election || !position || !candidate) return { error: "Election, position, or candidate not found." };
    if (election.status !== "DRAFT") return { error: "Candidates can only be assigned while an election is a draft." };
    if (position.electionId !== parsed.data.electionId) return { error: "The selected position does not belong to this election." };
    if (candidate.status !== "ACTIVE") return { error: "Only active candidates can be assigned to an election." };
    const intendedPosition = candidate.registrations[0]?.intendedPosition;
    if (intendedPosition && intendedPosition.trim().toLowerCase() !== position.title.trim().toLowerCase()) {
      return { error: `This candidate applied to contest for ${intendedPosition}, not ${position.title}.` };
    }

    await prisma.electionCandidate.create({ data: parsed.data });
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "ASSIGN_ELECTION_CANDIDATE",
        entityType: "ElectionCandidate",
        entityId: parsed.data.candidateId,
        electionId: parsed.data.electionId,
        metadata: JSON.stringify({ positionId: parsed.data.positionId, candidateId: parsed.data.candidateId }),
      },
    });
    revalidatePath(`/admin/elections/${parsed.data.electionId}`);
    return { success: true };
  } catch {
    return { error: "Candidate is already assigned to this position." };
  }
}

export async function updateElectionStatusAction(electionId: string, status: string) {
  const session = await requireAdmin();
  try {
    const parsedStatus = z.enum(["DRAFT", "SCHEDULED", "OPEN", "CLOSED", "RESULTS_PENDING", "PUBLISHED"]).safeParse(status);
    const parsedId = z.string().min(1).max(191).safeParse(electionId);
    if (!parsedStatus.success || !parsedId.success) return { error: "Invalid election status." };

    const election = await prisma.election.findUnique({
      where: { id: parsedId.data },
      select: {
        status: true,
        startAt: true,
        endAt: true,
        positions: {
          select: { candidates: { where: { candidate: { status: "ACTIVE" } }, take: 1, select: { id: true } } },
        },
      },
    });
    if (!election) return { error: "Election not found." };
    const error = getElectionTransitionError({
      from: election.status,
      to: parsedStatus.data,
      startAt: election.startAt,
      endAt: election.endAt,
      positionsReady: election.positions.length > 0 && election.positions.every((position) => position.candidates.length > 0),
    });
    if (error) return { error };

    const changed = await prisma.election.updateMany({
      where: { id: parsedId.data, status: election.status },
      data: { status: parsedStatus.data },
    });
    if (changed.count !== 1) return { error: "The election status changed. Refresh and try again." };

    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "UPDATE_ELECTION_STATUS",
        entityType: "Election",
        entityId: parsedId.data,
        electionId: parsedId.data,
        metadata: JSON.stringify({ newStatus: parsedStatus.data }),
      },
    });
    revalidatePath(`/admin/elections/${parsedId.data}`);
    revalidatePath("/admin/elections");
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to update status." };
  }
}

export async function deleteElectionAction(electionId: string) {
  const session = await requireAdmin();
  const parsedId = z.string().min(1).max(191).safeParse(electionId);
  if (!parsedId.success) return { error: "Invalid election." };

  try {
    const election = await prisma.election.findUnique({
      where: { id: parsedId.data },
      include: { _count: { select: { participations: true, ballots: true, results: true } } },
    });
    if (!election) return { error: "Election not found." };
    if (["SCHEDULED", "OPEN", "RESULTS_PENDING"].includes(election.status)) {
      return { error: "Active or scheduled elections cannot be deleted." };
    }
    if (election._count.participations > 0 || election._count.ballots > 0 || election._count.results > 0) {
      return { error: "This election has voting or result records and cannot be deleted." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.election.delete({ where: { id: election.id } });
    });
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "DELETE_ELECTION",
        entityType: "Election",
        entityId: election.id,
        metadata: JSON.stringify({ title: election.title }),
      },
    });
    revalidatePath("/admin/elections");
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch {
    return { error: "Failed to delete election." };
  }
}
