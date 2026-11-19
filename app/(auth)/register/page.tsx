"use client";

import { useActionState, useEffect } from "react";
import { requestAccessAction } from "@/lib/actions/voter.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(requestAccessAction, null);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="h-16 w-16 mb-4">
          <img src="/images/logo.png" alt="CECMKU Logo" className="h-full w-full object-contain" />
        </div>
        <h1 className="text-2xl font-semibold text-[#0B1930]">CECMKU Registration</h1>
        <p className="mt-1 text-sm text-[#667085] font-medium text-center">
          Communauté des Étudiants Congolais à MKU
        </p>
        <p className="mt-3 text-sm text-[#667085]">
          Submit your details to request voting access.
        </p>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-sm">
        {state?.success ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-[#16A34A] mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-[#0B1930]">Registration Submitted</h2>
            <p className="text-sm text-[#667085] mt-2">{state.message}</p>
            <p className="text-sm text-[#667085] mt-4">Redirecting to login...</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-[#DC2626]">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" required />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="voterId">Voter ID</Label>
                <Input id="voterId" name="voterId" required />
              </div>
              <div>
                <Label htmlFor="registrationNo">Reg No.</Label>
                <Input id="registrationNo" name="registrationNo" required />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Submitting..." : "Request Access"}
            </Button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-[#667085]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#2563EB] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
