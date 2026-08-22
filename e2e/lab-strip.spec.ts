import { test, expect } from "@playwright/test";

test.describe("gradual visual teach strip", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto("/index.html");
  });

  test("level select changes data-paint", async ({ page }) => {
    const strip = page.locator("#labStrip");
    await expect(strip).toBeVisible();
    await expect(strip).toHaveAttribute("data-paint", "starter");
    await page.locator("#learnLevel").selectOption("beginner");
    await expect(strip).toHaveAttribute("data-paint", "beginner");
    await page.locator("#learnLevel").selectOption("intermediate");
    await expect(strip).toHaveAttribute("data-paint", "intermediate");
    await page.locator("#learnLevel").selectOption("advanced");
    await expect(strip).toHaveAttribute("data-paint", "advanced");
  });

  test("starter strip has no ENT slider or QR on the strip", async ({ page }) => {
    const strip = page.locator("#labStrip");
    await expect(strip).toHaveAttribute("data-paint", "starter");
    await expect(strip.locator("input[type=range]")).toHaveCount(0);
    await expect(strip.locator("img, canvas, [data-qr]")).toHaveCount(0);
    await expect(strip.locator(".stage-words")).toBeVisible();
  });

  test("extra help off hides captions not the strip", async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute("data-teach", "off"));
    await expect(page.locator("#labStrip")).toBeVisible();
    await expect(page.locator("#labStrip .stage-caption").first()).toBeHidden();
  });
});
