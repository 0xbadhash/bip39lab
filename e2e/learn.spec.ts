import { test, expect } from "@playwright/test";

test.describe("Learning levels E0–E6", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem("bip39lab.level", "starter");
        localStorage.setItem("bip39lab.teach", "on");
      } catch (e) {
        /* ignore */
      }
    });
    await page.goto("/");
  });

  test("S61 orientation + first hour", async ({ page }) => {
    await expect(page.locator("#cardOrientation")).toBeVisible();
    await expect(page.locator("#orientationTable")).toContainText(/wallet|practice|PSBT/i);
    await expect(page.locator("#cardFirstHour")).toBeVisible();
    await expect(page.locator("[data-hour-step]")).toHaveCount(8);
    await page.locator('[data-hour-step="h1"] input').check();
    await expect(page.locator("#firstHourProgress")).toContainText(/1\s*\/\s*8/);
  });

  test("S62 level chip soft gates", async ({ page }) => {
    await expect(page.locator("#learnLevel")).toHaveValue("starter");
    await page.locator("#learnLevel").selectOption("advanced");
    await expect(page.locator("html")).toHaveAttribute("data-level", "advanced");
    await expect(page.locator("#cardBip85")).toBeVisible();
    await expect(page.locator("#cardOps")).toBeVisible();
    await page.locator("#learnLevel").selectOption("starter");
    await expect(page.locator("#cardOrientation")).toBeVisible();
  });

  test("S63 quiz shell", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("beginner");
    await expect(page.locator("#cardQuiz")).toBeVisible();
    await page.locator("#quizPass-q1").click();
    await expect(page.locator("#quizBadge-q1")).toContainText(/Passed/i);
    await page.locator("#quizOpenPp").click();
    await expect(page.locator("#panel-tools")).toBeVisible();
  });

  test("S64 three splits tour", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("intermediate");
    await expect(page.locator("#cardTour")).toBeVisible();
    await page.locator("#tourStart").click();
    await expect(page.locator("#tourBox")).toBeVisible();
    await expect(page.locator("#tourTitle")).toContainText(/Multisig/i);
    await page.locator("#tourNext").click();
    await expect(page.locator("#tourTitle")).toContainText(/Shamir/i);
  });

  test("S65 BIP-85 shell", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("advanced");
    await expect(page.locator("#cardBip85")).toBeVisible();
    await page.locator("#btnBip85Demo").click();
    await expect(page.locator("#bip85Out")).toContainText(/PRACTICE|BIP-85|practice/i);
  });

  test("S66 ops card advanced", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("advanced");
    await expect(page.locator("#cardOps")).toBeVisible();
    await expect(page.locator("#cardOps")).toContainText(/Knots|seed.scan|RPC/i);
  });
});

test.describe("E3 mobile shell", () => {
  test("S67 mobile layout stack", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator("#cardOrientation")).toBeVisible();
    await expect(page.locator(".sidebar")).toBeVisible();
    await expect(page.locator("#btnGenerate")).toBeVisible();
  });
});
