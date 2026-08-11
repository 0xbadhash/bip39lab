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
    await expect(page.locator('[data-hour-step="h1"] .hour-go')).toBeVisible();
    await expect(page.locator('[data-hour-step="h1"] .hour-done')).toBeVisible();
    await page.locator('[data-hour-step="h1"] input').check();
    await expect(page.locator("#firstHourProgress")).toContainText(/1\s*\/\s*8/);
    // Go → floating return dock → Mark done returns to checklist
    await page.locator('[data-hour-step="h2"] .hour-go').click();
    await expect(page.locator("#learnReturnBar")).toBeVisible();
    await expect(page.locator("#learnReturnBarBtn")).toContainText(/First hour/i);
    await expect(page.locator("#card-mnemonic")).toBeVisible();
    await page.locator("#learnReturnBarBtn").click();
    await expect(page.locator("#cardFirstHour")).toBeInViewport();
    await page.locator('[data-hour-step="h2"] .hour-done').click();
    await expect(page.locator("#firstHourProgress")).toContainText(/2\s*\/\s*8/);
    // Ready for Beginner marks h8 + level
    await page.getByRole("button", { name: /I’m ready for Beginner|I'm ready for Beginner/i }).click();
    await expect(page.locator("#learnLevel")).toHaveValue("beginner");
    await expect(page.locator("#firstHourProgress")).toContainText(/3\s*\/\s*8/);
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
    await expect(page.locator("#quizStatusBoard")).toBeVisible();
    await expect(page.locator("#quizHint-q1")).toBeVisible();
    await expect(page.locator("#quizHint-q1")).toContainText(/Not yet|experiment/i);
    // Go try → single floating dock (not stacked sticky bars) → return to quiz
    await page.locator("#quizOpenPp").click();
    await expect(page.locator("#learnReturnBar")).toBeVisible();
    await expect(page.locator("#learnReturnBarBtn")).toContainText(/Guided quiz|quiz/i);
    await expect(page.locator("#panel-tools")).toBeVisible();
    await expect(page.locator("#cardCmpPp")).toBeVisible();
    await page.locator("#learnReturnBarBtn").click();
    await expect(page.locator("#cardQuiz")).toBeInViewport();
    await page.locator("#quizPass-q1").click();
    await expect(page.locator("#quizBadge-q1")).toContainText(/Passed/i);
    await expect(page.locator("#quizBoard-q1")).toContainText(/Passed/i);
    await expect(page.locator("#quizHint-q1")).toBeHidden();
    await expect(page.locator("#quizHintPass-q1")).toBeVisible();
    await expect(page.locator("#quizSummary")).toContainText(/1\s*\/\s*4/);
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

  test("S68 intermediate I1–I4 self-check", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("intermediate");
    await expect(page.locator("#cardIntQuiz")).toBeVisible();
    await expect(page.locator("#intQuizStatusBoard")).toBeVisible();
    await expect(page.locator("#quizHint-i1")).toContainText(/Not yet|keys/i);
    await page.locator("#quizPass-i1").click();
    await expect(page.locator("#quizBadge-i1")).toContainText(/Passed/i);
    await expect(page.locator("#quizBoard-i1")).toContainText(/Passed/i);
    await expect(page.locator("#intQuizSummary")).toContainText(/1\s*\/\s*4/);
    // I4 Go try → Tools PSBT + Intermediate return dock
    await page.locator('[data-quiz-go="i4"]').click();
    await expect(page.locator("#learnReturnBar")).toBeVisible();
    await expect(page.locator("#learnReturnBarBtn")).toContainText(/Intermediate/i);
    await expect(page.locator("#cardPsbt")).toBeVisible();
    await page.locator("#learnReturnBarBtn").click();
    await expect(page.locator("#cardIntQuiz")).toBeInViewport();
    await page.locator("#quizPass-i4").click();
    await expect(page.locator("#quizBadge-i4")).toContainText(/Passed/i);
  });

  test("S70 intermediate I1 external dock", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("intermediate");
    await page.locator('[data-quiz-go="i1"]').click();
    await expect(page).toHaveURL(/multisig\.html/);
    await expect(page.locator("#learnReturnDockMs")).toBeVisible();
    await expect(page.locator("#learnReturnDockMs a")).toContainText(/Intermediate/i);
    // Mark I1 on Multisig dock (same pattern as Q2 Shamir) — pass + return
    await expect(page.locator("#btnMarkI1FromMs")).toBeVisible();
    await page.locator("#btnMarkI1FromMs").click();
    await expect(page).toHaveURL(/from=intquiz|index|\/$/);
    await expect(page.locator("#cardIntQuiz")).toBeInViewport();
    await expect(page.locator("#quizBadge-i1")).toContainText(/Passed/i);
  });

  test("S71 intermediate I4 mark on Lab dock", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("intermediate");
    await page.locator('[data-quiz-go="i4"]').click();
    await expect(page.locator("#learnReturnBar")).toBeVisible();
    await expect(page.locator("#btnMarkPathFromDock")).toBeVisible();
    await expect(page.locator("#btnMarkPathFromDock")).toContainText(/I4/i);
    await page.locator("#btnMarkPathFromDock").click();
    await expect(page.locator("#quizBadge-i4")).toContainText(/Passed/i);
    await expect(page.locator("#cardIntQuiz")).toBeInViewport();
  });

  test("S69 advanced A1–A4 self-check", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("advanced");
    await expect(page.locator("#cardAdvQuiz")).toBeVisible();
    await expect(page.locator("#advQuizStatusBoard")).toBeVisible();
    await expect(page.locator("#quizHint-a4")).toContainText(/Not yet|isn/i);
    await page.locator('[data-quiz-go="a4"]').click();
    await expect(page.locator("#learnReturnBar")).toBeVisible();
    await expect(page.locator("#learnReturnBarBtn")).toContainText(/Advanced/i);
    await expect(page.locator("#cardOrientation")).toBeVisible();
    await page.locator("#learnReturnBarBtn").click();
    await expect(page.locator("#cardAdvQuiz")).toBeInViewport();
    await page.locator("#quizPass-a1").click();
    await expect(page.locator("#quizBadge-a1")).toContainText(/Passed/i);
    await expect(page.locator("#advQuizSummary")).toContainText(/1\s*\/\s*4/);
    await page.locator("#quizPass-a2").click();
    await page.locator("#quizPass-a3").click();
    await page.locator("#quizPass-a4").click();
    await expect(page.locator("#advQuizSummary")).toContainText(/4\s*\/\s*4/);
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
