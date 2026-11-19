import { CandidateRegistrationForm } from "@/components/public/candidate-registration-form";

export default function CandidateRegistrationPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <header className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#2563EB]">CECMKU Elections</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B1930] sm:text-4xl">Candidate Registration</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#667085] sm:text-base">
          Submit your details and campaign information for administrator review. You can apply before an election is set up.
        </p>
      </header>
      <CandidateRegistrationForm />
    </div>
  );
}
