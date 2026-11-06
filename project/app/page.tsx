"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { IssueCard } from "@/components/issues/issue-card";
import { Issue } from "@/types/issue";
import { IssueService } from "@/services/issue-service";
import { ISSUE_CATEGORIES, CATEGORY_LIST } from "@/constants/categories";
import {
  ShieldCheck,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building2,
  Wrench,
  FileCheck,
  Award,
} from "lucide-react";

export default function HomePage() {
  const [featuredIssues, setFeaturedIssues] = React.useState<Issue[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const res = await IssueService.getIssues({}, 1, 6);
        setFeaturedIssues(res.issues);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpvote = async (issueId: string) => {
    await IssueService.toggleUpvote(issueId);
    setFeaturedIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          const nextVal = !i.userHasUpvoted;
          return {
            ...i,
            userHasUpvoted: nextVal,
            upvotes: nextVal ? i.upvotes + 1 : Math.max(0, i.upvotes - 1),
          };
        }
        return i;
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-16 pb-20 lg:pt-24 lg:pb-28">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline & Action */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-300">
                  <ShieldCheck className="h-4 w-4 text-teal-400" />
                  <span>Official Municipal Issue Reporting Platform</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                  Real Community Problems.
                  <span className="block text-teal-400 mt-1">
                    Transparent Solutions.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                  Report potholes, damaged streetlights, water leaks, and public
                  safety hazards in seconds. Follow real-time municipal triage,
                  department work orders, and photographic resolution proofs.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link href="/resident/report-issue" className="w-full sm:w-auto">
                    <Button
                      variant="accent"
                      size="lg"
                      className="w-full sm:w-auto text-base h-12 px-6"
                      leftIcon={<PlusCircle className="h-5 w-5" />}
                    >
                      Report an Issue Now
                    </Button>
                  </Link>

                  <Link href="/issues" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto text-base h-12 px-6 border-slate-700 bg-slate-800/80 text-white hover:bg-slate-800 hover:border-slate-600"
                      leftIcon={<Search className="h-5 w-5 text-teal-400" />}
                    >
                      Explore Public Tracker
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-400" />
                    <span>Open Public Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal-400" />
                    <span>Average 38hr Resolution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-400" />
                    <span>5 Wards Connected</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Live Civic Metric Card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-slate-700/80 bg-slate-800/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center justify-between pb-6 border-b border-slate-700/60">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Civic Activity Overview
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Live municipal response telemetry
                      </p>
                    </div>
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500" />
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/40">
                      <span className="text-xs font-medium text-slate-400 block">
                        Total Reports Logged
                      </span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                        1,482
                      </span>
                      <span className="text-[11px] text-teal-400 font-medium inline-flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" /> +14% this month
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/40">
                      <span className="text-xs font-medium text-slate-400 block">
                        Issues Resolved
                      </span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-teal-400 mt-1 block">
                        1,264
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                        85.3% clearance rate
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/40">
                      <span className="text-xs font-medium text-slate-400 block">
                        Under Active Work
                      </span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 block">
                        178
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                        Assigned to field crews
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/40">
                      <span className="text-xs font-medium text-slate-400 block">
                        Citizen Approval
                      </span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                        94.2%
                      </span>
                      <span className="text-[11px] text-teal-400 font-medium mt-1 block">
                        Verified satisfaction
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/issues"
                      className="flex items-center justify-between text-xs font-semibold text-teal-300 hover:text-teal-200 transition-colors group"
                    >
                      <span>Explore all resolved and active municipal tickets</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Simple 3-Step Lifecycle
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-3">
                How CivicTrack Resolves Issues
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2">
                From your neighborhood sidewalk to municipal dispatch and verified completion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white mb-5 shadow-sm shadow-teal-600/20">
                  <FileCheck className="h-7 w-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
                  Step 01
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  1. Report With Photo & Location
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Snap a photo of the road hazard, water leak, or fallen branch.
                  Pin your address or ward and specify urgency.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white mb-5 shadow-sm">
                  <Wrench className="h-7 w-7 text-teal-400" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Step 02
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  2. Municipal Triage & Dispatch
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Municipal authority administrators review the report, assign it
                  to the relevant department (e.g. Public Works), and dispatch field crews.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-white mb-5 shadow-sm shadow-teal-700/20">
                  <Award className="h-7 w-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
                  Step 03
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  3. Transparent Verification
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Field officers complete the work, upload verification proof, and
                  the public timeline marks the ticket resolved for all residents to see.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Municipal Domains
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                  Browse by Civic Category
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Explore reports categorized by municipal service responsibility.
                </p>
              </div>
              <Link href="/issues">
                <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  View All Categories
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CATEGORY_LIST.slice(0, 6).map((catKey) => {
                const config = ISSUE_CATEGORIES[catKey];
                return (
                  <Link
                    key={catKey}
                    href={`/issues?category=${catKey}`}
                    className="group rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-teal-500 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.badgeBg} ${config.badgeText}`}
                      >
                        {config.label}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      {config.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{config.defaultDepartment}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Recent Community Issues */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Real Community Feed
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                  Recent Issues in Your City
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Follow local neighborhood updates, upvote urgent repairs, and track progress.
                </p>
              </div>
              <Link href="/issues">
                <Button variant="default" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Explore All Community Issues
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-80 rounded-xl bg-slate-100 animate-pulse border border-slate-200"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredIssues.slice(0, 6).map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onUpvote={handleUpvote}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Civic Transparency Guarantee Banner */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3.5 py-1 text-xs font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>Accountability Pledge</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                Zero Lost Reports. Total Public Accountability.
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Every ticket submitted to CivicTrack receives a unique tracking
                number. Citizens can audit the date, timestamp, assigned municipal
                officer, and exact resolution notes at any time.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/resident/report-issue">
                  <Button variant="accent" size="lg" className="h-11 px-6">
                    Submit Community Issue
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-11 px-6 border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                  >
                    Learn About CivicTrack
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
