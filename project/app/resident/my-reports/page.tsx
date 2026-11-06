"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IssueService } from "@/services/issue-service";
import { Issue, IssueStatus } from "@/types/issue";
import { ISSUE_CATEGORIES } from "@/constants/categories";
import { formatDate } from "@/lib/utils";
import {
  PlusCircle,
  Search,
  ArrowRight,
  MapPin,
  ThumbsUp,
  FileText,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MyReportsPage() {
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await IssueService.getUserIssues("usr-resident-01");
        setIssues(data);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    // Tab filter
    if (activeTab === "active" && (issue.status === "resolved" || issue.status === "rejected")) {
      return false;
    }
    if (activeTab === "resolved" && issue.status !== "resolved") {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.trackingNumber.toLowerCase().includes(q) ||
        issue.location.address.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const totalCount = issues.length;
  const activeCount = issues.filter(
    (i) => i.status !== "resolved" && i.status !== "rejected"
  ).length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;

  return (
    <DashboardLayoutShell role="resident" userName="Alex Morgan" userEmail="alex.morgan@community.org">
      <div className="space-y-6">
        <PageHeader
          title="My Issue Reports"
          description="View, track, and manage all community issues you have submitted. Monitor step-by-step progress as municipal teams respond."
          breadcrumbs={[
            { label: "Resident Hub", href: "/resident/dashboard" },
            { label: "My Reports" },
          ]}
          actions={
            <Link href="/resident/report-issue">
              <Button
                variant="accent"
                size="md"
                leftIcon={<PlusCircle className="h-4 w-4" />}
              >
                Submit New Issue
              </Button>
            </Link>
          }
        />

        {/* Tab & Search Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex space-x-1 border-b border-slate-200">
            {[
              { id: "all", label: "All Reports", count: totalCount },
              { id: "active", label: "Active & In Progress", count: activeCount },
              { id: "resolved", label: "Resolved", count: resolvedCount },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium border-b-2 transition-all",
                    isSelected
                      ? "border-teal-600 text-teal-700 font-semibold"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  )}
                >
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px]",
                      isSelected
                        ? "bg-teal-100 text-teal-800"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search my reports..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : filteredIssues.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-7 w-7 text-slate-400" />}
            title="No reports found in this view"
            description={
              searchQuery
                ? "No reports matched your search keyword. Try clearing your search term."
                : "You don't have any issue reports in this category yet."
            }
            actionLabel="Report a New Community Issue"
            onAction={() => (window.location.href = "/resident/report-issue")}
          />
        ) : (
          <div className="space-y-3">
            {filteredIssues.map((issue) => {
              const catConfig = ISSUE_CATEGORIES[issue.category] || ISSUE_CATEGORIES.other;

              return (
                <Card
                  key={issue.id}
                  className="p-5 hover:border-slate-300 transition-all shadow-2xs group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                          {issue.trackingNumber}
                        </span>
                        <StatusPill status={issue.status} size="sm" />
                        <span
                          className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-full",
                            catConfig.badgeBg,
                            catConfig.badgeText
                          )}
                        >
                          {catConfig.label}
                        </span>
                      </div>

                      <Link
                        href={`/issues/${issue.id}`}
                        className="block font-semibold text-slate-900 group-hover:text-teal-600 transition-colors text-base truncate"
                      >
                        {issue.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{issue.location.address}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>Submitted {formatDate(issue.createdAt)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5 text-slate-400" />
                          <span>{issue.upvotes} community upvotes</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <Link href={`/issues/${issue.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                        >
                          View Live Ticket
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayoutShell>
  );
}

