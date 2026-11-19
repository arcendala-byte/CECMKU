"use client";

import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      {/* Main Content Area - offset by 64 (16rem) on desktop */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader isOpen={sidebarOpen} onMenuClick={() => setSidebarOpen((open) => !open)} />
        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
