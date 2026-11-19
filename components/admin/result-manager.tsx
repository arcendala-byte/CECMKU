
"use client";

import { useState, type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

import {
  calculateResultsAction,
  publishResultsAction,
} from "@/lib/actions/result.actions";

type ElectionResult = {
  id: string;
  positionId: string;
  voteCount: number;
  position: {
    title: string;
  } | null;
  candidate: {
    fullName: string;
  } | null;
};

type AdminElection = {
  id: string;
  title: string;
  status: ComponentProps<typeof StatusBadge>["status"];
  results: ElectionResult[];
};

export function AdminResultManager({
  election,
}: {
  election: AdminElection;
}) {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasResults = election.results.length > 0;

  const resultsByPosition = election.results.reduce<
    Record<string, ElectionResult[]>
  >((acc, result) => {
    if (!acc[result.positionId]) {
      acc[result.positionId] = [];
    }

    acc[result.positionId].push(result);

    return acc;
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
      setError("Unable to calculate election results. Please try again.");
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
      setError("Unable to publish election results. Please try again.");
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
              ([positionId, results]) => (
                <div key={positionId} className="p-6">
                  <h4 className="font-semibold text-[#0B1930] mb-4">
                    {results[0]?.position?.title || "Position"}
                  </h4>

                  <div className="space-y-3">
                    {[...results]
                      .sort((a, b) => b.voteCount - a.voteCount)
                      .map((result) => (
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
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
