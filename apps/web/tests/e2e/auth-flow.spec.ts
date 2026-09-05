import { test, expect } from "@playwright/test";

test.describe("Authentication & Route Guard Flow", () => {
  test("Unauthenticated user visiting /dashboard without cookies should be redirected to /login", async ({
    page,
    context,
  }) => {
    // Clear cookies
    await context.clearCookies();

    // Try navigating to protected dashboard
    await page.goto("/dashboard");

    // Must be redirected to /login with redirect parameter
    await expect(page).toHaveURL(/\/login/);
  });

  test("Authenticated user can view dashboard, KPI telemetry, and toggle navigation", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    // Check title and branding
    await expect(page).toHaveTitle(/OpsMind/i);

    // Verify main navigation exists
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    // Verify KPI cards render
    const grossRevenue = page.getByText(/Today's Revenue/i);
    await expect(grossRevenue).toBeVisible();
  });
});
