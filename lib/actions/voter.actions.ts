"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/database/prisma";

const voterSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  registrationNo: z.string().trim().min(3).max(64),
  voterId: z.string().trim().min(3).max(64),
});

const createVoterSchema = voterSchema.extend({
  password: z.string().min(8).max(128),
});

export async function createVoterAction(prevState: unknown, formData: FormData) {
  const session = await requireAdmin();
  const parsed = createVoterSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    registrationNo: formData.get("registrationNo"),
    voterId: formData.get("voterId"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Invalid form data", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          fullName: parsed.data.fullName,
          email: parsed.data.email.toLowerCase(),
          passwordHash,
          role: "VOTER",
          accountStatus: "ACTIVE",
        },
      });
      await tx.voterProfile.create({
        data: {
          userId: newUser.id,
          registrationNo: parsed.data.registrationNo,
          voterId: parsed.data.voterId,
          eligible: true,
        },
      });
      return newUser;
    });
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "CREATE_VOTER",
        entityType: "User",
        entityId: user.id,
        metadata: JSON.stringify({ fullName: parsed.data.fullName, email: parsed.data.email }),
      },
    });
    revalidatePath("/admin/voters");
    return { success: true };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return { error: "A user with this email, voter ID, or registration number already exists." };
    }
    return { error: "Failed to create voter. Please try again." };
  }
}

const updateVoterSchema = voterSchema.extend({
  userId: z.string().min(1).max(191),
});

export async function updateVoterAction(prevState: unknown, formData: FormData) {
  await requireAdmin();
  const parsed = updateVoterSchema.safeParse({
    userId: formData.get("userId"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    registrationNo: formData.get("registrationNo"),
    voterId: formData.get("voterId"),
  });
  if (!parsed.success) {
    return { error: "Invalid form data", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const voter = await tx.user.findUnique({
        where: { id: parsed.data.userId },
        include: { voterProfile: true },
      });
      if (!voter || voter.role !== "VOTER" || !voter.voterProfile) {
        throw new Error("Voter not found");
      }
      await tx.user.update({
        where: { id: voter.id },
        data: { fullName: parsed.data.fullName, email: parsed.data.email.toLowerCase() },
      });
      await tx.voterProfile.update({
        where: { userId: voter.id },
        data: { registrationNo: parsed.data.registrationNo, voterId: parsed.data.voterId },
      });
    });
    revalidatePath("/admin/voters");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "Voter not found") return { error: "Voter not found." };
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return { error: "The email, voter ID, or registration number is already in use." };
    }
    return { error: "Failed to update voter." };
  }
}

export async function setVoterStatusAction(userId: string, status: "ACTIVE" | "SUSPENDED" | "PENDING") {
  const session = await requireAdmin();
  const parsedId = z.string().min(1).max(191).safeParse(userId);
  if (!parsedId.success) return { error: "Invalid voter." };

  try {
    const updated = await prisma.user.updateMany({
      where: { id: parsedId.data, role: "VOTER" },
      data: { accountStatus: status },
    });
    if (updated.count !== 1) return { error: "Voter account not found." };
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: status === "ACTIVE" ? "ACTIVATE_VOTER" : "SUSPEND_VOTER",
        entityType: "User",
        entityId: parsedId.data,
      },
    });
    revalidatePath("/admin/voters");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to change voter status." };
  }
}

export async function deleteVoterAction(userId: string) {
  const session = await requireAdmin();
  const parsedId = z.string().min(1).max(191).safeParse(userId);
  if (!parsedId.success) return { error: "Invalid voter." };

  try {
    const voter = await prisma.user.findUnique({
      where: { id: parsedId.data },
      include: { voterProfile: { include: { participations: { select: { id: true } } } } },
    });
    if (!voter || voter.role !== "VOTER") return { error: "Voter account not found." };
    if (voter.id === session.user.id) return { error: "You cannot delete your own account." };
    if ((voter.voterProfile?.participations.length ?? 0) > 0) {
      return { error: "This voter has election records and cannot be deleted. Suspend the account instead." };
    }
    await prisma.$transaction(async (tx) => {
      await tx.user.delete({ where: { id: voter.id } });
    });
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "DELETE_VOTER",
        entityType: "User",
        entityId: voter.id,
      },
    });
    revalidatePath("/admin/voters");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to delete voter." };
  }
}

const registerSchema = voterSchema.extend({
  password: z.string().min(8).max(128),
});

export async function requestAccessAction(prevState: unknown, formData: FormData) {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    registrationNo: formData.get("registrationNo"),
    voterId: formData.get("voterId"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Invalid form data", fieldErrors: parsed.error.flatten().fieldErrors };

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          fullName: parsed.data.fullName,
          email: parsed.data.email.toLowerCase(),
          passwordHash,
          role: "VOTER",
          accountStatus: "PENDING",
        },
      });
      await tx.voterProfile.create({
        data: {
          userId: newUser.id,
          registrationNo: parsed.data.registrationNo,
          voterId: parsed.data.voterId,
          eligible: true,
        },
      });
    });
    return { success: true, message: "Registration submitted! Please wait for admin approval." };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return { error: "A user with this email, voter ID, or registration number already exists." };
    }
    return { error: "Failed to submit registration. Please try again." };
  }
}
