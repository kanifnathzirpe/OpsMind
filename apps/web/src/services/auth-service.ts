import { User, Organization } from "@/types/auth";
import { mockFetch } from "@/lib/api/client";

export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "org-acme",
    name: "Acme Global Markets",
    slug: "acme-global",
    plan: "Enterprise Autonomous",
    currency: "USD",
    currencySymbol: "$",
    multiplier: 1.0,
    seatsUsed: 14,
    seatsTotal: 25,
    logoColor: "from-blue-500 to-indigo-600",
  },
  {
    id: "org-hyperscale",
    name: "HyperScale Commerce",
    slug: "hyperscale",
    plan: "Enterprise Autonomous",
    currency: "EUR",
    currencySymbol: "€",
    multiplier: 0.92,
    seatsUsed: 22,
    seatsTotal: 30,
    logoColor: "from-emerald-500 to-teal-600",
  },
  {
    id: "org-northwind",
    name: "Northwind Logistics & Pay",
    slug: "northwind",
    plan: "Scale",
    currency: "GBP",
    currencySymbol: "£",
    multiplier: 0.79,
    seatsUsed: 8,
    seatsTotal: 15,
    logoColor: "from-amber-500 to-orange-600",
  },
  {
    id: "org-demo",
    name: "Demo Merchant Labs",
    slug: "demo-merchant",
    plan: "Starter",
    currency: "USD",
    currencySymbol: "$",
    multiplier: 0.45,
    seatsUsed: 3,
    seatsTotal: 5,
    logoColor: "from-purple-500 to-violet-600",
  },
];

export const DEFAULT_USER: User = {
  id: "usr_ops_9821a",
  name: "Alex Vance",
  email: "alex.vance@opsmind.enterprise",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "Admin",
  organizationId: "org-acme",
  createdAt: "2024-01-15T08:00:00Z",
};

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password?: string;
  companyName?: string;
}

export interface AuthSession {
  user: User;
  organization: Organization;
  organizations: Organization[];
  token: string;
  expiresAt: string;
}

export class AuthService {
  private static STORAGE_KEY = "opsmind_auth_session";

  static getSavedSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as AuthSession;
    } catch {
      return null;
    }
  }

  static saveSession(session: AuthSession): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
      // Also write cookie for Next.js middleware protection
      document.cookie = `opsmind_session=${session.token}; path=/; max-age=604800; SameSite=Lax`;
    } catch (e) {
      console.error("Failed to save auth session:", e);
    }
  }

  static clearSession(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      document.cookie = "opsmind_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (e) {
      console.error("Failed to clear auth session:", e);
    }
  }

  static async login(credentials: LoginCredentials): Promise<AuthSession> {
    const org = MOCK_ORGANIZATIONS[0];
    const user: User = {
      ...DEFAULT_USER,
      email: credentials.email || DEFAULT_USER.email,
    };

    const session: AuthSession = {
      user,
      organization: org,
      organizations: MOCK_ORGANIZATIONS,
      token: `ops_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const res = await mockFetch(session, 300);
    this.saveSession(res.data);
    return res.data;
  }

  static async signup(data: SignupData): Promise<AuthSession> {
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: data.companyName || "My Store",
      slug: (data.companyName || "my-store").toLowerCase().replace(/\s+/g, "-"),
      plan: "Enterprise Autonomous",
      currency: "USD",
      currencySymbol: "$",
      multiplier: 1.0,
      seatsUsed: 1,
      seatsTotal: 10,
      logoColor: "from-blue-600 to-indigo-600",
    };

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: "Admin",
      organizationId: newOrg.id,
      createdAt: new Date().toISOString(),
    };

    const session: AuthSession = {
      user: newUser,
      organization: newOrg,
      organizations: [newOrg, ...MOCK_ORGANIZATIONS],
      token: `ops_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const res = await mockFetch(session, 350);
    this.saveSession(res.data);
    return res.data;
  }

  static async logout(): Promise<void> {
    await mockFetch(true, 150);
    this.clearSession();
  }

  static async switchOrganization(orgId: string): Promise<AuthSession> {
    const current = this.getSavedSession();
    const targetOrg = MOCK_ORGANIZATIONS.find((o) => o.id === orgId) || MOCK_ORGANIZATIONS[0];

    const updatedSession: AuthSession = current
      ? {
          ...current,
          organization: targetOrg,
        }
      : {
          user: DEFAULT_USER,
          organization: targetOrg,
          organizations: MOCK_ORGANIZATIONS,
          token: `ops_jwt_${Date.now()}`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };

    const res = await mockFetch(updatedSession, 200);
    this.saveSession(res.data);
    return res.data;
  }

  static async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return (
      await mockFetch(
        {
          success: true,
          message: `Password reset instructions dispatched to ${email}`,
        },
        300
      )
    ).data;
  }

  static async resetPassword(newPassword: string): Promise<{ success: boolean }> {
    if (!newPassword || newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    return (await mockFetch({ success: true }, 300)).data;
  }

  static async verifyEmail(code: string): Promise<{ success: boolean }> {
    if (!code || code.length < 4) {
      throw new Error("Invalid verification code");
    }
    return (await mockFetch({ success: true }, 250)).data;
  }

  static async refreshToken(): Promise<AuthSession | null> {
    const current = this.getSavedSession();
    if (!current) return null;
    const refreshedSession: AuthSession = {
      ...current,
      token: `ops_jwt_refreshed_${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    this.saveSession(refreshedSession);
    return (await mockFetch(refreshedSession, 150)).data;
  }

  static async updateUserAvatar(avatarUrl: string): Promise<AuthSession | null> {
    const current = this.getSavedSession();
    if (!current) return null;
    const updatedSession: AuthSession = {
      ...current,
      user: {
        ...current.user,
        avatar: avatarUrl,
      },
    };
    this.saveSession(updatedSession);
    return (await mockFetch(updatedSession, 150)).data;
  }
}
