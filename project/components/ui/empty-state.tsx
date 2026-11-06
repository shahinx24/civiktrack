import * as React from "react";
import { cn } from "@/lib/utils";
import { FolderOpen } from "lucide-react";
import { Button } from "./button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-slate-300 rounded-xl bg-slate-50/50",
        className
      )}
    >
      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-white border border-slate-200 text-slate-400 shadow-xs mb-4">
        {icon || <FolderOpen className="h-7 w-7 text-slate-400" />}
      </div>
      <h4 className="text-base font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="accent" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

