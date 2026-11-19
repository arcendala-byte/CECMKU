import { prisma } from "@/lib/database/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ElectionPage() {
  const election = await prisma.election.findFirst({
    orderBy: { createdAt: "desc" },
    include: { positions: { orderBy: { order: "asc" } } },
  });

  if (!election) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-[#0B1930]">No Active Election</h1>
        <p className="text-[#667085] mt-2">Please check back later for upcoming elections.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#0B1930]">Election Details</h1>
        <StatusBadge status={election.status} />
      </div>

      <Card className="mb-8">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold text-[#0B1930] mb-4">{election.title}</h2>
          <p className="text-[#667085] mb-6">{election.description}</p>

          <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-[#E5E7EB]">
            <div>
              <p className="text-sm font-medium text-[#667085]">Start Date</p>
              <p className="text-lg font-medium text-[#0B1930]">{format(election.startAt, "PPP 'at' p")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#667085]">End Date</p>
              <p className="text-lg font-medium text-[#0B1930]">{format(election.endAt, "PPP 'at' p")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-xl font-semibold text-[#0B1930] mb-4">Available Positions</h3>
      <div className="grid gap-4">
        {election.positions.map((position) => (
          <Card key={position.id}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[#0B1930]">{position.title}</h4>
                <p className="text-sm text-[#667085]">{position.description}</p>
              </div>
              <div className="text-sm text-[#667085] font-medium">
                {position.mandatory ? "Mandatory" : "Optional"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
