"use client";

import { useActionState, useEffect, useState } from "react";
import { createCandidateAction, updateCandidateAction } from "@/lib/actions/candidate.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Upload, User } from "lucide-react";

type CandidateFormValues = {
  id: string;
  fullName: string;
  registrationNo: string;
  course: string | null;
  academicYear: string | null;
  photoUrl: string | null;
  biography: string;
  manifesto: string;
  slogan: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "INACTIVE";
};

export function CandidateForm({ initialCandidate }: { initialCandidate?: CandidateFormValues }) {
  const router = useRouter();
  const action = initialCandidate ? updateCandidateAction : createCandidateAction;
  const [state, formAction, isPending] = useActionState(action, null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialCandidate?.photoUrl ?? null);

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/candidates");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4 max-w-3xl bg-white p-6 rounded-lg border border-[#E5E7EB]">
      {state?.error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
          {state.error}
        </div>
      )}
      {initialCandidate && <input type="hidden" name="candidateId" value={initialCandidate.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" defaultValue={initialCandidate?.fullName ?? ""} required />
        </div>
        <div>
          <Label htmlFor="registrationNo">Registration Number</Label>
          <Input id="registrationNo" name="registrationNo" defaultValue={initialCandidate?.registrationNo ?? ""} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="course">Course</Label>
          <Input id="course" name="course" defaultValue={initialCandidate?.course ?? ""} placeholder="e.g., Computer Science" />
        </div>
        <div>
          <Label htmlFor="academicYear">Academic Year</Label>
          <Input id="academicYear" name="academicYear" defaultValue={initialCandidate?.academicYear ?? ""} placeholder="e.g., Year 3" />
        </div>
        <div>
          <Label htmlFor="slogan">Campaign Slogan (Optional)</Label>
          <Input id="slogan" name="slogan" defaultValue={initialCandidate?.slogan ?? ""} />
        </div>
      </div>

      <div>
        <Label htmlFor="photo">Candidate Photo (Optional)</Label>
        <div className="mt-2 flex items-center gap-4">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] flex items-center justify-center">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="Candidate photo preview" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-[#98A2B3]" />
            )}
          </div>
          <label htmlFor="photo" className="flex cursor-pointer items-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#0B1930] hover:bg-[#F7F8FA]">
            <Upload className="h-4 w-4" />
            Choose Picture
          </label>
          <Input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setPhotoPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
        </div>
        <p className="text-xs text-[#667085] mt-2">JPG, PNG, or WebP. Maximum 5 MB.</p>
      </div>

      <div>
        <Label htmlFor="biography">Biography</Label>
        <textarea
          id="biography"
          name="biography"
          required
          rows={4}
          defaultValue={initialCandidate?.biography ?? ""}
          className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>

      <div>
        <Label htmlFor="manifesto">Manifesto</Label>
        <textarea
          id="manifesto"
          name="manifesto"
          required
          rows={6}
          defaultValue={initialCandidate?.manifesto ?? ""}
          className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={initialCandidate?.status ?? "ACTIVE"}
          className="w-full h-10 rounded-md border border-[#E5E7EB] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        >
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          {initialCandidate && (
            <>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="INACTIVE">Inactive</option>
            </>
          )}
        </select>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : initialCandidate ? "Save Changes" : "Save Candidate"}
        </Button>
      </div>
    </form>
  );
}
