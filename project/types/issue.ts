import { UserRole } from "./user";

export type IssueStatus =
  | "submitted"
  | "under_review"
  | "in_progress"
  | "resolved"
  | "rejected";

export type IssuePriority = "low" | "medium" | "high" | "critical";

export type IssueCategory =
  | "roads"
  | "water"
  | "sanitation"
  | "electricity"
  | "parks"
  | "public_safety"
  | "other";

export interface IssueLocation {
  address: string;
  city: string;
  ward?: string;
  zipCode?: string;
  landmark?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IssueTimelineEvent {
  id: string;
  status: IssueStatus;
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole | "system";
  note?: string;
}

export interface Issue {
  id: string;
  trackingNumber: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  location: IssueLocation;
  images: string[];
  reporterId: string;
  reporterName: string;
  reporterEmail?: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  departmentId?: string;
  departmentName?: string;
  upvotes: number;
  userHasUpvoted?: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  timeline: IssueTimelineEvent[];
}

export interface IssueFilters {
  search?: string;
  category?: IssueCategory | "all";
  status?: IssueStatus | "all";
  priority?: IssuePriority | "all";
  departmentId?: string;
  ward?: string;
  sortBy?: "newest" | "oldest" | "upvotes" | "priority";
}

