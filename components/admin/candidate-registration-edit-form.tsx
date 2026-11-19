"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateCandidateRegistrationAction } from "@/lib/actions/candidate-registration.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RegistrationFormData = {
  id: string;
  fullName: string;
  registrationNo: string;
  email: string;
  phone: string;
  faculty: string;
  department: string;
  course: string;
  yearOfStudy: string;
  intendedPosition: string;
  biography: string;
  manifesto: string;
};

export function CandidateRegistrationEditForm({ application }: { application: RegistrationFormData }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateCandidateRegistrationAction, null);
  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="registrationId" value={application.id} />
      {state?.error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="fullName">Full name</Label><Input id="fullName" name="fullName" defaultValue={application.fullName} required /></div>
        <div><Label htmlFor="registrationNo">Registration number</Label><Input id="registrationNo" name="registrationNo" defaultValue={application.registrationNo} required /></div>
        <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" defaultValue={application.email} required /></div>
        <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" defaultValue={application.phone} required /></div>
        <div><Label htmlFor="faculty">Faculty/school</Label><Input id="faculty" name="faculty" defaultValue={application.faculty} required /></div>
        <div><Label htmlFor="department">Department</Label><Input id="department" name="department" defaultValue={application.department} required /></div>
        <div><Label htmlFor="course">Course/programme</Label><Input id="course" name="course" defaultValue={application.course} required /></div>
        <div><Label htmlFor="yearOfStudy">Year of study</Label><Input id="yearOfStudy" name="yearOfStudy" defaultValue={application.yearOfStudy} required /></div>
        <div className="sm:col-span-2"><Label htmlFor="intendedPosition">Intended position</Label><Input id="intendedPosition" name="intendedPosition" defaultValue={application.intendedPosition} required /></div>
        <div className="sm:col-span-2"><Label htmlFor="biography">Biography</Label><textarea id="biography" name="biography" defaultValue={application.biography} required minLength={20} rows={5} className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm" /></div>
        <div className="sm:col-span-2"><Label htmlFor="manifesto">Manifesto</Label><textarea id="manifesto" name="manifesto" defaultValue={application.manifesto} required minLength={20} rows={7} className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm" /></div>
      </div>
      <div className="flex justify-end"><Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save application details"}</Button></div>
    </form>
  );
}
