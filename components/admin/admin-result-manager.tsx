
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  calculateResultsAction,
  publishResultsAction,
} from "@/lib/actions/result.actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Prisma } from "@prisma/client";

type ElectionWithResults = Prisma.ElectionGetPayload<{
  include: {
    results: {
      include: {
        position: true;
        candidate: true;
      };
    };
  };
}>;

export function AdminResultManager({
  election,
}: {
  election: ElectionWithResults;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasResults = election.results.length > 0;

  const resultsByPosition = election.results.reduce<
    Record<string, typeof election.results>
  >((groups, result) => {
    (groups[result.positionId] ??= []).push(result);
    return groups;
  }, {});

  async function handleCalculate() {
    setIsPending(true);
    setError(null);

    try {
      const result = await calculateResultsAction(election.id);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    } catch {
      setError("Unable to calculate results. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  async function handlePublish() {
    setIsPending(true);
    setError(null);

    try {
      const result = await publishResultsAction(election.id);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    } catch {
      setError("Unable to publish results. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between bg-[#F7F8FA] border-b border-[#E5E7EB]">
        <div>
          <CardTitle className="text-lg">{election.title}</CardTitle>
          <div className="text-sm text-[#667085] mt-1 flex items-center gap-2">
            Status: <StatusBadge status={election.status} />
          </div>
        </div>

        <div className="flex gap-2">
          {(!hasResults || election.status === "CLOSED") && (
            <Button
              onClick={handleCalculate}
              disabled={isPending}
              variant="secondary"
            >
              {isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Calculate Results
            </Button>
          )}

          {hasResults && election.status === "RESULTS_PENDING" && (
            <Button onClick={handlePublish} disabled={isPending}>
              {isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify &amp; Publish
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {error && (
          <p
            role="alert"
            className="m-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {!hasResults ? (
          <div className="p-8 text-center text-[#667085]">
            Click &quot;Calculate Results&quot; to tally the anonymous ballots.
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB]">
            {Object.entries(resultsByPosition).map(
              ([positionId, positionResults]) => {
                const sortedResults = [...positionResults].sort(
                  (a, b) => b.voteCount - a.voteCount
                );

                return (
                  <div key={positionId} className="p-6">
                    <h4 className="font-semibold text-[#0B1930] mb-4">
                      {sortedResults[0]?.position?.title || "Position"}
                    </h4>

                    <div className="space-y-3">
                      {sortedResults.map((result) => (
                        <div
                          key={result.id}
                          className="flex items-center justify-between p-3 bg-[#F7F8FA] rounded-md border border-[#E5E7EB]"
                        >
                          <span className="font-medium text-[#0B1930]">
                            {result.candidate?.fullName || "Unknown"}
                          </span>
                          <span className="font-bold text-[#2563EB]">
                            {result.voteCount} votes
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
