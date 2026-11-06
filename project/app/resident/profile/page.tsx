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
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Building,
} from "lucide-react";

export default function ResidentProfilePage() {
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "Alex Morgan",
    email: "alex.morgan@community.org",
    phone: "+1 (555) 234-5678",
    ward: "Ward 4 - Riverside & Waterfront",
    notifyStatusChange: true,
    notifySmsAlerts: true,
    notifyMonthlyDigest: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayoutShell role="resident" userName="Alex Morgan" userEmail="alex.morgan@community.org">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="Resident Profile & Preferences"
          description="Manage your contact details, designated municipal ward, and community notification subscriptions."
          breadcrumbs={[
            { label: "Resident Hub", href: "/resident/dashboard" },
            { label: "My Profile" },
          ]}
        />

        {savedSuccess && (
          <Alert variant="success" title="Preferences Saved">
            Your profile details and notification settings have been updated successfully.
          </Alert>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity Card */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <Avatar name={formData.name} size="lg" className="h-16 w-16 text-lg" />
              <div>
                <h3 className="font-bold text-lg text-slate-900">{formData.name}</h3>
                <p className="text-xs text-slate-500">
                  Verified Resident Member • Joined Jan 2025
                </p>
                <div className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Ward 4 Registered Citizen</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                leftIcon={<User className="h-4 w-4" />}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                leftIcon={<Phone className="h-4 w-4" />}
                required
              />

              <Input
                label="Designated Municipal Ward"
                value={formData.ward}
                disabled
                leftIcon={<MapPin className="h-4 w-4" />}
                helperText="Ward assigned based on verified residential address"
              />
            </div>
          </Card>

          {/* Ward Representative Card */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Ward 4 Representative Office
              </h4>
              <Building className="h-4 w-4 text-teal-600" />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900 text-sm">
                Council Member Elena Vance
              </p>
              <p>Ward 4 Municipal Office: 440 Riverside Blvd, Suite 200</p>
              <p>Office Hours: Mon–Fri, 9:00 AM – 5:00 PM • Direct: (555) 440-WARD</p>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Bell className="h-4 w-4 text-teal-600" />
                Notification Subscriptions
              </h3>
              <p className="text-xs text-slate-500">
                Choose how you receive alerts when issues you submitted or upvoted progress.
              </p>
            </div>

            <div className="space-y-3 divide-y divide-slate-100 text-xs">
              <label className="flex items-start justify-between pt-3 cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">
                    Real-Time Status Updates
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Receive immediate email notifications when your issue moves from review to in-progress or resolved.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifyStatusChange}
                  onChange={(e) =>
                    setFormData({ ...formData, notifyStatusChange: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 ml-4 mt-1"
                />
              </label>

              <label className="flex items-start justify-between pt-3 cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">
                    SMS Priority Alerts
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Receive text messages for high-urgency utility shutoffs or critical road closures in Ward 4.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifySmsAlerts}
                  onChange={(e) =>
                    setFormData({ ...formData, notifySmsAlerts: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 ml-4 mt-1"
                />
              </label>

              <label className="flex items-start justify-between pt-3 cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">
                    Monthly Community Progress Digest
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    A monthly email summarizing resolved issues, municipal investments, and planned streetworks.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notifyMonthlyDigest}
                  onChange={(e) =>
                    setFormData({ ...formData, notifyMonthlyDigest: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 ml-4 mt-1"
                />
              </label>
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
              Save Profile & Preferences
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayoutShell>
  );
}

