import { prisma } from "@/lib/database/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const candidates = await prisma.candidate.findMany({
    where: { status: "ACTIVE" },
    include: {
      assignments: {
        include: { position: true, election: true },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16">
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1930]">Meet the Candidates</h1>
        <p className="text-sm sm:text-base text-[#667085] mt-2">Learn about the individuals running for leadership positions.</p>
      </div>

      {candidates.length === 0 ? (
        <div className="text-center py-12 sm:py-20 px-4 bg-white rounded-lg border border-[#E5E7EB]">
          <User className="h-12 w-12 text-[#667085] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0B1930]">No candidates announced yet</h3>
          <p className="text-[#667085] mt-2">Check back later for candidate profiles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {candidates.map((candidate) => {
            const assignment = candidate.assignments[0];
            return (
              <Link
                key={candidate.id}
                href={`/candidates/${candidate.id}`}
                className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              >
                <Card className="h-full overflow-hidden hover:border-[#2563EB] transition-colors cursor-pointer">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="aspect-[4/3] w-full bg-[#F7F8FA] rounded-md mb-4 flex items-center justify-center overflow-hidden">
                      {candidate.photoUrl ? (
                        <img src={candidate.photoUrl} alt={candidate.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-16 w-16 text-[#E5E7EB]" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-[#0B1930] break-words">{candidate.fullName}</h3>
                    <p className="text-sm font-medium text-[#2563EB] mb-2 break-words">{assignment?.position.title || "Position TBD"}</p>
                    <p className="text-sm text-[#667085] line-clamp-2 break-words">{candidate.slogan || candidate.biography}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
