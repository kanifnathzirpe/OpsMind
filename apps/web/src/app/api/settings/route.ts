import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api";

// In-memory backend storage for settings
let storedSettings = {
  workspace: {
    id: "m_1",
    name: "Acme Global Direct",
    currency: "USD",
    currencySymbol: "$",
    region: "North America (USD)",
    gateway: "Stripe US",
    theme: "dark",
  },
  notifications: {
    emailAlerts: true,
    slackWebhook: "https://hooks.slack.com/services/T00/B00/XXXXX",
    weeklyDigest: true,
    fraudThreshold: 75,
    failedPaymentAlerts: true,
    pushNotifications: true,
  },
  theme: "dark" as "dark" | "light",
  profile: {
    name: "Alex Vance",
    email: "alex.vance@opsmind.enterprise",
    title: "Lead Operations Engineer",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  apiKeys: [
    {
      id: "key_prod_01",
      name: "Autonomous Sentinel Worker",
      prefix: "ops_live_sec_...",
      lastUsed: "Just now",
      createdAt: "2024-01-15",
      permissions: ["read", "write", "intercept"],
    },
    {
      id: "key_dev_02",
      name: "Stripe Webhook Ingestion Rail",
      prefix: "ops_live_whk_...",
      lastUsed: "2 mins ago",
      createdAt: "2024-02-01",
      permissions: ["write"],
    },
  ],
  security: {
    mfaEnabled: true,
    sessionTimeoutMinutes: 30,
    ipAllowlist: ["192.168.1.0/24", "10.0.0.0/16"],
    enforceSso: false,
  },
  organization: {
    name: "OpsMind Global Holdings",
    slug: "opsmind-global",
    domain: "opsmind.enterprise",
    billingTier: "Enterprise Autonomous (Custom Rail)",
    taxId: "US-EIN-94-8291041",
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section && section in storedSettings) {
      return successResponse(storedSettings[section as keyof typeof storedSettings]);
    }

    return successResponse(storedSettings);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to retrieve settings", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return errorResponse("Invalid settings payload", 400);
    }

    storedSettings = {
      ...storedSettings,
      ...body,
      workspace: {
        ...storedSettings.workspace,
        ...(body.workspace || {}),
      },
      notifications: {
        ...storedSettings.notifications,
        ...(body.notifications || {}),
      },
      profile: {
        ...storedSettings.profile,
        ...(body.profile || {}),
      },
      security: {
        ...storedSettings.security,
        ...(body.security || {}),
      },
      organization: {
        ...storedSettings.organization,
        ...(body.organization || {}),
      },
    };

    return successResponse(storedSettings);
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to persist settings", 500);
  }
}
