import { apiClient } from "./api-client";
import {
  MOCK_CASH_FLOW,
  MOCK_REVENUE_SERIES,
  CashFlowData,
  RevenueDataPoint,
} from "../dashboard-data";

export function getFallbackForecast(): CashFlowData {
  return { ...MOCK_CASH_FLOW };
}

export function getFallbackRevenueSeries(): RevenueDataPoint[] {
  return [...MOCK_REVENUE_SERIES];
}

export async function fetchForecast(
  signal?: AbortSignal
): Promise<CashFlowData> {
  try {
    const res = await apiClient.get<CashFlowData>("/api/forecast", { signal });
    return res.data;
  } catch (error) {
    console.warn("API /api/forecast failed, using fallback mock data:", error);
    return getFallbackForecast();
  }
}

export async function fetchRevenueSeries(
  timeframe?: string,
  signal?: AbortSignal
): Promise<RevenueDataPoint[]> {
  try {
    const res = await apiClient.get<RevenueDataPoint[]>("/api/forecast", {
      params: { type: "revenue", timeframe },
      signal,
    });
    return res.data;
  } catch (error) {
    console.warn("API revenue series failed, using fallback mock data:", error);
    return getFallbackRevenueSeries();
  }
}

export const forecastApi = {
  getForecast: fetchForecast,
  getRevenueSeries: fetchRevenueSeries,
  getFallbackForecast,
  getFallbackRevenueSeries,
};
