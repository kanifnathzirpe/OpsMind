"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { ordersApi } from "@/lib/api/orders";
import { fraudApi } from "@/lib/api/fraud";
import { forecastApi } from "@/lib/api/forecast";
import { paymentsApi } from "@/lib/api/payments";
import { customersApi } from "@/lib/api/customers";
import { SettingsService } from "@/services/settings-service";
import { UserRole, NotificationPreferences } from "@/types/auth";
import { OrderItem, FailedPaymentItem, FraudAlertItem } from "@/lib/dashboard-data";
import { toast } from "sonner";

export const QUERY_KEYS = {
  dashboard: (merchantId: string) => ["dashboard", merchantId] as const,
  orders: (merchantId: string, search?: string, status?: string) =>
    ["orders", merchantId, search, status] as const,
  fraud: () => ["fraud"] as const,
  forecast: () => ["forecast"] as const,
  revenueSeries: (timeframe?: string) => ["revenueSeries", timeframe] as const,
  payments: () => ["payments"] as const,
  customers: (search?: string) => ["customers", search] as const,
  notifications: () => ["notifications"] as const,
  team: (orgId?: string) => ["team", orgId] as const,
  apiKeys: (orgId?: string) => ["apiKeys", orgId] as const,
  billing: (orgId?: string) => ["billing", orgId] as const,
  webhooks: (orgId?: string) => ["webhooks", orgId] as const,
  sessions: () => ["sessions"] as const,
  notificationPreferences: () => ["notificationPreferences"] as const,
};

// -------------------------------------------------------------
// Queries using the centralized API layer
// -------------------------------------------------------------

export function useDashboardQuery(merchantId: string = "m_1") {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard(merchantId),
    queryFn: ({ signal }) => dashboardApi.getDashboard(merchantId, signal),
    staleTime: 30 * 1000,
  });
}

export function useOrdersQuery(
  merchantId: string = "m_1",
  search?: string,
  status?: string,
  limit?: number
) {
  return useQuery({
    queryKey: QUERY_KEYS.orders(merchantId, search, status),
    queryFn: ({ signal }) =>
      ordersApi.getOrders({ merchantId, search, status, limit }, signal),
    staleTime: 20 * 1000,
  });
}

export function useFraudQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.fraud(),
    queryFn: ({ signal }) => fraudApi.getFraudAlerts(signal),
    staleTime: 30 * 1000,
  });
}

export function useForecastQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.forecast(),
    queryFn: ({ signal }) => forecastApi.getForecast(signal),
    staleTime: 60 * 1000,
  });
}

export function useRevenueSeriesQuery(timeframe?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.revenueSeries(timeframe),
    queryFn: ({ signal }) => forecastApi.getRevenueSeries(timeframe, signal),
    staleTime: 60 * 1000,
  });
}

export function usePaymentsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.payments(),
    queryFn: ({ signal }) => paymentsApi.getFailedPayments(signal),
    staleTime: 20 * 1000,
  });
}

export function useCustomersQuery(search?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.customers(search),
    queryFn: ({ signal }) => customersApi.getCustomers(search, signal),
    staleTime: 60 * 1000,
  });
}

// -------------------------------------------------------------
// Mutations with Optimistic Updates
// -------------------------------------------------------------

export function useRefundOrderMutation(merchantId: string = "m_1") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.refundOrder(orderId),
    onMutate: async (orderId: string) => {
      // Cancel outgoing queries for orders
      await queryClient.cancelQueries({
        queryKey: ["orders", merchantId],
      });

      // Snapshot previous value
      const previousOrders = queryClient.getQueryData<OrderItem[]>(
        QUERY_KEYS.orders(merchantId)
      );

      // Optimistically update cache
      if (previousOrders) {
        queryClient.setQueryData<OrderItem[]>(
          QUERY_KEYS.orders(merchantId),
          previousOrders.map((order) =>
            order.id === orderId ? { ...order, status: "refunded" as const } : order
          )
        );
      }

      return { previousOrders };
    },
    onError: (_err, _orderId, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(
          QUERY_KEYS.orders(merchantId),
          context.previousOrders
        );
      }
      toast.error("Failed to refund order");
    },
    onSuccess: (data) => {
      toast.success(`Order ${data.orderId} marked as refunded`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", merchantId] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard(merchantId) });
    },
  });
}

