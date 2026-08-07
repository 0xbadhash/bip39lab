import { test, expect } from "@playwright/test";

/** Public abandon BIP84 idx0 — address only (never a seed on this page). */
const ADDR84 = "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu";
const ABANDON =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

/** Comet scenarios S13 / S13b / S13c — Option C Network page */
test.describe("Network page E2E", () => {
  test("S13 network page loads; balances gated; lab CSP offline; nav=5", async ({ page }) => {
    await page.goto("/network.html");
    await expect(page.getByRole("heading", { name: /Network/i })).toBeVisible();
    await expect(page.locator("body")).toContainText(/mempool\.space/i);

    // Network CSP: same-origin proxy and/or direct mempool.space (never offline-only)
    const netCsp =
      (await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content")) ||
      "";
    expect(netCsp).toMatch(/connect-src[^;]*('self'|mempool\.space)/);
    expect(netCsp).not.toMatch(/connect-src\s+'none'/);

    await expect(page.locator(".nav-item[data-nav]")).toHaveCount(6);
    await expect(page.locator('.nav-item[data-nav="network"]')).toHaveClass(/active/);
    await expect(page.locator('.nav-item[data-nav="tools"]')).toBeVisible();

    await expect(page.locator("#btnFetchBal")).toBeDisabled();
    await expect(page.locator("#btnLoadLab")).toBeDisabled();

    await page.locator("#balAck").check();
    await expect(page.locator("#btnFetchBal")).toBeEnabled();
    await expect(page.locator("#btnLoadLab")).toBeEnabled();

    // Lab remains offline CSP
    await page.goto("/");
    const labCsp =
      (await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content")) ||
      "";
    expect(labCsp).toContain("connect-src 'none'");
    await expect(page.locator('.nav-item[data-nav="network"]')).toBeVisible();
    await expect(page.locator(".nav-item[data-nav]")).toHaveCount(6);
  });

  test("S13b fee snapshot fetch (live API)", async ({ page }) => {
    await page.goto("/network.html");
    // Result panel must start collapsed (hidden attribute respected in CSS)
    await expect(page.locator("#snapResult")).toBeHidden();
    await page.locator("#btnFetchSnap").click();
    // Wait on content / status — not merely panel visibility (flaky if CSS ignores [hidden])
    await expect(page.locator("#snapStatus")).toContainText(/OK|ok|Snapshot|failed|unavailable/i, {
      timeout: 30_000,
    });
    await expect(page.locator("#snapResult")).toBeVisible();
    await expect(page.locator("#feeOut")).toContainText(/sat\/vB|fastest/i);
    await expect(page.locator("#trafficOut")).toContainText(/Tip|height|Mempool/i);
    await expect(page.locator("#snapStatus")).toContainText(/OK|ok|Snapshot/i);
    await expect(page.locator("#feeExample")).toContainText(/vB|sats/i);
    await expect(page.locator("#feeBands")).toContainText(/sat\/vB|fastest|½|hour/i);
  });

  test("S13c balances ack; address fetch; reject mnemonic as addresses", async ({ page }) => {
    await page.goto("/network.html");

    // Mnemonic must not be treated as address list
    await page.locator("#balAck").check();
    await page.locator("#balAddrs").fill(ABANDON);
    await page.locator("#btnFetchBal").click();
    await expect(page.locator("#balStatus")).toContainText(/address|seed|phrase|Add at least/i);

    // Valid address path (live API — fail-closed if API down)
    await page.locator("#balAddrs").fill(ADDR84);
    await page.locator("#btnFetchBal").click();
    await expect
      .poll(async () => page.locator("#balTableBody tr:not(.empty-row)").count(), {
        timeout: 30_000,
      })
      .toBeGreaterThanOrEqual(1);
    await expect(page.locator("#balTableBody")).toContainText(ADDR84);
    // Status column: ok or unknown — never invent success zeros on hard failure without a status
    const rowText = await page.locator("#balTableBody tr").first().innerText();
    expect(rowText).toMatch(/ok|unknown|error/i);
    await expect(page.locator("#balStatus")).toContainText(/Done|ok|unknown/i);
  });

  test("S13d Lab session bridge loads addresses after derive", async ({ page }) => {
    // Derive on Lab first (same browser context → sessionStorage)
    await page.goto("/");
    await page.locator("#mnemonic").fill(ABANDON);
    await page.waitForTimeout(500);
    await expect
      .poll(async () => page.locator("#addrTableBody tr:not(.empty-row)").count(), {
        timeout: 15_000,
      })
      .toBeGreaterThanOrEqual(1);

    await page.goto("/network.html");
    await page.locator("#balAck").check();
    await page.locator("#btnLoadLab").click();
    const addrs = await page.locator("#balAddrs").inputValue();
    expect(addrs.length).toBeGreaterThan(10);
    expect(addrs).toMatch(/bc1/i);
    expect(addrs.toLowerCase()).not.toContain("abandon");
    await expect(page.locator("#balStatus")).toContainText(/Loaded|address/i);
  });
});
