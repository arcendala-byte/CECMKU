import { prisma } from "@/lib/database/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";
import { PositionManager } from "@/components/admin/position-manager";
import { ElectionActions } from "@/components/admin/election-actions";
import { EditElectionForm } from "@/components/admin/edit-election-form";

export default async function ElectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const election = await prisma.election.findUnique({
    where: { id },
    include: {
      positions: {
        orderBy: { order: "asc" },
        include: { candidates: { include: { candidate: true } } }
      }
    }
  });

  if (!election) return notFound();

  const allCandidates = await prisma.candidate.findMany({
    where: { status: "ACTIVE" },
    orderBy: { fullName: "asc" },
    include: {
      registrations: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { intendedPosition: true },
      },
    },
  }).then((candidates) => candidates.map((candidate) => ({
    ...candidate,
    intendedPosition: candidate.registrations[0]?.intendedPosition,
  })));

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#0B1930]">{election.title}</h1>
          <p className="text-[#667085] mt-1">{format(election.startAt, "PPP")} - {format(election.endAt, "PPP")}</p>
        </div>
        <StatusBadge status={election.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><h3 className="font-semibold text-[#0B1930]">Election Details</h3></CardHeader>
            <CardContent>
              <EditElectionForm
                election={{
                  id: election.id,
                  title: election.title,
                  description: election.description,
                  startAt: election.startAt,
                  endAt: election.endAt,
                }}
                editable={["DRAFT", "SCHEDULED"].includes(election.status)}
              />
              {!["DRAFT", "SCHEDULED"].includes(election.status) && (
                <p className="text-sm text-[#667085]">{election.description}</p>
              )}
            </CardContent>
          </Card>
          <PositionManager electionId={election.id} positions={election.positions} allCandidates={allCandidates} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-[#0B1930]">Actions</h3>
            </CardHeader>
            <CardContent>
              <ElectionActions electionId={election.id} currentStatus={election.status} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
