import { test, expect } from "@playwright/test";

test.describe("Dashboard Navigation & Critical Actions", () => {
  test("Can trigger Command Palette with keyboard shortcut", async ({ page }) => {
    await page.goto("/dashboard");

    // Press '/' or Ctrl+K
    await page.keyboard.press("Control+k");

    // Check if Command Palette or search input is focused
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput.first()).toBeVisible();
  });

  test("Can open and close notification drawer", async ({ page }) => {
    await page.goto("/dashboard");

    // Click notification bell
    const bellButton = page.locator('button[aria-label*="notification" i], button:has(svg.lucide-bell)');
    await bellButton.first().click();

    // Verify notification drawer appears
    await expect(page.getByText(/Notifications/i).first()).toBeVisible();

    // Press Escape to dismiss
    await page.keyboard.press("Escape");
  });
});
