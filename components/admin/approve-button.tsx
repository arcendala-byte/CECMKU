"use client";

import { useState } from "react";
import { approveVoterAction } from "@/lib/actions/approval.actions";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { translateCurrentLanguage } from "@/components/language-provider";

export function ApproveButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleApprove() {
    setIsPending(true);
    const res = await approveVoterAction(userId);
    setIsPending(false);
    if (res.success) {
      router.refresh();
    } else {
      alert(translateCurrentLanguage(res.error ?? "Failed to approve voter."));
    }
  }

  return (
    <Button size="sm" variant="secondary" onClick={handleApprove} disabled={isPending}>
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
      Approve
    </Button>
  );
}
