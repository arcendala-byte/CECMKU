import { prisma } from "@/lib/database/prisma";
import { requireVoter } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { BallotForm } from "@/components/voting/ballot-form";
import { isElectionVotingOpen } from "@/lib/elections/rules";

export const dynamic = "force-dynamic";

export default async function VotingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireVoter();

  const voterProfile = await prisma.voterProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!voterProfile) redirect("/dashboard");

  const election = await prisma.election.findUnique({
    where: { id },
    include: {
      positions: {
        orderBy: { order: "asc" },
        include: {
          candidates: {
            include: { candidate: true }
          }
        }
      }
    }
  });

  if (!election) return notFound();
  const now = new Date();
  if (!isElectionVotingOpen(election, now) || !voterProfile.eligible) {
    redirect("/dashboard");
  }

  // Check if already voted
  const participation = await prisma.ballotParticipation.findUnique({
    where: {
      electionId_voterProfileId: {
        electionId: election.id,
        voterProfileId: voterProfile.id
      }
    }
  });

  if (participation) redirect("/dashboard");

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#F7F8FA] px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0B1930]">{election.title}</h1>
          <p className="text-[#667085] mt-2">Please review your selections carefully before submitting.</p>
        </div>

        <BallotForm electionId={election.id} positions={election.positions} />
      </div>
    </div>
  );
}
