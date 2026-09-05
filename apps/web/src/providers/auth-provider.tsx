"use client";

import * as React from "react";
import { User, Organization, UserRole } from "@/types/auth";
import {
  AuthService,
  AuthSession,
  LoginCredentials,
  SignupData,
  MOCK_ORGANIZATIONS,
  DEFAULT_USER,
} from "@/services/auth-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  organizations: Organization[];
  role: UserRole | null;
  permissions: string[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials, redirectUrl?: string) => Promise<void>;
  signup: (data: SignupData, redirectUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Admin: [
    "dashboard:view",
    "revenue:view",
    "forecast:view",
    "orders:view",
    "orders:manage",
    "fraud:view",
    "fraud:manage",
    "payments:view",
    "payments:retry",
    "customers:view",
    "copilot:use",
    "settings:manage",
    "billing:manage",
    "team:manage",
    "keys:manage",
  ],
  Analyst: [
    "dashboard:view",
    "revenue:view",
    "forecast:view",
    "orders:view",
    "fraud:view",
    "payments:view",
    "copilot:use",
  ],
  Support: [
    "dashboard:view",
    "orders:view",
    "orders:manage",
    "customers:view",
    "fraud:view",
    "payments:view",
    "payments:retry",
    "copilot:use",
  ],
  Viewer: [
    "dashboard:view",
    "orders:view",
    "revenue:view",
    "forecast:view",
  ],
  Developer: [
    "dashboard:view",
    "orders:view",
    "fraud:view",
    "payments:retry",
    "keys:manage",
    "webhooks:manage",
  ],
  Finance: [
    "dashboard:view",
    "orders:manage",
    "forecast:view",
    "billing:manage",
    "settlements:view",
  ],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = React.useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Initialize session from storage / default demo session
  React.useEffect(() => {
    try {
      const saved = AuthService.getSavedSession();
      if (saved) {
        setTimeout(() => setSession(saved), 0);
      } else {
        // Default authenticated demo session so first-time build/demo immediately works
        const defaultSession: AuthSession = {
          user: DEFAULT_USER,
          organization: MOCK_ORGANIZATIONS[0],
          organizations: MOCK_ORGANIZATIONS,
          token: "ops_jwt_demo_default",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        AuthService.saveSession(defaultSession);
        setTimeout(() => setSession(defaultSession), 0);
      }
    } catch (err) {
      console.error("Auth init error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials, redirectUrl: string = "/dashboard") => {
    setIsLoading(true);
    try {
      const newSession = await AuthService.login(credentials);
      setSession(newSession);
      toast.success(`Welcome back, ${newSession.user.name}`);
      router.push(redirectUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData, redirectUrl: string = "/dashboard") => {
    setIsLoading(true);
    try {
      const newSession = await AuthService.signup(data);
      setSession(newSession);
      toast.success(`Workspace initialized for ${newSession.organization.name}`);
      router.push(redirectUrl);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create account");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setSession(null);
      toast.info("Signed out of session");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    const saved = AuthService.getSavedSession();
    if (saved) {
      setSession(saved);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshed = await AuthService.refreshToken();
      if (refreshed) {
        setSession(refreshed);
        toast.success("Security token refreshed successfully");
      }
    } catch {
      toast.error("Failed to refresh session token");
    }
  };

  const updateUserAvatar = async (avatarUrl: string) => {
    try {
      const updated = await AuthService.updateUserAvatar(avatarUrl);
      if (updated) {
        setSession(updated);
        toast.success("Avatar updated successfully");
      }
    } catch {
      toast.error("Failed to update avatar");
    }
  };

  const switchOrganization = async (orgId: string) => {
    try {
      const updated = await AuthService.switchOrganization(orgId);
      setSession(updated);
      toast.success(`Switched active workspace: ${updated.organization.name}`);
    } catch (err) {
      toast.error("Failed to switch workspace");
      console.error(err);
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (!session) return;
    const updated: AuthSession = {
      ...session,
      user: {
        ...session.user,
        role: newRole,
      },
    };
    AuthService.saveSession(updated);
    setSession(updated);
    toast.info(`Switched role to ${newRole}`);
  };

  const role = session?.user?.role || null;
  const permissions = role ? ROLE_PERMISSIONS[role] || [] : [];

  const value: AuthContextType = {
    user: session?.user || null,
    organization: session?.organization || null,
    organizations: session?.organizations || MOCK_ORGANIZATIONS,
    role,
    permissions,
    token: session?.token || null,
    isAuthenticated: !!session?.token,
    isLoading,
    login,
    signup,
    logout,
    refresh,
    refreshToken,
    updateUserAvatar,
    switchOrganization,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
