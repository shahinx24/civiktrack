"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types/user";
import { ROLE_NAVIGATION, ROLE_LABELS } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  ClipboardList,
  Globe,
  Briefcase,
  Users,
  Building2,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  role: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  ClipboardList,
  Globe,
  Briefcase,
  Users,
  Building2,
  BarChart3,
  Settings,
};

export function Sidebar({
  role,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const navItems = ROLE_NAVIGATION[role] || ROLE_NAVIGATION.resident;
  const roleLabel = ROLE_LABELS[role] || ROLE_LABELS.resident;

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between">
      {/* Top Section: Brand & Nav */}
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-teal-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                  Civic<span className="text-teal-600">Track</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                  {roleLabel.title}
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 px-3">
          {navItems.map((item) => {
            const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
            const isActive =
              item.href === `/${role}/dashboard`
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                title={isCollapsed ? item.title : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group",
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-700"
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Help & Session Action */}
      <div className="space-y-3 p-3 border-t border-slate-100">
        <Link
          href="/issues"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
          title={isCollapsed ? "Community Feed" : undefined}
        >
          <HelpCircle className="h-5 w-5 shrink-0 text-slate-400" />
          {!isCollapsed && <span>Public Feed</span>}
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
          title={isCollapsed ? "Exit Portal" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0 text-slate-400" />
          {!isCollapsed && <span>Exit Portal</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col border-r border-slate-200 bg-white transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:hidden transform transition-transform duration-200 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

