"use server";

import { prisma } from "@/lib/database/prisma";
import { requireAdmin } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function approveVoterAction(userId: string) {
  const session = await requireAdmin();
  const parsedId = z.string().min(1).max(191).safeParse(userId);
  if (!parsedId.success) return { error: "Invalid voter." };

  try {
    const updated = await prisma.user.updateMany({
      where: {
        id: parsedId.data,
        role: "VOTER",
        accountStatus: "PENDING",
        voterProfile: { isNot: null },
      },
      data: { accountStatus: "ACTIVE" },
    });
    if (updated.count !== 1) return { error: "This account is not a pending voter." };

    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "APPROVE_VOTER",
        entityType: "User",
        entityId: parsedId.data,
      },
    });

    revalidatePath("/admin/voters");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to approve voter." };
  }
}
