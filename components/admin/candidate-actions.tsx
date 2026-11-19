"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCandidateAction } from "@/lib/actions/candidate.actions";
import { translateCurrentLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function CandidateActions({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    const confirmation = translateCurrentLanguage(
      "Delete this candidate? Draft election assignments will also be removed. Candidates with voting or published result records are protected.",
    );
    if (!window.confirm(confirmation)) return;

    setIsPending(true);
    try {
      const result = await deleteCandidateAction(candidateId);
      if (result.success) {
        router.refresh();
      } else {
        window.alert(translateCurrentLanguage(result.error ?? "Failed to delete candidate. Refresh and try again."));
      }
    } catch {
      window.alert(translateCurrentLanguage("Failed to delete candidate. Refresh and try again."));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/candidates/${candidateId}/edit`}>
        <Button type="button" variant="secondary" size="sm">Edit</Button>
      </Link>
      <Button type="button" variant="danger" size="sm" onClick={handleDelete} disabled={isPending}>
        {isPending ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
