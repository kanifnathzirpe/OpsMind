export type UserRole = "Admin" | "Analyst" | "Support" | "Viewer" | "Developer" | "Finance";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  organizationId: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "Starter" | "Scale" | "Enterprise Autonomous";
  currency: string;
  currencySymbol: string;
  multiplier: number;
  seatsUsed: number;
  seatsTotal: number;
  logoColor: string;
}

export type MemberStatus = "Active" | "Pending" | "Suspended";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: MemberStatus;
  avatar?: string;
  lastActive: string;
  invitedAt?: string;
}

export type ApiKeyPermission =
  | "read:analytics"
  | "write:firewall"
  | "write:retries"
  | "admin:billing"
  | "read:ledger";

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  keyMasked: string;
  permissions: ApiKeyPermission[];
  lastUsed: string;
  createdAt: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  description: string;
  events: string[];
  status: "active" | "failing" | "disabled";
  secretMasked: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Void";
  pdfUrl: string;
}

export interface BillingInfo {
  planName: string;
  planPrice: number;
  billingCycle: "monthly" | "annually";
  renewsOn: string;
  paymentMethod: {
    brand: "visa" | "mastercard" | "amex";
    last4: string;
    expMonth: number;
    expYear: number;
    holderName: string;
  };
  usage: {
    aiTokensUsed: number;
    aiTokensLimit: number;
    apiCallsUsed: number;
    apiCallsLimit: number;
    rulesActive: number;
    rulesLimit: number;
  };
  invoices: Invoice[];
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  current: boolean;
  lastActive: string;
}

export interface NotificationPreferences {
  fraudAlerts: boolean;
  paymentRecovery: boolean;
  emailDigest: boolean;
  slackAlerts: boolean;
  smsEscalations: boolean;
  webhookTriggers: boolean;
  browserPush: boolean;
}
