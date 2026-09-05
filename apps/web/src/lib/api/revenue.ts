import { apiClient } from "./api-client";
import { CashFlowData, RevenueDataPoint, MOCK_CASH_FLOW, MOCK_REVENUE_SERIES } from "../dashboard-data";

export interface RevenueQueryParams {
  merchantId?: string;
  timeframe?: string;
}

export async function fetchRevenueMetrics(
  params?: RevenueQueryParams,
  signal?: AbortSignal
): Promise<CashFlowData> {
  try {
    const res = await apiClient.get<CashFlowData>("/api/revenue", {
      params: { merchantId: params?.merchantId, timeframe: params?.timeframe },
      signal,
    });
    return res.data;
  } catch (error) {
    console.warn("API /api/revenue failed, falling back to cached baseline:", error);
    return { ...MOCK_CASH_FLOW };
  }
}

export async function fetchRevenueHistory(
  timeframe?: string,
  signal?: AbortSignal
): Promise<RevenueDataPoint[]> {
  try {
    const res = await apiClient.get<RevenueDataPoint[]>("/api/forecast", {
      params: { type: "revenue", timeframe },
      signal,
    });
    return res.data;
  } catch {
    return [...MOCK_REVENUE_SERIES];
  }
}

export const revenueApi = {
  getRevenueMetrics: fetchRevenueMetrics,
  getRevenueHistory: fetchRevenueHistory,
};
