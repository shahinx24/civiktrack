"use client";

import * as React from "react";
import Link from "next/link";
import { Issue } from "@/types/issue";
import { ISSUE_CATEGORIES, PRIORITY_CONFIG } from "@/constants/categories";
import { StatusPill } from "@/components/ui/status-pill";
import { Card } from "@/components/ui/card";
import { MapPin, ThumbsUp, Calendar, ArrowRight, Image as ImageIcon } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface IssueCardProps {
  issue: Issue;
  onUpvote?: (id: string) => void;
  showActions?: boolean;
  viewMode?: "grid" | "list";
}

export function IssueCard({
  issue,
  onUpvote,
  showActions = true,
  viewMode = "grid",
}: IssueCardProps) {
  const categoryConfig = ISSUE_CATEGORIES[issue.category] || ISSUE_CATEGORIES.other;
  const priorityConfig = PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.medium;

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onUpvote) {
      onUpvote(issue.id);
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:border-slate-300 transition-all p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {issue.images && issue.images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={issue.images[0]}
                alt={issue.title}
                className="h-20 w-24 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100 hidden xs:block"
              />
            ) : (
              <div className="h-20 w-24 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0 hidden xs:block text-slate-400">
                <ImageIcon className="h-6 w-6" />
              </div>
            )}

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {issue.trackingNumber}
                </span>
                <span
                  className={cn(
                    "font-medium px-2 py-0.5 rounded-full",
                    categoryConfig.badgeBg,
                    categoryConfig.badgeText
                  )}
                >
                  {categoryConfig.label}
                </span>
                <StatusPill status={issue.status} size="sm" />
              </div>

              <Link
                href={`/issues/${issue.id}`}
                className="block font-semibold text-slate-900 hover:text-teal-600 transition-colors truncate text-base"
              >
                {issue.title}
              </Link>

              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate max-w-[200px]">
                    {issue.location.address}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{formatRelativeTime(issue.createdAt)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            {showActions && (
              <button
                onClick={handleUpvoteClick}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all active:scale-95",
                  issue.userHasUpvoted
                    ? "bg-teal-50 border-teal-200 text-teal-700 font-semibold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
                title="Upvote to raise municipal priority"
              >
                <ThumbsUp
                  className={cn(
                    "h-3.5 w-3.5",
                    issue.userHasUpvoted ? "fill-teal-600 text-teal-600" : ""
                  )}
                />
                <span>{issue.upvotes}</span>
              </button>
            )}

            <Link
              href={`/issues/${issue.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              <span>View</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:border-slate-300 transition-all hover:shadow-md group">
      {/* Photo Header */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
        {issue.images && issue.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={issue.images[0]}
            alt={issue.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-50">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">No photo submitted</span>
          </div>
        )}

        {/* Status Pill overlay */}
        <div className="absolute top-3 left-3">
          <StatusPill status={issue.status} size="sm" />
        </div>

        {/* Priority Badge overlay */}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-md border backdrop-blur-md bg-white/90 shadow-2xs",
              priorityConfig.badgeText,
              priorityConfig.badgeBorder
            )}
          >
            {priorityConfig.label}
          </span>
        </div>

        {/* Tracking number pill */}
        <div className="absolute bottom-2.5 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
          {issue.trackingNumber}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              categoryConfig.badgeBg,
              categoryConfig.badgeText
            )}
          >
            {categoryConfig.label}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-400">
            {formatRelativeTime(issue.createdAt)}
          </span>
        </div>

        <Link
          href={`/issues/${issue.id}`}
          className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 text-base leading-snug mb-2"
        >
          {issue.title}
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {issue.description}
        </p>

        {/* Location Info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {issue.location.address}
            {issue.location.ward ? ` (${issue.location.ward})` : ""}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-slate-50/70 border-t border-slate-100">
        <button
          onClick={handleUpvoteClick}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all active:scale-95",
            issue.userHasUpvoted
              ? "bg-teal-100/80 text-teal-800 font-semibold"
              : "text-slate-600 hover:bg-slate-200/60"
          )}
          title="Upvote this community issue"
        >
          <ThumbsUp
            className={cn(
              "h-3.5 w-3.5",
              issue.userHasUpvoted ? "fill-teal-600 text-teal-600" : ""
            )}
          />
          <span>{issue.upvotes} upvotes</span>
        </button>

        <Link
          href={`/issues/${issue.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-teal-700 transition-colors"
        >
          <span>Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}

