"use client";

import * as React from "react";
import { UserRole } from "@/types/user";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./dashboard-header";
import { cn } from "@/lib/utils";

export interface DashboardLayoutShellProps {
  role: UserRole;
  userName?: string;
  userEmail?: string;
  children: React.ReactNode;
}

export function DashboardLayoutShell({
  role,
  userName,
  userEmail,
  children,
}: DashboardLayoutShellProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar navigation */}
      <Sidebar
        role={role}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <DashboardHeader
          currentRole={role}
          userName={userName}
          userEmail={userEmail}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

