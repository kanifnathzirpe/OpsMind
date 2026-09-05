import { describe, it, expect } from "vitest";
import { UserRole } from "@/types/auth";

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

function hasPermission(role: UserRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
}

describe("Role Based Access Control (RBAC) Test Suite", () => {
  it("Admin should have comprehensive system management permissions", () => {
    expect(hasPermission("Admin", "dashboard:view")).toBe(true);
    expect(hasPermission("Admin", "orders:manage")).toBe(true);
    expect(hasPermission("Admin", "fraud:manage")).toBe(true);
    expect(hasPermission("Admin", "settings:manage")).toBe(true);
    expect(hasPermission("Admin", "billing:manage")).toBe(true);
    expect(hasPermission("Admin", "keys:manage")).toBe(true);
  });

  it("Analyst should have analytics & forecast permissions, but NO settings or key management", () => {
    expect(hasPermission("Analyst", "revenue:view")).toBe(true);
    expect(hasPermission("Analyst", "forecast:view")).toBe(true);
    expect(hasPermission("Analyst", "copilot:use")).toBe(true);
    expect(hasPermission("Analyst", "settings:manage")).toBe(false);
    expect(hasPermission("Analyst", "keys:manage")).toBe(false);
    expect(hasPermission("Analyst", "team:manage")).toBe(false);
  });

  it("Support should have orders:manage and payments:retry, but NO billing or settings access", () => {
    expect(hasPermission("Support", "orders:manage")).toBe(true);
    expect(hasPermission("Support", "payments:retry")).toBe(true);
    expect(hasPermission("Support", "customers:view")).toBe(true);
    expect(hasPermission("Support", "settings:manage")).toBe(false);
    expect(hasPermission("Support", "billing:manage")).toBe(false);
  });

  it("Viewer should be strictly read-only and restricted from all management operations", () => {
    expect(hasPermission("Viewer", "dashboard:view")).toBe(true);
    expect(hasPermission("Viewer", "orders:view")).toBe(true);
    expect(hasPermission("Viewer", "orders:manage")).toBe(false);
    expect(hasPermission("Viewer", "fraud:manage")).toBe(false);
    expect(hasPermission("Viewer", "payments:retry")).toBe(false);
    expect(hasPermission("Viewer", "settings:manage")).toBe(false);
  });
});
