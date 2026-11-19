import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/database/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { isElectionVotingOpen } from "@/lib/elections/rules";
import { ReturnHomeButton } from "@/components/layout/return-home-button";
import { ParticlesBackground } from "@/components/ui/particles-background";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireAuth();

  const voterProfile = await prisma.voterProfile.findUnique({
    where: { userId: session.user.id },
  });

  // Find any open election
  const activeElection = await prisma.election.findFirst({
    where: { status: "OPEN" },
    include: { _count: { select: { positions: true } } },
  });

  // Check if they voted in this election
  const participation =
    activeElection && voterProfile
      ? await prisma.ballotParticipation.findUnique({
          where: {
            electionId_voterProfileId: {
              electionId: activeElection.id,
              voterProfileId: voterProfile.id,
            },
          },
        })
      : null;

  const now = new Date();
  const votingWindowOpen = activeElection
    ? isElectionVotingOpen(activeElection, now)
    : false;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-[#F7F8FA]">
      {/* Decorative particle layer */}
      <ParticlesBackground
        className="absolute inset-0 z-0"
        quantity={50}
        color="37, 99, 235"
        linkDistance={130}
      />

      <div className="relative z-10 mx-auto max-w-4xl p-8">
        <div className="mb-6">
          <ReturnHomeButton />
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#0B1930]">
            Welcome back, {session.user.name?.split(" ")[0]}
          </h1>
          <p className="text-[#667085] mt-2">
            Your participation helps shape the future of our community.
          </p>
        </div>

        <h2 className="text-lg font-semibold text-[#0B1930] mb-4">
          Election Status
        </h2>

        {!activeElection ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-[#667085]">
                There are currently no active elections.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#0B1930]">
                    {activeElection.title}
                  </h3>
                  <p className="text-sm text-[#667085] mt-1">
                    {activeElection._count.positions} positions to vote for
                  </p>
                </div>
                <StatusBadge status={activeElection.status} />
              </div>

              {participation ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                  <CheckCircle2 className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Voting Completed</p>
                    <p className="text-sm">
                      Your ballot has been successfully submitted and recorded
                      anonymously.
                    </p>
                  </div>
                </div>
              ) : !voterProfile ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Your voter profile could not be found. Please contact the
                  election committee.
                </p>
              ) : !voterProfile.eligible ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Your account is not eligible to vote.
                </p>
              ) : !votingWindowOpen ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Voting is currently closed for this election.
                </p>
              ) : (
                <div className="flex items-center justify-between p-4 bg-[#F7F8FA] rounded-lg border border-[#E5E7EB]">
                  <div>
                    <p className="font-medium text-[#0B1930]">
                      Your vote is pending
                    </p>
                    <p className="text-sm text-[#667085]">
                      Cast your ballot before the election closes.
                    </p>
                  </div>
                  <Link
                    href={`/voting/${activeElection.id}`}
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-[#142B4A] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0B1930] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                  >
                    Vote Now <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}