export const APP_NAME = "OpsMind";
export const APP_DESCRIPTION = "AI Operating System for Modern Merchants";

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  ANALYTICS: "/analytics",
  PAYMENTS: "/payments",
  FRAUD: "/fraud",
  CASHFLOW: "/cashflow",
  COPILOT: "/copilot",
  SETTINGS: "/settings",
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REGISTER: "/api/auth/register",
  },
  ANALYTICS: {
    REVENUE: "/api/analytics/revenue",
    METRICS: "/api/analytics/metrics",
  },
  PAYMENTS: {
    LIST: "/api/payments",
    FAILED: "/api/payments/failed",
    RECOVER: "/api/payments/recover",
  },
  FRAUD: {
    DETECT: "/api/fraud/detect",
    ALERTS: "/api/fraud/alerts",
  },
  CASHFLOW: {
    FORECAST: "/api/cashflow/forecast",
    HISTORY: "/api/cashflow/history",
  },
  COPILOT: {
    CHAT: "/api/copilot/chat",
    QUERY: "/api/copilot/query",
  },
} as const;

export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
} as const;

export const DATE_RANGES = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  LAST_7_DAYS: "last_7_days",
  LAST_30_DAYS: "last_30_days",
  LAST_90_DAYS: "last_90_days",
  THIS_MONTH: "this_month",
  LAST_MONTH: "last_month",
  THIS_YEAR: "this_year",
  CUSTOM: "custom",
} as const;

export const PAYMENT_STATUS = {
  SUCCESS: "success",
  FAILED: "failed",
  PENDING: "pending",
  PROCESSING: "processing",
} as const;

export const FRAUD_RISK_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;