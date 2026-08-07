import { test, expect } from "@playwright/test";
import { expectNavCount } from "./helpers";

/**
 * Help UX hybrid P0–P4: tips, teach mode, step rails.
 * Comet S41–S48.
 */
test.describe("Help UX hybrid", () => {
  async function forceTeach(page: import("@playwright/test").Page, mode: "on" | "off") {
    await page.addInitScript((m) => {
      try {
        localStorage.setItem("bip39lab.teach", m);
      } catch (e) {
        /* ignore */
      }
    }, mode);
  }

  test("S41 Lab teach toggle On by default · step rail visible", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/");
    await expect(page.locator("#btnTeach")).toBeVisible();
    await expect(page.locator("#btnTeach")).toContainText(/Teach: On/i);
    await expect(page.locator("html")).toHaveAttribute("data-teach", "on");
    await expect(page.locator("#labStepRail")).toBeVisible();
    await expect(page.locator("#labStepRail .step-rail-btn")).toHaveCount(4);
  });

  test("S42 Teach Off hides teach-only · keeps safety", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/");
    await page.locator("#btnTeach").click();
    await expect(page.locator("#btnTeach")).toContainText(/Teach: Off/i);
    await expect(page.locator("html")).toHaveAttribute("data-teach", "off");
    await expect(page.locator("#labStepRail")).toBeHidden();
    // air-gap warn always on
    await expect(page.locator(".warn")).toBeVisible();
    await expect(page.locator(".warn")).toContainText(/Air-gap/i);
    // tip buttons without safety class hidden when teach off
    await expect(page.locator(".help-tip:not(.help-tip-safety)").first()).toBeHidden();
  });

  test("S43 help tip opens and Escape closes", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/");
    const tip = page.locator("#card-mnemonic .help-tip").first();
    const btn = tip.locator(".help-tip-btn");
    const panel = tip.locator(".help-tip-panel");
    await expect(panel).toBeHidden();
    await btn.click();
    await expect(tip).toHaveClass(/is-open/);
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(/recovery|vault|air/i);
    await page.keyboard.press("Escape");
    await expect(tip).not.toHaveClass(/is-open/);
  });

  test("S44 step rail scrolls to watch-only", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/");
    await page.locator('#labStepRail [data-step-target="#watchOnlyPanel"]').click();
    await expect(page.locator("#watchOnlyPanel")).toBeVisible();
    await expect(page.locator('#labStepRail [data-step-target="#watchOnlyPanel"]')).toHaveClass(
      /is-active/
    );
  });

  test("S45 Multisig step rail + teach + tip BIP67", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/multisig.html");
    await expect(page.locator("#msStepRail")).toBeVisible();
    await expect(page.locator("#btnTeach")).toBeVisible();
    await page.locator('#msStepRail [data-step-target="#msCardBuild"]').click();
    await expect(page.locator("#msCardBuild")).toBeVisible();
    const tip = page.locator("#msCardBuild .help-tip").filter({
      has: page.locator('[aria-label="About BIP67"]'),
    });
    await tip.locator(".help-tip-btn").click();
    await expect(tip.locator(".help-tip-panel")).toBeVisible();
    await expect(tip.locator(".help-tip-panel")).toContainText(/BIP67|same/i);
  });

  test("S46 Multisig checklist collapsed by default (details)", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/multisig.html");
    const det = page.locator("details.help-fold").filter({ hasText: /Cosigner checklist/i });
    await expect(det).toBeVisible();
    await expect(det).not.toHaveAttribute("open", "");
    await det.locator("summary").click();
    await expect(det).toHaveAttribute("open", "");
    await expect(det).toContainText(/hardware|public/i);
  });

  test("S47 Network step rail · leak always visible · fee tip", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/network.html");
    await expect(page.locator("#netStepRail")).toBeVisible();
    await expect(page.locator("#netCardIntro")).toContainText(/Privacy|address/i);
    await page.locator("#btnTeach").click();
    await expect(page.locator("#netStepRail")).toBeHidden();
    await expect(page.locator("#balAck")).toBeVisible();
    await page.locator("#btnTeach").click();
    const feeTip = page.locator("#netCardFees .help-tip").first();
    await feeTip.locator(".help-tip-btn").click();
    await expect(feeTip.locator(".help-tip-panel")).toContainText(/sat\/vB|postage|fee/i);
  });

  test("S48 teach persists via localStorage across pages", async ({ page }) => {
    // Do NOT force on via init after toggle — only seed once, then navigate without reset
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("bip39lab.teach", "on"));
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-teach", "on");
    await page.locator("#btnTeach").click();
    await expect(page.locator("html")).toHaveAttribute("data-teach", "off");
    const stored = await page.evaluate(() => localStorage.getItem("bip39lab.teach"));
    expect(stored).toBe("off");
    // same page context → localStorage persists
    await page.goto("/network.html");
    await expect(page.locator("html")).toHaveAttribute("data-teach", "off");
    await expect(page.locator("#btnTeach")).toContainText(/Teach: Off/i);
    await page.locator("#btnTeach").click();
    await expect(page.locator("html")).toHaveAttribute("data-teach", "on");
  });

  test("S48b Lab still 5-nav after help UX", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/");
    await expectNavCount(page);
  });
});
