import { prisma } from "@/lib/database/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export default async function AuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100, // Show last 100 logs
    include: { actor: true },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#0B1930]">Audit Logs</h1>
        <p className="text-[#667085] mt-1">A chronological record of all system actions.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB] text-[#667085]">
              <tr>
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Actor</th>
                <th className="px-6 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[#667085]">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="px-6 py-4 text-[#667085] whitespace-nowrap">
                      {format(log.createdAt, "MMM d, yyyy HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#0B1930]">
                      {log.actor?.fullName || "System"}
                    </td>
                    <td className="px-6 py-4 text-[#667085] truncate max-w-xs">
                      {log.metadata || log.entityType}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
