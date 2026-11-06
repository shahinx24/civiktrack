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
  HardHat,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Truck,
  Wrench,
} from "lucide-react";

export default function OfficerProfilePage() {
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "Elena Rostova",
    email: "elena.rostova@pwi.gov.local",
    phone: "+1 (555) 567-8901",
    department: "Public Works & Infrastructure (PWI)",
    serviceTruck: "Heavy Dispatch Unit #PWI-04 (Asphalt & Paving)",
    zone: "District West (Wards 1, 3, 4)",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayoutShell role="officer" userName="Elena Rostova" userEmail="elena.rostova@pwi.gov.local">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="Field Officer Credentials"
          description="Service team identification, assigned municipal service vehicle, and active engineering dispatch zones."
          breadcrumbs={[
            { label: "Field Dashboard", href: "/officer/dashboard" },
            { label: "Officer Profile" },
          ]}
        />

        {savedSuccess && (
          <Alert variant="success" title="Officer Details Saved">
            Your field credentials and dispatch contact details have been updated.
          </Alert>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <Avatar name={formData.name} size="lg" className="h-16 w-16 text-lg bg-amber-50 text-amber-700" />
              <div>
                <h3 className="font-bold text-lg text-slate-900">{formData.name}</h3>
                <p className="text-xs text-slate-500">
                  Lead Field Engineer • {formData.department}
                </p>
                <div className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <HardHat className="h-3.5 w-3.5" />
                  <span>Licensed Municipal Infrastructure Specialist</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Officer Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Department Email"
                type="email"
                value={formData.email}
                disabled
                helperText="Government field radio & telemetry account"
              />

              <Input
                label="Direct Field Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />

              <Input
                label="Assigned Department"
                value={formData.department}
                disabled
              />

              <Input
                label="Primary Service Vehicle"
                value={formData.serviceTruck}
                disabled
                leftIcon={<Truck className="h-4 w-4" />}
              />

              <Input
                label="Service District"
                value={formData.zone}
                disabled
              />
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="px-6 h-11"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              Update Field Profile
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayoutShell>
  );
}

