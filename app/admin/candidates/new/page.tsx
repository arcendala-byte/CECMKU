import { CandidateForm } from "@/components/admin/candidate-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewCandidatePage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/candidates" className="text-sm text-[#667085] hover:text-[#0B1930] flex items-center mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Candidates
        </Link>
        <h1 className="text-2xl font-semibold text-[#0B1930]">Add New Candidate</h1>
      </div>
      <CandidateForm />
    </div>
  );
}
