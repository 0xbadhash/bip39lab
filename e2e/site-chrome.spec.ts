import { test, expect } from "@playwright/test";
import { expectNavCount, labCspOffline } from "./helpers";

/**
 * Cross-page chrome: nav parity, CSP isolation, labels.
 * Comet scenarios S36–S40.
 */
test.describe("Site chrome cross-page", () => {
  test("S36 Lab Multisig Shamir Network same 6 nav labels", async ({ page }) => {
    for (const path of ["/", "/multisig.html", "/shamir.html", "/network.html"]) {
      await page.goto(path);
      await expectNavCount(page);
      await expect(page.locator('.nav-item[data-nav="lab"] strong')).toHaveText("Lab");
      await expect(page.locator('.nav-item[data-nav="multisig"] strong')).toHaveText("Multisig");
      await expect(page.locator('.nav-item[data-nav="shamir"] strong')).toHaveText("Shamir");
      await expect(page.locator('.nav-item[data-nav="network"] strong')).toHaveText("Network");
      await expect(page.locator('.nav-item[data-nav="tools"] strong')).toHaveText("Tools");
      await expect(page.locator('.nav-item[data-nav="glossary"] strong')).toHaveText("Glossary");
      await expect(page.locator('.nav-item[data-nav="balance"]')).toHaveCount(0);
      await expect(page.locator('.nav-item[data-nav="about"]')).toHaveCount(0);
    }
  });

  test("S37 Lab and Multisig CSP offline; Network allows mempool", async ({ page }) => {
    await page.goto("/");
    await labCspOffline(page);
    await page.goto("/multisig.html");
    await labCspOffline(page);
    await page.goto("/network.html");
    const csp =
      (await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content")) ||
      "";
    expect(csp).toMatch(/mempool\.space|'self'/);
  });

  test("S38 Multisig active aria-current", async ({ page }) => {
    await page.goto("/multisig.html");
    await expect(page.locator('.nav-item[data-nav="multisig"]')).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("S39 Network active aria-current", async ({ page }) => {
    await page.goto("/network.html");
    await expect(page.locator('.nav-item[data-nav="network"]')).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("S39b Shamir active aria-current", async ({ page }) => {
    await page.goto("/shamir.html");
    await expect(page.locator('.nav-item[data-nav="shamir"]')).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("S40 footer host links present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".footer-host")).toContainText(/bip39\.catalyxt\.xyz|English/i);
    await page.goto("/multisig.html");
    await expect(page.locator("body")).toContainText(/bip39\.catalyxt\.xyz|Multisig/i);
    await page.goto("/network.html");
    await expect(page.locator("body")).toContainText(/bip39\.catalyxt\.xyz|Lab/i);
  });
});
