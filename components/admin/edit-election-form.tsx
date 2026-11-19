
"use client";

import { useActionState, useEffect } from "react";
import { updateElectionAction } from "@/lib/actions/election.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function toLocalInput(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000)
    .toISOString()
    .slice(0, 16);
}

export function EditElectionForm({
  election,
  editable,
}: {
  election: {
    id: string;
    title: string;
    description: string;
    startAt: Date;
    endAt: Date;
  };
  editable: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    updateElectionAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      window.location.reload();
    }
  }, [state]);

  if (!editable) return null;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="electionId" value={election.id} />

      {state?.error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
          Election updated.
        </div>
      )}

      <div>
        <Label htmlFor="title">Election Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={election.title}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          defaultValue={election.description}
          required
          rows={4}
          className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startAt">Start Date &amp; Time</Label>
          <Input
            id="startAt"
            name="startAt"
            type="datetime-local"
            defaultValue={toLocalInput(election.startAt)}
            required
          />
        </div>

        <div>
          <Label htmlFor="endAt">End Date &amp; Time</Label>
          <Input
            id="endAt"
            name="endAt"
            type="datetime-local"
            defaultValue={toLocalInput(election.endAt)}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Election"}
        </Button>
      </div>
    </form>
  );
}
