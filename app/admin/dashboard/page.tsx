import { prisma } from "@/lib/database/prisma";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Users, UserSquare2, Vote, BarChart3, ClipboardList } from "lucide-react";

export default async function AdminDashboardPage() {
  const [voterCount, candidateCount, activeElections, publishedResults, pendingApplications] = await Promise.all([
    prisma.user.count({ where: { role: "VOTER" } }),
    prisma.candidate.count(),
    prisma.election.count({ where: { status: "OPEN" } }),
    prisma.election.count({ where: { status: "PUBLISHED" } }),
    prisma.candidateRegistration.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-[#0B1930] mb-6">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">Registered Voters</p>
                <p className="text-2xl font-bold text-[#0B1930] mt-1">{voterCount}</p>
              </div>
              <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-[#2563EB]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Link href="/admin/candidate-registrations" className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#667085]">Pending Applications</p>
                  <p className="mt-1 text-2xl font-bold text-[#0B1930]">{pendingApplications}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                  <ClipboardList className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">Candidates</p>
                <p className="text-2xl font-bold text-[#0B1930] mt-1">{candidateCount}</p>
              </div>
              <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center">
                <UserSquare2 className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">Active Elections</p>
                <p className="text-2xl font-bold text-[#0B1930] mt-1">{activeElections}</p>
              </div>
              <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                <Vote className="h-5 w-5 text-[#16A34A]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#667085]">Published Results</p>
                <p className="text-2xl font-bold text-[#0B1930] mt-1">{publishedResults}</p>
              </div>
              <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-[#D97706]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
