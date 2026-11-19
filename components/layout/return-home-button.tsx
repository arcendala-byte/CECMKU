import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ReturnHomeButton() {
  return (
    <Link
      href="/"
      className="inline-flex h-10 items-center gap-2 rounded-md border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#142B4A] transition-colors hover:bg-[#F7F8FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
    >
      <ArrowLeft className="h-4 w-4" />
      Return to Home
    </Link>
  );
}
