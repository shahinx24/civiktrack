"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MOCK_DEPARTMENTS } from "@/mock/departments";
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "Do I need to create an account to view or report community issues?",
    answer:
      "Anyone can freely browse community issues, search by neighborhood, and view resolution timelines without logging in. To submit a new issue or upvote an existing report, you can quickly sign in or use the resident portal.",
  },
  {
    question: "What happens after I submit a report?",
    answer:
      "Your issue immediately appears in the municipal queue with a unique tracking number (e.g., CT-8921). The central triage authority reviews your submission within 2-4 business hours, categorizes it, and dispatches it to the designated department field crew.",
  },
  {
    question: "How are urgent or emergency issues handled?",
    answer:
      "Issues tagged as Critical (such as downed power lines, broken gas mains, or structural collapse) trigger immediate high-priority alerts to dispatch teams. For imminent life-threatening emergencies, residents should always dial 911 or local emergency services directly.",
  },
  {
    question: "Why was my issue rejected?",
    answer:
      "A report may be rejected if it pertains to private property (such as personal driveways or private interior plumbing), is an exact duplicate of an already active ticket, or falls outside municipal jurisdiction. A detailed explanation note is always logged in the transparency timeline.",
  },
  {
    question: "Can I track issues reported by other neighbors?",
    answer:
      "Yes! CivicTrack is completely transparent. You can search issues across all 5 municipal wards, filter by category (roads, water, electricity, sanitation), and upvote issues affecting your street to help city planners prioritize them.",
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 border border-teal-200">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              <span>Civic Mission & Municipal Transparency</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Empowering Citizens, Elevating City Infrastructure
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              CivicTrack was founded on a simple principle: municipal governance works
              best when every citizen has a voice, and every report has a clear,
              auditable path to resolution.
            </p>
          </div>

          {/* Pillars of Transparency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Service Level Guarantees</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Standard issues are acknowledged within 4 hours. Potholes and roadway
                hazards are triaged within 24 hours, and critical hazards are dispatched
                with emergency priority.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Zero Lost Reports</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Every ticket is permanently registered in the public audit ledger.
                Statuses cannot change without recorded actor notes, department stamps,
                and timestamp records.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Photo Proof Verification</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Field officers attach completion photographs and technical notes upon
                closing an issue, allowing the neighborhood to verify the quality of work.
              </p>
            </Card>
          </div>

          {/* Connected Municipal Departments */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Governance Network
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                Participating Municipal Departments
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                CivicTrack connects directly to dispatch consoles across municipal services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_DEPARTMENTS.map((dept) => (
                <Card key={dept.id} className="p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        {dept.code}
                      </span>
                      <span className="text-xs text-slate-500">
                        Head: <strong className="text-slate-700">{dept.headOfficer}</strong>
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{dept.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{dept.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {dept.phone}
                    </span>
                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {dept.resolvedIssuesCount} resolved
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-6 max-w-3xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Common Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-slate-900 hover:bg-slate-50/70 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className="h-4 w-4 text-teal-600 shrink-0" />
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2",
                          isOpen ? "rotate-180 text-teal-600" : ""
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact & Support Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-900">
                Ready to make your neighborhood better?
              </h3>
              <p className="text-sm text-slate-500 max-w-md leading-relaxed">
                Submit an issue report right now with photos and street location, or
                browse current community tickets.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/resident/report-issue">
                <Button
                  variant="accent"
                  size="md"
                  leftIcon={<PlusCircle className="h-4 w-4" />}
                >
                  Report an Issue
                </Button>
              </Link>
              <Link href="/issues">
                <Button variant="outline" size="md">
                  Browse Issues
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

