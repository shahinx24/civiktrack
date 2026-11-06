"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayoutShell } from "@/components/layout/dashboard-layout-shell";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { IssueService } from "@/services/issue-service";
import { IssueCategory, IssuePriority, Issue } from "@/types/issue";
import { ISSUE_CATEGORIES, CATEGORY_LIST } from "@/constants/categories";
import {
  Upload,
  CheckCircle2,
  MapPin,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  X,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const reportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters"),
  category: z.enum([
    "roads",
    "water",
    "sanitation",
    "electricity",
    "parks",
    "public_safety",
    "other",
  ] as const),
  priority: z.enum(["low", "medium", "high", "critical"] as const),
  description: z.string().min(15, "Please provide at least 15 characters describing the issue"),
  address: z.string().min(5, "Please enter an accurate street address"),
  ward: z.string().min(1, "Please select a municipal ward"),
  landmark: z.string().optional(),
  imageUrl: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

const SAMPLE_PHOTO_PRESETS = [
  {
    label: "Road / Pothole Damage",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Water Pipe Leak",
    url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Streetlight / Electrical",
    url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Sanitation / Trash Overflow",
    url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
  },
];

const WARDS = [
  { label: "Ward 1 - Downtown Civic Center", value: "Ward 1 - Downtown" },
  { label: "Ward 2 - Highland Park District", value: "Ward 2 - Highland Park" },
  { label: "Ward 3 - Old Town & Heritage Corridor", value: "Ward 3 - Old Town" },
  { label: "Ward 4 - Riverside & Waterfront", value: "Ward 4 - Riverside" },
  { label: "Ward 5 - West Hills & Suburbs", value: "Ward 5 - West Hills" },
];

export default function ReportIssuePage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [createdIssue, setCreatedIssue] = React.useState<Issue | null>(null);
  const [previewPhoto, setPreviewPhoto] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      category: "roads",
      priority: "medium",
      ward: "Ward 4 - Riverside",
    },
  });

  const selectedCategory = watch("category");
  const selectedPriority = watch("priority");

  const onSubmit = async (data: ReportFormData) => {
    try {
      setLoading(true);
      const newIssue = await IssueService.createIssue({
        title: data.title,
        category: data.category as IssueCategory,
        priority: data.priority as IssuePriority,
        description: data.description,
        location: {
          address: data.address,
          city: "Metro City",
          ward: data.ward,
          landmark: data.landmark,
          coordinates: { lat: 37.7749, lng: -122.4194 },
        },
        images: previewPhoto ? [previewPhoto] : [],
        reporterId: "usr-resident-01",
        reporterName: "Alex Morgan",
        reporterEmail: "alex.morgan@community.org",
      });

      setCreatedIssue(newIssue);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  };

  if (createdIssue) {
    return (
      <DashboardLayoutShell role="resident" userName="Alex Morgan" userEmail="alex.morgan@community.org">
        <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Report Successfully Registered
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Your Issue Is In the Municipal Queue
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              We&apos;ve assigned tracking number{" "}
              <strong className="text-slate-900 font-mono text-base bg-slate-100 px-2 py-0.5 rounded">
                {createdIssue.trackingNumber}
              </strong>
              . Municipal triage will evaluate and assign field personnel shortly.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={`/issues/${createdIssue.id}`}>
              <Button variant="accent" size="lg" className="w-full sm:w-auto">
                View Public Transparency Ticket
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                setCreatedIssue(null);
                setPreviewPhoto(null);
                reset();
              }}
            >
              Report Another Issue
            </Button>
            <Link href="/resident/dashboard">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayoutShell>
    );
  }

  return (
    <DashboardLayoutShell role="resident" userName="Alex Morgan" userEmail="alex.morgan@community.org">
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="Submit Community Issue"
          description="Report local potholes, water leaks, sanitation hazards, or streetlight problems. Provide accurate location details and photos to expedite municipal dispatch."
          breadcrumbs={[
            { label: "Resident Hub", href: "/resident/dashboard" },
            { label: "Report Issue" },
          ]}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Category Selection */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                1. Select Issue Category
              </h3>
              <p className="text-xs text-slate-500">
                Choose the municipal category that best matches your problem.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CATEGORY_LIST.map((catKey) => {
                const config = ISSUE_CATEGORIES[catKey];
                const isSelected = selectedCategory === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setValue("category", catKey)}
                    className={cn(
                      "flex flex-col text-left p-3 rounded-xl border text-xs transition-all",
                      isSelected
                        ? "bg-teal-50/70 border-teal-600 shadow-xs ring-1 ring-teal-600"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    )}
                  >
                    <span className="font-bold text-slate-900 text-xs">
                      {config.label}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                      {config.defaultDepartment}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="text-xs text-rose-600 font-medium">{errors.category.message}</p>
            )}
          </Card>

          {/* Step 2: Issue Details & Urgency */}
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                2. Problem Title & Description
              </h3>
              <p className="text-xs text-slate-500">
                Be specific about dimensions, severity, and hazards to pedestrians or vehicles.
              </p>
            </div>

            <Input
              label="Issue Title / Summary"
              placeholder="e.g. Deep Pothole on Oak Street Near Elementary School"
              error={errors.title?.message}
              required
              {...register("title")}
            />

            <Textarea
              label="Detailed Problem Description"
              placeholder="Describe what happened, how long it has been present, and any immediate hazards..."
              rows={4}
              maxChars={600}
              error={errors.description?.message}
              required
              {...register("description")}
            />

            {/* Urgency Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 tracking-wide">
                Urgency Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "low", label: "Low", desc: "Cosmetic or minor inconvenience" },
                  { id: "medium", label: "Medium", desc: "Standard maintenance requirement" },
                  { id: "high", label: "High", desc: "Hazardous to pedestrians or vehicles" },
                  { id: "critical", label: "Critical", desc: "Imminent danger or major utility failure" },
                ].map((urg) => {
                  const isSelected = selectedPriority === urg.id;
                  return (
                    <button
                      key={urg.id}
                      type="button"
                      onClick={() => setValue("priority", urg.id as IssuePriority)}
                      className={cn(
                        "p-3 rounded-lg border text-left text-xs transition-all",
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className="font-bold capitalize">{urg.label}</div>
                      <div
                        className={cn(
                          "text-[10px] mt-0.5",
                          isSelected ? "text-slate-300" : "text-slate-400"
                        )}
                      >
                        {urg.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Step 3: Location Details */}
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                3. Neighborhood Location
              </h3>
              <p className="text-xs text-slate-500">
                Pinpoint the exact street address or cross-street.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Street Address or Intersection"
                placeholder="e.g. 412 Oak Street & 9th Ave"
                leftIcon={<MapPin className="h-4 w-4" />}
                error={errors.address?.message}
                required
                {...register("address")}
              />

              <Select
                label="Municipal Ward"
                options={WARDS}
                error={errors.ward?.message}
                required
                {...register("ward")}
              />
            </div>

            <Input
              label="Landmark Reference (Optional)"
              placeholder="e.g. Opposite Oak Elementary Gate B, next to bus stop #12"
              {...register("landmark")}
            />
          </Card>

          {/* Step 4: Photo Proof Attachment */}
          <Card className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                4. Photo Verification (Recommended)
              </h3>
              <p className="text-xs text-slate-500">
                Reports with photographs are resolved 40% faster by municipal dispatch.
              </p>
            </div>

            {previewPhoto ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-64 max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewPhoto}
                  alt="Issue preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(null)}
                  className="absolute top-2 right-2 bg-slate-900/80 text-white rounded-full p-1.5 hover:bg-rose-600 transition-colors"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50/50">
                  <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">
                    Click a sample photo below to test verification
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    PNG, JPG, or WEBP up to 10MB
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPreviewPhoto(preset.url)}
                      className="p-2 rounded-lg border border-slate-200 text-left hover:border-teal-500 hover:bg-teal-50/30 transition-all text-xs"
                    >
                      <span className="font-medium text-slate-800 block truncate">
                        {preset.label}
                      </span>
                      <span className="text-[10px] text-teal-600 font-semibold mt-0.5 block">
                        + Attach Photo
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/resident/dashboard">
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="px-8 h-11"
              isLoading={loading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Submit Issue Report
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayoutShell>
  );
}

