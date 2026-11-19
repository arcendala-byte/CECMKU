"use client";

import { useActionState, useEffect } from "react";
import { createVoterAction } from "@/lib/actions/voter.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewVoterPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createVoterAction, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/voters");
    }
  }, [state, router]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/voters" className="text-sm text-[#667085] hover:text-[#0B1930] flex items-center mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Voters
        </Link>
        <h1 className="text-2xl font-semibold text-[#0B1930]">Register New Voter</h1>
      </div>

      <form action={formAction} className="space-y-4 max-w-2xl bg-white p-6 rounded-lg border border-[#E5E7EB]">
        {state?.error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" name="fullName" required />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="voterId">Voter ID</Label>
            <Input id="voterId" name="voterId" placeholder="e.g., V-1001" required />
          </div>
          <div>
            <Label htmlFor="registrationNo">Registration Number</Label>
            <Input id="registrationNo" name="registrationNo" required />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Initial Password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} />
          <p className="text-xs text-[#667085] mt-1">Provide this password to the voter so they can log in.</p>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Registering..." : "Register Voter"}
          </Button>
        </div>
      </form>
    </div>
  );
}
