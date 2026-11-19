"use client";

import { useState } from "react";
import { deleteElectionAction, updateElectionStatusAction } from "@/lib/actions/election.actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { translateCurrentLanguage } from "@/components/language-provider";

export function ElectionActions({ electionId, currentStatus }: { electionId: string, currentStatus: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setIsPending(true);
    const res = await updateElectionStatusAction(electionId, newStatus);
    setIsPending(false);
    if (res.success) {
      router.refresh();
    } else {
      alert(translateCurrentLanguage(res.error ?? "Failed to update status."));
    }
  }

  async function handleDelete() {
    if (!window.confirm(translateCurrentLanguage("Delete this election? This cannot be undone. Elections with voting or result records are protected."))) return;
    setIsPending(true);
    const res = await deleteElectionAction(electionId);
    setIsPending(false);
    if (res.success) {
      router.push("/admin/elections");
      router.refresh();
    } else {
      alert(translateCurrentLanguage(res.error ?? "Failed to delete election."));
    }
  }

  return (
    <div className="space-y-3">
      {currentStatus === "DRAFT" && (
        <Button
          className="w-full justify-start"
          onClick={() => handleStatusChange("SCHEDULED")}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Schedule Election (Show Countdown)
        </Button>
      )}

      {currentStatus === "SCHEDULED" && (
        <Button
          className="w-full justify-start bg-[#16A34A] hover:bg-[#15803d]"
          onClick={() => handleStatusChange("OPEN")}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Open Voting Now
        </Button>
      )}

      {currentStatus === "OPEN" && (
        <Button
          variant="danger"
          className="w-full justify-start"
          onClick={() => handleStatusChange("CLOSED")}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Close Voting
        </Button>
      )}

      {["DRAFT", "CLOSED", "PUBLISHED"].includes(currentStatus) && (
        <Button
          variant="danger"
          className="w-full justify-start"
          onClick={handleDelete}
          disabled={isPending}
        >
          Delete Election
        </Button>
      )}

    </div>
  );
}
