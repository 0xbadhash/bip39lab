import { test, expect } from "@playwright/test";
import { expectNavCount, hourRailGo } from "./helpers";

/**
 * Help UX hybrid P0–P4: tips, Extra help (no mid-page step rails).
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

  test("S41 Lab Extra help On · teach-only copy visible · no step rail", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/");
    await expect(page.locator("#btnTeach")).toBeVisible();
    await expect(page.locator("#btnTeach")).toContainText(/Extra help: On|Teach: On/i);
    await expect(page.locator("html")).toHaveAttribute("data-teach", "on");
    await expect(page.locator("[data-step-rail], #labStepRail")).toHaveCount(0);
    await expect(page.locator("#card-mnemonic .card-lede, #card-mnemonic .teach-only").first()).toBeVisible();
  });

  test("S42 Extra help Off hides teach-only · keeps safety", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/");
    await page.locator("#btnTeach").click();
    await expect(page.locator("#btnTeach")).toContainText(/Extra help: Off|Teach: Off/i);
    await expect(page.locator("html")).toHaveAttribute("data-teach", "off");
    // air-gap warn always on (not the hidden entropy-pad result box)
    await expect(page.locator('.warn[role="note"]')).toBeVisible();
    await expect(page.locator('.warn[role="note"]')).toContainText(/Air-gap/i);
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
    await btn.hover();
    await expect(panel).toBeVisible();
    await expect(panel).toContainText(/recovery|vault|air/i);
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });

  test("S44 first-hour Go jumps to Lab sections (replaces step rail)", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/");
    await page.locator('#firstHourList [data-hour-step="h2"]').click();
    await expect(page.locator("#card-mnemonic")).toBeVisible();
    await expect(page.locator("#btnGenerate")).toBeVisible();
  });

  test("S44b Tools panel opens without mid-page rails", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/");
    await page.locator('.nav-item[data-nav="tools"]').click();
    await expect(page.locator("#panel-tools")).toBeVisible();
    await expect(page.locator("[data-step-rail], #labStepRail, #toolsStepRail")).toHaveCount(0);
    await expect(page.locator("#cardPathPlay")).toBeVisible();
    await expect(page.locator("#cardPsbt")).toBeVisible();
  });

  test("S45 Multisig Extra help + tip BIP67", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/multisig.html");
    await expect(page.locator("#btnTeach")).toBeVisible();
    await expect(page.locator("#msCardBuild")).toBeVisible();
    await page.locator("#msCardBuild").scrollIntoViewIfNeeded();
    const tip = page.locator("#msCardBuild .help-tip").filter({
      has: page.locator('[aria-label="About BIP67"]'),
    });
    await tip.locator(".help-tip-btn").hover();
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
    // BIP67 checklist row has ⓘ next to “same address”
    await expect(det).toContainText(/BIP67 sort agreed/i);
    const bip67Tip = det.locator('.help-tip[data-term="BIP67"]');
    await expect(bip67Tip).toBeVisible();
    await bip67Tip.locator(".help-tip-btn").hover();
    await expect(bip67Tip.locator(".help-tip-panel")).toBeVisible();
    await expect(bip67Tip.locator(".help-tip-panel")).toContainText(/same address|lexicographic|BIP67/i);
    await page.keyboard.press("Escape"); // close tip so next ⓘ is not covered
    // Vault verify: same address = multisig vault, not solo
    const vaultTip = det.locator('.help-tip[data-term="MSVAULTVERIFY"]');
    await expect(vaultTip).toBeVisible();
    await vaultTip.locator(".help-tip-btn").hover();
    await expect(vaultTip.locator(".help-tip-panel")).toContainText(/vault|not each|single-sig|solo/i);
    await page.keyboard.press("Escape");
    // Cosigner replace tip
    const replTip = det.locator('.help-tip[data-term="COSIGNERREPLACE"]');
    await expect(replTip).toBeVisible();
    await replTip.locator(".help-tip-btn").hover();
    await expect(replTip.locator(".help-tip-panel")).toContainText(/new vault|cannot|replace|spend out/i);
  });

  test("S47 Network Extra help · leak always visible · fee tip", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/network.html");
    await expect(page.locator("[data-step-rail], #netStepRail")).toHaveCount(0);
    await expect(page.locator("#netCardIntro")).toContainText(/Privacy|address/i);
    await page.locator("#btnTeach").click();
    await expect(page.locator("#btnTeach")).toContainText(/Extra help: Off|Teach: Off/i);
    await expect(page.locator("#balAck")).toBeVisible();
    await page.locator("#btnTeach").click();
    const feeTip = page.locator("#netCardFees .help-tip").first();
    await feeTip.locator(".help-tip-btn").hover();
    await expect(feeTip.locator(".help-tip-panel")).toContainText(/sat\/vB|postage|fee/i);
  });

  test("S48 Extra help persists via localStorage across pages", async ({ page }) => {
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
    await expect(page.locator("#btnTeach")).toContainText(/Extra help: Off|Teach: Off/i);
    await page.locator("#btnTeach").click();
    await expect(page.locator("html")).toHaveAttribute("data-teach", "on");
  });

  test("S101 every visible Lab (i) opens on hover without click", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/");
    const n = await page.locator(".help-tip-btn").count();
    expect(n).toBeGreaterThanOrEqual(25);
    const tips = page.locator(".help-tip");
    const tcount = await tips.count();
    expect(tcount).toBeGreaterThanOrEqual(25);
    for (let i = 0; i < Math.min(tcount, 12); i++) {
      const tip = tips.nth(i);
      await tip.scrollIntoViewIfNeeded();
      if (!(await tip.isVisible())) continue;
      await tip.locator(".help-tip-btn").hover();
      await expect(tip.locator(".help-tip-panel")).toBeVisible();
    }
    await page.goto("/multisig.html");
    await page.locator(".help-tip").first().locator(".help-tip-btn").hover();
    await expect(page.locator(".help-tip").first().locator(".help-tip-panel")).toBeVisible();
    await page.goto("/network.html");
    await page.locator(".help-tip").first().locator(".help-tip-btn").hover();
    await expect(page.locator(".help-tip").first().locator(".help-tip-panel")).toBeVisible();
    await page.goto("/shamir.html");
    await page.locator(".help-tip").first().locator(".help-tip-btn").hover();
    await expect(page.locator(".help-tip").first().locator(".help-tip-panel")).toBeVisible();
    await page.goto("/slip39.html");
    await expect(page.locator(".help-tip-btn")).toHaveCount(1);
    await page.locator(".help-tip-btn").hover();
    await expect(page.locator(".help-tip-panel")).toBeVisible();
  });

  test("S48b Lab still 6-nav after help UX", async ({ page }) => {
    await forceTeach(page, "on");
    await page.goto("/");
    await expectNavCount(page);
  });
});
