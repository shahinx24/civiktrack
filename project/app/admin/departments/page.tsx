"use client";

import * as React from "react";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { DepartmentService } from "@/services/department-service";
import { Department } from "@/types/department";
import {
  Building2,
  Phone,
  Mail,
  Edit2,
  CheckCircle2,
  HardHat,
  Shield,
} from "lucide-react";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingDept, setEditingDept] = React.useState<Department | null>(null);
  const [headOfficer, setHeadOfficer] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const loadDepts = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await DepartmentService.getDepartments();
      setDepartments(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDepts();
  }, [loadDepts]);

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setHeadOfficer(dept.headOfficer);
    setPhone(dept.phone);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    setSaving(true);
    await DepartmentService.updateDepartment(editingDept.id, {
      headOfficer,
      phone,
    });
    setSaving(false);
    setEditingDept(null);
    loadDepts();
  };

  return (
    <DashboardLayoutShell role="admin" userName="Sarah Jenkins" userEmail="sarah.jenkins@admin.gov.local">
      <div className="space-y-6">
        <PageHeader
          title="Municipal Department Management"
          description="Configure municipal service agencies, dispatch routing codes, lead supervisory engineers, and contact channels."
          breadcrumbs={[
            { label: "Admin Console", href: "/admin/dashboard" },
            { label: "Departments" },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Card key={dept.id} className="p-6 flex flex-col justify-between shadow-2xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                    {dept.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {dept.activeIssuesCount} Active Work Orders
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <HardHat className="h-4 w-4 text-slate-400" />
                    <span>Lead Officer: <strong className="text-slate-800">{dept.headOfficer}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{dept.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{dept.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {dept.resolvedIssuesCount} Verified Closures
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(dept)}
                  leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                >
                  Configure
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {editingDept && (
        <Modal
          isOpen={Boolean(editingDept)}
          onClose={() => setEditingDept(null)}
          title={`Configure Department: ${editingDept.name}`}
          description={`Update leadership and dispatch contact details for ${editingDept.code}.`}
        >
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <Input
              label="Lead Supervisory Engineer / Head Officer"
              value={headOfficer}
              onChange={(e) => setHeadOfficer(e.target.value)}
              required
            />

            <Input
              label="Dispatch Hotline Extension"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingDept(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent"
                size="sm"
                isLoading={saving}
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayoutShell>
  );
}

