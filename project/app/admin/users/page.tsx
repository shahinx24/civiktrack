"use client";

import * as React from "react";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { AuthService } from "@/services/auth-service";
import { User, UserRole } from "@/types/user";
import { ROLE_LABELS } from "@/constants/navigation";
import { formatDate } from "@/lib/utils";
import {
  Search,
  UserPlus,
  Shield,
  Edit2,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");

  // Edit role modal state
  const [editUser, setEditUser] = React.useState<User | null>(null);
  const [newRole, setNewRole] = React.useState<UserRole>("resident");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await AuthService.getAllMockUsers();
        setUsers(data);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.ward && u.ward.toLowerCase().includes(q)) ||
        (u.departmentName && u.departmentName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSaveRole = async () => {
    if (!editUser) return;
    setIsSaving(true);
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? { ...u, role: newRole } : u))
      );
      setIsSaving(false);
      setEditUser(null);
    }, 300);
  };

  return (
    <DashboardLayoutShell role="admin" userName="Sarah Jenkins" userEmail="sarah.jenkins@admin.gov.local">
      <div className="space-y-6">
        <PageHeader
          title="User Directory & Access Control"
          description="Manage community residents, field engineering personnel, municipal authority administrators, and system access levels."
          breadcrumbs={[
            { label: "Admin Console", href: "/admin/dashboard" },
            { label: "Users" },
          ]}
        />

        {/* Filter Toolbar */}
        <Card className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user by name, email, ward..."
                className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
              />
            </div>

            {/* Role Filter Tabs */}
            <div className="flex space-x-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs overflow-x-auto">
              {[
                { id: "all", label: "All Roles" },
                { id: "resident", label: "Residents" },
                { id: "officer", label: "Officers" },
                { id: "authority", label: "Authority" },
                { id: "admin", label: "Admins" },
              ].map((tab) => {
                const isSelected = roleFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setRoleFilter(tab.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors",
                      isSelected
                        ? "bg-white text-slate-900 shadow-2xs font-semibold"
                        : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 pl-5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Assigned Ward / Department</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Member Since</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const roleConfig = ROLE_LABELS[user.role] || ROLE_LABELS.resident;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} size="sm" />
                          <div>
                            <span className="font-semibold text-slate-900 block text-sm">
                              {user.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            "text-xs font-semibold px-2.5 py-0.5 rounded-full border",
                            roleConfig.badgeColor
                          )}
                        >
                          {roleConfig.title}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {user.departmentName || user.ward || "Central Municipal District"}
                      </td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                        {user.phone || "—"}
                      </td>
                      <td className="p-3.5 text-slate-400 whitespace-nowrap">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs px-2.5"
                          onClick={() => {
                            setEditUser(user);
                            setNewRole(user.role);
                          }}
                          leftIcon={<Edit2 className="h-3 w-3" />}
                        >
                          Modify Role
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Edit Role Modal */}
      {editUser && (
        <Modal
          isOpen={Boolean(editUser)}
          onClose={() => setEditUser(null)}
          title={`Modify Access Role: ${editUser.name}`}
          description={`Update user authorization credentials for ${editUser.email}.`}
        >
          <div className="space-y-4 pt-2">
            <Select
              label="Selected Authorization Role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              options={[
                { label: "Community Resident (Standard Citizen)", value: "resident" },
                { label: "Field Department Officer (Dispatched Crew)", value: "officer" },
                { label: "Authority Triage Administrator (Municipal Dispatch)", value: "authority" },
                { label: "System Administrator (Full Platform Governance)", value: "admin" },
              ]}
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setEditUser(null)}>
                Cancel
              </Button>
              <Button
                variant="accent"
                size="sm"
                isLoading={isSaving}
                onClick={handleSaveRole}
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
              >
                Update Access
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayoutShell>
  );
}

