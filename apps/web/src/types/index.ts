export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface AnalyticsMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalTransactions: number;
  averageOrderValue: number;
  conversionRate: number;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "success" | "failed" | "pending" | "processing";
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FraudAlert {
  id: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  description: string;
  amount: number;
  transactionId: string;
  createdAt: Date;
  resolved: boolean;
}

export interface CashFlowForecast {
  date: Date;
  inflow: number;
  outflow: number;
  balance: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface DashboardStats {
  revenue: number;
  revenueChange: number;
  failedPayments: number;
  failedPaymentsChange: number;
  fraudAlerts: number;
  fraudAlertsChange: number;
  cashFlow: number;
  cashFlowChange: number;
}