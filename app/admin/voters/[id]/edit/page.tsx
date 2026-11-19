import { prisma } from "@/lib/database/prisma";
import { notFound } from "next/navigation";
import { EditVoterForm } from "@/components/admin/edit-voter-form";

export default async function EditVoterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const voter = await prisma.user.findUnique({
    where: { id },
    include: { voterProfile: true },
  });
  if (!voter || voter.role !== "VOTER" || !voter.voterProfile) return notFound();

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-semibold text-[#0B1930] mb-6">Edit Voter</h1>
      <EditVoterForm
        userId={voter.id}
        fullName={voter.fullName}
        email={voter.email}
        registrationNo={voter.voterProfile.registrationNo}
        voterId={voter.voterProfile.voterId}
      />
    </div>
  );
}
