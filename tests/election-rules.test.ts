import assert from "node:assert/strict";
import test from "node:test";
import {
  ballotSchema,
  electionSchema,
  getElectionTransitionError,
  isElectionVotingOpen,
} from "../lib/elections/rules";

const now = new Date("2026-11-18T12:00:00.000Z");
const startAt = new Date("2026-11-20T12:00:00.000Z");
const endAt = new Date("2026-11-21T12:00:00.000Z");

test("election input trims text and requires a valid chronological voting period", () => {
  const parsed = electionSchema.safeParse({
    title: "  CECMKU Election  ",
    description: " Community leadership election ",
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
  });

  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.title, "CECMKU Election");
    assert.equal(parsed.data.startAt.toISOString(), startAt.toISOString());
  }

  assert.equal(
    electionSchema.safeParse({
      title: "Election",
      description: "A valid description",
      startAt: endAt.toISOString(),
      endAt: startAt.toISOString(),
    }).success,
    false
  );
});

test("ballots reject duplicate selections for a position and malformed input", () => {
  assert.equal(
    ballotSchema.safeParse({
      electionId: "election-1",
      selections: [
        { positionId: "president", candidateId: "candidate-1" },
        { positionId: "president", candidateId: "candidate-2" },
      ],
    }).success,
    false
  );

  assert.equal(
    ballotSchema.safeParse({ electionId: "", selections: [] }).success,
    false
  );
});

test("an open election remains available until its scheduled end", () => {
  const election = { status: "OPEN" as const, startAt, endAt };

  assert.equal(isElectionVotingOpen(election, now), true);
  assert.equal(isElectionVotingOpen(election, endAt), false);
  assert.equal(
    isElectionVotingOpen({ ...election, status: "SCHEDULED" }, startAt),
    false
  );
});

test("elections require a complete draft before scheduling", () => {
  assert.match(
    getElectionTransitionError({
      from: "DRAFT",
      to: "SCHEDULED",
      startAt,
      endAt,
      now,
    }) ?? "",
    /position and an active candidate/
  );

  assert.equal(
    getElectionTransitionError({
      from: "DRAFT",
      to: "SCHEDULED",
      startAt,
      endAt,
      positionsReady: true,
      now,
    }),
    null
  );
});

test("only opens voting inside its scheduled time and rejects invalid lifecycle jumps", () => {
  assert.match(
    getElectionTransitionError({
      from: "SCHEDULED",
      to: "OPEN",
      startAt,
      endAt,
      now,
    }) ?? "",
    /scheduled voting period/
  );

  assert.equal(
    getElectionTransitionError({
      from: "SCHEDULED",
      to: "OPEN",
      startAt,
      endAt,
      now: new Date("2026-11-20T12:00:00.000Z"),
    }),
    null
  );

  assert.match(
    getElectionTransitionError({
      from: "CLOSED",
      to: "OPEN",
      startAt,
      endAt,
      now,
    }) ?? "",
    /not allowed/
  );
});
