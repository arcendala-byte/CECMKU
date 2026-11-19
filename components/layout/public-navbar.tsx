import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "@/components/language-switcher";

export function PublicNavbar() {
  const primaryLinks = [
    { label: "Home", href: "/" },
    { label: "Election", href: "/election" },
    { label: "Candidates", href: "/candidates" },
    { label: "Results", href: "/results" },
    { label: "Candidate Registration", href: "/candidate-registration" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="z-50 flex shrink-0 items-center gap-2.5">
          <Image src="/images/logo.png" alt="CECMKU Logo" width={40} height={40} priority className="h-10 w-10 object-contain" />
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-bold leading-tight text-[#0B1930] sm:text-base">CECMKU</span>
            <span className="hidden max-w-[220px] truncate text-[11px] leading-tight text-[#667085] sm:block">
              Communauté des Étudiants Congolais à MKU
            </span>
          </div>
        </Link>

        <nav aria-label="Primary navigation" className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex">
          {primaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                item.href === "/candidate-registration"
                  ? "text-[#2563EB] hover:bg-blue-50"
                  : "text-[#667085] hover:bg-[#F7F8FA] hover:text-[#0B1930]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-2 border-l border-[#E5E7EB] pl-4 xl:flex">
          <LanguageSwitcher compact />
          <Link href="/register">
            <Button variant="ghost" size="sm" className="text-[#142B4A]">Register</Button>
          </Link>
          <Link href="/login">
            <Button variant="primary" size="sm">Voter Login</Button>
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
