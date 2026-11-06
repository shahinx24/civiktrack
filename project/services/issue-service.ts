import { Issue, IssueFilters, IssueStatus, IssueTimelineEvent } from "@/types/issue";
import { PaginationMeta } from "@/types/common";
import { MOCK_ISSUES } from "@/mock/issues";
import { ApiClient } from "./api-client";

// In-memory issue store seeded with initial mock data
let issueStore: Issue[] = [...MOCK_ISSUES];

export interface GetIssuesResult {
  issues: Issue[];
  meta: PaginationMeta;
}

export const IssueService = {
  /**
   * Fetch issues with flexible filtering, search, sorting, and pagination
   */
  async getIssues(
    filters: IssueFilters = {},
    page: number = 1,
    pageSize: number = 8
  ): Promise<GetIssuesResult> {
    await ApiClient.simulateDelay(250);

    let filtered = [...issueStore];

    // Search filter (title, description, trackingNumber, address)
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(q) ||
          issue.description.toLowerCase().includes(q) ||
          issue.trackingNumber.toLowerCase().includes(q) ||
          issue.location.address.toLowerCase().includes(q) ||
          (issue.location.ward && issue.location.ward.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((i) => i.category === filters.category);
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((i) => i.status === filters.status);
    }

    // Priority filter
    if (filters.priority && filters.priority !== "all") {
      filtered = filtered.filter((i) => i.priority === filters.priority);
    }

    // Department filter
    if (filters.departmentId) {
      filtered = filtered.filter((i) => i.departmentId === filters.departmentId);
    }

    // Sorting
    if (filters.sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filters.sortBy === "upvotes") {
      filtered.sort((a, b) => b.upvotes - a.upvotes);
    } else if (filters.sortBy === "priority") {
      const priorityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
    } else {
      // Default: newest
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Pagination
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const currentPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (currentPage - 1) * pageSize;
    const pagedIssues = filtered.slice(startIndex, startIndex + pageSize);

    return {
      issues: pagedIssues,
      meta: {
        page: currentPage,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  },

  /**
   * Get single issue by ID or Tracking Number
   */
  async getIssueById(idOrTracking: string): Promise<Issue | null> {
    await ApiClient.simulateDelay(150);
    const issue = issueStore.find(
      (i) => i.id === idOrTracking || i.trackingNumber.toLowerCase() === idOrTracking.toLowerCase()
    );
    return issue ? { ...issue } : null;
  },

  /**
   * Submit a new issue
   */
  async createIssue(
    data: Omit<Issue, "id" | "trackingNumber" | "upvotes" | "createdAt" | "updatedAt" | "timeline" | "status">
  ): Promise<Issue> {
    await ApiClient.simulateDelay(400);

    const now = new Date().toISOString();
    const newId = `iss-${Date.now().toString().slice(-4)}`;
    const randomTrack = `CT-${Math.floor(8950 + Math.random() * 1000)}`;

    const initialTimeline: IssueTimelineEvent[] = [
      {
        id: `tl-${newId}-1`,
        status: "submitted",
        title: "Report Submitted",
        description: `${data.reporterName || "Resident"} submitted community report.`,
        timestamp: now,
        actorName: data.reporterName || "Resident",
        actorRole: "resident",
      },
    ];

    const newIssue: Issue = {
      ...data,
      id: newId,
      trackingNumber: randomTrack,
      status: "submitted",
      upvotes: 1,
      userHasUpvoted: true,
      createdAt: now,
      updatedAt: now,
      timeline: initialTimeline,
    };

    issueStore = [newIssue, ...issueStore];
    return newIssue;
  },

  /**
   * Update issue status with timeline history note
   */
  async updateStatus(
    id: string,
    status: IssueStatus,
    note?: string,
    actorName: string = "Admin Team",
    actorRole: "authority" | "officer" | "admin" | "system" = "authority"
  ): Promise<Issue | null> {
    await ApiClient.simulateDelay(300);

    const index = issueStore.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const currentIssue = issueStore[index];
    const now = new Date().toISOString();

    const statusTitles: Record<IssueStatus, string> = {
      submitted: "Report Registered",
      under_review: "Municipal Review Started",
      in_progress: "Action Dispatched & In Progress",
      resolved: "Issue Resolved & Verified",
      rejected: "Report Rejected",
    };

    const newTimelineEvent: IssueTimelineEvent = {
      id: `tl-${id}-${currentIssue.timeline.length + 1}`,
      status,
      title: statusTitles[status] || "Status Updated",
      description: note || `Status transitioned to ${status.replace("_", " ")}.`,
      timestamp: now,
      actorName,
      actorRole,
      note,
    };

    const updatedIssue: Issue = {
      ...currentIssue,
      status,
      updatedAt: now,
      resolvedAt: status === "resolved" ? now : currentIssue.resolvedAt,
      timeline: [...currentIssue.timeline, newTimelineEvent],
    };

    issueStore[index] = updatedIssue;
    return updatedIssue;
  },

  /**
   * Assign issue to a department and/or officer
   */
  async assignDepartment(
    id: string,
    departmentId: string,
    departmentName: string,
    officerId?: string,
    officerName?: string,
    actorName: string = "Triage Supervisor"
  ): Promise<Issue | null> {
    await ApiClient.simulateDelay(300);

    const index = issueStore.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const current = issueStore[index];
    const now = new Date().toISOString();

    const newTimelineEvent: IssueTimelineEvent = {
      id: `tl-${id}-${current.timeline.length + 1}`,
      status: current.status === "submitted" ? "under_review" : current.status,
      title: "Assigned to Department",
      description: officerName
        ? `Assigned to ${departmentName} (Officer: ${officerName})`
        : `Assigned to ${departmentName} queue.`,
      timestamp: now,
      actorName,
      actorRole: "authority",
    };

    const updated: Issue = {
      ...current,
      departmentId,
      departmentName,
      assignedOfficerId: officerId || current.assignedOfficerId,
      assignedOfficerName: officerName || current.assignedOfficerName,
      status: current.status === "submitted" ? "under_review" : current.status,
      updatedAt: now,
      timeline: [...current.timeline, newTimelineEvent],
    };

    issueStore[index] = updated;
    return updated;
  },

  /**
   * Toggle upvote for community prioritization
   */
  async toggleUpvote(id: string): Promise<{ upvotes: number; userHasUpvoted: boolean } | null> {
    await ApiClient.simulateDelay(100);

    const issue = issueStore.find((i) => i.id === id);
    if (!issue) return null;

    if (issue.userHasUpvoted) {
      issue.upvotes = Math.max(0, issue.upvotes - 1);
      issue.userHasUpvoted = false;
    } else {
      issue.upvotes += 1;
      issue.userHasUpvoted = true;
    }

    return { upvotes: issue.upvotes, userHasUpvoted: issue.userHasUpvoted };
  },

  /**
   * Get issues submitted by a specific user
   */
  async getUserIssues(userId: string): Promise<Issue[]> {
    await ApiClient.simulateDelay(200);
    return issueStore.filter((i) => i.reporterId === userId);
  },

  /**
   * Get issues assigned to a specific department or officer
   */
  async getDepartmentIssues(departmentId: string): Promise<Issue[]> {
    await ApiClient.simulateDelay(200);
    return issueStore.filter((i) => i.departmentId === departmentId);
  },
};
