import { ShieldCheck, Eye, Lock, FileCheck } from "lucide-react";
import Link from "next/link";

export default function TransparencyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B1930] tracking-tight mb-4">Election Transparency</h1>
        <p className="text-[#667085] max-w-2xl mx-auto">
          We are committed to providing a free, fair, and verifiable election. Learn how our technology protects your vote and ensures accurate results.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-50 rounded-lg shrink-0">
              <Lock className="h-6 w-6 text-[#16A34A]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0B1930]">Ballot Data Separation</h2>
              <p className="text-sm text-[#667085] mt-2 leading-relaxed">
                Voter participation and ballot selections are stored in separate records. A random ballot reference is used to enforce one ballot per voter, and the same reference is stored with the participation record and the ballot. This separates identity fields from ballot selections, but a person with privileged database access could technically correlate those records; the portal does not claim cryptographic or absolute anonymity against privileged access.
                <strong className="block mt-2 text-[#0B1930]">See the <Link href="/privacy" className="underline underline-offset-2">Privacy Notice</Link> for details about ballot records and their limitations.</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg shrink-0">
              <Eye className="h-6 w-6 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0B1930]">Live Audit Logs</h2>
              <p className="text-sm text-[#667085] mt-2 leading-relaxed">
                Every action taken by the election administrators—from creating candidates to opening and closing the polls—is logged in an audit trail. This ensures that every administrative action is recorded and reviewable.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 rounded-lg shrink-0">
              <FileCheck className="h-6 w-6 text-[#9333EA]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0B1930]">Verification Process</h2>
              <p className="text-sm text-[#667085] mt-2 leading-relaxed">
                After voting closes, the Election Committee independently calculates the results. The system prevents the publication of results until the committee has formally verified the totals. Results are only made public once this verification is complete.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-50 rounded-lg shrink-0">
              <ShieldCheck className="h-6 w-6 text-[#D97706]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0B1930]">System Integrity</h2>
              <p className="text-sm text-[#667085] mt-2 leading-relaxed">
                The platform enforces strict database-level constraints. A voter cannot submit more than one ballot, and a ballot cannot contain an invalid candidate or position. The system runs on a secure, privately hosted database.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
