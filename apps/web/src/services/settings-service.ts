import { mockFetch } from "@/lib/api/client";
import {
  TeamMember,
  ApiKey,
  WebhookEndpoint,
  BillingInfo,
  ActiveSession,
  NotificationPreferences,
  UserRole,
} from "@/types/auth";

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "mem_1",
    name: "Alex Vance",
    email: "alex.vance@opsmind.enterprise",
    role: "Admin",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    lastActive: "Just now",
  },
  {
    id: "mem_2",
    name: "Sarah Chen",
    email: "sarah.chen@opsmind.enterprise",
    role: "Developer",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    lastActive: "14 mins ago",
  },
  {
    id: "mem_3",
    name: "Marcus Thorne",
    email: "m.thorne@opsmind.enterprise",
    role: "Finance",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    lastActive: "2 hours ago",
  },
  {
    id: "mem_4",
    name: "Elena Rostova",
    email: "elena.r@opsmind.enterprise",
    role: "Support",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    lastActive: "Yesterday",
  },
  {
    id: "mem_5",
    name: "Liam O'Connor",
    email: "liam.oc@partner-payments.io",
    role: "Viewer",
    status: "Pending",
    invitedAt: "2 days ago",
    lastActive: "Never",
  },
];

export const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: "key_prod_01",
    name: "Production Gateway Ingestion",
    prefix: "ops_live_99a",
    keyMasked: "ops_live_99a8************************3f9c",
    permissions: ["read:analytics", "write:firewall", "write:retries"],
    lastUsed: "2 mins ago",
    createdAt: "2024-02-10T12:00:00Z",
  },
  {
    id: "key_ci_02",
    name: "CI/CD Auto-Dunning Bot",
    prefix: "ops_live_41b",
    keyMasked: "ops_live_41b4************************881e",
    permissions: ["read:analytics", "write:retries"],
    lastUsed: "1 hour ago",
    createdAt: "2024-03-01T09:30:00Z",
  },
  {
    id: "key_test_03",
    name: "Staging Read-Only Sandbox",
    prefix: "ops_test_12x",
    keyMasked: "ops_test_12x0************************44ab",
    permissions: ["read:analytics", "read:ledger"],
    lastUsed: "Yesterday",
    createdAt: "2024-04-15T15:00:00Z",
  },
];

export const INITIAL_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: "wh_1",
    url: "https://api.merchant.com/v1/webhooks/opsmind",
    description: "Primary ERP ledger sync & fraud quarantine callback",
    events: ["fraud.detected", "payment.recovered", "settlement.completed"],
    status: "active",
    secretMasked: "whsec_99a**********************f1",
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "wh_2",
    url: "https://hooks.slack.com/services/T00/B00/XXXX",
    description: "Ops Incident Alert Room webhook",
    events: ["fraud.critical", "gateway.down"],
    status: "active",
    secretMasked: "whsec_33c**********************89",
    createdAt: "2024-02-14T11:20:00Z",
  },
];

export const INITIAL_BILLING: BillingInfo = {
  planName: "Enterprise Autonomous",
  planPrice: 2499,
  billingCycle: "monthly",
  renewsOn: "October 1, 2026",
  paymentMethod: {
    brand: "visa",
    last4: "4242",
    expMonth: 8,
    expYear: 2028,
    holderName: "Alex Vance (OpsMind Inc.)",
  },
  usage: {
    aiTokensUsed: 1420800,
    aiTokensLimit: 5000000,
    apiCallsUsed: 894210,
    apiCallsLimit: 2000000,
    rulesActive: 48,
    rulesLimit: 100,
  },
  invoices: [
    {
      id: "inv_2026_09",
      number: "INV-OPS-2026-09",
      date: "Sep 1, 2026",
      amount: 2499,
      status: "Paid",
      pdfUrl: "#",
    },
    {
      id: "inv_2026_08",
      number: "INV-OPS-2026-08",
      date: "Aug 1, 2026",
      amount: 2499,
      status: "Paid",
      pdfUrl: "#",
    },
    {
      id: "inv_2026_07",
      number: "INV-OPS-2026-07",
      date: "Jul 1, 2026",
      amount: 2499,
      status: "Paid",
      pdfUrl: "#",
    },
  ],
};

