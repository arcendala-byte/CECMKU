"use client";

import { Menu } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export function AdminHeader({
  onMenuClick,
  isOpen,
}: {
  onMenuClick: () => void;
  isOpen: boolean;
}) {
  return (
    <header className="lg:hidden flex items-center justify-between bg-white border-b border-[#E5E7EB] p-4 sticky top-0 z-30 w-full">
      <span className="font-semibold text-[#0B1930]">Admin Portal</span>
      <div className="flex items-center gap-2">
        <LanguageSwitcher compact />
        <button
        type="button"
        onClick={onMenuClick}
        aria-label={isOpen ? "Close admin navigation" : "Open admin navigation"}
        aria-controls="admin-navigation"
        aria-expanded={isOpen}
        className="p-2 -mr-2 text-[#667085] hover:text-[#0B1930] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
      >
        <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
