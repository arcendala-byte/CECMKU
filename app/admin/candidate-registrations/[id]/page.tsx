import Link from "next/link";
import { notFound } from "next/navigation";
import { CandidateRegistrationEditForm } from "@/components/admin/candidate-registration-edit-form";
import { CandidateRegistrationReview } from "@/components/admin/candidate-registration-review";
import { prisma } from "@/lib/database/prisma";

export default async function CandidateRegistrationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = await prisma.candidateRegistration.findUnique({
    where: { id },
    include: { files: { orderBy: { createdAt: "asc" } }, candidate: { select: { id: true, fullName: true } } },
  });
  if (!application) notFound();

  const photo = application.files.find((file) => file.type === "PROFILE_PHOTO");
  const documents = application.files.filter((file) => file.type === "SUPPORTING_DOCUMENT");

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <div>
        <Link href="/admin/candidate-registrations" className="text-sm text-[#2563EB] hover:underline">← Candidate registrations</Link>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0B1930]">{application.fullName}</h1>
            <p className="mt-1 font-mono text-sm text-[#667085]">{application.reference}</p>
          </div>
          <span className="w-fit rounded-full border border-[#E5E7EB] px-3 py-1 text-sm">{application.status}</span>
        </div>
      </div>

      <section className="grid gap-6 rounded-lg border border-[#E5E7EB] bg-white p-4 sm:grid-cols-[180px_1fr] sm:p-6">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/api/admin/candidate-registrations/${application.id}/files/${photo.id}`} alt={`Profile photograph for ${application.fullName}`} className="aspect-square w-full rounded-lg border border-[#E5E7EB] object-cover" />
        ) : <div className="aspect-square rounded-lg bg-[#F7F8FA]" />}
        <dl className="grid content-start gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <div><dt className="text-[#667085]">Registration number</dt><dd className="font-medium">{application.registrationNo}</dd></div>
          <div><dt className="text-[#667085]">Election cycle</dt><dd className="font-medium">{application.cycleKey}</dd></div>
          <div><dt className="text-[#667085]">Email</dt><dd className="font-medium break-all">{application.email}</dd></div>
          <div><dt className="text-[#667085]">Phone</dt><dd className="font-medium">{application.phone}</dd></div>
          <div><dt className="text-[#667085]">Faculty/school</dt><dd className="font-medium">{application.faculty}</dd></div>
          <div><dt className="text-[#667085]">Department</dt><dd className="font-medium">{application.department}</dd></div>
          <div><dt className="text-[#667085]">Course</dt><dd className="font-medium">{application.course}</dd></div>
          <div><dt className="text-[#667085]">Year of study</dt><dd className="font-medium">{application.yearOfStudy}</dd></div>
          <div><dt className="text-[#667085]">Intended position</dt><dd className="font-medium">{application.intendedPosition}</dd></div>
          <div><dt className="text-[#667085]">Submitted</dt><dd className="font-medium">{application.createdAt.toLocaleString()}</dd></div>
        </dl>
      </section>

      <section className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <h2 className="mb-3 text-lg font-semibold text-[#0B1930]">Supporting documents</h2>
        {documents.length ? <ul className="space-y-2">{documents.map((file) => (
          <li key={file.id}><a className="text-sm font-medium text-[#2563EB] hover:underline" href={`/api/admin/candidate-registrations/${application.id}/files/${file.id}`}>{file.originalName} <span className="text-[#667085]">({(file.size / 1024 / 1024).toFixed(1)} MB)</span></a></li>
        ))}</ul> : <p className="text-sm text-[#667085]">No supporting documents attached.</p>}
      </section>

      <section className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <h2 className="mb-3 text-lg font-semibold text-[#0B1930]">Review decision</h2>
        {application.candidate && <p className="mb-3 text-sm text-green-700">Linked candidate record: {application.candidate.fullName}</p>}
        <CandidateRegistrationReview registrationId={application.id} status={application.status} />
      </section>

      <section className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#0B1930]">Edit application information</h2>
        <CandidateRegistrationEditForm application={application} />
      </section>
    </div>
  );
}
