import { apiClient } from "./api-client";

export interface EnterpriseSettings {
  workspace: {
    id: string;
    name: string;
    currency: string;
    currencySymbol: string;
    region?: string;
    gateway?: string;
    theme?: string;
  };
  notifications: {
    emailAlerts: boolean;
    slackWebhook: string;
    weeklyDigest: boolean;
    fraudThreshold: number;
    failedPaymentAlerts: boolean;
    pushNotifications: boolean;
  };
  theme: "dark" | "light";
  profile: {
    name: string;
    email: string;
    title: string;
    role: string;
    avatar: string;
  };
  apiKeys?: Array<{
    id: string;
    name: string;
    prefix: string;
    lastUsed: string;
    createdAt: string;
    permissions: string[];
  }>;
}

export async function fetchSettings(signal?: AbortSignal): Promise<EnterpriseSettings> {
  const res = await apiClient.get<EnterpriseSettings>("/api/settings", { signal });
  return res.data;
}

export async function updateSettings(
  settings: Partial<EnterpriseSettings>,
  signal?: AbortSignal
): Promise<EnterpriseSettings> {
  const res = await apiClient.post<EnterpriseSettings>("/api/settings", settings, { signal });
  return res.data;
}

export const settingsApi = {
  getSettings: fetchSettings,
  updateSettings,
};
