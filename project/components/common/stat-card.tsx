import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string | number;
  changeType?: "increase" | "decrease" | "neutral";
  period?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  period,
  icon,
  iconBg = "bg-teal-50 text-teal-700",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        {icon && (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm",
              iconBg
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
      </div>

      {(change !== undefined || period) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
          {change !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium rounded px-1.5 py-0.5",
                changeType === "increase"
                  ? "bg-emerald-50 text-emerald-700"
                  : changeType === "decrease"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              {changeType === "increase" && <TrendingUp className="h-3 w-3" />}
              {changeType === "decrease" && <TrendingDown className="h-3 w-3" />}
              {changeType === "neutral" && <Minus className="h-3 w-3" />}
              {change}
            </span>
          )}
          {period && <span>{period}</span>}
        </div>
      )}
    </div>
  );
}

