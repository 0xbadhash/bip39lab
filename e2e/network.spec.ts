import { test, expect } from "@playwright/test";
import { ABANDON, GOLDEN, expectNavCount, labCspOffline, pasteMnemonic, waitForTableRows } from "./helpers";

test.describe("Network page E2E", () => {
  test("S32 shell · 6-nav · mempool CSP · balances gated", async ({ page }) => {
    await page.goto("/network.html");
    await expect(page.getByRole("heading", { name: /Network/i })).toBeVisible();
    await expect(page.locator("body")).toContainText(/mempool/i);
    await expectNavCount(page);
    await expect(page.locator('.nav-item[data-nav="network"]')).toHaveClass(/active/);
    await expect(page.locator('.nav-item[data-nav="tools"]')).toBeVisible();

    const netCsp =
      (await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content")) ||
      "";
    expect(netCsp).toMatch(/connect-src[^;]*('self'|mempool\.space)/);
    expect(netCsp).not.toMatch(/connect-src\s+'none'/);

    await expect(page.locator("#balAck").locator("xpath=..")).toContainText(/mempool proxy/i);
    await expect(page.locator("#balAck").locator("xpath=..")).toContainText(/mempool\.space/i);
    await expect(page.locator("#btnFetchBal")).toBeDisabled();
    await expect(page.locator("#btnLoadLab")).toBeDisabled();
    // Visible gate: hint present while disabled
    await expect(page.locator("#balGateHint")).toBeVisible();
    await page.locator("#balAck").check();
    await expect(page.locator("#btnFetchBal")).toBeEnabled();
    await expect(page.locator("#btnLoadLab")).toBeEnabled();
    await expect(page.locator("#balGateHint")).toBeHidden();

    await expect(page.locator("#netCardBal")).toContainText(/Private balance via CLI|knots|mempool/i);

    await page.goto("/");
    await labCspOffline(page);
    await expectNavCount(page);
  });

  test("S13b fee snapshot + bands + traffic", async ({ page }) => {
    await page.goto("/network.html");
    await expect(page.locator("#snapResult")).toBeHidden();
    await page.locator("#btnFetchSnap").click();
    await expect(page.locator("#snapStatus")).toContainText(/OK|ok|Snapshot|failed|unavailable/i, {
      timeout: 30_000,
    });
    await expect(page.locator("#snapResult")).toBeVisible();
    await expect(page.locator("#feeOut")).toContainText(/sat\/vB|fastest/i);
    await expect(page.locator("#trafficOut")).toContainText(/Tip|height|Mempool/i);
    await expect(page.locator("#snapStatus")).toContainText(/OK|ok|Snapshot/i);
    await expect(page.locator("#feeExample")).toContainText(/vB|sats/i);
    await expect(page.locator("#feeBands")).toContainText(/sat\/vB|fastest|½|hour|economy|minimum/i);
    await expect(page.locator("#snapResult")).toContainText(/UTXO/i);
  });

  test("S13c balances reject mnemonic · fetch address", async ({ page }) => {
    await page.goto("/network.html");
    await page.locator("#balAck").check();
    await page.locator("#balAddrs").fill(ABANDON);
    await page.locator("#btnFetchBal").click();
    await expect(page.locator("#balStatus")).toContainText(/address|seed|phrase|Add at least/i);

    await page.locator("#balAddrs").fill(GOLDEN.bip84);
    await page.locator("#btnFetchBal").click();
    await expect
      .poll(async () => page.locator("#balTableBody tr:not(.empty-row)").count(), {
        timeout: 30_000,
      })
      .toBeGreaterThanOrEqual(1);
    await expect(page.locator("#balTableBody")).toContainText(GOLDEN.bip84);
    const rowText = await page.locator("#balTableBody tr").first().innerText();
    expect(rowText).toMatch(/ok|unknown|error/i);
    // Never silent fake zero without a status word
    if (/0(\.0+)?\s*(btc|sats)?/i.test(rowText) && !/ok|unknown|error/i.test(rowText)) {
      throw new Error("balance row looks like bare zero without ok|unknown|error");
    }
  });

  test("S13d Lab session bridge", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 1);

    await page.goto("/network.html");
    await page.locator("#balAck").check();
    await page.locator("#btnLoadLab").click();
    const addrs = await page.locator("#balAddrs").inputValue();
    expect(addrs.trim().length).toBe(0);
    await expect(page.locator("#balStatus")).toContainText(/address|session|Lab|none|empty|need/i);
  });

  test("S33 load lab without ack fails", async ({ page }) => {
    await page.goto("/network.html");
    // buttons disabled without ack
    await expect(page.locator("#btnLoadLab")).toBeDisabled();
  });

  test("S34 empty addresses after ack", async ({ page }) => {
    await page.goto("/network.html");
    await page.locator("#balAck").check();
    await page.locator("#balAddrs").fill("");
    await page.locator("#btnFetchBal").click();
    await expect(page.locator("#balStatus")).toContainText(/address|Add at least/i);
  });

  test("S35 network → tools deep link", async ({ page }) => {
    await page.goto("/network.html");
    await page.locator('.nav-item[data-nav="tools"]').click();
    await expect(page).toHaveURL(/#tools|tools/);
    await expect(page.locator("#panel-tools")).toBeVisible();
  });
});
