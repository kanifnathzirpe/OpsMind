import { apiClient } from "./api-client";
import {
  MOCK_KPIS,
  MOCK_ORDERS,
  MOCK_FRAUD_ALERTS,
  MOCK_CASH_FLOW,
  MOCK_ACTIVITIES,
  MOCK_REVENUE_SERIES,
  MOCK_MERCHANTS,
  KPIData,
  OrderItem,
  FraudAlertItem,
  CashFlowData,
  ActivityTimelineItem,
  RevenueDataPoint,
} from "../dashboard-data";

export interface DashboardPayload {
  organizationId: string;
  merchantId: string;
  kpis: KPIData[];
  orders: OrderItem[];
  fraudAlerts: FraudAlertItem[];
  cashFlow: CashFlowData;
  activities: ActivityTimelineItem[];
  revenueSeries: RevenueDataPoint[];
}

export function getFallbackDashboardData(merchantId: string = "m_1"): DashboardPayload {
  const merchant = MOCK_MERCHANTS.find((m) => m.id === merchantId || m.code === merchantId) || MOCK_MERCHANTS[0];
  const mult = merchant.multiplier || 1.0;

  const scaledKpis = MOCK_KPIS.map((kpi) => {
    const scaledVal = Math.round(kpi.numericValue * mult);
    return {
      ...kpi,
      numericValue: scaledVal,
      value: `${merchant.currencySymbol}${scaledVal.toLocaleString()}`,
      sparkline: kpi.sparkline.map((v) => Math.round(v * mult)),
    };
  });

  const scaledOrders = MOCK_ORDERS.map((order) => {
    const amount = Math.round(order.amount * mult * 100) / 100;
    const fee = Math.round(order.fee * mult * 100) / 100;
    return {
      ...order,
      amount,
      fee,
      net: Math.round((amount - fee) * 100) / 100,
      currency: merchant.currency,
    };
  });

  return {
    organizationId: merchant.id,
    merchantId: merchant.id,
    kpis: scaledKpis,
    orders: scaledOrders,
    fraudAlerts: MOCK_FRAUD_ALERTS,
    cashFlow: MOCK_CASH_FLOW,
    activities: MOCK_ACTIVITIES,
    revenueSeries: MOCK_REVENUE_SERIES,
  };
}

export async function fetchDashboard(
  merchantId: string = "m_1",
  signal?: AbortSignal
): Promise<DashboardPayload> {
  try {
    const res = await apiClient.get<DashboardPayload>("/api/dashboard", {
      params: { merchantId },
      signal,
    });
    return res.data;
  } catch (error) {
    console.warn("API /api/dashboard failed, using fallback mock data:", error);
    return getFallbackDashboardData(merchantId);
  }
}

export const dashboardApi = {
  getDashboard: fetchDashboard,
  getFallback: getFallbackDashboardData,
};
