import { apiClient } from "./api-client";
import { MOCK_ORDERS } from "../dashboard-data";

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  country: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  fraudScore: number;
  status: "active" | "flagged" | "vip";
}

export function getFallbackCustomers(search?: string): CustomerItem[] {
  // Synthesize customers from MOCK_ORDERS deduplicated by customerId
  const customerMap = new Map<string, CustomerItem>();

  MOCK_ORDERS.forEach((order) => {
    if (!customerMap.has(order.customerId)) {
      customerMap.set(order.customerId, {
        id: order.customerId,
        name: order.customerName,
        email: order.customerEmail,
        avatar: order.customerAvatar,
        country: order.country,
        totalSpent: order.amount,
        ordersCount: 1,
        lastOrderDate: `${order.date} ${order.time}`,
        fraudScore: order.fraudRiskScore,
        status: order.fraudRiskScore > 75 ? "flagged" : order.amount > 1500 ? "vip" : "active",
      });
    } else {
      const existing = customerMap.get(order.customerId)!;
      existing.totalSpent = +(existing.totalSpent + order.amount).toFixed(2);
      existing.ordersCount += 1;
      if (existing.totalSpent > 3000) {
        existing.status = "vip";
      }
    }
  });

  let list = Array.from(customerMap.values());
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function fetchCustomers(
  search?: string,
  signal?: AbortSignal
): Promise<CustomerItem[]> {
  try {
    const res = await apiClient.get<CustomerItem[]>("/api/customers", {
      params: { search },
      signal,
    });
    return res.data;
  } catch (error) {
    console.warn("API /api/customers failed, using fallback mock data:", error);
    return getFallbackCustomers(search);
  }
}

export async function fetchCustomerById(
  id: string,
  signal?: AbortSignal
): Promise<CustomerItem | null> {
  try {
    const res = await apiClient.get<CustomerItem>(`/api/customers/${id}`, { signal });
    return res.data;
  } catch {
    const list = getFallbackCustomers();
    return list.find((c) => c.id === id) || null;
  }
}

export const customersApi = {
  getCustomers: fetchCustomers,
  getCustomerById: fetchCustomerById,
  getFallback: getFallbackCustomers,
};
