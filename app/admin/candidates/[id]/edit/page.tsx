import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CandidateForm } from "@/components/admin/candidate-form";
import { prisma } from "@/lib/database/prisma";

export default async function EditCandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidate = await prisma.candidate.findUnique({ where: { id } });

  if (!candidate) return notFound();

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <Link href="/admin/candidates" className="text-sm text-[#667085] hover:text-[#0B1930] flex items-center mb-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Candidates
        </Link>
        <h1 className="text-2xl font-semibold text-[#0B1930]">Edit Candidate</h1>
      </div>
      <CandidateForm
        initialCandidate={{
          id: candidate.id,
          fullName: candidate.fullName,
          registrationNo: candidate.registrationNo,
          course: candidate.course,
          academicYear: candidate.academicYear,
          photoUrl: candidate.photoUrl,
          biography: candidate.biography,
          manifesto: candidate.manifesto,
          slogan: candidate.slogan,
          status: candidate.status,
        }}
      />
    </div>
  );
}
