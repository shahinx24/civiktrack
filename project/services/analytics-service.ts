import {
  PlatformOverviewStats,
  MonthlyTrendData,
  CategoryDistributionData,
  WardMetric,
  MOCK_PLATFORM_STATS,
  MOCK_MONTHLY_TRENDS,
  MOCK_CATEGORY_DISTRIBUTION,
  MOCK_WARD_METRICS,
} from "@/mock/analytics";
import { ApiClient } from "./api-client";

export const AnalyticsService = {
  async getPlatformStats(): Promise<PlatformOverviewStats> {
    await ApiClient.simulateDelay(150);
    return { ...MOCK_PLATFORM_STATS };
  },

  async getMonthlyTrends(): Promise<MonthlyTrendData[]> {
    await ApiClient.simulateDelay(150);
    return [...MOCK_MONTHLY_TRENDS];
  },

  async getCategoryDistribution(): Promise<CategoryDistributionData[]> {
    await ApiClient.simulateDelay(150);
    return [...MOCK_CATEGORY_DISTRIBUTION];
  },

  async getWardMetrics(): Promise<WardMetric[]> {
    await ApiClient.simulateDelay(150);
    return [...MOCK_WARD_METRICS];
  },
};

