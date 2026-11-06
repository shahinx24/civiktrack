"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/user";
import { ROLE_LABELS } from "@/constants/navigation";
import { Avatar } from "@/components/ui/avatar";
import {
  Menu,
  Bell,
  Search,
  Check,
  ChevronDown,
  UserCheck,
  Building,
  Briefcase,
  Shield,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  currentRole: UserRole;
  userName?: string;
  userEmail?: string;
  onOpenMobileMenu?: () => void;
}

const ROLES: { id: UserRole; name: string; path: string; icon: React.ElementType }[] = [
  { id: "resident", name: "Resident", path: "/resident/dashboard", icon: UserCheck },
  { id: "authority", name: "Authority Admin", path: "/authority/dashboard", icon: Building },
  { id: "officer", name: "Field Officer", path: "/officer/dashboard", icon: Briefcase },
  { id: "admin", name: "System Admin", path: "/admin/dashboard", icon: Shield },
];

export function DashboardHeader({
  currentRole,
  userName = "Alex Morgan",
  userEmail = "alex.morgan@civic.local",
  onOpenMobileMenu,
}: DashboardHeaderProps) {
  const router = useRouter();
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const currentRoleInfo = ROLE_LABELS[currentRole] || ROLE_LABELS.resident;

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-xs">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Quick Search */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search issues, track ID..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Issue submission for resident */}
        {currentRole === "resident" && (
          <Link href="/resident/report-issue" className="hidden sm:inline-flex">
            <Button
              variant="accent"
              size="sm"
              leftIcon={<PlusCircle className="h-4 w-4" />}
            >
              Report Issue
            </Button>
          </Link>
        )}

        {/* Role Demo Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            title="Switch demo role perspective"
          >
            <span className="hidden xs:inline text-slate-400">View as:</span>
            <span className="font-semibold text-slate-900">
              {currentRoleInfo.title}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setRoleMenuOpen(false)}
            >
              <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Switch Demo Role
                </p>
              </div>
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isSelected = r.id === currentRole;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRoleMenuOpen(false);
                      router.push(r.path);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-teal-600" />
                      <span>{r.name}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-teal-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute 1 top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setNotificationsOpen(false)}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-semibold text-slate-900">
                  Civic Notifications
                </span>
                <span className="text-[10px] font-medium bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">
                  3 New
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <p className="font-semibold text-slate-800">
                    Report #CT-8921 updated
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Status moved to In Progress by Public Works
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    10m ago
                  </span>
                </div>
                <div className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <p className="font-semibold text-slate-800">
                    New issue assigned to your ward
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Water pipeline leak reported at Oak Ave
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    1h ago
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Info Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <Avatar name={userName} size="sm" />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight">
              {userName}
            </span>
            <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
              {userEmail}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

