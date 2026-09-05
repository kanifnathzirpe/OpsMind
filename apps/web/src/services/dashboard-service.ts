import { dashboardApi } from "@/lib/api/dashboard";
import { ordersApi } from "@/lib/api/orders";
import { fraudApi } from "@/lib/api/fraud";
import { forecastApi } from "@/lib/api/forecast";
import { mockFetch } from "@/lib/api/client";
import {
  MOCK_NOTIFICATIONS,
  OrderItem,
  FraudAlertItem,
  CashFlowData,
  NotificationItem,
} from "@/lib/dashboard-data";
import { DashboardPayload } from "@/lib/api/dashboard";

export type { DashboardPayload };

export class DashboardService {
  static async getDashboard(orgId: string = "m_1"): Promise<DashboardPayload> {
    return dashboardApi.getDashboard(orgId);
  }

  static async getOrders(orgId: string = "m_1", search?: string): Promise<OrderItem[]> {
    return ordersApi.getOrders({ merchantId: orgId, search });
  }

  static async getFraudAlerts(orgId?: string): Promise<FraudAlertItem[]> {
    void orgId;
    return fraudApi.getFraudAlerts();
  }

  static async getForecast(orgId?: string): Promise<CashFlowData> {
    void orgId;
    return forecastApi.getForecast();
  }

  static async getNotifications(): Promise<NotificationItem[]> {
    try {
      const response = await fetch('/api/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const result = await response.json();
      return result.data;
    } catch {
      const res = await mockFetch(MOCK_NOTIFICATIONS, 150);
      return res.data;
    }
  }
}
