import { z } from "zod";
import type { ElectionStatus } from "@prisma/client";

const dateTime = z
  .string()
  .min(1, "A date and time is required")
  .refine((value) => Number.isFinite(Date.parse(value)), "Enter a valid date and time")
  .transform((value) => new Date(value));

export const electionSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(160),
    description: z.string().trim().min(10, "Description must be at least 10 characters").max(5000),
    startAt: dateTime,
    endAt: dateTime,
  })
  .refine((value) => value.startAt < value.endAt, {
    message: "The closing time must be after the opening time",
    path: ["endAt"],
  });

export const ballotSchema = z.object({
  electionId: z.string().min(1).max(191),
  selections: z
    .array(
      z.object({
        positionId: z.string().min(1).max(191),
        candidateId: z.string().min(1).max(191),
      })
    )
    .max(100),
}).superRefine(({ selections }, context) => {
  const selectedPositions = new Set<string>();
  for (const [index, selection] of selections.entries()) {
    if (selectedPositions.has(selection.positionId)) {
      context.addIssue({
        code: "custom",
        message: "Only one candidate may be selected for each position.",
        path: ["selections", index, "positionId"],
      });
    }
    selectedPositions.add(selection.positionId);
  }
});

export function isElectionVotingOpen(
  election: { status: ElectionStatus; endAt: Date },
  now = new Date()
): boolean {
  return election.status === "OPEN" && now < election.endAt;
}

export function getElectionTransitionError({
  from,
  to,
  startAt,
  endAt,
  positionsReady = false,
  now = new Date(),
}: {
  from: ElectionStatus;
  to: ElectionStatus;
  startAt: Date;
  endAt: Date;
  positionsReady?: boolean;
  now?: Date;
}): string | null {
  if (from === to) return "The election is already in this status.";

  if (from === "DRAFT" && to === "SCHEDULED") {
    if (startAt <= now || endAt <= now) {
      return "Set a future voting period before scheduling this election.";
    }
    if (!positionsReady) {
      return "Add at least one position and an active candidate to every position before scheduling.";
    }
    return null;
  }

  if (from === "SCHEDULED" && to === "OPEN") {
    if (now < startAt || now >= endAt) {
      return "Voting can only be opened during the scheduled voting period.";
    }
    return null;
  }

  if (from === "OPEN" && to === "CLOSED") return null;

  return "This election status change is not allowed.";
}
