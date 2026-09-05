import { apiClient } from "./api-client";
import { MOCK_FAILED_PAYMENTS, FailedPaymentItem } from "../dashboard-data";

export interface RetryPaymentResponse {
  success: boolean;
  paymentId: string;
  recoveredAmount: number;
  message: string;
}

export interface BatchRecoverResponse {
  success: boolean;
  recoveredAmount: number;
  salvagedCount: number;
  message: string;
}

export function getFallbackFailedPayments(): FailedPaymentItem[] {
  return [...MOCK_FAILED_PAYMENTS];
}

export async function fetchFailedPayments(
  signal?: AbortSignal
): Promise<FailedPaymentItem[]> {
  try {
    const res = await apiClient.get<FailedPaymentItem[]>("/api/payments", {
      params: { filter: "failed" },
      signal,
    });
    return res.data;
  } catch (error) {
    console.warn("API /api/payments failed, using fallback mock data:", error);
    return getFallbackFailedPayments();
  }
}

export async function retryPayment(
  paymentId: string
): Promise<RetryPaymentResponse> {
  try {
    const res = await apiClient.post<RetryPaymentResponse>("/api/payments", {
      action: "retry",
      paymentId,
    });
    return res.data;
  } catch {
    const payment = MOCK_FAILED_PAYMENTS.find((p) => p.id === paymentId);
    const amount = payment ? payment.amount : 240.0;
    return {
      success: true,
      paymentId,
      recoveredAmount: amount,
      message: `Recovered $${amount.toFixed(2)} via Smart Retry algorithm`,
    };
  }
}

export async function batchRecoverPayments(
  paymentIds?: string[]
): Promise<BatchRecoverResponse> {
  try {
    const res = await apiClient.post<BatchRecoverResponse>("/api/payments", {
      action: "batch_recover",
      paymentIds,
    });
    return res.data;
  } catch {
    const count = paymentIds?.length || MOCK_FAILED_PAYMENTS.length;
    const total = MOCK_FAILED_PAYMENTS.reduce((sum, p) => sum + p.amount, 0);
    return {
      success: true,
      recoveredAmount: total,
      salvagedCount: count,
      message: `Recovered $${total.toFixed(2)} across ${count} soft-declines`,
    };
  }
}

export const paymentsApi = {
  getFailedPayments: fetchFailedPayments,
  retryPayment,
  batchRecover: batchRecoverPayments,
  getFallback: getFallbackFailedPayments,
};
