import assert from "node:assert/strict";
import test from "node:test";
import { candidateRegistrationSchema } from "../lib/validations/candidate-registration";
import { getCandidateDeletionError } from "../lib/candidates/rules";

const validApplication = {
  fullName: "  Alex Candidate ",
  registrationNo: "  MKU/2023/123 ",
  email: "ALEX@example.com",
  phone: "+254712345678",
  faculty: "Faculty of Computing",
  department: "Information Technology",
  course: "BSc Information Technology",
  yearOfStudy: "Year 3",
  intendedPosition: "President",
  biography: "A candidate profile with more than twenty characters.",
  manifesto: "A statement of intent with more than twenty characters.",
};

test("candidate applications validate and normalize required details", () => {
  const parsed = candidateRegistrationSchema.safeParse(validApplication);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.fullName, "Alex Candidate");
    assert.equal(parsed.data.registrationNo, "MKU/2023/123");
    assert.equal(parsed.data.email, "ALEX@example.com");
  }
});

test("candidate applications reject invalid email and incomplete campaign details", () => {
  assert.equal(
    candidateRegistrationSchema.safeParse({ ...validApplication, email: "not-an-email" }).success,
    false,
  );
  assert.equal(
    candidateRegistrationSchema.safeParse({ ...validApplication, manifesto: "short" }).success,
    false,
  );
});

test("candidate deletion allows only unused candidates with draft assignments", () => {
  assert.equal(
    getCandidateDeletionError({
      selectionCount: 0,
      resultCount: 0,
      electionStatuses: ["DRAFT"],
    }),
    null,
  );
});

test("candidate deletion protects voting, result, and non-draft election records", () => {
  assert.match(
    getCandidateDeletionError({
      selectionCount: 1,
      resultCount: 0,
      electionStatuses: ["DRAFT"],
    }) ?? "",
    /voting or result records/,
  );
  assert.match(
    getCandidateDeletionError({
      selectionCount: 0,
      resultCount: 1,
      electionStatuses: [],
    }) ?? "",
    /voting or result records/,
  );
  assert.match(
    getCandidateDeletionError({
      selectionCount: 0,
      resultCount: 0,
      electionStatuses: ["PUBLISHED"],
    }) ?? "",
    /non-draft elections/,
  );
});