export function useRetryPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => paymentsApi.retryPayment(paymentId),
    onMutate: async (paymentId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.payments() });

      const previousPayments = queryClient.getQueryData<FailedPaymentItem[]>(
        QUERY_KEYS.payments()
      );

      if (previousPayments) {
        queryClient.setQueryData<FailedPaymentItem[]>(
          QUERY_KEYS.payments(),
          previousPayments.map((p) =>
            p.id === paymentId ? { ...p, status: "recovered" as const } : p
          )
        );
      }

      return { previousPayments };
    },
    onError: (_err, _paymentId, context) => {
      if (context?.previousPayments) {
        queryClient.setQueryData(QUERY_KEYS.payments(), context.previousPayments);
      }
      toast.error("Failed to recover payment");
    },
    onSuccess: (data) => {
      toast.success(data.message || `Payment recovered successfully`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.payments() });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateFraudAlertMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      alertId,
      status,
    }: {
      alertId: string;
      status: "blocked" | "flagged" | "quarantined";
    }) => fraudApi.updateStatus(alertId, status),
    onMutate: async ({ alertId, status }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.fraud() });

      const previousAlerts = queryClient.getQueryData<FraudAlertItem[]>(
        QUERY_KEYS.fraud()
      );

      if (previousAlerts) {
        queryClient.setQueryData<FraudAlertItem[]>(
          QUERY_KEYS.fraud(),
          previousAlerts.map((a) =>
            a.id === alertId ? { ...a, status } : a
          )
        );
      }

      return { previousAlerts };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousAlerts) {
        queryClient.setQueryData(QUERY_KEYS.fraud(), context.previousAlerts);
      }
      toast.error("Failed to update fraud alert");
    },
    onSuccess: () => {
      toast.success("Fraud alert status updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fraud() });
    },
  });
}

export function useApplyFraudRuleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ruleId, ruleName }: { ruleId: string; ruleName?: string }) =>
      fraudApi.applyRule(ruleId, ruleName),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fraud() });
    },
    onError: () => {
      toast.error("Failed to apply firewall rule");
    },
  });
}

// -------------------------------------------------------------
// Settings and Organization Queries & Mutations
// -------------------------------------------------------------

export function useTeamQuery(orgId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.team(orgId),
    queryFn: () => SettingsService.getTeamMembers(orgId),
    staleTime: 60 * 1000,
  });
}

export function useApiKeysQuery(orgId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.apiKeys(orgId),
    queryFn: () => SettingsService.getApiKeys(orgId),
    staleTime: 60 * 1000,
  });
}

export function useBillingQuery(orgId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.billing(orgId),
    queryFn: () => SettingsService.getBillingInfo(orgId),
    staleTime: 60 * 1000,
  });
}

export function useWebhooksQuery(orgId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.webhooks(orgId),
    queryFn: () => SettingsService.getWebhooks(orgId),
    staleTime: 60 * 1000,
  });
}

export function useSessionsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.sessions(),
    queryFn: () => SettingsService.getActiveSessions(),
    staleTime: 60 * 1000,
  });
}

export function useNotificationPreferencesQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.notificationPreferences(),
    queryFn: () => SettingsService.getNotificationPreferences(),
    staleTime: 60 * 1000,
  });
}

export function useInviteMemberMutation(orgId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; email: string; role: UserRole }) =>
      SettingsService.inviteMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.team(orgId) });
      toast.success("Invitation dispatched to team member");
    },
    onError: () => {
      toast.error("Failed to send invitation");
    },
  });
}

export function useRemoveMemberMutation(orgId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SettingsService.removeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.team(orgId) });
      toast.success("Team member revoked from organization");
    },
  });
}

export function useCreateApiKeyMutation(orgId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      permissions: Parameters<typeof SettingsService.createApiKey>[0]["permissions"];
    }) => SettingsService.createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys(orgId) });
      toast.success("Production API key generated successfully");
    },
  });
}

export function useRevokeApiKeyMutation(orgId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SettingsService.revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.apiKeys(orgId) });
      toast.info("API key revoked");
    },
  });
}

export function useUpdateNotificationPreferencesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prefs: Partial<NotificationPreferences>) =>
      SettingsService.updateNotificationPreferences(prefs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationPreferences() });
      toast.success("Notification preferences updated");
    },
  });
}
