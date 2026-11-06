"use client";

import * as React from "react";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import {
  Shield,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function AuthorityProfilePage() {
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "Marcus Vance",
    email: "marcus.vance@civic.gov.local",
    phone: "+1 (555) 456-7890",
    role: "Authority Triage Administrator",
    jurisdiction: "Central Municipal District & Metro Wards 1-5",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayoutShell role="authority" userName="Marcus Vance" userEmail="marcus.vance@civic.gov.local">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="Authority Profile & Credentials"
          description="Municipal administration credentials, triage supervisory access, and jurisdictional parameters."
          breadcrumbs={[
            { label: "Authority Hub", href: "/authority/dashboard" },
            { label: "Profile" },
          ]}
        />

        {savedSuccess && (
          <Alert variant="success" title="Authority Record Updated">
            Your administrator profile and contact details have been refreshed.
          </Alert>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <Avatar name={formData.name} size="lg" className="h-16 w-16 text-lg bg-indigo-50 text-indigo-700" />
              <div>
                <h3 className="font-bold text-lg text-slate-900">{formData.name}</h3>
                <p className="text-xs text-slate-500">
                  {formData.role} • City Municipal Administration
                </p>
                <div className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  <Shield className="h-3.5 w-3.5" />
                  <span>High-Clearance Municipal Triage</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Administrator Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Official Municipal Email"
                type="email"
                value={formData.email}
                disabled
                helperText="Government domain email linked to dispatch audit ledger"
              />

              <Input
                label="Dispatch Contact Extension"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />

              <Input
                label="Authorized Jurisdictional Wards"
                value={formData.jurisdiction}
                disabled
                helperText="Full authority across municipal districts"
              />
            </div>
          </Card>

          {/* Action Row */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="px-6 h-11"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Update Credentials
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayoutShell>
  );
}

