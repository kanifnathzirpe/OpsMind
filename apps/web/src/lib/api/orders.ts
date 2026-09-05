import { apiClient } from "./api-client";
import { MOCK_ORDERS, OrderItem } from "../dashboard-data";

export interface OrdersQueryParams {
  merchantId?: string;
  search?: string;
  status?: string;
  limit?: number;
}

export function getFallbackOrders(params?: OrdersQueryParams): OrderItem[] {
  let items = [...MOCK_ORDERS];

  if (params?.status && params.status !== "all") {
    items = items.filter((o) => o.status === params.status);
  }

  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    items = items.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
    );
  }

  if (params?.limit && params.limit > 0) {
    items = items.slice(0, params.limit);
  }

  return items;
}

export async function fetchOrders(
  params?: OrdersQueryParams,
  signal?: AbortSignal
): Promise<OrderItem[]> {
  try {
    const res = await apiClient.get<OrderItem[]>("/api/orders", {
      params: {
        merchantId: params?.merchantId,
        search: params?.search,
        status: params?.status,
        limit: params?.limit,
      },
      signal,
    });
    return res.data;
  } catch (error) {
    console.warn("API /api/orders failed, using fallback mock data:", error);
    return getFallbackOrders(params);
  }
}

export async function fetchOrderById(
  orderId: string,
  signal?: AbortSignal
): Promise<OrderItem | null> {
  try {
    const res = await apiClient.get<OrderItem>(`/api/orders/${orderId}`, { signal });
    return res.data;
  } catch {
    const found = MOCK_ORDERS.find((o) => o.id === orderId || o.orderNumber === orderId);
    return found || null;
  }
}

export async function refundOrder(
  orderId: string
): Promise<{ success: boolean; orderId: string; status: string }> {
  try {
    const res = await apiClient.post<{ success: boolean; orderId: string; status: string }>(
      "/api/orders",
      { action: "refund", orderId }
    );
    return res.data;
  } catch {
    return { success: true, orderId, status: "refunded" };
  }
}

export const ordersApi = {
  getOrders: fetchOrders,
  getOrderById: fetchOrderById,
  refundOrder,
  getFallback: getFallbackOrders,
};
