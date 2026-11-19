
import { prisma } from "@/lib/database/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { BarChart3, Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const publishedElections = await prisma.election.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { updatedAt: "desc" },
    include: {
      results: {
        include: { position: true, candidate: true },
      },
      _count: { select: { participations: true } },
    },
  });

  if (publishedElections.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-[#0B1930] mb-2">
          Election Results
        </h1>
        <p className="text-[#667085] mb-8">
          Official results verified by the election committee.
        </p>
        <Card>
          <CardContent className="p-16 text-center">
            <BarChart3 className="h-16 w-16 text-[#E5E7EB] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#0B1930]">
              Results Not Yet Published
            </h3>
            <p className="text-[#667085] mt-2">Check back later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-[#0B1930] mb-2">
        Official Election Results
      </h1>
      <p className="text-[#667085] mb-8">
        Verified by the MKU Community Election Committee.
      </p>

      <div className="space-y-12">
        {publishedElections.map((election) => {
          const resultsByPosition = election.results.reduce<
            Record<string, typeof election.results>
          >((groups, result) => {
            (groups[result.positionId] ??= []).push(result);
            return groups;
          }, {});

          return (
            <div key={election.id}>
              <div className="flex items-center justify-between mb-6 border-b border-[#E5E7EB] pb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-[#0B1930]">
                    {election.title}
                  </h2>
                  <p className="text-sm text-[#667085] mt-1">
                    Total Voter Turnout:{" "}
                    <strong className="text-[#0B1930]">
                      {election._count.participations} votes
                    </strong>
                  </p>
                </div>
                <StatusBadge status="PUBLISHED" />
              </div>

              <div className="grid gap-6">
                {Object.entries(resultsByPosition).map(
                  ([positionId, positionResults]) => {
                    const sortedResults = [...positionResults].sort(
                      (a, b) => b.voteCount - a.voteCount
                    );
                    const totalVotes = sortedResults.reduce(
                      (sum, result) => sum + result.voteCount,
                      0
                    );

                    return (
                      <Card key={positionId}>
                        <CardHeader className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
                          <CardTitle className="text-lg">
                            {sortedResults[0]?.position?.title || "Position"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {sortedResults.map((result, index) => {
                              const percentage =
                                totalVotes > 0
                                  ? (
                                      (result.voteCount / totalVotes) *
                                      100
                                    ).toFixed(1)
                                  : "0.0";
                              const isWinner =
                                index === 0 && totalVotes > 0;

                              return (
                                <div key={result.id}>
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`font-medium ${
                                          isWinner
                                            ? "text-[#16A34A]"
                                            : "text-[#0B1930]"
                                        }`}
                                      >
                                        {result.candidate?.fullName}
                                      </span>
                                      {isWinner && (
                                        <Trophy className="h-4 w-4 text-[#16A34A]" />
                                      )}
                                    </div>
                                    <span className="text-sm font-semibold text-[#0B1930]">
                                      {result.voteCount} votes ({percentage}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        isWinner
                                          ? "bg-[#16A34A]"
                                          : "bg-[#2563EB]"
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
