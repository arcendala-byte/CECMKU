import { prisma } from "@/lib/database/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ApproveButton } from "@/components/admin/approve-button";
import { VoterActions } from "@/components/admin/voter-actions";

export default async function AdminVotersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const status = ["PENDING", "ACTIVE", "SUSPENDED"].includes(params.status ?? "") ? params.status : undefined;
  const voters = await prisma.user.findMany({
    where: {
      role: "VOTER",
      ...(status ? { accountStatus: status as "PENDING" | "ACTIVE" | "SUSPENDED" } : {}),
      ...(query ? {
        OR: [
          { fullName: { contains: query } },
          { email: { contains: query } },
          { voterProfile: { is: { voterId: { contains: query } } } },
          { voterProfile: { is: { registrationNo: { contains: query } } } },
        ],
      } : {}),
    },
    include: { voterProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-[#0B1930]">Registered Voters</h1>
        <Link href="/admin/voters/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Voter
          </Button>
        </Link>
      </div>

      <form className="bg-white border border-[#E5E7EB] rounded-lg p-3 mb-4 flex flex-col sm:flex-row gap-3" action="/admin/voters">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search name, email, or ID"
          className="w-full sm:max-w-sm rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
        <select name="status" defaultValue={status ?? ""} className="rounded-md border border-[#E5E7EB] px-3 py-2 text-sm bg-white">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm text-left">
          <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[#667085]">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Voter ID</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {voters.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#667085]">
                  No voters registered yet.
                </td>
              </tr>
            ) : (
              voters.map((v) => (
                <tr key={v.id} className="hover:bg-[#F7F8FA] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#0B1930]">{v.fullName}</td>
                  <td className="px-6 py-4 text-[#667085]">{v.email}</td>
                  <td className="px-6 py-4 text-[#667085]">{v.voterProfile?.voterId}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      v.accountStatus === "ACTIVE"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}>
                      {v.accountStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {v.accountStatus === "PENDING" && (
                      <div className="mb-2"><ApproveButton userId={v.id} /></div>
                    )}
                    <VoterActions
                      userId={v.id}
                      status={v.accountStatus as "PENDING" | "ACTIVE" | "SUSPENDED"}
                    />
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
