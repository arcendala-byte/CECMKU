import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function VoterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E5E7EB] bg-white/95 px-4 backdrop-blur sm:px-6">
        <Link href="/dashboard" className="text-sm font-semibold text-[#0B1930] hover:text-[#2563EB]">
          CECMKU Voter Portal
        </Link>
        <LanguageSwitcher compact />
      </header>
      <main>{children}</main>
    </div>
  );
}
