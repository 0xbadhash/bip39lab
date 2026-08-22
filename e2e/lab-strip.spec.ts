import { test, expect } from "@playwright/test";

test.describe("gradual visual teach strip (0.16.25–0.16.26)", () => {
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

  test("S115 strip is inside #card-mnemonic under Generate", async ({ page }) => {
    const strip = page.locator("#card-mnemonic #labStrip");
    await expect(strip).toBeVisible({ timeout: 8000 });
    await expect(page.locator("#panel-lab > #labStrip")).toHaveCount(0);
    const gen = await page.locator("#btnGenerate").boundingBox();
    const box = await strip.boundingBox();
    expect(gen && box).toBeTruthy();
    expect(box!.y).toBeGreaterThan(gen!.y);
  });

  test("S116 starter ghosts are ticks; empty card one line", async ({ page }) => {
    const strip = page.locator("#labStrip");
    await expect(strip).toBeVisible({ timeout: 8000 });
    await expect(strip.locator("#stripEmptyHint")).toHaveText(/Generate to fill this backup/);
    await expect(strip.locator(".ww")).toHaveCount(0);
    const words = await strip.locator(".stage-words").boundingBox();
    const ent = await strip.locator(".stage-entropy").boundingBox();
    expect(words && ent).toBeTruthy();
    expect(ent!.width).toBeLessThan(48);
    expect(words!.width).toBeGreaterThan(ent!.width * 2);
    await expect(strip.locator(".stage-entropy .stage-caption")).toBeHidden();
  });

  test("S117 Starter is/isn’t collapsed; air-gap banner stays", async ({ page }) => {
    await expect(page.locator("#labSafetyBanner")).toBeVisible();
    await expect(page.locator("#orientationFold")).not.toHaveAttribute("open");
    await expect(page.locator("#cardOrientation")).toBeVisible();
  });
});
