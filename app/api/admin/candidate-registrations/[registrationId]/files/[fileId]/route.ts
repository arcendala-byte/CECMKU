import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/database/prisma";

const privateUploadDirectory = path.join(process.cwd(), "storage", "candidate-registrations");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ registrationId: string; fileId: string }> },
) {
  await requireAdmin();
  const { registrationId, fileId } = await params;
  const file = await prisma.candidateRegistrationFile.findFirst({
    where: { id: fileId, registrationId },
    select: { originalName: true, storedName: true, mimeType: true, size: true, type: true },
  });
  if (!file || path.basename(file.storedName) !== file.storedName) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  try {
    const contents = await readFile(path.join(privateUploadDirectory, file.storedName));
    return new NextResponse(new Uint8Array(contents), {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Length": String(file.size),
        "Content-Disposition": `${file.type === "PROFILE_PHOTO" ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Stored file is unavailable." }, { status: 404 });
  }
}
