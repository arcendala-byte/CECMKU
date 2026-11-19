
"use client";

import { useState } from "react";
import { submitBallotAction } from "@/lib/actions/vote.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type BallotPosition = {
  id: string;
  title: string;
  description: string | null;
  mandatory: boolean;
  candidates: {
    candidate: {
      id: string;
      fullName: string;
      slogan: string | null;
    };
  }[];
};

export function BallotForm({
  electionId,
  positions,
}: {
  electionId: string;
  positions: BallotPosition[];
}) {
  const router = useRouter();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (positionId: string, candidateId: string) => {
    setSelections((prev) => ({ ...prev, [positionId]: candidateId }));
  };

  const handleSubmit = async () => {
    const missingMandatory = positions.filter(
      (position) => position.mandatory && !selections[position.id]
    );

    if (missingMandatory.length > 0) {
      setError(
        `Please select a candidate for all mandatory positions (${missingMandatory
          .map((position) => position.title)
          .join(", ")})`
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = Object.entries(selections).map(
        ([positionId, candidateId]) => ({
          positionId,
          candidateId,
        })
      );

      const res = await submitBallotAction(electionId, payload);

      if (res.error) {
        setError(res.error);
        setIsSubmitting(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Unable to submit your ballot. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {error && (
        <div className="flex items-start gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-[#DC2626]">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {positions.map((position) => (
        <Card key={position.id}>
          <div className="p-4 bg-[#142B4A] text-white rounded-t-lg">
            <h3 className="font-semibold">{position.title}</h3>
            <p className="text-sm text-gray-300">{position.description}</p>

            {position.mandatory && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded mt-2 inline-block">
                Mandatory
              </span>
            )}
          </div>

          <CardContent className="p-4 space-y-3">
            {position.candidates.length === 0 ? (
              <p className="text-sm text-[#667085] italic">
                No candidates for this position.
              </p>
            ) : (
              position.candidates.map(({ candidate }) => (
                <label
                  key={candidate.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selections[position.id] === candidate.id
                      ? "border-[#2563EB] bg-blue-50/50"
                      : "border-[#E5E7EB] hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`position-${position.id}`}
                    value={candidate.id}
                    checked={selections[position.id] === candidate.id}
                    onChange={() => handleSelect(position.id, candidate.id)}
                    className="w-5 h-5 text-[#2563EB] focus:ring-[#2563EB]"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-[#0B1930]">
                      {candidate.fullName}
                    </p>
                    {candidate.slogan && (
                      <p className="text-sm text-[#667085]">
                        &quot;{candidate.slogan}&quot;
                      </p>
                    )}
                  </div>
                </label>
              ))
            )}
          </CardContent>
        </Card>
      ))}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-sm text-[#667085]">
            {Object.keys(selections).length} of {positions.length} positions
            selected
          </p>

          <Button size="lg" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Submit Ballot
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
