
import { prisma } from "@/lib/database/prisma";
import { AdminResultManager } from "@/components/admin/admin-result-manager";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  const elections = await prisma.election.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      results: {
        include: {
          position: true,
          candidate: true,
        },
      },
    },
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0B1930]">
          Election Results
        </h1>
        <p className="text-sm text-[#667085] mt-1">
          Calculate, review, and publish election results.
        </p>
      </div>

      {elections.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 text-center text-[#667085]">
          No elections are available yet.
        </div>
      ) : (
        <div className="space-y-6">
          {elections.map((election) => (
            <AdminResultManager
              key={election.id}
              election={election}
            />
          ))}
        </div>
      )}
    </div>
  );
}
