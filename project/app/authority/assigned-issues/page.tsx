"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
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
  Search,
  Filter,
  Send,
  Wrench,
  Eye,
  Building,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthorityAssignedIssuesPage() {
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Filters
  const [search, setSearch] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedPriority, setSelectedPriority] = React.useState<string>("all");

  // Modals
  const [assignIssue, setAssignIssue] = React.useState<Issue | null>(null);
  const [statusIssue, setStatusIssue] = React.useState<Issue | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [issueRes, deptRes] = await Promise.all([
        IssueService.getIssues({}, 1, 50),
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

  const filteredIssues = issues.filter((issue) => {
    if (selectedDept !== "all" && issue.departmentId !== selectedDept) return false;
    if (selectedStatus !== "all" && issue.status !== selectedStatus) return false;
    if (selectedPriority !== "all" && issue.priority !== selectedPriority) return false;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.trackingNumber.toLowerCase().includes(q) ||
        issue.location.address.toLowerCase().includes(q) ||
        (issue.assignedOfficerName && issue.assignedOfficerName.toLowerCase().includes(q))
      );
    }

    return true;
  });

  const handleAssign = async (
    deptId: string,
    deptName: string,
    officerId?: string,
    officerName?: string
  ) => {
    if (!assignIssue) return;
    await IssueService.assignDepartment(
      assignIssue.id,
      deptId,
      deptName,
      officerId,
      officerName,
      "Marcus Vance (Authority Administrator)"
    );
    await loadData();
  };

  const handleUpdateStatus = async (newStatus: IssueStatus, note: string) => {
    if (!statusIssue) return;
    await IssueService.updateStatus(
      statusIssue.id,
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
          title="Municipal Queue & Dispatch"
          description="Manage, triage, and route community issues to municipal infrastructure departments and assigned officers."
          breadcrumbs={[
            { label: "Authority Hub", href: "/authority/dashboard" },
            { label: "Assigned Issues" },
          ]}
        />

        {/* Filter Controls Bar */}
        <Card className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tracking #, title, street..."
                className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 px-3 text-xs sm:text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 px-3 text-xs sm:text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 px-3 text-xs sm:text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical Urgency</option>
              <option value="high">High Urgency</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-500 border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{filteredIssues.length}</strong> municipal issues
            </span>
            {(search || selectedDept !== "all" || selectedStatus !== "all" || selectedPriority !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedDept("all");
                  setSelectedStatus("all");
                  setSelectedPriority("all");
                }}
                className="flex items-center gap-1 text-teal-700 font-semibold hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                Clear Filters
              </button>
            )}
          </div>
        </Card>

        {/* Management Table */}
        <Card className="overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 pl-5">Tracking ID</th>
                  <th className="p-3.5">Issue Details</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Urgency</th>
                  <th className="p-3.5">Assigned Agency</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Loading municipal queue...
                    </td>
                  </tr>
                ) : filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No issues match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => {
                    const catConfig = ISSUE_CATEGORIES[issue.category] || ISSUE_CATEGORIES.other;
                    const prioConfig = PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.medium;

                    return (
                      <tr key={issue.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 pl-5 font-mono font-bold text-slate-700">
                          {issue.trackingNumber}
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <Link
                            href={`/issues/${issue.id}`}
                            className="font-semibold text-slate-900 hover:text-teal-600 transition-colors block truncate"
                          >
                            {issue.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                            {issue.location.address}
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={cn(
                              "font-medium px-2 py-0.5 rounded-full",
                              catConfig.badgeBg,
                              catConfig.badgeText
                            )}
                          >
                            {catConfig.label}
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={cn(
                              "font-semibold px-2 py-0.5 rounded border text-[11px]",
                              prioConfig.badgeBg,
                              prioConfig.badgeText,
                              prioConfig.badgeBorder
                            )}
                          >
                            {prioConfig.label}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {issue.departmentName ? (
                            <div>
                              <span className="font-semibold text-slate-800 block">
                                {issue.departmentName}
                              </span>
                              <span className="text-[11px] text-slate-400 block">
                                {issue.assignedOfficerName || "Queue Assigned"}
                              </span>
                            </div>
                          ) : (
                            <span className="italic text-amber-600 font-medium">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <StatusPill status={issue.status} size="sm" />
                        </td>
                        <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs px-2.5"
                              onClick={() => setAssignIssue(issue)}
                              title="Assign Department or Lead Officer"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline ml-1">Assign</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs px-2.5"
                              onClick={() => setStatusIssue(issue)}
                              title="Update Status"
                            >
                              <Wrench className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline ml-1">Status</span>
                            </Button>
                            <Link href={`/issues/${issue.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="View Public Ticket">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <AssignOfficerModal
        isOpen={Boolean(assignIssue)}
        onClose={() => setAssignIssue(null)}
        issue={assignIssue}
        onAssign={handleAssign}
      />

      <StatusUpdateModal
        isOpen={Boolean(statusIssue)}
        onClose={() => setStatusIssue(null)}
        issue={statusIssue}
        onUpdateStatus={handleUpdateStatus}
        actorRoleTitle="Authority Administrator"
      />
    </DashboardLayoutShell>
  );
}

