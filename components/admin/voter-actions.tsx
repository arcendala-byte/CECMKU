"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, RotateCcw, ShieldOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteVoterAction, setVoterStatusAction } from "@/lib/actions/voter.actions";
import { translateCurrentLanguage } from "@/components/language-provider";

export function VoterActions({ userId, status }: { userId: string; status: "PENDING" | "ACTIVE" | "SUSPENDED" }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function updateStatus(nextStatus: "ACTIVE" | "SUSPENDED") {
    setPending(true);
    const result = await setVoterStatusAction(userId, nextStatus);
    setPending(false);
    if (result.success) router.refresh();
    else alert(translateCurrentLanguage(result.error ?? "Failed to change voter status."));
  }

  async function deleteVoter() {
    if (!window.confirm(translateCurrentLanguage("Delete this voter account? Accounts with voting records are protected."))) return;
    setPending(true);
    const result = await deleteVoterAction(userId);
    setPending(false);
    if (result.success) router.refresh();
    else alert(translateCurrentLanguage(result.error ?? "Failed to delete voter."));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/admin/voters/${userId}/edit`}>
        <Button size="sm" variant="secondary" aria-label="Edit voter">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      {status === "ACTIVE" ? (
        <Button size="sm" variant="secondary" onClick={() => updateStatus("SUSPENDED")} disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldOff className="h-4 w-4 mr-1" />}
          Suspend
        </Button>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => updateStatus("ACTIVE")} disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4 mr-1" />}
          Activate
        </Button>
      )}
      <Button size="sm" variant="danger" onClick={deleteVoter} disabled={pending} aria-label="Delete voter">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
