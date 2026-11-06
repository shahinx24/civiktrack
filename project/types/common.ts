export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface StatMetric {
  label: string;
  value: number | string;
  change?: number; // e.g. +12% or -5%
  changeType?: "increase" | "decrease" | "neutral";
  period?: string;
  icon?: string;
}

export interface ActivityItem {
  id: string;
  type: "issue_created" | "status_updated" | "assigned" | "commented" | "resolved";
  title: string;
  description: string;
  timestamp: string;
  issueId: string;
  issueTrackingNumber: string;
  actorName: string;
}

