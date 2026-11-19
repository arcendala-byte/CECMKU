type CandidateDeletionCheck = {
  selectionCount: number;
  resultCount: number;
  electionStatuses: string[];
};

export function getCandidateDeletionError({
  selectionCount,
  resultCount,
  electionStatuses,
}: CandidateDeletionCheck): string | null {
  if (selectionCount > 0 || resultCount > 0) {
    return "Candidates with voting or result records cannot be deleted.";
  }

  if (electionStatuses.some((status) => status !== "DRAFT")) {
    return "Candidates assigned to non-draft elections cannot be deleted.";
  }

  return null;
}
