"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/common/page-header";
import { IssueCard } from "@/components/issues/issue-card";
import { IssueFiltersBar } from "@/components/issues/issue-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { useIssues } from "@/hooks/use-issues";
import {
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  FolderSearch,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PublicIssuesPage() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const {
    issues,
    meta,
    loading,
    page,
    setPage,
    filters,
    updateFilter,
    resetFilters,
    handleUpvote,
  } = useIssues({ pageSize: 6 });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <PageHeader
            title="Community Issue Explorer"
            description="Explore transparent neighborhood reports across all 5 municipal wards. Track work orders, upvote priority hazards, and view verified resolution updates."
            breadcrumbs={[
              { label: "Community Issues" },
            ]}
            actions={
              <Link href="/resident/report-issue">
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<PlusCircle className="h-4 w-4" />}
                >
                  Report New Issue
                </Button>
              </Link>
            }
          />

          {/* Filter Bar */}
          <IssueFiltersBar
            filters={filters}
            onFilterChange={updateFilter}
            onReset={resetFilters}
            totalResults={meta.totalCount}
          />

          {/* View Toolbar: Grid vs List Switcher */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>
              Showing{" "}
              <strong className="text-slate-800">
                {issues.length > 0 ? (page - 1) * meta.pageSize + 1 : 0}-
                {Math.min(page * meta.pageSize, meta.totalCount)}
              </strong>{" "}
              of <strong className="text-slate-800">{meta.totalCount}</strong> reports
            </span>

            <div className="flex items-center gap-1 border border-slate-200 bg-white p-0.5 rounded-lg shadow-2xs">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "grid"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900"
                )}
                aria-label="Grid view"
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900"
                )}
                aria-label="List view"
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Issues Display */}
          {loading ? (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-xl bg-slate-200/60 animate-pulse border border-slate-200"
                />
              ))}
            </div>
          ) : issues.length === 0 ? (
            <EmptyState
              icon={<FolderSearch className="h-7 w-7 text-slate-400" />}
              title="No community reports match your filters"
              description="Try adjusting your search terms, changing the category, or clearing the active filters."
              actionLabel="Clear All Filters"
              onAction={resetFilters}
            />
          ) : (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {issues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onUpvote={handleUpvote}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                leftIcon={<ChevronLeft className="h-4 w-4" />}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1 px-2 text-xs font-semibold text-slate-600">
                Page {page} of {meta.totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage(page + 1)}
                rightIcon={<ChevronRight className="h-4 w-4" />}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

