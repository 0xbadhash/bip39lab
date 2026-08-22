import { test, expect } from "@playwright/test";

test.describe("gradual visual teach strip (0.16.25–0.16.27)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto("/index.html");
  });

  test("S110 level select changes data-paint on #labStrip", async ({ page }) => {
    const strip = page.locator("#labStrip");
    await expect(strip).toBeVisible({ timeout: 8000 });
    await expect(strip).toHaveAttribute("data-paint", "starter");
    await page.locator("#learnLevel").selectOption("beginner");
    await expect(strip).toHaveAttribute("data-paint", "beginner");
    await page.locator("#learnLevel").selectOption("intermediate");
    await expect(strip).toHaveAttribute("data-paint", "intermediate");
    await page.locator("#learnLevel").selectOption("advanced");
    await expect(strip).toHaveAttribute("data-paint", "advanced");
  });

  test("S111 starter strip: word card only; no ENT slider or QR on strip", async ({ page }) => {
    const strip = page.locator("#labStrip");
    await expect(strip).toBeVisible({ timeout: 8000 });
    await expect(strip).toHaveAttribute("data-paint", "starter");
    await expect(strip.locator("input[type=range]")).toHaveCount(0);
    await expect(strip.locator("img, canvas, [data-qr]")).toHaveCount(0);
    await expect(strip.locator(".stage-words")).toBeVisible();
    await expect(strip.locator(".stamp-warn")).toContainText(/practice backup/i);
    await expect(strip.locator(".lab-strip-extra.int-only")).toBeHidden();
  });

  test("S112 extra help Off hides captions not the strip", async ({ page }) => {
    await expect(page.locator("#labStrip")).toBeVisible({ timeout: 8000 });
    await page.evaluate(() => document.documentElement.setAttribute("data-teach", "off"));
    await expect(page.locator("#labStrip")).toBeVisible();
    await expect(page.locator("#labStrip .stage-caption").first()).toBeHidden();
  });

  test("S113 intermediate shows keys≠shares extra; advanced shows master→child", async ({ page }) => {
    const strip = page.locator("#labStrip");
    await expect(strip).toBeVisible({ timeout: 8000 });
    await page.locator("#learnLevel").selectOption("intermediate");
    await expect(strip).toHaveAttribute("data-paint", "intermediate");
    await expect(strip.locator(".lab-strip-extra.int-only")).toBeVisible();
    await expect(strip.locator(".lab-strip-extra.int-only")).toContainText(/Keys/i);
    await page.locator("#learnLevel").selectOption("advanced");
    await expect(strip).toHaveAttribute("data-paint", "advanced");
    await expect(strip.locator(".lab-strip-extra.adv-only")).toBeVisible();
    await expect(strip.locator(".lab-strip-extra.adv-only")).toContainText(/master/i);
  });

  test("S114 Starter: #labStrip is inside #card-mnemonic and below #btnGenerate", async ({ page }) => {
    const strip = page.locator("#card-mnemonic #labStrip");
    await expect(strip).toBeVisible({ timeout: 8000 });
    await expect(page.locator("#panel-lab > #labStrip")).toHaveCount(0);
    const gen = await page.locator("#btnGenerate").boundingBox();
    const box = await strip.boundingBox();
    expect(gen && box).toBeTruthy();
    expect(box!.y).toBeGreaterThan(gen!.y);
  });

  test("S115 Starter: Seed QR / Print / Network buttons not visible", async ({ page }) => {
    await expect(page.locator("#labStrip")).toBeVisible({ timeout: 8000 });
    await expect(page.locator("#btnSeedQr")).toBeHidden();
    await expect(page.locator("#btnPrintBackup")).toBeHidden();
    await expect(page.locator("#btnSendNetwork")).toBeHidden();
  });

  test("S116 Starter: ghost stages have no visible caption text", async ({ page }) => {
    const strip = page.locator("#labStrip");
    await expect(strip).toBeVisible({ timeout: 8000 });
    await expect(strip.locator(".stage-entropy .stage-caption")).toBeHidden();
    await expect(strip.locator(".stage-checksum .stage-caption")).toBeHidden();
    await expect(strip.locator(".stage-seed .stage-caption")).toBeHidden();
    await expect(strip.locator(".stage-address .stage-caption")).toBeHidden();
    const ent = await strip.locator(".stage-entropy").boundingBox();
    expect(ent).toBeTruthy();
    expect(ent!.width).toBeLessThanOrEqual(32);
  });

  test("S117 #btnReadyBeginner hidden until first-hour step h8 selected", async ({ page }) => {
    await expect(page.locator("#btnReadyBeginner")).toBeHidden();
    await page.locator('#firstHourList [data-hour-step="h2"]').click();
    await expect(page.locator("#btnReadyBeginner")).toBeHidden();
    await page.locator('#firstHourList [data-hour-step="h8"]').click();
    await expect(page.locator("#btnReadyBeginner")).toBeVisible();
  });
});
