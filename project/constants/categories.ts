import { IssueCategory, IssuePriority } from "@/types/issue";

export interface CategoryConfig {
  value: IssueCategory;
  label: string;
  description: string;
  defaultDepartment: string;
  badgeBg: string;
  badgeText: string;
}

export const ISSUE_CATEGORIES: Record<IssueCategory, CategoryConfig> = {
  roads: {
    value: "roads",
    label: "Roads & Potholes",
    description: "Damaged pavement, missing signage, broken traffic signals, or street hazards.",
    defaultDepartment: "Public Works & Infrastructure",
    badgeBg: "bg-orange-50",
    badgeText: "text-orange-700",
  },
  water: {
    value: "water",
    label: "Water & Drainage",
    description: "Pipe leaks, low pressure, blocked storm drains, or contaminated water.",
    defaultDepartment: "Water & Sewerage Authority",
    badgeBg: "bg-cyan-50",
    badgeText: "text-cyan-700",
  },
  sanitation: {
    value: "sanitation",
    label: "Sanitation & Waste",
    description: "Overflowing public dumpsters, illegal dumping, missed trash collection.",
    defaultDepartment: "Sanitation & Waste Management",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
  },
  electricity: {
    value: "electricity",
    label: "Power & Streetlights",
    description: "Dark street lamps, exposed electrical wires, municipal power outages.",
    defaultDepartment: "Municipal Utilities & Energy",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
  },
  parks: {
    value: "parks",
    label: "Parks & Greenery",
    description: "Fallen branches, overgrown public grass, damaged playground equipment.",
    defaultDepartment: "Parks & Recreation Department",
    badgeBg: "bg-lime-50",
    badgeText: "text-lime-700",
  },
  public_safety: {
    value: "public_safety",
    label: "Public Safety",
    description: "Hazardous sidewalks, structural hazards, fire safety risks in civic spaces.",
    defaultDepartment: "Civic Safety & Enforcement",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
  },
  other: {
    value: "other",
    label: "General & Other",
    description: "Community inquiries, civic nuisances, and miscellaneous reports.",
    defaultDepartment: "General Municipal Administration",
    badgeBg: "bg-slate-50",
    badgeText: "text-slate-700",
  },
};

export const CATEGORY_LIST: IssueCategory[] = [
  "roads",
  "water",
  "sanitation",
  "electricity",
  "parks",
  "public_safety",
  "other",
];

export const PRIORITY_CONFIG: Record<
  IssuePriority,
  { label: string; badgeBg: string; badgeText: string; badgeBorder: string }
> = {
  low: {
    label: "Low",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    badgeBorder: "border-slate-200",
  },
  medium: {
    label: "Medium",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
  },
  high: {
    label: "High",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-200",
  },
  critical: {
    label: "Critical",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    badgeBorder: "border-rose-200",
  },
};

