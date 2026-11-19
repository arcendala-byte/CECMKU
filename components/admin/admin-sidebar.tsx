"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Vote, Users, UserSquare2, ClipboardList, Briefcase,
  BarChart3, FileText, Settings, X
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { logoutAction } from "@/lib/auth/actions";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";

const navItems = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Elections", href: "/admin/elections", icon: Vote },
  { name: "Voters", href: "/admin/voters", icon: Users },
  { name: "Candidates", href: "/admin/candidates", icon: UserSquare2 },
  { name: "Candidate Registrations", href: "/admin/candidate-registrations", icon: ClipboardList },
  { name: "Positions", href: "/admin/positions", icon: Briefcase },
  { name: "Results", href: "/admin/results", icon: BarChart3 },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ isOpen, closeSidebar }: { isOpen: boolean, closeSidebar: () => void }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeSidebar();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMobile, isOpen, closeSidebar]);

  return (
    <>
      <button
        type="button"
        aria-label="Close admin navigation"
        aria-hidden={!isOpen || !isMobile}
        tabIndex={isOpen && isMobile ? 0 : -1}
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      />

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#0B1930] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
        id="admin-navigation"
        aria-label="Admin navigation"
        role={isOpen && isMobile ? "dialog" : undefined}
        aria-modal={isOpen && isMobile ? true : undefined}
        aria-hidden={isMobile && !isOpen}
        inert={isMobile && !isOpen}
      >
        <div className="h-16 shrink-0 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img src="/images/logo.png" alt="Logo" className="h-7 w-7 object-contain bg-white rounded-full p-0.5" />
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight leading-tight">CECMKU Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="[&>button]:border-white/20 [&>button]:bg-white/10 [&>button]:text-white [&>button]:hover:bg-white/15">
              <LanguageSwitcher compact />
            </div>
            <button type="button" onClick={closeSidebar} aria-label="Close admin navigation" className="lg:hidden text-gray-400 hover:text-white p-1">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#142B4A] text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 p-4 border-t border-white/10">
          <form action={logoutAction}>
            <button className="w-full text-left px-3 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-md hover:bg-white/5 transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
