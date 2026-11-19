"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { reviewCandidateRegistrationAction } from "@/lib/actions/candidate-registration.actions";

export function CandidateRegistrationReview({ registrationId, status }: { registrationId: string; status: "PENDING" | "APPROVED" | "REJECTED" }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function review(nextStatus: "PENDING" | "APPROVED" | "REJECTED") {
    setPending(true);
    setMessage("");
    const result = await reviewCandidateRegistrationAction(registrationId, nextStatus);
    setPending(false);
    if (result.success) {
      setMessage(`Application marked ${nextStatus.toLowerCase()}.`);
      router.refresh();
    } else {
      setMessage(result.error ?? "Could not update application.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => review("APPROVED")} disabled={pending || status === "APPROVED"}>Approve &amp; add candidate</Button>
        <Button variant="danger" onClick={() => review("REJECTED")} disabled={pending || status === "REJECTED"}>Reject</Button>
        <Button variant="secondary" onClick={() => review("PENDING")} disabled={pending || status === "PENDING"}>Mark pending</Button>
      </div>
      {message && <p role="status" className="mt-3 text-sm text-[#667085]">{message}</p>}
    </div>
  );
}
