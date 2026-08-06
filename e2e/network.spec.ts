import { test, expect } from "@playwright/test";

/** Comet scenario S13 — Option C Network page */
test.describe("Network page E2E", () => {
  test("S13 network page loads; balances gated; lab CSP offline", async ({ page }) => {
    await page.goto("/network.html");
    await expect(page.getByRole("heading", { name: /Network/i })).toBeVisible();
    await expect(page.locator("#btnFetchBal")).toBeDisabled();
    await expect(page.locator("#btnLoadLab")).toBeDisabled();

    await page.locator("#balAck").check();
    await expect(page.locator("#btnFetchBal")).toBeEnabled();
    await expect(page.locator("#btnLoadLab")).toBeEnabled();

    // Lab remains offline CSP
    await page.goto("/");
    const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
    expect(csp || "").toContain("connect-src 'none'");
    await expect(page.locator('.nav-item[data-nav="network"]')).toBeVisible();
  });

  test("S13b fee snapshot fetch (live API)", async ({ page }) => {
    await page.goto("/network.html");
    await page.locator("#btnFetchSnap").click();
    await expect(page.locator("#snapResult")).toBeVisible({ timeout: 30_000 });
    await expect(page.locator("#feeOut")).toContainText(/sat\/vB|fastest/i);
    await expect(page.locator("#trafficOut")).toContainText(/Tip|height|Mempool/i);
    await expect(page.locator("#snapStatus")).toContainText(/OK|ok|Snapshot/i);
  });
});
