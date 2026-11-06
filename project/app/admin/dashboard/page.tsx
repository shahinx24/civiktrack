"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonthlyTrendChart } from "@/components/charts/monthly-trend-chart";
import { CategoryDistributionChart } from "@/components/charts/category-distribution-chart";
import { AnalyticsService } from "@/services/analytics-service";
import {
  PlatformOverviewStats,
  MonthlyTrendData,
  CategoryDistributionData,
  WardMetric,
} from "@/mock/analytics";
import {
  Building2,
  Users,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  TrendingUp,
  Shield,
  ArrowRight,
  HardHat,
  BarChart3,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<PlatformOverviewStats | null>(null);
  const [trends, setTrends] = React.useState<MonthlyTrendData[]>([]);
  const [categories, setCategories] = React.useState<CategoryDistributionData[]>([]);
  const [wardMetrics, setWardMetrics] = React.useState<WardMetric[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const [statsData, trendsData, catData, wardData] = await Promise.all([
          AnalyticsService.getPlatformStats(),
          AnalyticsService.getMonthlyTrends(),
          AnalyticsService.getCategoryDistribution(),
          AnalyticsService.getWardMetrics(),
        ]);
        setStats(statsData);
        setTrends(trendsData);
        setCategories(catData);
        setWardMetrics(wardData);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <DashboardLayoutShell role="admin" userName="Sarah Jenkins" userEmail="sarah.jenkins@admin.gov.local">
      <div className="space-y-6">
        <PageHeader
          title="City Administration Console"
          description="High-level municipal performance analytics, ward resolution compliance, department rosters, and platform governance."
          breadcrumbs={[{ label: "Admin Console" }]}
          actions={
            <div className="flex items-center gap-2">
              <Link href="/admin/reports">
                <Button variant="outline" size="sm" leftIcon={<FileSpreadsheet className="h-4 w-4" />}>
                  Export Civic Audit
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="default" size="sm" leftIcon={<Users className="h-4 w-4" />}>
                  User Directory
                </Button>
              </Link>
            </div>
          }
        />

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total City Reports"
            value={stats?.totalIssuesReported || "1,482"}
            change="+14.2%"
            changeType="increase"
            period="vs last 30 days"
            icon={<BarChart3 className="h-5 w-5" />}
            iconBg="bg-slate-100 text-slate-800"
          />
          <StatCard
            label="City Clearance Rate"
            value="85.3%"
            change="+3.1%"
            changeType="increase"
            period="1,264 closed tickets"
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconBg="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            label="Mean Resolution Time"
            value={`${stats?.avgResolutionTimeHours || 38.4} hrs`}
            change="-4.2 hrs"
            changeType="decrease"
            period="Faster response SLA"
            icon={<Clock className="h-5 w-5" />}
            iconBg="bg-blue-50 text-blue-700"
          />
          <StatCard
            label="Active Field Crews"
            value={stats?.activeOfficersInField || 36}
            period="6 municipal departments"
            icon={<HardHat className="h-5 w-5" />}
            iconBg="bg-amber-50 text-amber-700"
          />
        </div>

        {/* Charts Row: Monthly Trend (8 cols) & Category Breakdown (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <Card className="lg:col-span-7 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Monthly Intake vs Resolution Trajectory
                </h3>
                <p className="text-xs text-slate-500">
                  Total incoming community tickets vs resolved field closures
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                SLA Positive
              </span>
            </div>
            <MonthlyTrendChart data={trends} height={290} />
          </Card>

          <Card className="lg:col-span-5 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Issues by Civic Domain
                </h3>
                <p className="text-xs text-slate-500">
                  Volume distribution across service categories
                </p>
              </div>
            </div>
            <CategoryDistributionChart data={categories} height={290} />
          </Card>
        </div>

        {/* Ward Performance Summary Table */}
        <Card className="p-6 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Ward Performance & Response Benchmarks
              </h3>
              <p className="text-xs text-slate-500">
                Service metrics and mean turnaround times by municipal district
              </p>
            </div>
            <Link
              href="/admin/departments"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              Manage departments & SLAs →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-semibold">Ward District</th>
                  <th className="py-3 px-4 font-semibold">Total Reports</th>
                  <th className="py-3 px-4 font-semibold">Resolution Rate</th>
                  <th className="py-3 px-4 font-semibold">Avg Turnaround</th>
                  <th className="py-3 px-4 font-semibold text-right">Status Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wardMetrics.map((ward) => (
                  <tr key={ward.ward} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {ward.ward}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {ward.totalIssues}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-teal-600 h-2 rounded-full"
                            style={{ width: `${ward.resolvedRate}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-800">
                          {ward.resolvedRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {ward.avgResolutionDays} days
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Compliant
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayoutShell>
  );
}

