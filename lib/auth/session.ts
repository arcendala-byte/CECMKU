import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/database/prisma";

export async function getSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // JWT claims can outlive a role change or account suspension. Re-check the
  // current account for server-rendered pages and every protected mutation.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, accountStatus: true },
  });

  if (!user || user.accountStatus !== "ACTIVE") redirect("/login");
  if (!allowedRoles.includes(user.role)) redirect("/dashboard");

  return session;
}

export async function requireAdmin() {
  return requireRole(["SUPER_ADMIN", "ELECTION_ADMIN"]);
}

export async function requireSuperAdmin() {
  return requireRole(["SUPER_ADMIN"]);
}

export async function requireVoter() {
  return requireRole(["VOTER"]);
}
