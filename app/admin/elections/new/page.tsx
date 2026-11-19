"use client";

import { useActionState } from "react";
import { createElectionAction } from "@/lib/actions/election.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewElectionPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createElectionAction, null);

  useEffect(() => {
    if (state?.success) {
      router.push(`/admin/elections/${state.electionId}`);
    }
  }, [state, router]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/elections" className="text-sm text-[#667085] hover:text-[#0B1930] flex items-center mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Elections
        </Link>
        <h1 className="text-2xl font-semibold text-[#0B1930]">Create Election</h1>
      </div>

      <form action={formAction} className="space-y-4 max-w-2xl bg-white p-6 rounded-lg border border-[#E5E7EB]">
        {state?.error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
            {state.error}
          </div>
        )}

        <div>
          <Label htmlFor="title">Election Title</Label>
          <Input id="title" name="title" placeholder="e.g., 2024 Executive Committee Election" required />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startAt">Start Date & Time</Label>
            <Input id="startAt" name="startAt" type="datetime-local" required />
          </div>
          <div>
            <Label htmlFor="endAt">End Date & Time</Label>
            <Input id="endAt" name="endAt" type="datetime-local" required />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Election"}
          </Button>
        </div>
      </form>
    </div>
  );
}
