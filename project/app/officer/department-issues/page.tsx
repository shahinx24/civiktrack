"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { StatusUpdateModal } from "@/components/forms/status-update-modal";
import { IssueService } from "@/services/issue-service";
import { Issue, IssueStatus } from "@/types/issue";
import { ISSUE_CATEGORIES, PRIORITY_CONFIG } from "@/constants/categories";
import { formatDate } from "@/lib/utils";
import {
  Wrench,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Eye,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OfficerDepartmentIssuesPage() {
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [search, setSearch] = React.useState<string>("");
  const [statusIssue, setStatusIssue] = React.useState<Issue | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await IssueService.getDepartmentIssues("dept-pwi");
      setIssues(res);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredIssues = issues.filter((issue) => {
    if (activeTab === "in_progress" && issue.status !== "in_progress") return false;
    if (activeTab === "critical" && issue.priority !== "critical" && issue.priority !== "high") return false;
    if (activeTab === "resolved" && issue.status !== "resolved") return false;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.trackingNumber.toLowerCase().includes(q) ||
        issue.location.address.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const handleStatusSubmit = async (newStatus: IssueStatus, note: string) => {
    if (!statusIssue) return;
    await IssueService.updateStatus(
      statusIssue.id,
      newStatus,
      note,
      "Elena Rostova (Lead Field Officer)",
      "officer"
    );
    await loadData();
  };

  return (
    <DashboardLayoutShell role="officer" userName="Elena Rostova" userEmail="elena.rostova@pwi.gov.local">
      <div className="space-y-6">
        <PageHeader
          title="Department Work Orders"
          description="Public Works & Infrastructure • Field task list, status transitions, and resolution logging."
          breadcrumbs={[
            { label: "Field Dashboard", href: "/officer/dashboard" },
            { label: "Department Issues" },
          ]}
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex space-x-1 border-b border-slate-200">
            {[
              { id: "all", label: "All Tasks", count: issues.length },
              { id: "critical", label: "High / Critical", count: issues.filter((i) => i.priority === "critical" || i.priority === "high").length },
              { id: "in_progress", label: "In Progress", count: issues.filter((i) => i.status === "in_progress").length },
              { id: "resolved", label: "Resolved", count: issues.filter((i) => i.status === "resolved").length },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition-all",
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

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search work orders..."
              className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Task Cards */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : filteredIssues.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 text-sm">
            No department tasks found matching the current filter.
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredIssues.map((issue) => {
              const prioConfig = PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.medium;
              const catConfig = ISSUE_CATEGORIES[issue.category] || ISSUE_CATEGORIES.other;

              return (
                <Card
                  key={issue.id}
                  className="p-5 hover:border-slate-300 transition-all shadow-2xs group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {issue.trackingNumber}
                        </span>
                        <StatusPill status={issue.status} size="sm" />
                        <span
                          className={cn(
                            "text-[11px] font-semibold px-2 py-0.5 rounded border",
                            prioConfig.badgeBg,
                            prioConfig.badgeText,
                            prioConfig.badgeBorder
                          )}
                        >
                          {prioConfig.label}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
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
                          <span>Reported {formatDate(issue.createdAt)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => setStatusIssue(issue)}
                        leftIcon={<Wrench className="h-3.5 w-3.5" />}
                      >
                        Update Progress
                      </Button>
                      <Link href={`/issues/${issue.id}`}>
                        <Button variant="outline" size="sm" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                          View
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

      <StatusUpdateModal
        isOpen={Boolean(statusIssue)}
        onClose={() => setStatusIssue(null)}
        issue={statusIssue}
        onUpdateStatus={handleStatusSubmit}
        actorRoleTitle="Elena Rostova (Lead Field Officer)"
      />
    </DashboardLayoutShell>
  );
}

