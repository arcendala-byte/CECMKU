"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "en" ? "fr" : "en")}
      aria-label={language === "en" ? "Switch to French" : "Passer à l'anglais"}
      title={language === "en" ? "Switch to French" : "Passer à l'anglais"}
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white px-2.5 text-xs font-semibold text-[#0B1930] hover:bg-[#F7F8FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
    >
      <Languages className="h-4 w-4" />
      {compact ? language.toUpperCase() : language === "en" ? "EN / FR" : "FR / EN"}
    </button>
  );
}
