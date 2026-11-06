export interface MonthlyTrendData {
  month: string;
  reported: number;
  resolved: number;
}

export interface CategoryDistributionData {
  category: string;
  count: number;
  percentage: number;
  fill: string;
}

export interface WardMetric {
  ward: string;
  totalIssues: number;
  resolvedRate: number; // percentage
  avgResolutionDays: number;
}

export interface PlatformOverviewStats {
  totalIssuesReported: number;
  resolvedIssuesCount: number;
  activeIssuesCount: number;
  avgResolutionTimeHours: number;
  citizenSatisfactionRate: number; // percentage
  activeOfficersInField: number;
}

export const MOCK_PLATFORM_STATS: PlatformOverviewStats = {
  totalIssuesReported: 1482,
  resolvedIssuesCount: 1264,
  activeIssuesCount: 178,
  avgResolutionTimeHours: 38.4,
  citizenSatisfactionRate: 94.2,
  activeOfficersInField: 36,
};

export const MOCK_MONTHLY_TRENDS: MonthlyTrendData[] = [
  { month: "Sep", reported: 110, resolved: 98 },
  { month: "Oct", reported: 142, resolved: 135 },
  { month: "Nov", reported: 125, resolved: 120 },
  { month: "Dec", reported: 160, resolved: 148 },
  { month: "Jan", reported: 175, resolved: 162 },
  { month: "Feb", reported: 190, resolved: 178 },
  { month: "Mar", reported: 85, resolved: 72 },
];

export const MOCK_CATEGORY_DISTRIBUTION: CategoryDistributionData[] = [
  { category: "Roads & Potholes", count: 480, percentage: 32.4, fill: "#F97316" },
  { category: "Water & Drainage", count: 320, percentage: 21.6, fill: "#06B6D4" },
  { category: "Sanitation & Waste", count: 260, percentage: 17.5, fill: "#10B981" },
  { category: "Power & Streetlights", count: 195, percentage: 13.2, fill: "#F59E0B" },
  { category: "Parks & Greenery", count: 127, percentage: 8.6, fill: "#84CC16" },
  { category: "Public Safety", count: 100, percentage: 6.7, fill: "#EF4444" },
];

export const MOCK_WARD_METRICS: WardMetric[] = [
  { ward: "Ward 1 - Downtown", totalIssues: 420, resolvedRate: 88, avgResolutionDays: 1.8 },
  { ward: "Ward 2 - Highland Park", totalIssues: 310, resolvedRate: 91, avgResolutionDays: 1.4 },
  { ward: "Ward 3 - Old Town", totalIssues: 260, resolvedRate: 83, avgResolutionDays: 2.3 },
  { ward: "Ward 4 - Riverside", totalIssues: 332, resolvedRate: 86, avgResolutionDays: 1.9 },
  { ward: "Ward 5 - West Hills", totalIssues: 160, resolvedRate: 95, avgResolutionDays: 1.2 },
];

