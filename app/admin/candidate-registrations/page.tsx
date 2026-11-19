import Link from "next/link";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/database/prisma";

export default async function CandidateRegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const status = ["PENDING", "APPROVED", "REJECTED"].includes(params.status ?? "")
    ? params.status as "PENDING" | "APPROVED" | "REJECTED"
    : undefined;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const pageSize = 25;
  const where = {
    ...(status ? { status } : {}),
    ...(query ? {
      OR: [
        { fullName: { contains: query } },
        { registrationNo: { contains: query } },
        { email: { contains: query } },
        { reference: { contains: query } },
        { intendedPosition: { contains: query } },
      ],
    } : {}),
  };
  const [registrations, total] = await Promise.all([
    prisma.candidateRegistration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        reference: true,
        fullName: true,
        registrationNo: true,
        email: true,
        intendedPosition: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.candidateRegistration.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const queryString = new URLSearchParams({
    ...(query ? { q: query } : {}),
    ...(status ? { status } : {}),
  }).toString();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0B1930]">Candidate Registrations</h1>
          <p className="mt-1 text-sm text-[#667085]">{total} application{total === 1 ? "" : "s"} · showing {page}/{totalPages}</p>
        </div>
        <a href={`/api/admin/candidate-registrations/export${queryString ? `?${queryString}` : ""}`}>
          <Button variant="secondary" className="w-full sm:w-auto"><Download className="mr-2 h-4 w-4" />Export CSV</Button>
        </a>
      </div>

      <form action="/admin/candidate-registrations" className="mb-4 flex flex-col gap-3 rounded-lg border border-[#E5E7EB] bg-white p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#667085]" />
          <input name="q" defaultValue={query} placeholder="Search name, reference, email, or position" className="w-full rounded-md border border-[#E5E7EB] py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
        </div>
        <select name="status" defaultValue={status ?? ""} className="rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <Button type="submit">Filter</Button>
      </form>

      <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-[#E5E7EB] bg-[#F7F8FA] text-[#667085]">
              <tr>
                <th className="px-5 py-3 font-medium">Reference</th><th className="px-5 py-3 font-medium">Applicant</th>
                <th className="px-5 py-3 font-medium">Position</th><th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Submitted</th><th className="px-5 py-3 font-medium">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {registrations.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-[#667085]">No candidate applications found.</td></tr>
              ) : registrations.map((application) => (
                <tr key={application.id} className="hover:bg-[#F7F8FA]">
                  <td className="px-5 py-4 font-mono text-xs">{application.reference}</td>
                  <td className="px-5 py-4"><p className="font-medium text-[#0B1930]">{application.fullName}</p><p className="text-xs text-[#667085]">{application.registrationNo} · {application.email}</p></td>
                  <td className="px-5 py-4">{application.intendedPosition}</td>
                  <td className="px-5 py-4"><span className="rounded-full border border-[#E5E7EB] px-2.5 py-1 text-xs">{application.status}</span></td>
                  <td className="px-5 py-4 text-[#667085]">{application.createdAt.toLocaleDateString()}</td>
                  <td className="px-5 py-4"><Link className="font-medium text-[#2563EB] hover:underline" href={`/admin/candidate-registrations/${application.id}`}>Review application</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-[#667085]">Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          {page > 1 && <Link className="rounded border border-[#E5E7EB] px-3 py-2" href={`/admin/candidate-registrations?${queryString}${queryString ? "&" : ""}page=${page - 1}`}>Previous</Link>}
          {page < totalPages && <Link className="rounded border border-[#E5E7EB] px-3 py-2" href={`/admin/candidate-registrations?${queryString}${queryString ? "&" : ""}page=${page + 1}`}>Next</Link>}
        </div>
      </div>
    </div>
  );
}
