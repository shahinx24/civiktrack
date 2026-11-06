import * as React from "react";
import { IssueStatus } from "@/types/issue";
import { ISSUE_STATUSES } from "@/constants/statuses";
import { cn } from "@/lib/utils";

export interface StatusPillProps {
  status: IssueStatus;
  showDot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StatusPill({
  status,
  showDot = true,
  size = "md",
  className,
}: StatusPillProps) {
  const config = ISSUE_STATUSES[status] || ISSUE_STATUSES.submitted;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1.5",
    md: "px-2.5 py-1 text-xs gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border tracking-wide",
        config.badgeBg,
        config.badgeText,
        config.badgeBorder,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            config.dotColor,
            status === "in_progress" && "animate-pulse"
          )}
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}

