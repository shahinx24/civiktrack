"use client";

import * as React from "react";
import { IssueFilters, IssueCategory, IssueStatus, IssuePriority } from "@/types/issue";
import { ISSUE_CATEGORIES, CATEGORY_LIST } from "@/constants/categories";
import { STATUS_LIST, ISSUE_STATUSES } from "@/constants/statuses";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IssueFiltersProps {
  filters: IssueFilters;
  onFilterChange: (key: keyof IssueFilters, value: unknown) => void;
  onReset: () => void;
  totalResults?: number;
}

export function IssueFiltersBar({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: IssueFiltersProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const hasActiveFilters = Boolean(
    filters.search ||
      (filters.category && filters.category !== "all") ||
      (filters.status && filters.status !== "all") ||
      (filters.priority && filters.priority !== "all")
  );

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs">
      {/* Top Search & Primary Filters Row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Search by keywords, tracking number, street, ward..."
            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50/50 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Right Sort & Advanced Controls */}
        <div className="flex items-center gap-2.5">
          <select
            value={filters.sortBy || "newest"}
            onChange={(e) => onFilterChange("sortBy", e.target.value)}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="upvotes">Sort: Highest Upvotes</option>
            <option value="priority">Sort: Highest Priority</option>
          </select>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "flex h-10 items-center gap-1.5 rounded-lg border px-3 text-xs sm:text-sm font-medium transition-colors",
              showAdvanced || hasActiveFilters
                ? "border-teal-300 bg-teal-50 text-teal-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px] text-white">
                !
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="flex h-10 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 font-medium shrink-0 mr-1">Category:</span>
        <button
          onClick={() => onFilterChange("category", "all")}
          className={cn(
            "rounded-full px-3 py-1 font-medium whitespace-nowrap transition-colors",
            !filters.category || filters.category === "all"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          All Categories
        </button>
        {CATEGORY_LIST.map((catKey) => {
          const config = ISSUE_CATEGORIES[catKey];
          const isSelected = filters.category === catKey;
          return (
            <button
              key={catKey}
              onClick={() => onFilterChange("category", isSelected ? "all" : catKey)}
              className={cn(
                "rounded-full px-3 py-1 font-medium whitespace-nowrap transition-colors",
                isSelected
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Expandable Advanced Filters (Status & Priority) */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150">
          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onFilterChange("status", "all")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors border",
                  !filters.status || filters.status === "all"
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                )}
              >
                All Statuses
              </button>
              {STATUS_LIST.map((st) => {
                const config = ISSUE_STATUSES[st];
                const isSelected = filters.status === st;
                return (
                  <button
                    key={st}
                    onClick={() => onFilterChange("status", isSelected ? "all" : st)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium transition-colors border",
                      isSelected
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Filter by Urgency / Priority
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "critical", "high", "medium", "low"] as (IssuePriority | "all")[]).map(
                (p) => {
                  const isSelected = (!filters.priority && p === "all") || filters.priority === p;
                  return (
                    <button
                      key={p}
                      onClick={() => onFilterChange("priority", isSelected ? "all" : p)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors border",
                        isSelected
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      {p === "all" ? "All Priorities" : p}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* Result Count Status */}
      {totalResults !== undefined && (
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
          <span>
            Found <strong className="text-slate-800">{totalResults}</strong> community issue
            {totalResults === 1 ? "" : "s"}
          </span>
          {hasActiveFilters && (
            <span className="text-teal-700 font-medium">Filters applied</span>
          )}
        </div>
      )}
    </div>
  );
}

