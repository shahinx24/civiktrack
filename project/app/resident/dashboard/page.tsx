"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { IssueService } from "@/services/issue-service";
import { Issue } from "@/types/issue";
import { formatDate } from "@/lib/utils";
import {
  PlusCircle,
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Bell,
  Sparkles,
} from "lucide-react";

export default function ResidentDashboardPage() {
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load issues submitted by resident Alex Morgan
        const myIssues = await IssueService.getUserIssues("usr-resident-01");
        setIssues(myIssues);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalReports = issues.length;
  const underReviewCount = issues.filter((i) => i.status === "under_review" || i.status === "submitted").length;
  const inProgressCount = issues.filter((i) => i.status === "in_progress").length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;

  return (
    <DashboardLayoutShell role="resident" userName="Alex Morgan" userEmail="alex.morgan@community.org">
      <div className="space-y-6">
        {/* Welcome Page Header */}
        <PageHeader
          title="Resident Hub"
          description="Track your reported community issues, submit new neighborhood repairs, and monitor municipal progress in Ward 4 - Riverside."
          actions={
            <Link href="/resident/report-issue">
              <Button
                variant="accent"
                size="md"
                leftIcon={<PlusCircle className="h-4 w-4" />}
              >
                Report New Issue
              </Button>
            </Link>
          }
        />

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Reports"
            value={totalReports}
            period="All time submissions"
            icon={<FileText className="h-5 w-5" />}
            iconBg="bg-slate-100 text-slate-800"
          />
          <StatCard
            label="Awaiting Review"
            value={underReviewCount}
            period="Municipal triage queue"
            icon={<Clock className="h-5 w-5" />}
            iconBg="bg-blue-50 text-blue-700"
          />
          <StatCard
            label="In Progress"
            value={inProgressCount}
            period="Field crews dispatched"
            icon={<Wrench className="h-5 w-5" />}
            iconBg="bg-indigo-50 text-indigo-700"
          />
          <StatCard
            label="Resolved"
            value={resolvedCount}
            period="Verified completions"
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconBg="bg-emerald-50 text-emerald-700"
          />
        </div>

        {/* Quick Report CTA Callout */}
        <div className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 via-teal-50/50 to-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Spot a pothole, leak, or damaged streetlight?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Takes less than a minute. Include a photo and location to speed up municipal response.
              </p>
            </div>
          </div>
          <Link href="/resident/report-issue" className="shrink-0 w-full sm:w-auto">
            <Button variant="accent" size="md" className="w-full sm:w-auto">
              Submit Report
            </Button>
          </Link>
        </div>

        {/* Layout Grid: Recent Reports Table & Notification Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Recent Reports (8 cols) */}
          <Card className="lg:col-span-8 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">My Recent Submissions</h3>
                <p className="text-xs text-slate-500">Reports filed by your account</p>
              </div>
              <Link
                href="/resident/my-reports"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                View all reports →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 rounded-lg bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : issues.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                You haven&apos;t submitted any issues yet. Click &quot;Report New Issue&quot; above to submit your first report.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {issues.slice(0, 4).map((issue) => (
                  <div
                    key={issue.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {issue.trackingNumber}
                        </span>
                        <StatusPill status={issue.status} size="sm" />
                      </div>
                      <Link
                        href={`/issues/${issue.id}`}
                        className="block font-semibold text-slate-900 group-hover:text-teal-600 transition-colors text-sm truncate"
                      >
                        {issue.title}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{issue.location.address}</span>
                        </span>
                        <span>•</span>
                        <span>{formatDate(issue.createdAt)}</span>
                      </div>
                    </div>

                    <Link
                      href={`/issues/${issue.id}`}
                      className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 group-hover:text-teal-700 self-end sm:self-center"
                    >
                      <span>Track</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Right Column: Ward 4 Noticeboard (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Ward 4 Activity Feed
                </h4>
                <Bell className="h-4 w-4 text-teal-600" />
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <p className="font-semibold text-slate-800">
                    Road Crew Dispatched to Oak St
                  </p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Public Works heavy asphalt roller unit en route for pothole repair.
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    Today at 08:30 AM
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <p className="font-semibold text-slate-800">
                    Storm Drain Jetting Complete
                  </p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Riverbend Road drainage grate cleared of debris. Roadway reopened.
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    Yesterday at 12:00 PM
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/issues"
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 block text-center"
                >
                  Explore all Ward 4 community issues →
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayoutShell>
  );
}

