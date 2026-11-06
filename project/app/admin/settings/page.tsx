"use client";

import * as React from "react";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import {
  Settings,
  Building,
  CheckCircle2,
  Clock,
  Shield,
  Bell,
  Sliders,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const [settings, setSettings] = React.useState({
    cityName: "Metro City Municipal Corporation",
    portalDomain: "civictrack.metrocity.gov",
    contactEmail: "helpdesk@metrocity.gov",
    emergencyPhone: "1-800-CIVIC-00",
    slaCriticalHours: 4,
    slaStandardHours: 48,
    requirePhotoProof: true,
    enablePublicGuestUpvoting: true,
    sendResidentSmsDigest: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayoutShell role="admin" userName="Sarah Jenkins" userEmail="sarah.jenkins@admin.gov.local">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="Platform Governance & Settings"
          description="Global municipal parameters, service level target thresholds, and civic transparency rules."
          breadcrumbs={[
            { label: "Admin Console", href: "/admin/dashboard" },
            { label: "Settings" },
          ]}
        />

        {savedSuccess && (
          <Alert variant="success" title="Platform Settings Updated">
            System configuration parameters have been synchronized across all municipal portals.
          </Alert>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Municipal Identity */}
          <Card className="p-6 space-y-4 shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Building className="h-4 w-4 text-teal-600" />
                Municipal Authority Identity
              </h3>
              <p className="text-xs text-slate-500">
                Official entity name and primary contact endpoints shown to citizens.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <Input
                label="Municipality / City Government Name"
                value={settings.cityName}
                onChange={(e) => setSettings({ ...settings, cityName: e.target.value })}
                required
              />

              <Input
                label="Official Civic Portal Subdomain"
                value={settings.portalDomain}
                onChange={(e) => setSettings({ ...settings, portalDomain: e.target.value })}
                required
              />

              <Input
                label="Civic Helpdesk Inquiries Email"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                required
              />

              <Input
                label="Municipal Central Dispatch Phone"
                value={settings.emergencyPhone}
                onChange={(e) => setSettings({ ...settings, emergencyPhone: e.target.value })}
                required
              />
            </div>
          </Card>

          {/* SLA Thresholds */}
          <Card className="p-6 space-y-4 shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600" />
                Service Level Agreement (SLA) Targets
              </h3>
              <p className="text-xs text-slate-500">
                Maximum expected response windows before tickets are flagged as overdue.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <Input
                label="Critical Hazard Dispatch Window (Hours)"
                type="number"
                value={settings.slaCriticalHours}
                onChange={(e) =>
                  setSettings({ ...settings, slaCriticalHours: Number(e.target.value) })
                }
                helperText="Applies to downed wires, gas leaks, and critical hazards"
                required
              />

              <Input
                label="Standard Issue Clearance Window (Hours)"
                type="number"
                value={settings.slaStandardHours}
                onChange={(e) =>
                  setSettings({ ...settings, slaStandardHours: Number(e.target.value) })
                }
                helperText="Applies to standard potholes, signage, and park repairs"
                required
              />
            </div>
          </Card>

          {/* Civic Governance Policy Toggles */}
          <Card className="p-6 space-y-4 shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal-600" />
                Verification & Public Transparency Rules
              </h3>
              <p className="text-xs text-slate-500">
                Enforce evidence requirements and public engagement controls.
              </p>
            </div>

            <div className="space-y-3 divide-y divide-slate-100 text-xs pt-1">
              <label className="flex items-start justify-between pt-3 cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">
                    Mandatory Photographic Resolution Proof
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Field officers cannot mark tickets as &ldquo;Resolved&rdquo; without attaching photo verification.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requirePhotoProof}
                  onChange={(e) =>
                    setSettings({ ...settings, requirePhotoProof: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 ml-4 mt-1"
                />
              </label>

              <label className="flex items-start justify-between pt-3 cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">
                    Allow Anonymous Citizen Upvoting
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Unregistered visitors can upvote community issues to help prioritize neighborhood hazards.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enablePublicGuestUpvoting}
                  onChange={(e) =>
                    setSettings({ ...settings, enablePublicGuestUpvoting: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 ml-4 mt-1"
                />
              </label>

              <label className="flex items-start justify-between pt-3 cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">
                    Automated SMS Status Alerts for Residents
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Send free text message updates when municipal work crews arrive on-site.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.sendResidentSmsDigest}
                  onChange={(e) =>
                    setSettings({ ...settings, sendResidentSmsDigest: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 ml-4 mt-1"
                />
              </label>
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
              Save Platform Configuration
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayoutShell>
  );
}

