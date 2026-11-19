import { cn } from "@/lib/utils/cn";

type Status = "DRAFT" | "SCHEDULED" | "OPEN" | "CLOSED" | "RESULTS_PENDING" | "PUBLISHED";

export function StatusBadge({ status }: { status: Status }) {
  const styles = {
    DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
    SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
    OPEN: "bg-green-50 text-green-700 border-green-200 animate-pulse",
    CLOSED: "bg-orange-50 text-orange-700 border-orange-200",
    RESULTS_PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    PUBLISHED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status])}>
      {status.replace("_", " ")}
    </span>
  );
}
