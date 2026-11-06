"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Issue, IssueStatus } from "@/types/issue";
import { ISSUE_STATUSES, STATUS_LIST } from "@/constants/statuses";
import { CheckCircle2, AlertTriangle, Wrench, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
  onUpdateStatus: (newStatus: IssueStatus, note: string) => Promise<void>;
  defaultStatus?: IssueStatus;
  actorRoleTitle?: string;
}

export function StatusUpdateModal({
  isOpen,
  onClose,
  issue,
  onUpdateStatus,
  defaultStatus,
  actorRoleTitle = "Authority Administrator",
}: StatusUpdateModalProps) {
  const [status, setStatus] = React.useState<IssueStatus>("under_review");
  const [note, setNote] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (defaultStatus) {
      setStatus(defaultStatus);
    } else if (issue) {
      setStatus(issue.status);
    }
    setNote("");
  }, [issue, defaultStatus]);

  if (!issue) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onUpdateStatus(status, note);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Ticket Resolution Status"
      description={`Change public tracking status for ${issue.trackingNumber}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <p className="font-semibold text-slate-800">{issue.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-slate-500">Current Status:</span>
            <span className="font-semibold capitalize text-slate-700">
              {issue.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Status Option Buttons */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Select Next Lifecycle Status
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STATUS_LIST.map((st) => {
              const config = ISSUE_STATUSES[st];
              const isSelected = status === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={cn(
                    "p-2.5 rounded-lg border text-left text-xs transition-all",
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <div className="font-bold">{config.label}</div>
                  <div
                    className={cn(
                      "text-[10px] mt-0.5 line-clamp-1",
                      isSelected ? "text-slate-300" : "text-slate-400"
                    )}
                  >
                    {config.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mandatory Transparency Note */}
        <Textarea
          label="Transparency Audit Note (Visible to public)"
          placeholder="Describe action taken, crew dispatched, or reason for status update..."
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
          helperText={`Will be timestamped and permanently logged under ${actorRoleTitle}.`}
        />

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="accent"
            size="sm"
            isLoading={loading}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            Save Status & Log Note
          </Button>
        </div>
      </form>
    </Modal>
  );
}

