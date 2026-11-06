"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PUBLIC_NAV_ITEMS } from "@/constants/navigation";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Menu,
  X,
  ArrowRight,
  PlusCircle,
  LogIn,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-teal-400 group-hover:bg-slate-800 transition-colors shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
              Civic<span className="text-teal-600">Track</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Community Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {PUBLIC_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link href="/resident/report-issue">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PlusCircle className="h-4 w-4 text-teal-600" />}
              className="text-slate-700 hover:text-teal-700"
            >
              Report Issue
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<LogIn className="h-4 w-4" />}
            >
              Sign In
            </Button>
          </Link>
          <Link href="/resident/dashboard">
            <Button
              variant="default"
              size="sm"
              rightIcon={<ArrowRight className="h-4 w-4 text-slate-300" />}
            >
              Demo Portal
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/resident/report-issue">
            <Button
              variant="accent"
              size="sm"
              className="text-xs px-2.5 h-8"
              leftIcon={<PlusCircle className="h-3.5 w-3.5" />}
            >
              Report
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <p className="text-xs font-semibold uppercase text-slate-400 px-3 tracking-wider">
              Quick Portals (Demo)
            </p>
            <div className="grid grid-cols-2 gap-2 px-1">
              <Link
                href="/resident/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <UserCheck className="h-4 w-4 text-teal-600" />
                Resident Hub
              </Link>
              <Link
                href="/authority/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                Authority Admin
              </Link>
              <Link
                href="/officer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <UserCheck className="h-4 w-4 text-amber-600" />
                Field Officer
              </Link>
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <ShieldCheck className="h-4 w-4 text-purple-600" />
                System Admin
              </Link>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="default" className="w-full justify-center">
                  Create Resident Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

