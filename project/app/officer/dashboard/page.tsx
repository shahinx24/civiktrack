"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
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
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Truck,
  HardHat,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OfficerDashboardPage() {
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [statusModalIssue, setStatusModalIssue] = React.useState<Issue | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      // Elena Rostova: Public Works & Infrastructure issues
      const deptIssues = await IssueService.getDepartmentIssues("dept-pwi");
      setIssues(deptIssues);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const assignedCount = issues.length;
  const inProgressCount = issues.filter((i) => i.status === "in_progress").length;
  const criticalCount = issues.filter((i) => i.priority === "critical" || i.priority === "high").length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;

  const handleStatusSubmit = async (newStatus: IssueStatus, note: string) => {
    if (!statusModalIssue) return;
    await IssueService.updateStatus(
      statusModalIssue.id,
      newStatus,
      note,
      "Elena Rostova (Lead Field Engineer)",
      "officer"
    );
    await loadData();
  };

  return (
    <DashboardLayoutShell role="officer" userName="Elena Rostova" userEmail="elena.rostova@pwi.gov.local">
      <div className="space-y-6">
        <PageHeader
          title="Field Operations Hub"
          description="Public Works & Infrastructure • Field crew dispatch, task status logs, and photographic resolution verification."
          breadcrumbs={[{ label: "Field Dashboard" }]}
          actions={
            <Link href="/officer/department-issues">
              <Button variant="default" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Full Department Queue
              </Button>
            </Link>
          }
        />

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Assigned Work Orders"
            value={assignedCount}
            period="Public Works queue"
            icon={<HardHat className="h-5 w-5" />}
            iconBg="bg-amber-50 text-amber-700"
          />
          <StatCard
            label="Active In Field"
            value={inProgressCount}
            period="Crews on-site"
            icon={<Wrench className="h-5 w-5" />}
            iconBg="bg-indigo-50 text-indigo-700"
          />
          <StatCard
            label="High / Critical Urgency"
            value={criticalCount}
            period="Immediate priority"
            icon={<AlertTriangle className="h-5 w-5" />}
            iconBg="bg-rose-50 text-rose-700"
          />
          <StatCard
            label="Completed & Verified"
            value={resolvedCount}
            period="Archived with proof"
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconBg="bg-emerald-50 text-emerald-700"
          />
        </div>

        {/* Layout Grid: Active Field Tasks & Safety Noticeboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Active Field Tasks (8 cols) */}
          <Card className="lg:col-span-8 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Active Field Work Orders</h3>
                <p className="text-xs text-slate-500">
                  Infrastructure repairs assigned to your lead engineering crew
                </p>
              </div>
              <Link
                href="/officer/department-issues"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                View all department work →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-20 rounded-lg bg-slate-100 animate-pulse" />
                ))}
              </div>
            ) : issues.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No active work orders currently assigned to Public Works.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {issues.map((issue) => {
                  const prioConfig = PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.medium;

                  return (
                    <div
                      key={issue.id}
                      className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
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
                            <span>{issue.location.address}</span>
                          </span>
                          <span>•</span>
                          <span>Assigned Officer: {issue.assignedOfficerName || "Elena Rostova"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => setStatusModalIssue(issue)}
                          leftIcon={<Wrench className="h-3.5 w-3.5" />}
                        >
                          Update Progress
                        </Button>
                        <Link href={`/issues/${issue.id}`}>
                          <Button variant="ghost" size="icon" title="View Public Transparency Ticket">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Right Column: Field Roster & Safety Checklist (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Field Equipment Status
                </h4>
                <Truck className="h-4 w-4 text-teal-600" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-medium text-slate-800">Asphalt Hot-Roller #PWI-04</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Active On-Site
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-medium text-slate-800">Utility Boom Truck #PWI-12</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Ready
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-medium text-slate-800">Cold Patch Compound</span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                    Inventory: 8.5 tons
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-5 space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Field Protocol Reminder
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before marking any ticket &ldquo;Resolved&rdquo;, field technicians must attach clear
                photographic proof of the finished repair for municipal archiving and resident verification.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={Boolean(statusModalIssue)}
        onClose={() => setStatusModalIssue(null)}
        issue={statusModalIssue}
        onUpdateStatus={handleStatusSubmit}
        actorRoleTitle="Elena Rostova (Lead Field Officer)"
      />
    </DashboardLayoutShell>
  );
}

