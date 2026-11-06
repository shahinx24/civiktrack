"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { StatusPill } from "@/components/ui/status-pill";
import { IssueTimeline } from "@/components/issues/issue-timeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { IssueService } from "@/services/issue-service";
import { Issue } from "@/types/issue";
import { ISSUE_CATEGORIES, PRIORITY_CONFIG } from "@/constants/categories";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  ThumbsUp,
  Share2,
  Building,
  User,
  ArrowLeft,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface IssueDetailViewProps {
  id: string;
}

export function IssueDetailView({ id }: IssueDetailViewProps) {
  const router = useRouter();

  const [issue, setIssue] = React.useState<Issue | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [copiedLink, setCopiedLink] = React.useState(false);

  React.useEffect(() => {
    async function loadIssue() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await IssueService.getIssueById(id);
        setIssue(data);
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    }
    loadIssue();
  }, [id]);

  const handleUpvote = async () => {
    if (!issue) return;
    const res = await IssueService.toggleUpvote(issue.id);
    if (res) {
      setIssue({
        ...issue,
        upvotes: res.upvotes,
        userHasUpvoted: res.userHasUpvoted,
      });
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-3/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="py-12 max-w-2xl mx-auto">
        <EmptyState
          icon={<AlertCircle className="h-8 w-8 text-rose-500" />}
          title="Community Issue Not Found"
          description={`No issue record exists with ID or tracking number "${id}".`}
          actionLabel="Return to Issues Feed"
          onAction={() => router.push("/issues")}
        />
      </div>
    );
  }

  const categoryConfig = ISSUE_CATEGORIES[issue.category] || ISSUE_CATEGORIES.other;
  const priorityConfig = PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.medium;

  return (
    <div className="space-y-8">
      {/* Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <Breadcrumbs
          items={[
            { label: "Community Issues", href: "/issues" },
            { label: issue.trackingNumber },
          ]}
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/issues")}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Feed
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            leftIcon={
              copiedLink ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Share2 className="h-4 w-4" />
              )
            }
          >
            {copiedLink ? "Link Copied" : "Share Ticket"}
          </Button>
        </div>
      </div>

      {/* Issue Header Banner */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-200/80 px-2.5 py-1 rounded-md">
            {issue.trackingNumber}
          </span>
          <StatusPill status={issue.status} size="md" />
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-md",
              categoryConfig.badgeBg,
              categoryConfig.badgeText
            )}
          >
            {categoryConfig.label}
          </span>
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-md border",
              priorityConfig.badgeBg,
              priorityConfig.badgeText,
              priorityConfig.badgeBorder
            )}
          >
            {priorityConfig.label} Urgency
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          {issue.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-slate-400" />
            <strong className="text-slate-700">{issue.location.address}</strong>
            {issue.location.ward && ` • ${issue.location.ward}`}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>Reported on {formatDate(issue.createdAt)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-slate-400" />
            <span>Reporter: {issue.reporterName}</span>
          </span>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Photo Gallery, Description, Timeline */}
        <div className="lg:col-span-8 space-y-8">
          {/* Photo Viewer */}
          {issue.images && issue.images.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
              <div className="relative h-72 sm:h-96 md:h-[420px] w-full bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={issue.images[activeImageIndex] || issue.images[0]}
                  alt={issue.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium">
                  Photo Verification Proof
                </div>
              </div>

              {issue.images.length > 1 && (
                <div className="p-3 bg-slate-50 flex gap-2 overflow-x-auto border-t border-slate-200">
                  {issue.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "relative h-16 w-20 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                        activeImageIndex === idx
                          ? "border-teal-600 ring-2 ring-teal-200"
                          : "border-transparent opacity-70 hover:opacity-100"
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Issue Description */}
          <Card className="p-6 space-y-3">
            <h3 className="font-bold text-base text-slate-900 uppercase tracking-wider text-xs">
              Problem Description & Resident Statement
            </h3>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {issue.description}
            </p>

            {issue.location.landmark && (
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Landmark reference:</span>
                <span>{issue.location.landmark}</span>
              </div>
            )}
          </Card>

          {/* Resolution Lifecycle Timeline */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Resolution Transparency & Audit History
            </h3>
            <IssueTimeline
              currentStatus={issue.status}
              timeline={issue.timeline}
            />
          </div>
        </div>

        {/* Right Column (4 cols): Priority Upvote, Location Map, Department Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Community Upvote Card */}
          <Card className="p-5 text-center space-y-4">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-base">
                Community Priority Score
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Does this issue impact your daily commute or neighborhood safety?
                Upvote to raise municipal dispatch priority.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {issue.upvotes}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                neighbor upvotes
              </span>
            </div>

            <Button
              variant={issue.userHasUpvoted ? "accent" : "outline"}
              size="md"
              className="w-full justify-center"
              onClick={handleUpvote}
              leftIcon={
                <ThumbsUp
                  className={cn(
                    "h-4 w-4",
                    issue.userHasUpvoted ? "fill-white" : ""
                  )}
                />
              }
            >
              {issue.userHasUpvoted ? "Upvoted by You" : "Upvote This Report"}
            </Button>
          </Card>

          {/* Location Card & Map */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Geographic Location
              </h4>
              <MapPin className="h-4 w-4 text-teal-600" />
            </div>

            <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
              <div
                className="absolute inset-0 opacity-20 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:12px_12px]"
                aria-hidden="true"
              />
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div className="h-10 w-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg ring-4 ring-teal-100 animate-bounce">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="font-bold text-xs text-slate-900 mt-1">
                  {issue.location.address}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {issue.location.coordinates
                    ? `${issue.location.coordinates.lat.toFixed(4)}, ${issue.location.coordinates.lng.toFixed(4)}`
                    : "37.7749° N, 122.4194° W"}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <p>
                <strong className="text-slate-800">Ward District:</strong>{" "}
                {issue.location.ward || "Central Municipal District"}
              </p>
              <p>
                <strong className="text-slate-800">City Jurisdiction:</strong>{" "}
                {issue.location.city || "Metro City"} {issue.location.zipCode}
              </p>
            </div>
          </Card>

          {/* Assigned Department Card */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Assigned Municipal Agency
              </h4>
              <Building className="h-4 w-4 text-teal-600" />
            </div>

            {issue.departmentName ? (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <p className="font-semibold text-slate-900 text-sm">
                    {issue.departmentName}
                  </p>
                  {issue.assignedOfficerName && (
                    <p className="text-slate-600">
                      Lead Officer:{" "}
                      <strong className="text-slate-800">
                        {issue.assignedOfficerName}
                      </strong>
                    </p>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Field work orders are assigned and monitored via the central
                  municipal dispatch grid.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                This report is currently in the triage queue awaiting department
                assignment by municipal administrators.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

