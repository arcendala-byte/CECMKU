import assert from "node:assert/strict";
import test, { after } from "node:test";
import { randomUUID } from "node:crypto";
import { prisma } from "../lib/database/prisma";

after(async () => {
  await prisma.$disconnect();
});

test(
  "candidate application can be approved and assigned to an election before any election setup exists",
  { skip: process.env.RUN_DB_INTEGRATION_TESTS !== "1" },
  async () => {
    const id = randomUUID();
    const registrationId = `MKU-TEST-${id}`;
    const email = `candidate-${id}@example.invalid`;
    const rollbackMarker = `rollback-${id}`;

    try {
      await prisma.$transaction(async (tx) => {
        const admin = await tx.user.create({
          data: {
            email: `admin-${id}@example.invalid`,
            passwordHash: "integration-test-only",
            fullName: "Integration Test Admin",
            role: "ELECTION_ADMIN",
            accountStatus: "ACTIVE",
          },
        });
        const application = await tx.candidateRegistration.create({
          data: {
            reference: `CECMKU-TEST-${id}`,
            cycleKey: "test-cycle",
            fullName: "Integration Test Candidate",
            registrationNo: registrationId,
            email,
            phone: "+254700000000",
            faculty: "Test Faculty",
            department: "Test Department",
            course: "Test Course",
            yearOfStudy: "Year 2",
            intendedPosition: "President",
            biography: "An integration-test candidate biography longer than twenty characters.",
            manifesto: "An integration-test candidate manifesto longer than twenty characters.",
          },
        });

        const candidate = await tx.candidate.create({
          data: {
            fullName: application.fullName,
            registrationNo: application.registrationNo,
            course: application.course,
            academicYear: application.yearOfStudy,
            biography: application.biography,
            manifesto: application.manifesto,
            status: "ACTIVE",
          },
        });
        await tx.candidateRegistration.update({
          where: { id: application.id },
          data: { status: "APPROVED", candidateId: candidate.id },
        });

        const election = await tx.election.create({
          data: {
            title: `Integration Test Election ${id}`,
            description: "Temporary database integration test election.",
            startAt: new Date("2099-01-01T00:00:00.000Z"),
            endAt: new Date("2099-01-02T00:00:00.000Z"),
            createdById: admin.id,
          },
        });
        const position = await tx.electionPosition.create({
          data: {
            electionId: election.id,
            title: "President",
            description: "Integration test position.",
          },
        });
        await tx.electionCandidate.create({
          data: { electionId: election.id, positionId: position.id, candidateId: candidate.id },
        });

        const approvedRegistration = await tx.candidateRegistration.findUnique({
          where: { id: application.id },
          include: { candidate: true },
        });
        const electionRoster = await tx.electionPosition.findUnique({
          where: { id: position.id },
          include: { candidates: { include: { candidate: true } } },
        });
        assert.equal(approvedRegistration?.status, "APPROVED");
        assert.equal(approvedRegistration?.candidate?.registrationNo, registrationId);
        assert.equal(electionRoster?.candidates[0]?.candidate.fullName, "Integration Test Candidate");
        throw new Error(rollbackMarker);
      });
    } catch (error) {
      if (!(error instanceof Error) || error.message !== rollbackMarker) throw error;
    }

    assert.equal(await prisma.user.count({ where: { email: `admin-${id}@example.invalid` } }), 0);
    assert.equal(await prisma.candidateRegistration.count({ where: { registrationNo: registrationId } }), 0);
    assert.equal(await prisma.candidate.count({ where: { registrationNo: registrationId } }), 0);
  },
);
