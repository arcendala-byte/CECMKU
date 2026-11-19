"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateVoterAction } from "@/lib/actions/voter.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditVoterForm(props: {
  userId: string;
  fullName: string;
  email: string;
  registrationNo: string;
  voterId: string;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateVoterAction, null);

  useEffect(() => {
    if (state?.success) router.push("/admin/voters");
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4 max-w-2xl bg-white p-4 md:p-6 rounded-lg border border-[#E5E7EB]">
      <input type="hidden" name="userId" value={props.userId} />
      {state?.error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">{state.error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" defaultValue={props.fullName} required />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" defaultValue={props.email} required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="voterId">Voter ID</Label>
          <Input id="voterId" name="voterId" defaultValue={props.voterId} required />
        </div>
        <div>
          <Label htmlFor="registrationNo">Registration Number</Label>
          <Input id="registrationNo" name="registrationNo" defaultValue={props.registrationNo} required />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/voters")}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Changes"}</Button>
      </div>
    </form>
  );
}
