"use server";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/database/prisma";
import { candidateRegistrationSchema } from "@/lib/validations/candidate-registration";

const privateUploadDirectory = path.join(process.cwd(), "storage", "candidate-registrations");

function isJpeg(data: Buffer) {
  return data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
}

function isPng(data: Buffer) {
  return data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
}

function isWebp(data: Buffer) {
  return data.length >= 12 && data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP";
}

function isPdf(data: Buffer) {
  return data.length >= 5 && data.toString("ascii", 0, 5) === "%PDF-";
}

function safeOriginalName(name: string) {
  return path.basename(name).replace(/[^\w.\- ()]/g, "_").slice(0, 180) || "upload";
}

export async function submitCandidateRegistrationAction(_previous: unknown, formData: FormData) {
  const parsed = candidateRegistrationSchema.safeParse({
    fullName: formData.get("fullName"),
    registrationNo: formData.get("registrationNo"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    faculty: formData.get("faculty"),
    department: formData.get("department"),
    course: formData.get("course"),
    yearOfStudy: formData.get("yearOfStudy"),
    intendedPosition: formData.get("intendedPosition"),
    biography: formData.get("biography"),
    manifesto: formData.get("manifesto"),
  });
  if (!parsed.success) {
    return { error: "Please review the form and correct the highlighted information.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const photo = formData.get("profilePhoto");
  if (!(photo instanceof File) || photo.size === 0) return { error: "Please upload a profile photograph." };
  if (photo.size > 5 * 1024 * 1024) return { error: "The profile photograph must be 5 MB or smaller." };

  const supportingFiles = formData.getAll("supportingDocuments").filter((file): file is File => file instanceof File && file.size > 0);
  if (supportingFiles.length > 5) return { error: "You can upload a maximum of five supporting documents." };

  const filesToSave: Array<{
    storedName: string;
    originalName: string;
    mimeType: string;
    size: number;
    type: "PROFILE_PHOTO" | "SUPPORTING_DOCUMENT";
    data: Buffer;
  }> = [];
  const photoData = Buffer.from(await photo.arrayBuffer());
  const photoFormat = isJpeg(photoData) ? { mimeType: "image/jpeg", extension: "jpg" }
    : isPng(photoData) ? { mimeType: "image/png", extension: "png" }
      : isWebp(photoData) ? { mimeType: "image/webp", extension: "webp" }
        : null;
  if (!photoFormat) return { error: "The profile photo must be a valid JPEG, PNG, or WebP image." };
  filesToSave.push({
    storedName: `${randomUUID()}.${photoFormat.extension}`,
    originalName: safeOriginalName(photo.name),
    mimeType: photoFormat.mimeType,
    size: photo.size,
    type: "PROFILE_PHOTO",
    data: photoData,
  });

  for (const file of supportingFiles) {
    if (file.size > 10 * 1024 * 1024) return { error: `${safeOriginalName(file.name)} exceeds the 10 MB limit.` };
    const data = Buffer.from(await file.arrayBuffer());
    if (!isPdf(data)) return { error: "Supporting documents must be valid PDF files." };
    filesToSave.push({
      storedName: `${randomUUID()}.pdf`,
      originalName: safeOriginalName(file.name),
      mimeType: "application/pdf",
      size: file.size,
      type: "SUPPORTING_DOCUMENT",
      data,
    });
  }

  await mkdir(privateUploadDirectory, { recursive: true });
  const savedPaths: string[] = [];
  try {
    for (const file of filesToSave) {
      const filePath = path.join(privateUploadDirectory, file.storedName);
      await writeFile(filePath, file.data, { flag: "wx", mode: 0o600 });
      savedPaths.push(filePath);
    }

    const reference = `CECMKU-${new Date().getFullYear()}-${randomUUID().toUpperCase()}`;
    await prisma.candidateRegistration.create({
      data: {
        ...parsed.data,
        registrationNo: parsed.data.registrationNo.toUpperCase(),
        email: parsed.data.email.toLowerCase(),
        cycleKey: String(new Date().getFullYear()),
        reference,
        files: {
          create: filesToSave.map((file) => ({
            storedName: file.storedName,
            originalName: file.originalName,
            mimeType: file.mimeType,
            size: file.size,
            type: file.type,
          })),
        },
      },
    });
    revalidatePath("/admin/candidate-registrations");
    return { success: true, reference };
  } catch (error) {
    await Promise.all(savedPaths.map((filePath) => unlink(filePath).catch(() => undefined)));
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return { error: "An application for this registration number has already been submitted for this election cycle." };
    }
    return { error: "Your application could not be submitted. Please try again." };
  }
}

const updateSchema = candidateRegistrationSchema.extend({ registrationId: z.string().min(1).max(191) });

export async function updateCandidateRegistrationAction(_previous: unknown, formData: FormData) {
  const session = await requireAdmin();
  const parsed = updateSchema.safeParse({
    registrationId: formData.get("registrationId"),
    fullName: formData.get("fullName"),
    registrationNo: formData.get("registrationNo"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    faculty: formData.get("faculty"),
    department: formData.get("department"),
    course: formData.get("course"),
    yearOfStudy: formData.get("yearOfStudy"),
    intendedPosition: formData.get("intendedPosition"),
    biography: formData.get("biography"),
    manifesto: formData.get("manifesto"),
  });
  if (!parsed.success) return { error: "Please check the application fields.", fieldErrors: parsed.error.flatten().fieldErrors };

  try {
    await prisma.$transaction(async (tx) => {
      const application = await tx.candidateRegistration.update({
        where: { id: parsed.data.registrationId },
        data: {
        fullName: parsed.data.fullName,
        registrationNo: parsed.data.registrationNo.toUpperCase(),
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone,
        faculty: parsed.data.faculty,
        department: parsed.data.department,
        course: parsed.data.course,
        yearOfStudy: parsed.data.yearOfStudy,
        intendedPosition: parsed.data.intendedPosition,
        biography: parsed.data.biography,
        manifesto: parsed.data.manifesto,
        },
        select: { id: true, candidateId: true, fullName: true, registrationNo: true, course: true, yearOfStudy: true, biography: true, manifesto: true },
      });
      if (application.candidateId) {
        await tx.candidate.update({
          where: { id: application.candidateId },
          data: {
            fullName: application.fullName,
            registrationNo: application.registrationNo,
            course: application.course,
            academicYear: application.yearOfStudy,
            biography: application.biography,
            manifesto: application.manifesto,
          },
        });
      }
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "UPDATE_CANDIDATE_REGISTRATION",
          entityType: "CandidateRegistration",
          entityId: application.id,
        },
      });
    });
    revalidatePath("/admin/candidate-registrations");
    revalidatePath(`/admin/candidate-registrations/${parsed.data.registrationId}`);
    return { success: true };
  } catch {
    return { error: "Could not update this application. Check for duplicate registration numbers." };
  }
}

