"use client";

import { useActionState, useRef } from "react";
import { submitCandidateRegistrationAction } from "@/lib/actions/candidate-registration.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CandidateRegistrationForm() {
  const [state, formAction, pending] = useActionState(submitCandidateRegistrationAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  if (state?.success) {
    return (
      <section className="rounded-xl border border-green-200 bg-green-50 p-6 text-center sm:p-10" role="status">
        <h2 className="text-xl font-semibold text-green-900">Application submitted</h2>
        <p className="mt-2 text-sm text-green-800">Keep this reference for your records:</p>
        <p className="mt-2 inline-block rounded-md bg-white px-4 py-2 font-mono font-semibold text-[#0B1930]">{state.reference}</p>
        <p className="mt-4 text-sm text-green-800">The election committee will review your application.</p>
      </section>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-7 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-8">
      {state?.error && <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>}
      {state && "fieldErrors" in state && (
        <ul role="alert" className="list-inside list-disc rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {Object.entries(state.fieldErrors ?? {}).flatMap(([field, messages]) =>
            (messages ?? []).map((message) => <li key={`${field}-${message}`}>{field}: {message}</li>)
          )}
        </ul>
      )}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#0B1930]">Personal and academic details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="fullName">Full name</Label><Input id="fullName" name="fullName" autoComplete="name" required maxLength={120} /></div>
          <div><Label htmlFor="registrationNo">Registration/admission number</Label><Input id="registrationNo" name="registrationNo" required maxLength={64} /></div>
          <div><Label htmlFor="email">Email address</Label><Input id="email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
          <div><Label htmlFor="phone">Phone number</Label><Input id="phone" name="phone" type="tel" autoComplete="tel" required maxLength={32} /></div>
          <div><Label htmlFor="faculty">Faculty or school</Label><Input id="faculty" name="faculty" required maxLength={120} /></div>
          <div><Label htmlFor="department">Department</Label><Input id="department" name="department" required maxLength={120} /></div>
          <div><Label htmlFor="course">Course/programme</Label><Input id="course" name="course" required maxLength={120} /></div>
          <div><Label htmlFor="yearOfStudy">Year of study</Label><Input id="yearOfStudy" name="yearOfStudy" placeholder="e.g. Year 2" required maxLength={40} /></div>
          <div className="sm:col-span-2">
            <Label htmlFor="intendedPosition">Position you intend to contest</Label>
            <Input id="intendedPosition" name="intendedPosition" placeholder="e.g. President" required maxLength={120} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0B1930]">Campaign information</h2>
        <div>
          <Label htmlFor="biography">Candidate profile / biography</Label>
          <textarea id="biography" name="biography" required minLength={20} maxLength={5000} rows={5} className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
        </div>
        <div>
          <Label htmlFor="manifesto">Manifesto / statement of intent</Label>
          <textarea id="manifesto" name="manifesto" required minLength={20} maxLength={10000} rows={7} className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0B1930]">Photograph and documents</h2>
        <div>
          <Label htmlFor="profilePhoto">Profile photograph <span className="text-red-600">*</span></Label>
          <Input id="profilePhoto" name="profilePhoto" type="file" accept="image/jpeg,image/png,image/webp" required />
          <p className="mt-1 text-xs text-[#667085]">JPEG, PNG, or WebP; maximum 5 MB. This is required.</p>
        </div>
        <div>
          <Label htmlFor="supportingDocuments">Supporting documents (optional)</Label>
          <Input id="supportingDocuments" name="supportingDocuments" type="file" accept="application/pdf,.pdf" multiple />
          <p className="mt-1 text-xs text-[#667085]">PDF files only; up to 5 documents, 10 MB each.</p>
        </div>
      </section>

      <div className="border-t border-[#E5E7EB] pt-5">
        <p className="mb-4 text-xs leading-5 text-[#667085]">Your application files are stored privately and can only be accessed by authorized election administrators.</p>
        <Button type="submit" className="w-full sm:w-auto" disabled={pending}>{pending ? "Submitting application..." : "Submit Candidate Application"}</Button>
      </div>
    </form>
  );
}