export const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: "sess_curr",
    device: "MacBook Pro 16-inch (Apple Silicon)",
    browser: "Chrome 128.0 (macOS)",
    ip: "192.0.2.45 (San Francisco, CA)",
    location: "United States",
    current: true,
    lastActive: "Active now",
  },
  {
    id: "sess_mobile",
    device: "iPhone 16 Pro",
    browser: "Safari Mobile 18.0",
    ip: "198.51.100.12 (New York, NY)",
    location: "United States",
    current: false,
    lastActive: "2 hours ago",
  },
  {
    id: "sess_office",
    device: "Workstation ThinkStation P620",
    browser: "Edge 128.0 (Windows 11)",
    ip: "203.0.113.88 (Austin, TX)",
    location: "United States",
    current: false,
    lastActive: "3 days ago",
  },
];

export const INITIAL_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  fraudAlerts: true,
  paymentRecovery: true,
  emailDigest: true,
  slackAlerts: true,
  smsEscalations: false,
  webhookTriggers: true,
  browserPush: true,
};

let teamMembersState = [...INITIAL_TEAM_MEMBERS];
let apiKeysState = [...INITIAL_API_KEYS];
const webhooksState = [...INITIAL_WEBHOOKS];
let sessionsState = [...INITIAL_SESSIONS];
let notifPrefsState = { ...INITIAL_NOTIFICATION_PREFERENCES };

export class SettingsService {
  static async getTeamMembers(orgId?: string): Promise<TeamMember[]> {
    const list = orgId ? teamMembersState.filter(() => true) : teamMembersState;
    return (await mockFetch([...list], 180)).data;
  }

  static async inviteMember(
    data: { name: string; email: string; role: UserRole }
  ): Promise<TeamMember> {
    const newMember: TeamMember = {
      id: `mem_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: "Pending",
      invitedAt: "Just now",
      lastActive: "Never",
    };
    teamMembersState = [newMember, ...teamMembersState];
    return (await mockFetch(newMember, 250)).data;
  }

  static async removeMember(id: string): Promise<{ success: boolean }> {
    teamMembersState = teamMembersState.filter((m) => m.id !== id);
    return (await mockFetch({ success: true }, 200)).data;
  }

  static async getApiKeys(orgId?: string): Promise<ApiKey[]> {
    const list = orgId ? apiKeysState.filter(() => true) : apiKeysState;
    return (await mockFetch([...list], 180)).data;
  }

  static async createApiKey(data: {
    name: string;
    permissions: ApiKey["permissions"];
  }): Promise<{ key: ApiKey; secret: string }> {
    const randomHex = Math.random().toString(36).substring(2, 10);
    const fullSecret = `ops_live_${randomHex}_${Math.random().toString(36).substring(2, 14)}`;
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: data.name,
      prefix: fullSecret.substring(0, 12),
      keyMasked: `${fullSecret.substring(0, 12)}************************${fullSecret.slice(-4)}`,
      permissions: data.permissions,
      lastUsed: "Never",
      createdAt: new Date().toISOString(),
    };
    apiKeysState = [newKey, ...apiKeysState];
    return (await mockFetch({ key: newKey, secret: fullSecret }, 250)).data;
  }

  static async revokeApiKey(id: string): Promise<{ success: boolean }> {
    apiKeysState = apiKeysState.filter((k) => k.id !== id);
    return (await mockFetch({ success: true }, 200)).data;
  }

  static async getWebhooks(orgId?: string): Promise<WebhookEndpoint[]> {
    const list = orgId ? webhooksState.filter(() => true) : webhooksState;
    return (await mockFetch([...list], 180)).data;
  }

  static async getBillingInfo(orgId?: string): Promise<BillingInfo> {
    const billing = orgId ? { ...INITIAL_BILLING } : INITIAL_BILLING;
    return (await mockFetch(billing, 200)).data;
  }

  static async getActiveSessions(): Promise<ActiveSession[]> {
    return (await mockFetch([...sessionsState], 180)).data;
  }

  static async terminateSession(id: string): Promise<{ success: boolean }> {
    sessionsState = sessionsState.filter((s) => s.id !== id);
    return (await mockFetch({ success: true }, 200)).data;
  }

  static async getNotificationPreferences(): Promise<NotificationPreferences> {
    return (await mockFetch({ ...notifPrefsState }, 150)).data;
  }

  static async updateNotificationPreferences(
    prefs: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    notifPrefsState = { ...notifPrefsState, ...prefs };
    return (await mockFetch({ ...notifPrefsState }, 150)).data;
  }

  static async saveSettings(payload: Record<string, unknown>): Promise<{ success: boolean }> {
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch {
      return { success: true };
    }
  }
}
