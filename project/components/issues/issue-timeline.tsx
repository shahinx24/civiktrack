import * as React from "react";
import { IssueTimelineEvent, IssueStatus } from "@/types/issue";
import { ISSUE_STATUSES } from "@/constants/statuses";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  FileCheck2,
  Clock,
  Wrench,
  CheckCircle,
  XCircle,
  User,
  Shield,
  Building,
} from "lucide-react";

export interface IssueTimelineProps {
  currentStatus: IssueStatus;
  timeline: IssueTimelineEvent[];
}

const STATUS_ICONS: Record<IssueStatus, React.ElementType> = {
  submitted: FileCheck2,
  under_review: Clock,
  in_progress: Wrench,
  resolved: CheckCircle,
  rejected: XCircle,
};

const ACTOR_ICONS: Record<string, React.ElementType> = {
  resident: User,
  authority: Shield,
  officer: Building,
  admin: Shield,
  system: Building,
};

export function IssueTimeline({ currentStatus, timeline }: IssueTimelineProps) {
  // Sort events chronologically (oldest first for timeline)
  const sortedEvents = [...timeline].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      {/* 4-Step Progress Tracker Bar (if not rejected) */}
      {currentStatus !== "rejected" ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-5">
            Resolution Progress Tracker
          </h4>
          <div className="relative">
            {/* Step Track */}
            <div className="grid grid-cols-4 gap-2 text-center relative">
              {/* Horizontal Connecting Line */}
              <div className="absolute top-4 left-[12%] right-[12%] h-0.5 bg-slate-200 -z-0" />

              {(
                [
                  "submitted",
                  "under_review",
                  "in_progress",
                  "resolved",
                ] as IssueStatus[]
              ).map((stepKey, idx) => {
                const config = ISSUE_STATUSES[stepKey];
                const currentStepIndex = ISSUE_STATUSES[currentStatus]?.stepIndex || 1;
                const isCompleted = config.stepIndex <= currentStepIndex;
                const isCurrent = stepKey === currentStatus;
                const StepIcon = STATUS_ICONS[stepKey];

                return (
                  <div key={stepKey} className="flex flex-col items-center relative z-10">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all shadow-xs",
                        isCompleted
                          ? "bg-teal-600 border-teal-600 text-white"
                          : "bg-white border-slate-300 text-slate-400"
                      )}
                    >
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-semibold mt-2",
                        isCurrent
                          ? "text-teal-700"
                          : isCompleted
                          ? "text-slate-800"
                          : "text-slate-400"
                      )}
                    >
                      {config.label}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      Step {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 flex items-center gap-3 text-rose-900">
          <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold">Report Flagged as Rejected:</span> This
            issue was evaluated by municipal administration and resolved without
            field action (e.g., duplicate report or private property matter).
          </div>
        </div>
      )}

      {/* Chronological Audit Log of Events */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Detailed Transparency Log
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {sortedEvents.map((event, idx) => {
            const isLatest = idx === sortedEvents.length - 1;
            const EventIcon = STATUS_ICONS[event.status] || FileCheck2;
            const ActorIcon = ACTOR_ICONS[event.actorRole] || User;

            return (
              <div key={event.id} className="relative group">
                {/* Node indicator */}
                <div
                  className={cn(
                    "absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border bg-white ring-4 ring-white",
                    isLatest
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-300 text-slate-500"
                  )}
                >
                  <EventIcon className="h-3 w-3" />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h5 className="text-sm font-semibold text-slate-900">
                      {event.title}
                    </h5>
                    <time className="text-xs text-slate-400 font-mono">
                      {formatDate(event.timestamp)}
                    </time>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {event.description}
                  </p>

                  {event.note && (
                    <div className="mt-2 rounded-lg bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-700 italic">
                      &ldquo;{event.note}&rdquo;
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                    <ActorIcon className="h-3 w-3 text-slate-400" />
                    <span>Logged by:</span>
                    <strong className="font-medium text-slate-600">
                      {event.actorName}
                    </strong>
                    <span className="capitalize text-slate-400">
                      ({event.actorRole})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

