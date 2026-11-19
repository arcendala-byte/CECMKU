"use client";

import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Election", href: "/election" },
    { name: "Candidates", href: "/candidates" },
    { name: "Candidate Registration", href: "/candidate-registration" },
    { name: "Election Policy", href: "/policy" },
    { name: "Privacy Notice", href: "/privacy" },
    { name: "Results", href: "/results" },
    { name: "Voter Guidelines", href: "/guidelines" },
    { name: "Transparency", href: "/transparency" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <div className="ml-auto flex shrink-0 xl:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-[#0B1930] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="public-mobile-navigation"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <nav
          id="public-mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute top-16 left-0 right-0 bg-white border-b border-[#E5E7EB] shadow-lg p-4 flex flex-col gap-1 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto animate-menu-in"
        >
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-[#0B1930] py-3 border-b border-gray-100 last:border-0"
            >
              {link.name}
            </Link>
          ))}
          <div className="py-3 border-b border-gray-100">
            <LanguageSwitcher />
          </div>
          <div className="flex flex-col gap-2 mt-4 pt-2">
            <Link href="/register" onClick={() => setIsOpen(false)}>
              <Button variant="secondary" className="w-full">Register</Button>
            </Link>
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button className="w-full">Voter Login</Button>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
