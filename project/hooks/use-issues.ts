"use client";

import { useState, useEffect, useCallback } from "react";
import { Issue, IssueFilters } from "@/types/issue";
import { PaginationMeta } from "@/types/common";
import { IssueService } from "@/services/issue-service";
import { useDebounce } from "./use-debounce";

interface UseIssuesOptions {
  initialFilters?: IssueFilters;
  pageSize?: number;
  autoFetch?: boolean;
}

export function useIssues(options: UseIssuesOptions = {}) {
  const { initialFilters = {}, pageSize = 6, autoFetch = true } = options;

  const [filters, setFilters] = useState<IssueFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    pageSize,
    totalCount: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await IssueService.getIssues(
        { ...filters, search: debouncedSearch },
        page,
        pageSize
      );
      setIssues(res.issues);
      setMeta(res.meta);
    } catch {
      setError("Failed to load community issues. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch, page, pageSize]);

  useEffect(() => {
    if (autoFetch) {
      fetchIssues();
    }
  }, [fetchIssues, autoFetch]);

  // Update specific filter property and reset page to 1
  const updateFilter = useCallback((key: keyof IssueFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPage(1);
  }, [initialFilters]);

  // Optimistic upvote handler
  const handleUpvote = useCallback(async (issueId: string) => {
    // Optimistic update in UI
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id === issueId) {
          const nextHasUpvoted = !i.userHasUpvoted;
          return {
            ...i,
            userHasUpvoted: nextHasUpvoted,
            upvotes: nextHasUpvoted ? i.upvotes + 1 : Math.max(0, i.upvotes - 1),
          };
        }
        return i;
      })
    );

    try {
      await IssueService.toggleUpvote(issueId);
    } catch {
      // Revert if error
      fetchIssues();
    }
  }, [fetchIssues]);

  return {
    issues,
    meta,
    loading,
    error,
    page,
    setPage,
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    refetch: fetchIssues,
    handleUpvote,
  };
}

