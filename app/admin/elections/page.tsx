import { prisma } from "@/lib/database/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";

export default async function AdminElectionsPage() {
  const elections = await prisma.election.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { positions: true, participations: true } } }
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-[#0B1930]">Elections</h1>
        <Link href="/admin/elections/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Election
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
        {/* Wrapper for horizontal scroll on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[#667085]">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Dates</th>
                <th className="px-6 py-3 font-medium">Positions</th>
                <th className="px-6 py-3 font-medium">Votes Cast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {elections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#667085]">
                    No elections created yet.
                  </td>
                </tr>
              ) : (
                elections.map((e) => (
                  <tr key={e.id} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/elections/${e.id}`} className="font-medium text-[#2563EB] hover:underline">
                        {e.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-6 py-4 text-[#667085] whitespace-nowrap">
                      {format(e.startAt, "MMM d")} - {format(e.endAt, "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-[#667085]">{e._count.positions}</td>
                    <td className="px-6 py-4 text-[#667085]">{e._count.participations}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
