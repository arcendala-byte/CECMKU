"use client";

import { useState } from "react";
import { createPositionAction, assignCandidateAction } from "@/lib/actions/election.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserPlus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { translateCurrentLanguage } from "@/components/language-provider";

type CandidateOption = { id: string; fullName: string; intendedPosition?: string };
type PositionCandidate = { id: string; candidate: { fullName: string } };
type Position = { id: string; title: string; description: string; candidates: PositionCandidate[] };

export function PositionManager({ electionId, positions, allCandidates }: { electionId: string; positions: Position[]; allCandidates: CandidateOption[] }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [assigningTo, setAssigningTo] = useState<string | null>(null);

  async function handleCreatePosition(formData: FormData) {
    const res = await createPositionAction(null, formData);
    if (res?.success) {
      setIsCreating(false);
      router.refresh();
    } else {
      alert(translateCurrentLanguage(res?.error ?? "Position could not be created."));
    }
  }

  async function handleAssign(formData: FormData) {
    const res = await assignCandidateAction(null, formData);
    if (res?.success) {
      setAssigningTo(null);
      router.refresh();
    } else {
      alert(translateCurrentLanguage(res?.error ?? "Candidate assignment could not be completed."));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#0B1930]">Positions & Candidates</h2>
        <Button size="sm" onClick={() => setIsCreating(!isCreating)}>
          <Plus className="h-4 w-4 mr-2" /> Add Position
        </Button>
      </div>

      {isCreating && (
        <Card className="border-[#2563EB]">
          <CardContent className="p-4">
            <form action={handleCreatePosition} className="space-y-3">
              <input type="hidden" name="electionId" value={electionId} />
              <div>
                <Label>Position Title</Label>
                <Input name="title" placeholder="e.g., President" required />
              </div>
              <div>
                <Label>Description</Label>
                <Input name="description" placeholder="Brief description" required />
              </div>
              <input type="hidden" name="mandatory" value="true" />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit">Save Position</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {positions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-[#E5E7EB]">
          <p className="text-[#667085]">No positions created yet.</p>
        </div>
      ) : (
        positions.map((position) => (
          <Card key={position.id}>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div>
                <h3 className="font-semibold text-[#0B1930]">{position.title}</h3>
                <p className="text-sm text-[#667085]">{position.description}</p>
              </div>
            </CardHeader>
            <CardContent className="bg-[#F7F8FA] p-4 border-t border-[#E5E7EB]">
              <div className="space-y-3">
                {position.candidates.map((ec) => (
                  <div key={ec.id} className="flex items-center justify-between bg-white p-3 rounded-md border border-[#E5E7EB]">
                    <span className="font-medium text-sm text-[#0B1930]">{ec.candidate.fullName}</span>
                  </div>
                ))}

                {assigningTo === position.id ? (
                  <form action={handleAssign} className="flex gap-2 items-center bg-white p-2 rounded-md border border-[#2563EB]">
                    <input type="hidden" name="electionId" value={electionId} />
                    <input type="hidden" name="positionId" value={position.id} />
                    <select name="candidateId" className="flex-1 h-9 rounded border border-[#E5E7EB] px-2 text-sm" required>
                      <option value="">Select a candidate...</option>
                      {allCandidates
                        .filter((candidate) => !candidate.intendedPosition || candidate.intendedPosition.trim().toLowerCase() === position.title.trim().toLowerCase())
                        .map((c) => (
                        <option key={c.id} value={c.id}>{c.fullName}</option>
                      ))}
                    </select>
                    <Button type="submit" size="sm">Assign</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setAssigningTo(null)}>Cancel</Button>
                  </form>
                ) : (
                  <Button variant="secondary" size="sm" className="w-full border-dashed" onClick={() => setAssigningTo(position.id)}>
                    <UserPlus className="h-4 w-4 mr-2" /> Assign Candidate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
