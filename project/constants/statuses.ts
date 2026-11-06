import { IssueStatus } from "@/types/issue";

export interface StatusConfig {
  value: IssueStatus;
  label: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  stepIndex: number;
}

export const ISSUE_STATUSES: Record<IssueStatus, StatusConfig> = {
  submitted: {
    value: "submitted",
    label: "Submitted",
    description: "The issue has been reported and logged in the municipal queue.",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-200",
    dotColor: "bg-amber-500",
    stepIndex: 1,
  },
  under_review: {
    value: "under_review",
    label: "Under Review",
    description: "An administrator or triage officer is evaluating the report.",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-800",
    badgeBorder: "border-blue-200",
    dotColor: "bg-blue-500",
    stepIndex: 2,
  },
  in_progress: {
    value: "in_progress",
    label: "In Progress",
    description: "Assigned department personnel have initiated field resolution.",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-800",
    badgeBorder: "border-indigo-200",
    dotColor: "bg-indigo-500",
    stepIndex: 3,
  },
  resolved: {
    value: "resolved",
    label: "Resolved",
    description: "The issue has been addressed, verified, and closed.",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-200",
    dotColor: "bg-emerald-500",
    stepIndex: 4,
  },
  rejected: {
    value: "rejected",
    label: "Rejected",
    description: "The report was reviewed but will not proceed (e.g. duplicate or out of jurisdiction).",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    badgeBorder: "border-slate-300",
    dotColor: "bg-slate-400",
    stepIndex: 0,
  },
};

export const STATUS_LIST: IssueStatus[] = [
  "submitted",
  "under_review",
  "in_progress",
  "resolved",
  "rejected",
];

