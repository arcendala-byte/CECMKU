import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/database/prisma";

function csvCell(value: string) {
  const safeValue = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  await requireAdmin();
  const { searchParams } = new URL(request.url);
  const status = ["PENDING", "APPROVED", "REJECTED"].includes(searchParams.get("status") ?? "")
    ? searchParams.get("status") as "PENDING" | "APPROVED" | "REJECTED"
    : undefined;
  const query = (searchParams.get("q") ?? "").trim();
  const registrations = await prisma.candidateRegistration.findMany({
    where: {
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
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = [
    ["Reference", "Cycle", "Status", "Full name", "Registration number", "Email", "Phone", "Faculty", "Department", "Course", "Year of study", "Intended position", "Submitted at"],
    ...registrations.map((application) => [
      application.reference,
      application.cycleKey,
      application.status,
      application.fullName,
      application.registrationNo,
      application.email,
      application.phone,
      application.faculty,
      application.department,
      application.course,
      application.yearOfStudy,
      application.intendedPosition,
      application.createdAt.toISOString(),
    ]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="candidate-registrations.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
