import { prisma } from "@/lib/database/prisma";
import { notFound } from "next/navigation";
import { User, BookOpen, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function CandidateProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const candidate = await prisma.candidate.findUnique({
    where: { id, status: "ACTIVE" },
    include: {
      assignments: { include: { position: true, election: true } },
    },
  });

  if (!candidate) return notFound();

  const assignment = candidate.assignments[0];

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
        <div className="md:col-span-1">
          <div className="w-full max-w-[280px] sm:max-w-sm md:max-w-none mx-auto aspect-square bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] flex items-center justify-center overflow-hidden md:sticky md:top-24">
            {candidate.photoUrl ? (
              <img src={candidate.photoUrl} alt={candidate.fullName} className="w-full h-full object-cover" />
            ) : (
              <User className="h-32 w-32 text-[#E5E7EB]" />
            )}
          </div>
        </div>

        <div className="md:col-span-2 min-w-0">
          <div className="mb-5 sm:mb-6">
            <p className="text-sm font-medium text-[#2563EB] uppercase tracking-wider mb-2">
              {assignment?.position.title || "Candidate"}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1930] break-words">{candidate.fullName}</h1>
            {candidate.slogan && (
              <p className="text-base sm:text-lg text-[#667085] mt-2 italic break-words">&quot;{candidate.slogan}&quot;</p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-[#667085]">
              {candidate.course && (
                <div className="flex min-w-0 items-center gap-1.5">
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span className="break-words">{candidate.course}</span>
                </div>
              )}
              {candidate.academicYear && (
                <div className="flex min-w-0 items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 shrink-0" />
                  <span className="break-words">{candidate.academicYear}</span>
                </div>
              )}
            </div>
          </div>

          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-[#0B1930] mb-2 sm:mb-3">Biography</h2>
              <div className="prose prose-sm text-[#667085] whitespace-pre-wrap break-words">
                {candidate.biography}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-[#0B1930] mb-2 sm:mb-3">Manifesto</h2>
              <div className="prose prose-sm text-[#667085] whitespace-pre-wrap break-words">
                {candidate.manifesto}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
