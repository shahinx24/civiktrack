"use client";

import * as React from "react";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Shield,
  FileCheck2,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ip: string;
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud-01",
    timestamp: "2025-03-03T07:30:00Z",
    actor: "Elena Rostova",
    role: "Officer",
    action: "STATUS_TRANSITION_IN_PROGRESS",
    target: "CT-8945 (Flickering Traffic Signal)",
    ip: "10.0.4.12",
  },
  {
    id: "aud-02",
    timestamp: "2025-03-03T06:50:00Z",
    actor: "Alex Morgan",
    role: "Resident",
    action: "ISSUE_REPORT_REGISTERED",
    target: "CT-8945 (Traffic Signal Junction)",
    ip: "192.168.1.45",
  },
  {
    id: "aud-03",
    timestamp: "2025-03-02T16:00:00Z",
    actor: "Marcus Vance",
    role: "Authority",
    action: "DEPARTMENT_ASSIGNED",
    target: "CT-8921 to Public Works & Infrastructure",
    ip: "10.0.1.2",
  },
  {
    id: "aud-04",
    timestamp: "2025-03-01T14:30:00Z",
    actor: "Elena Rostova",
    role: "Officer",
    action: "WORK_ORDER_DISPATCH_CONFIRMED",
    target: "CT-8921 (Oak Elementary Pothole)",
    ip: "10.0.4.12",
  },
  {
    id: "aud-05",
    timestamp: "2025-02-23T12:00:00Z",
    actor: "David Kim",
    role: "Officer",
    action: "RESOLUTION_VERIFIED_AND_CLOSED",
    target: "CT-8902 (Riverbend Storm Drain)",
    ip: "10.0.5.8",
  },
];

export default function AdminReportsPage() {
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);

  const handleExportCsv = () => {
    // Generate CSV content
    const headers = "Audit ID,Timestamp,Actor,Role,Action,Target,IP\n";
    const rows = MOCK_AUDIT_LOGS.map(
      (l) => `"${l.id}","${l.timestamp}","${l.actor}","${l.role}","${l.action}","${l.target}","${l.ip}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `civictrack-audit-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <DashboardLayoutShell role="admin" userName="Sarah Jenkins" userEmail="sarah.jenkins@admin.gov.local">
      <div className="space-y-6">
        <PageHeader
          title="Municipal Reports & Transparency Audit"
          description="Generate regulatory compliance exports, audit logs of all municipal status transitions, and public open data archives."
          breadcrumbs={[
            { label: "Admin Console", href: "/admin/dashboard" },
            { label: "Reports" },
          ]}
          actions={
            <Button
              variant="accent"
              size="sm"
              onClick={handleExportCsv}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export Audit CSV
            </Button>
          }
        />

        {downloadSuccess && (
          <Alert variant="success" title="Report Exported">
            Municipal audit CSV dataset has been generated and downloaded to your device.
          </Alert>
        )}

        {/* Report Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md">
                Monthly SLA
              </span>
              <FileCheck2 className="h-5 w-5 text-teal-600" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Municipal SLA Performance Review
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Consolidated department clearance metrics, median triage response hours, and citizen satisfaction ratings.
            </p>
            <Button variant="outline" size="sm" className="w-full justify-center" onClick={handleExportCsv}>
              Download SLA Report
            </Button>
          </Card>

          <Card className="p-6 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md">
                Ward Transparency
              </span>
              <Clock className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Ward Infrastructure Expenditure
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Geographic breakdown of asphalt repair volume, water drainage dispatches, and public park improvements.
            </p>
            <Button variant="outline" size="sm" className="w-full justify-center" onClick={handleExportCsv}>
              Download Ward Breakdown
            </Button>
          </Card>

          <Card className="p-6 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                Public Open Data
              </span>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Anonymized Open Data Archive
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Publicly accessible dataset containing resolved ticket locations, categories, and resolution hours for civic research.
            </p>
            <Button variant="outline" size="sm" className="w-full justify-center" onClick={handleExportCsv}>
              Download Public Dataset
            </Button>
          </Card>
        </div>

        {/* System Audit Log Table */}
        <Card className="p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Permanent Municipal Audit Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Tamper-evident chronological transaction record of administrative actions
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Live Audit Stream
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-semibold">Audit ID</th>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Actor & Role</th>
                  <th className="py-3 px-4 font-semibold">Action Trigger</th>
                  <th className="py-3 px-4 font-semibold">Target Entity</th>
                  <th className="py-3 px-4 font-semibold text-right">Client Host</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {MOCK_AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {log.id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-xs">
                      <span className="font-semibold text-slate-800">{log.actor}</span>{" "}
                      <span className="text-slate-400 text-[11px]">({log.role})</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-teal-700">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-xs text-slate-700">
                      {log.target}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayoutShell>
  );
}

