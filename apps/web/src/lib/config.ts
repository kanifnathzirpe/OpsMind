/**
 * Application environment configuration helper
 * Centralizes access to environment variables with sane fallbacks
 */

export interface AppConfig {
  apiUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
  appName: string;
  apiTimeoutMs: number;
  apiRetryCount: number;
}

export function getConfig(): AppConfig {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const nodeEnv = process.env.NODE_ENV || "development";

  return {
    apiUrl,
    isProduction: nodeEnv === "production",
    isDevelopment: nodeEnv === "development",
    appName: "OpsMind",
    apiTimeoutMs: 8000,
    apiRetryCount: 2,
  };
}

export const config = getConfig();