export async function reviewCandidateRegistrationAction(registrationId: string, status: "PENDING" | "APPROVED" | "REJECTED") {
  const session = await requireAdmin();
  const parsedId = z.string().min(1).max(191).safeParse(registrationId);
  if (!parsedId.success) return { error: "Invalid application." };

  let publishedPhotoPath: string | null = null;
  try {
    const application = await prisma.candidateRegistration.findUnique({
      where: { id: parsedId.data },
      include: { files: { where: { type: "PROFILE_PHOTO" }, take: 1 } },
    });
    if (!application) return { error: "Application not found." };

    await prisma.$transaction(async (tx) => {
      let candidateId = application.candidateId;
      if (status !== "APPROVED" && candidateId) {
        const existingCandidate = await tx.candidate.findUnique({
          where: { id: candidateId },
          include: { _count: { select: { assignments: true, selections: true, results: true } } },
        });
        if (existingCandidate && (existingCandidate._count.assignments > 0
          || existingCandidate._count.selections > 0
          || existingCandidate._count.results > 0)) {
          throw new Error("An assigned or historical candidate cannot be unapproved.");
        }
        if (existingCandidate) {
          await tx.candidate.update({ where: { id: candidateId }, data: { status: "INACTIVE" } });
        }
      }
      if (status === "APPROVED") {
        const existing = await tx.candidate.findUnique({
          where: { registrationNo: application.registrationNo },
          select: { id: true },
        });
        const photo = application.files[0];
        let photoUrl: string | undefined;
        if (photo) {
          const extension = path.extname(photo.storedName) || ".img";
          const publicName = `${randomUUID()}${extension}`;
          publishedPhotoPath = path.join(process.cwd(), "public", "uploads", "candidates", publicName);
          await mkdir(path.dirname(publishedPhotoPath), { recursive: true });
          await writeFile(publishedPhotoPath, await readFile(path.join(privateUploadDirectory, photo.storedName)), { flag: "wx" });
          photoUrl = `/uploads/candidates/${publicName}`;
        }

        const candidateData = {
          fullName: application.fullName,
          registrationNo: application.registrationNo,
          course: application.course,
          academicYear: application.yearOfStudy,
          biography: application.biography,
          manifesto: application.manifesto,
          status: "ACTIVE" as const,
          ...(photoUrl ? { photoUrl } : {}),
        };
        const candidate = existing
          ? await tx.candidate.update({ where: { id: existing.id }, data: candidateData })
          : await tx.candidate.create({ data: candidateData });
        candidateId = candidate.id;
      }

      await tx.candidateRegistration.update({
        where: { id: application.id },
        data: { status, candidateId },
      });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: `CANDIDATE_REGISTRATION_${status}`,
          entityType: "CandidateRegistration",
          entityId: application.id,
          metadata: JSON.stringify({ reference: application.reference, candidateId }),
        },
      });
    });
    revalidatePath("/admin/candidate-registrations");
    revalidatePath(`/admin/candidate-registrations/${parsedId.data}`);
    revalidatePath("/admin/candidates");
    revalidatePath("/admin/elections");
    revalidatePath("/candidates");
    return { success: true };
  } catch (error) {
    if (publishedPhotoPath) await unlink(publishedPhotoPath).catch(() => undefined);
    if (error instanceof Error && error.message === "An assigned or historical candidate cannot be unapproved.") {
      return { error: error.message };
    }
    return { error: "Could not update the application status." };
  }
}
