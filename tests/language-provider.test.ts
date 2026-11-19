import assert from "node:assert/strict";
import test from "node:test";
import { getTranslation } from "../components/language-provider";

test("translates shared public, voter, and administrator interface text", () => {
  const examples = [
    ["Candidate Registration", "Inscription des candidats"],
    ["Voting Completed", "Vote effectué"],
    ["Pending Applications", "Candidatures en attente"],
    ["Delete Election", "Supprimer l'élection"],
    ["Election not found.", "Élection introuvable."],
    ["Ballot Record Separation", "Séparation des dossiers de vote"],
    ["Election and Acceptable Use Policy", "Politique électorale et d'utilisation acceptable"],
    ["Election Policy | CECMKU", "Politique électorale | CECMKU"],
    ["Privacy Notice", "Avis de confidentialité"],
  ];

  for (const [english, french] of examples) {
    assert.equal(getTranslation(english, "fr"), french);
  }
});

test("preserves whitespace and leaves user-entered content unchanged", () => {
  assert.equal(getTranslation("  Your Voice.  ", "fr"), "  Votre voix.  ");
  assert.equal(getTranslation("An applicant-authored biography", "fr"), "An applicant-authored biography");
  assert.equal(getTranslation("A candidate is at MKU.", "fr"), "A candidate is at MKU.");
  assert.equal(getTranslation("Candidate Registration", "en"), "Candidate Registration");
});

test("localizes English date strings without changing their meaning", () => {
  assert.equal(getTranslation("Nov 18, 2026", "fr"), "18 nov. 2026");
  assert.equal(getTranslation("November 18th, 2026 at 3:05 PM", "fr"), "18 novembre 2026 à 15 h 05");
  assert.equal(getTranslation("11/18/2026", "fr"), "18 novembre 2026");
});
