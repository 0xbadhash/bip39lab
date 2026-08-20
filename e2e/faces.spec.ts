import { test, expect } from "@playwright/test";
import { clickLabAction } from "./helpers";

/** Four locked level faces. Local 4173 until 0.16.19 is live; then BASE_URL=live. */

test.describe("Level faces", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem("bip39lab.level", "starter");
        localStorage.setItem("bip39lab.teach", "on");
        localStorage.removeItem("bip39lab.firstHour");
        localStorage.removeItem("bip39lab.quiz");
        localStorage.removeItem("bip39lab.intQuiz");
        localStorage.removeItem("bip39lab.advQuiz");
      } catch (e) {
        /* ignore */
      }
    });
    await page.goto("/");
    await page.evaluate(() => {
      try {
        localStorage.setItem("bip39lab.level", "starter");
        localStorage.setItem("bip39lab.teach", "on");
        localStorage.removeItem("bip39lab.firstHour");
        localStorage.removeItem("bip39lab.quiz");
        localStorage.removeItem("bip39lab.intQuiz");
        localStorage.removeItem("bip39lab.advQuiz");
      } catch (e) {
        /* ignore */
      }
    });
    await page.reload();
  });

  test("S102 F1 Starter face: intro + First hour + lab; later off the face", async ({ page }) => {
    await expect(page.locator("#panel-title")).toHaveText("Offline BIP-39 lab");
    await expect(page.locator("#panel-sub")).toHaveText(
      "Generate, validate, and derive receive addresses — English wordlist only."
    );
    await expect(page.locator("#cardOrientation")).toBeVisible();
    await expect(page.locator("#cardFirstHour")).toBeVisible();
    await expect(page.locator("#card-mnemonic")).toBeVisible();
    await expect(page.locator("#btnGenerate")).toBeVisible();
    await expect(page.locator("#cardQuiz")).toBeHidden();
    await expect(page.locator("#cardIntQuiz")).toBeHidden();
    await expect(page.locator("#cardAdvQuiz")).toBeHidden();
    await expect(page.locator("#cardBip85")).toBeHidden();
    await expect(page.locator("#cardOps")).toBeHidden();
    await expect(page.locator("#learnLevelHint")).toContainText(/Later levels stay off this face/i);
    // 12-check is not a fifth page
    await expect(page.locator("#quizStatusBoard")).toBeHidden();
    await expect(page.locator("#intQuizStatusBoard")).toBeHidden();
    await expect(page.locator("#advQuizStatusBoard")).toBeHidden();
  });

  test("S103 F2 Beginner face: tiles + key/dice visual; no Guided quiz heading; Intermediate hidden", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("beginner");
    await expect(page.locator("#chapterBeginner")).toBeVisible();
    await expect(page.locator("#chapterBeginner")).toContainText(/Passphrase and entropy/i);
    await expect(page.locator("#cardQuiz")).toBeVisible();
    await expect(page.locator("#cardQuiz")).not.toContainText(/Guided quiz \(self-check\)/);
    await expect(page.locator("#cardQuiz")).not.toContainText(/Go to Guided quiz/);
    await expect(page.locator("#beginnerEntropyEq")).toBeVisible();
    await expect(page.locator("#beginnerEntropyEq img")).toBeVisible();
    await expect(page.locator("#beginnerEntropyEq img")).toHaveAttribute("src", /assets\/ds\/faces\/beginner-entropy-eq\.svg/);
    await expect(page.locator("#chapterBeginner")).toContainText(/Something you know/i);
    await expect(page.locator("#chapterBeginner")).toContainText(/Too few dice/i);
    await expect(page.locator("#chapterBeginner")).toContainText(/128 bits/i);
    await expect(page.locator("#quizTileGrid")).toBeVisible();
    await expect(page.locator(".quiz-tile")).toHaveCount(4);
    await expect(page.locator("#quizPass-q1")).toHaveText(/Mark passed/);
    await expect(page.locator("#quizOpenPp")).toHaveText(/Go try/);
    await expect(page.locator("#quizHint-q1")).toBeVisible();
    await expect(page.locator("#cardQuiz")).toContainText(/wrong passphrase/i);
    await expect(page.locator("#cardQuiz")).toContainText(/under-threshold Shamir/i);
    await expect(page.locator("#cardQuiz")).toContainText(/TOO LOW/i);
    await expect(page.locator("#cardIntQuiz")).toBeHidden();
    await expect(page.locator("#cardAdvQuiz")).toBeHidden();
    await expect(page.locator("#cardFirstHour")).toBeVisible();
    await expect(page.locator("#cardOrientation")).toHaveClass(/face-collapsed/);
    await expect(page.locator("#card-mnemonic")).toHaveClass(/face-collapsed/);
    await expect(page.locator("#learnLevelHint")).toContainText(/Intermediate stays hidden/i);
  });

  test("S104 F3 Intermediate face: keys ≠ shares ≠ share-words; I1–I4; Advanced hidden", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("intermediate");
    await expect(page.locator("#chapterIntermediate")).toBeVisible();
    await expect(page.locator("#chapterIntermediate")).toContainText(/keys ≠ shares ≠ share-words/i);
    await expect(page.locator("#intStillKeys")).toBeVisible();
    await expect(page.locator("#intStillShares")).toBeVisible();
    await expect(page.locator("#intStillWords")).toBeVisible();
    await expect(page.locator("#intStillKeys")).toHaveAttribute("src", /assets\/ds\/faces\/intermediate-keys\.png/);
    await expect(page.locator("#intStillShares")).toHaveAttribute("src", /intermediate-hex-shares\.png/);
    await expect(page.locator("#intStillWords")).toHaveAttribute("src", /intermediate-share-words\.png/);
    await expect(page.locator("#chapterIntermediate img.chapter-visual-img")).toHaveCount(0);
    await expect(page.locator("#cardIntQuiz")).toBeVisible();
    await expect(page.locator("#quizPass-i1")).toBeVisible();
    await expect(page.locator("#quizPass-i4")).toBeVisible();
    await expect(page.locator("#cardAdvQuiz")).toBeHidden();
    await expect(page.locator("#cardBip85")).toBeHidden();
    await expect(page.locator("#learnLevelHint")).toContainText(/Advanced stays hidden/i);
  });

  test("S105 F4 Advanced face: master → child keys; not a wallet; A1–A4", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("advanced");
    await expect(page.locator("#chapterAdvanced")).toBeVisible();
    await expect(page.locator("#chapterAdvanced")).toContainText(/master → child keys/i);
    await expect(page.locator("#chapterAdvancedIsNot")).toContainText(/not a wallet/i);
    await expect(page.locator("#cardAdvQuiz")).toBeVisible();
    await expect(page.locator("#quizPass-a1")).toBeVisible();
    await expect(page.locator("#quizPass-a4")).toBeVisible();
    await expect(page.locator("#learnLevelHint")).toContainText(/not a wallet/i);
  });

  test("S106 F5 Reset → Starter exact 0.16.16 intro; overlays 0.16.17 stay", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("intermediate");
    await page.locator("#btnResetClassroom").click();
    await expect(page.locator("#learnLevel")).toHaveValue("starter");
    await expect(page.locator("#panel-title")).toHaveText("Offline BIP-39 lab");
    await expect(page.locator("#panel-sub")).toHaveText(
      "Generate, validate, and derive receive addresses — English wordlist only."
    );
    await expect(page.locator("#panel-sub")).toBeInViewport();
    await expect(page.locator("#learnLevelToast")).toContainText(/Progress reset\. Level is Starter/);
    await expect(page.locator("#cardQuiz")).toBeHidden();
    // overlays still three ids
    await expect(page.locator("#overlayGenerate")).toBeHidden();
    await page.locator("#btnGenerate").click();
    await expect(page.locator("#overlayGenerate")).toBeVisible();
    await expect(page.locator("#overlayGenerateBody")).toContainText(/practice recovery phrase/i);
    const genBtns = page.locator("#overlayGenerate .lab-overlay-card button");
    await expect(genBtns).toHaveCount(1);
    await expect(genBtns).toHaveText("OK");
    await expect(page.locator("#overlayGenerate")).not.toContainText("Cancel");
    await expect(page.locator("#overlayGenerate")).not.toContainText("Continue");
  });

  test("S107 F6 (i) hover still not click-gated", async ({ page }) => {
    const tip = page.locator("#cardOrientation .help-tip").first();
    const panel = tip.locator(".help-tip-panel").first();
    await expect(tip.locator(".help-tip-btn")).toBeVisible();
    await tip.hover();
    await expect(panel).toBeVisible();
  });

  test("S108 F7 rec-flow form / results / missing-data / next-step / plain English / mobile / errors", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator("#btnGenerate")).toBeVisible();
    await clickLabAction(page, "generate");
    await expect(page.locator("#mnemonic")).not.toHaveValue("");
    await expect(page.locator("#addrTableBody tr:not(.empty-row)").first()).toBeVisible({ timeout: 10_000 });
    await clickLabAction(page, "clear");
    await clickLabAction(page, "derive");
    await expect(page.locator("#status")).toContainText(/phrase|mnemonic|missing|need|empty|word/i);
    await page.locator("#learnLevel").selectOption("beginner");
    await expect(page.locator("#chapterBeginner")).toContainText(/Passphrase and entropy/i);
    await expect(page.locator("#cardQuiz")).not.toContainText(/Guided quiz \(self-check\)/);
    await expect(page.locator("#beginnerEntropyEq")).toBeVisible();
    await expect(page.locator(".quiz-tile")).toHaveCount(4);
    await expect(page.locator("#quizHint-q1")).toContainText(/Not yet/i);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(24);
    await page.locator("#learnLevel").selectOption("advanced");
    await expect(page.locator("#chapterAdvancedIsNot")).toContainText(/not a wallet/i);
    await page.locator("#learnLevel").selectOption("intermediate");
    await expect(page.locator("#cardAdvQuiz")).toBeHidden();
  });
});
