"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_DEPARTMENTS } from "@/mock/departments";
import { MOCK_USERS } from "@/mock/users";
import { Issue } from "@/types/issue";
import { Building, UserCheck } from "lucide-react";

export interface AssignOfficerModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
  onAssign: (departmentId: string, departmentName: string, officerId?: string, officerName?: string) => Promise<void>;
}

export function AssignOfficerModal({
  isOpen,
  onClose,
  issue,
  onAssign,
}: AssignOfficerModalProps) {
  const [selectedDeptId, setSelectedDeptId] = React.useState<string>("");
  const [selectedOfficerId, setSelectedOfficerId] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (issue) {
      setSelectedDeptId(issue.departmentId || MOCK_DEPARTMENTS[0].id);
      setSelectedOfficerId(issue.assignedOfficerId || "");
    }
  }, [issue]);

  if (!issue) return null;

  const currentDept = MOCK_DEPARTMENTS.find((d) => d.id === selectedDeptId);
  const officers = MOCK_USERS.filter((u) => u.role === "officer");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDept) return;
    try {
      setLoading(true);
      const officer = officers.find((o) => o.id === selectedOfficerId);
      await onAssign(
        currentDept.id,
        currentDept.name,
        officer?.id,
        officer?.name
      );
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Department & Lead Officer"
      description={`Dispatch ticket ${issue.trackingNumber} to municipal field services.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <p className="font-semibold text-slate-800">{issue.title}</p>
          <p className="text-slate-500 mt-0.5">{issue.location.address}</p>
        </div>

        <Select
          label="Responsible Municipal Department"
          value={selectedDeptId}
          onChange={(e) => setSelectedDeptId(e.target.value)}
          options={MOCK_DEPARTMENTS.map((d) => ({
            label: `${d.name} (${d.code})`,
            value: d.id,
          }))}
          required
        />

        <Select
          label="Assign Field Officer (Optional)"
          value={selectedOfficerId}
          onChange={(e) => setSelectedOfficerId(e.target.value)}
          placeholder="-- Select Lead Field Officer --"
          options={[
            { label: "Unassigned (General Department Queue)", value: "" },
            ...officers.map((o) => ({
              label: `${o.name} (${o.departmentName || "Field Services"})`,
              value: o.id,
            })),
          ]}
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
            leftIcon={<Building className="h-4 w-4" />}
          >
            Confirm Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
}

