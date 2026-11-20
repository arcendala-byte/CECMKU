"use server";

import { prisma } from "@/lib/database/prisma";
import { candidateSchema } from "@/lib/validations/candidate";
import { requireAdmin } from "@/lib/auth/session";
import { getCandidateDeletionError } from "@/lib/candidates/rules";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { z } from "zod";

const candidateUpdateSchema = candidateSchema.extend({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "ACTIVE", "INACTIVE"]),
});

async function saveCandidatePhoto(value: FormDataEntryValue | null): Promise<{
  photoUrl?: string;
  error?: string;
}> {
  if (!(value instanceof File) || value.size === 0) return {};
  if (!["image/jpeg", "image/png", "image/webp"].includes(value.type)) {
    return { error: "The candidate photo must be JPG, PNG, or WebP." };
  }
  // Vercel Serverless Functions hard-cap request bodies at 4.5 MB
  if (value.size > 4 * 1024 * 1024) {
    return { error: "The candidate photo must not exceed 4 MB." };
  }

  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const fileName = `candidates/${randomUUID()}.${extensionByType[value.type]}`;

  const blob = await put(fileName, value, {
    access: "public",
    contentType: value.type,
  });

  return { photoUrl: blob.url };
}

async function removeUnusedPhoto(photoUrl: string | null | undefined) {
  if (!photoUrl || !photoUrl.includes("://vercel-storage.com")) return;
  try {
    await del(photoUrl);
  } catch {
    console.error("Failed to remove an unused candidate photo from Vercel Blob.");
  }
}

export async function createCandidateAction(prevState: unknown, formData: FormData) {
  const session = await requireAdmin();

  const parsed = candidateSchema.safeParse({
    fullName: formData.get("fullName"),
    registrationNo: formData.get("registrationNo"),
    course: formData.get("course") || undefined,
    academicYear: formData.get("academicYear") || undefined,
    photoUrl: undefined,
    biography: formData.get("biography"),
    manifesto: formData.get("manifesto"),
    slogan: formData.get("slogan") || undefined,
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: "Invalid form data", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let uploadedPhotoUrl: string | undefined;
  try {
    const savedPhoto = await saveCandidatePhoto(formData.get("photo"));
    if (savedPhoto.error) return { error: savedPhoto.error };
    uploadedPhotoUrl = savedPhoto.photoUrl;

    const candidate = await prisma.candidate.create({
      data: { ...parsed.data, photoUrl: uploadedPhotoUrl },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "CREATE_CANDIDATE",
        entityType: "Candidate",
        entityId: candidate.id,
        metadata: JSON.stringify({ fullName: candidate.fullName }),
      },
    });

    revalidatePath("/admin/candidates");
    revalidatePath("/candidates");
    return { success: true, candidateId: candidate.id };
  } catch (error: unknown) {
    await removeUnusedPhoto(uploadedPhotoUrl);
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return { error: "A candidate with this registration number already exists." };
    }
    console.error("Candidate creation failed:", error);
    return { error: "Failed to create candidate. Please try again." };
  }
}

export async function updateCandidateAction(prevState: unknown, formData: FormData) {
  const session = await requireAdmin();
  const candidateId = z.string().trim().min(1).max(191).safeParse(formData.get("candidateId"));
  if (!candidateId.success) return { error: "Invalid candidate." };

  const parsed = candidateUpdateSchema.safeParse({
    fullName: formData.get("fullName"),
    registrationNo: formData.get("registrationNo"),
    course: formData.get("course") || undefined,
    academicYear: formData.get("academicYear") || undefined,
    photoUrl: undefined,
    biography: formData.get("biography"),
    manifesto: formData.get("manifesto"),
    slogan: formData.get("slogan") || undefined,
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { error: "Invalid form data", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let newlyUploadedUrl: string | undefined;
  try {
    const existing = await prisma.candidate.findUnique({
      where: { id: candidateId.data },
      select: { id: true, photoUrl: true },
    });
    if (!existing) return { error: "Candidate not found." };

    const savedPhoto = await saveCandidatePhoto(formData.get("photo"));
    if (savedPhoto.error) return { error: savedPhoto.error };
    newlyUploadedUrl = savedPhoto.photoUrl;

    const candidate = await prisma.$transaction(async (tx) => {
      const updatedCandidate = await tx.candidate.update({
        where: { id: existing.id },
        data: {
          ...parsed.data,
          photoUrl: newlyUploadedUrl ?? existing.photoUrl,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "UPDATE_CANDIDATE",
          entityType: "Candidate",
          entityId: updatedCandidate.id,
          metadata: JSON.stringify({ fullName: updatedCandidate.fullName }),
        },
      });
      return updatedCandidate;
    });

    // Clean up old blob if a new photo replaced it
    if (newlyUploadedUrl && existing.photoUrl && existing.photoUrl !== newlyUploadedUrl) {
      await removeUnusedPhoto(existing.photoUrl);
    }

    revalidatePath("/admin/candidates");
    revalidatePath(`/admin/candidates/${candidate.id}/edit`);
    revalidatePath("/admin/elections");
    revalidatePath("/candidates");
    return { success: true };
  } catch (error: unknown) {
    await removeUnusedPhoto(newlyUploadedUrl);
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return { error: "A candidate with this registration number already exists." };
    }
    console.error("Candidate update failed:", error);
    return { error: "Failed to update candidate. Please try again." };
  }
}

export async function deleteCandidateAction(candidateId: string) {
  const session = await requireAdmin();
  const parsedId = z.string().trim().min(1).max(191).safeParse(candidateId);
  if (!parsedId.success) return { error: "Invalid candidate." };

  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id: parsedId.data },
      select: {
        id: true,
        fullName: true,
        photoUrl: true,
        _count: { select: { selections: true, results: true } },
        assignments: { select: { election: { select: { status: true } } } },
      },
    });
    if (!candidate) return { error: "Candidate not found." };

    const deletionError = getCandidateDeletionError({
      selectionCount: candidate._count.selections,
      resultCount: candidate._count.results,
      electionStatuses: candidate.assignments.map(({ election }) => election.status),
    });
    if (deletionError) return { error: deletionError };

    await prisma.$transaction(async (tx) => {
      await tx.electionCandidate.deleteMany({
        where: { candidateId: candidate.id, election: { status: "DRAFT" } },
      });
      await tx.candidate.delete({ where: { id: candidate.id } });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "DELETE_CANDIDATE",
          entityType: "Candidate",
          entityId: candidate.id,
          metadata: JSON.stringify({ fullName: candidate.fullName }),
        },
      });
    });

    await removeUnusedPhoto(candidate.photoUrl);

    revalidatePath("/admin/candidates");
    revalidatePath("/admin/elections");
    revalidatePath("/candidates");
    return { success: true };
  } catch {
    console.error("Candidate deletion failed.");
    return { error: "Failed to delete candidate. Refresh and try again." };
  }
}