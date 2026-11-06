import Link from "next/link";
import { ShieldCheck, HeartHandshake, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-teal-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Civic<span className="text-teal-600">Track</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Bridging the gap between active citizens and local municipal
              administration. Report potholes, power outages, sanitation
              concerns, and track public resolutions in real time.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <HeartHandshake className="h-4 w-4 text-teal-600" />
              <span>Dedicated to open, transparent community governance.</span>
            </div>
          </div>

          {/* Quick Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Civic Portals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/resident/dashboard"
                  className="hover:text-teal-600 transition-colors"
                >
                  Resident Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/resident/report-issue"
                  className="hover:text-teal-600 transition-colors"
                >
                  Submit Issue Report
                </Link>
              </li>
              <li>
                <Link
                  href="/issues"
                  className="hover:text-teal-600 transition-colors"
                >
                  Community Issue Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/authority/dashboard"
                  className="hover:text-teal-600 transition-colors"
                >
                  Authority Oversight
                </Link>
              </li>
              <li>
                <Link
                  href="/officer/dashboard"
                  className="hover:text-teal-600 transition-colors"
                >
                  Field Officer Worklist
                </Link>
              </li>
            </ul>
          </div>

          {/* Municipal Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Issue Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/issues?category=roads"
                  className="hover:text-teal-600 transition-colors"
                >
                  Roads & Infrastructure
                </Link>
              </li>
              <li>
                <Link
                  href="/issues?category=water"
                  className="hover:text-teal-600 transition-colors"
                >
                  Water Supply & Drainage
                </Link>
              </li>
              <li>
                <Link
                  href="/issues?category=sanitation"
                  className="hover:text-teal-600 transition-colors"
                >
                  Sanitation & Waste
                </Link>
              </li>
              <li>
                <Link
                  href="/issues?category=electricity"
                  className="hover:text-teal-600 transition-colors"
                >
                  Streetlights & Power
                </Link>
              </li>
              <li>
                <Link
                  href="/issues?category=parks"
                  className="hover:text-teal-600 transition-colors"
                >
                  Parks & Public Spaces
                </Link>
              </li>
            </ul>
          </div>

          {/* Civic Helpdesk Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Civic Helpdesk
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-600 shrink-0" />
                <span>Toll-Free: 1-800-CIVIC-00</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-600 shrink-0" />
                <span>support@civictrack.gov.local</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Municipal Center, Ward 4 Civic Plaza</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 CivicTrack Platform. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/about" className="hover:text-slate-600 transition-colors">
              About & Transparency
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/about#privacy" className="hover:text-slate-600 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/about#terms" className="hover:text-slate-600 transition-colors">
              Terms of Civic Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
