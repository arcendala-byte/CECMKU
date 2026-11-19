"use server";

import { prisma } from "@/lib/database/prisma";
import { requireVoter } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { ballotSchema, isElectionVotingOpen } from "@/lib/elections/rules";

export async function submitBallotAction(
  electionId: string,
  selections: { positionId: string; candidateId: string }[]
) {
  const session = await requireVoter();
  const parsed = ballotSchema.safeParse({ electionId, selections });
  if (!parsed.success) return { error: "The ballot contains invalid or duplicate selections." };

  const election = await prisma.election.findUnique({
    where: { id: parsed.data.electionId },
    select: {
      id: true,
      status: true,
      startAt: true,
      endAt: true,
      positions: {
        select: {
          id: true,
          mandatory: true,
          candidates: {
            where: { candidate: { status: "ACTIVE" } },
            select: { candidateId: true },
          },
        },
      },
    },
  });

  if (!election) return { error: "Election not found." };
  const now = new Date();
  if (!isElectionVotingOpen(election, now)) {
    return { error: "Voting is currently closed for this election." };
  }

  const selectionsByPosition = new Map(
    parsed.data.selections.map((selection) => [selection.positionId, selection.candidateId])
  );
  const electionPositions = new Map(election.positions.map((position) => [position.id, position]));

  for (const position of election.positions) {
    if (position.mandatory && !selectionsByPosition.has(position.id)) {
      return { error: "Please select a candidate for every mandatory position." };
    }
  }

  for (const selection of parsed.data.selections) {
    const position = electionPositions.get(selection.positionId);
    if (!position || !position.candidates.some((candidate) => candidate.candidateId === selection.candidateId)) {
      return { error: "A selected candidate is not active in this election position." };
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Re-check the election inside the transaction so a request prepared
      // before closing cannot submit against a stale open status.
      const currentElection = await tx.election.findUnique({
        where: { id: election.id },
        select: { status: true, startAt: true, endAt: true },
      });
      const submittedAt = new Date();
      if (!currentElection || !isElectionVotingOpen(currentElection, submittedAt)) {
        throw new Error("VOTING_CLOSED");
      }

      const voterProfile = await tx.voterProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true, eligible: true },
      });
      if (!voterProfile) throw new Error("VOTER_PROFILE_MISSING");
      if (!voterProfile.eligible) throw new Error("VOTER_INELIGIBLE");

      const existingVote = await tx.ballotParticipation.findUnique({
        where: {
          electionId_voterProfileId: {
            electionId: election.id,
            voterProfileId: voterProfile.id,
          },
        },
        select: { id: true },
      });
      if (existingVote) throw new Error("ALREADY_VOTED");

      // The unique election/voter constraint is the final defense against two
      // simultaneous submissions from separate browser tabs or devices.
      const ballotReference = randomUUID();
      await tx.ballotParticipation.create({
        data: {
          electionId: election.id,
          voterProfileId: voterProfile.id,
          ballotReference,
          submittedAt,
        },
      });

      const ballot = await tx.anonymousBallot.create({
        data: { electionId: election.id, ballotReference, submittedAt },
      });

      for (const selection of parsed.data.selections) {
        await tx.ballotSelection.create({
          data: {
            ballotId: ballot.id,
            positionId: selection.positionId,
            candidateId: selection.candidateId,
          },
        });
      }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ALREADY_VOTED") {
        return { error: "You have already submitted a ballot for this election." };
      }
      if (error.message === "VOTING_CLOSED") {
        return { error: "Voting is currently closed for this election." };
      }
      if (error.message === "VOTER_PROFILE_MISSING" || error.message === "VOTER_INELIGIBLE") {
        return { error: "Your account is not eligible to vote." };
      }
      // The unique index also handles concurrent requests that both passed
      // the friendly pre-check above.
      if ("code" in error && error.code === "P2002") {
        return { error: "You have already submitted a ballot for this election." };
      }
    }
    console.error("Voting error:", error);
    return { error: "Failed to submit ballot. Please try again." };
  }
}
