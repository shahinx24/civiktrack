"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { AssignOfficerModal } from "@/components/forms/assign-officer-modal";
import { StatusUpdateModal } from "@/components/forms/status-update-modal";
import { IssueService } from "@/services/issue-service";
import { DepartmentService } from "@/services/department-service";
import { Issue, IssueStatus } from "@/types/issue";
import { Department } from "@/types/department";
import { ISSUE_CATEGORIES, PRIORITY_CONFIG } from "@/constants/categories";
import { formatDate } from "@/lib/utils";
import {
  ShieldAlert,
  ClipboardList,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  AlertTriangle,
  Send,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthorityDashboardPage() {
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Modals state
  const [assignModalIssue, setAssignModalIssue] = React.useState<Issue | null>(null);
  const [statusModalIssue, setStatusModalIssue] = React.useState<Issue | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [issueRes, deptRes] = await Promise.all([
        IssueService.getIssues({}, 1, 15),
        DepartmentService.getDepartments(),
      ]);
      setIssues(issueRes.issues);
      setDepartments(deptRes);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Metrics calculations
  const pendingTriageCount = issues.filter((i) => i.status === "submitted").length;
  const inProgressCount = issues.filter((i) => i.status === "in_progress").length;
  const criticalCount = issues.filter((i) => i.priority === "critical" && i.status !== "resolved").length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;

  // Unassigned / Priority Triage list
  const triageQueue = issues.filter(
    (i) => i.status === "submitted" || i.status === "under_review" || i.priority === "critical"
  );

  const handleAssignSubmit = async (
    deptId: string,
    deptName: string,
    officerId?: string,
    officerName?: string
  ) => {
    if (!assignModalIssue) return;
    await IssueService.assignDepartment(
      assignModalIssue.id,
      deptId,
      deptName,
      officerId,
      officerName,
      "Marcus Vance (Authority Administrator)"
    );
    await loadData();
  };

  const handleStatusSubmit = async (newStatus: IssueStatus, note: string) => {
    if (!statusModalIssue) return;
    await IssueService.updateStatus(
      statusModalIssue.id,
      newStatus,
      note,
      "Marcus Vance (Authority Administrator)",
      "authority"
    );
    await loadData();
  };

  return (
    <DashboardLayoutShell role="authority" userName="Marcus Vance" userEmail="marcus.vance@civic.gov.local">
      <div className="space-y-6">
        <PageHeader
          title="Municipal Triage & Authority Hub"
          description="Central control console for community intake, department workload routing, and municipal SLA oversight across all 5 wards."
          breadcrumbs={[{ label: "Authority Hub" }]}
          actions={
            <Link href="/authority/assigned-issues">
              <Button variant="default" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View Full Municipal Queue
              </Button>
            </Link>
          }
        />

        {/* Top Stat Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Pending Triage"
            value={pendingTriageCount}
            change="+4 new"
            changeType="increase"
            period="Requires department routing"
            icon={<Clock className="h-5 w-5" />}
            iconBg="bg-amber-50 text-amber-700"
          />
          <StatCard
            label="Active Field Orders"
            value={inProgressCount}
            period="Dispatched to crews"
            icon={<ClipboardList className="h-5 w-5" />}
            iconBg="bg-indigo-50 text-indigo-700"
          />
          <StatCard
            label="Critical Hazards"
            value={criticalCount}
            change="High Priority"
            changeType="decrease"
            period="Immediate safety SLA"
            icon={<ShieldAlert className="h-5 w-5" />}
            iconBg="bg-rose-50 text-rose-700"
          />
          <StatCard
            label="Weekly Resolved"
            value={resolvedCount}
            period="Verified completions"
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconBg="bg-emerald-50 text-emerald-700"
          />
        </div>

        {/* Priority Triage Queue Table */}
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Incoming Reports Needing Action
              </h3>
              <p className="text-xs text-slate-500">
                Newly submitted community reports awaiting department assignment or status review.
              </p>
            </div>
            <span className="text-xs font-semibold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
              {triageQueue.length} tickets pending triage
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 rounded-lg bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : triageQueue.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              All incoming reports have been triaged! Good job.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              {triageQueue.slice(0, 6).map((issue) => {
                const catConfig = ISSUE_CATEGORIES[issue.category] || ISSUE_CATEGORIES.other;
                const prioConfig = PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.medium;

                return (
                  <div
                    key={issue.id}
                    className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
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
                        className="block font-semibold text-slate-900 group-hover:text-teal-600 transition-colors text-sm truncate"
                      >
                        {issue.title}
                      </Link>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{issue.location.address}</span>
                        <span>•</span>
                        <span>Reported by {issue.reporterName}</span>
                        <span>•</span>
                        <span>{formatDate(issue.createdAt)}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => setAssignModalIssue(issue)}
                        leftIcon={<Send className="h-3.5 w-3.5" />}
                      >
                        {issue.departmentName ? "Reassign" : "Assign Dept"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStatusModalIssue(issue)}
                      >
                        Update Status
                      </Button>
                      <Link href={`/issues/${issue.id}`}>
                        <Button variant="ghost" size="icon" title="View Ticket Details">
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

        {/* Municipal Departments Workload Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Department Workload & Staffing
              </h3>
              <p className="text-xs text-slate-500">
                Active municipal dispatch capacity and resolution counts.
              </p>
            </div>
            <Link
              href="/authority/assigned-issues"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Filter by department →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {dept.code}
                  </span>
                  <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    {dept.activeIssuesCount} Active Tickets
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">
                    {dept.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Head: <strong className="text-slate-700">{dept.headOfficer}</strong>
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{dept.resolvedIssuesCount} resolved all time</span>
                  <Link
                    href={`/authority/assigned-issues?dept=${dept.id}`}
                    className="font-medium text-teal-700 hover:underline"
                  >
                    View Queue
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <AssignOfficerModal
        isOpen={Boolean(assignModalIssue)}
        onClose={() => setAssignModalIssue(null)}
        issue={assignModalIssue}
        onAssign={handleAssignSubmit}
      />

      {/* Status Modal */}
      <StatusUpdateModal
        isOpen={Boolean(statusModalIssue)}
        onClose={() => setStatusModalIssue(null)}
        issue={statusModalIssue}
        onUpdateStatus={handleStatusSubmit}
        actorRoleTitle="Authority Administrator"
      />
    </DashboardLayoutShell>
  );
}

