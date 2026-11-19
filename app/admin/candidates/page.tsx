import { prisma } from "@/lib/database/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CandidateActions } from "@/components/admin/candidate-actions";

const candidateStatusStyles = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  INACTIVE: "bg-gray-100 text-gray-700 border-gray-200",
} as const;

const candidateStatusLabels = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export default async function AdminCandidatesPage() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-[#0B1930]">Candidates</h1>
        <Link href="/admin/candidates/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm text-left">
            <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[#667085]">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Reg No.</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#667085]">
                    No candidates added yet.
                  </td>
                </tr>
              ) : (
                candidates.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#0B1930]">{c.fullName}</td>
                    <td className="px-6 py-4 text-[#667085]">{c.registrationNo}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${candidateStatusStyles[c.status]}`}>
                        {candidateStatusLabels[c.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#667085]">
                      {c.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <CandidateActions candidateId={c.id} />
                    </td>
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
