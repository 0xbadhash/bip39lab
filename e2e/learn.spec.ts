import { test, expect } from "@playwright/test";

test.describe("Learning levels E0–E6", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        // Seed defaults only when missing — never clobber mid-test progress on reload
        if (localStorage.getItem("bip39lab.level") == null) {
          localStorage.setItem("bip39lab.level", "starter");
        }
        if (localStorage.getItem("bip39lab.teach") == null) {
          localStorage.setItem("bip39lab.teach", "on");
        }
      } catch (e) {
        /* ignore */
      }
    });
    // Clean slate for each test (not on later reload within the test)
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

  test("S61 orientation + first hour", async ({ page }) => {
    await expect(page.locator("#cardOrientation")).toBeVisible();
    await expect(page.locator("#orientationTable")).toContainText(/wallet|practice|PSBT/i);
    await expect(page.locator("#cardFirstHour")).toBeVisible();
    await expect(page.locator("[data-hour-step]")).toHaveCount(8);
    await expect(page.locator('[data-hour-step="h1"] .hour-go')).toBeVisible();
    await expect(page.locator('[data-hour-step="h1"] .hour-done')).toBeVisible();
    await expect(page.locator('[data-hour-step="h1"] input')).toBeDisabled();
    await page.locator('[data-hour-step="h1"] .hour-go').click();
    await expect(page.locator("#orientationTable")).toBeInViewport();
    await expect(page.locator('[data-hour-step="h1"] .hour-done')).toBeEnabled({ timeout: 5000 });
    await page.locator('[data-hour-step="h1"] .hour-done').click();
    await expect(page.locator("#firstHourProgress")).toContainText(/1\s*\/\s*8/);
    await page.locator('[data-hour-step="h2"] .hour-go').click();
    await expect(page.locator("#learnReturnBar")).toBeVisible();
    await expect(page.locator("#learnReturnBarBtn")).toContainText(/First hour/i);
    await expect(page.locator("#card-mnemonic")).toBeVisible();
    await expect(page.locator("#btnHourMarkFromDock")).toBeDisabled();
    page.once("dialog", (d) => d.accept());
    await page.locator("#btnGenerate").click();
    await expect(page.locator("#mnemonic")).not.toHaveValue("");
    await expect(page.locator("#btnHourMarkFromDock")).toBeEnabled({ timeout: 8000 });
    await page.locator("#btnHourMarkFromDock").click();
    await expect(page.locator("#cardFirstHour")).toBeInViewport();
    await expect(page.locator("#firstHourProgress")).toContainText(/2\s*\/\s*8/);
    await page.getByRole("button", { name: /I’m ready for Beginner|I'm ready for Beginner/i }).click();
    await expect(page.locator("#learnLevel")).toHaveValue("beginner");
    await expect(page.locator("#firstHourProgress")).toContainText(/3\s*\/\s*8/);
    await page.reload();
    await expect(page.locator("#learnLevel")).toHaveValue("beginner");
    await expect(page.locator('[data-hour-step="h1"] input')).toBeChecked();
    await expect(page.locator('[data-hour-step="h2"] input')).toBeChecked();
    await expect(page.locator('[data-hour-step="h1"] input')).toBeDisabled();
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

  test("S64 no mid-page three-splits tour", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("intermediate");
    await expect(page.locator("#cardTour")).toHaveCount(0);
    await expect(page.locator("#tourStart")).toHaveCount(0);
    await expect(page.locator("#panel-lab")).not.toContainText(/Tour: three ways to split trust/i);
    await expect(page.locator("#panel-lab")).not.toContainText(/Start \/ reset tour/i);
    await expect(page.locator("#cardQuiz")).toBeVisible();
    await expect(page.locator("#cardIntQuiz")).toBeVisible();
    await expect(page.locator("#headingIntQuiz")).toContainText(/Intermediate self-check/i);
    await expect(page.locator("#headingIntQuiz")).toContainText(/Three splits \+ Tools depth/i);
    await expect(page.locator("#quizPass-i1")).toBeVisible();
    await expect(page.locator("#quizPass-i2")).toBeVisible();
    await expect(page.locator("#quizPass-i3")).toBeVisible();
    const gap = await page.evaluate(() => {
      const q = document.getElementById("cardQuiz");
      const i = document.getElementById("cardIntQuiz");
      if (!q || !i) return -1;
      return i.getBoundingClientRect().top - q.getBoundingClientRect().bottom;
    });
    expect(gap).toBeGreaterThan(0);
    expect(gap).toBeLessThan(80);
  });

  test("S96 Intermediate select shows Intermediate self-check", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("intermediate");
    await expect(page.locator("#headingIntQuiz")).toBeInViewport({ timeout: 5000 });
    await expect(page.locator("#cardIntQuiz")).toBeInViewport();
    await expect(page.locator("#headingIntQuiz")).toContainText(/Intermediate self-check/i);
    await expect(page.locator("#headingIntQuiz")).toContainText(/Three splits \+ Tools depth/i);
    const pos = await page.evaluate(() => {
      const head = document.getElementById("headingIntQuiz");
      const fh = document.getElementById("cardFirstHour");
      const q = document.getElementById("cardQuiz");
      return {
        intTop: head ? head.getBoundingClientRect().top : 9999,
        fhBottom: fh ? fh.getBoundingClientRect().bottom : 0,
        quizBottom: q ? q.getBoundingClientRect().bottom : 0,
        vh: window.innerHeight,
      };
    });
    expect(pos.intTop).toBeGreaterThanOrEqual(-8);
    expect(pos.intTop).toBeLessThan(pos.vh * 0.45);
    expect(pos.fhBottom).toBeLessThan(pos.intTop);
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
    // Generate so the address table has wide bc1 rows
    await page.locator("#btnGenerate").click();
    await expect(page.locator("#addrTableBody tr:not(.empty-row)").first()).toBeVisible({
      timeout: 10_000,
    });
    // Table may be wider than viewport but must scroll inside #tableScroll — not grow the document
    const metrics = await page.evaluate(() => {
      const scroll = document.getElementById("tableScroll");
      const docW = document.documentElement.scrollWidth;
      const viewW = window.innerWidth;
      return {
        docW,
        viewW,
        tableScrollOverflow:
          scroll && scroll.scrollWidth > scroll.clientWidth + 2 ? true : false,
        tableClientW: scroll ? scroll.clientWidth : 0,
      };
    });
    // Allow a few px of scrollbar chrome; body should not be ~2× viewport
    expect(metrics.docW).toBeLessThanOrEqual(metrics.viewW + 24);
    if (metrics.tableClientW > 0) {
      // Either fits or scrolls inside the scroll container
      expect(metrics.tableClientW).toBeLessThanOrEqual(metrics.viewW + 8);
    }
  });
});

test.describe("First Hour real loop", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      try {
        localStorage.setItem("bip39lab.level", "starter");
        localStorage.setItem("bip39lab.teach", "on");
        localStorage.removeItem("bip39lab.firstHour");
        localStorage.removeItem("bip39lab.quiz");
        sessionStorage.removeItem("bip39lab.hourEvidence");
        sessionStorage.removeItem("bip39lab.hourActive");
        sessionStorage.removeItem("bip39lab.hourReturn");
      } catch (e) {
        /* ignore */
      }
    });
    await page.reload();
  });

  test("S83 no FIRST_HOUR.md user links", async ({ page }) => {
    // In-lab guide only: no FIRST_HOUR / docs/FIRST_ links. Hand-typed URL may 200.
    const hrefs = await page.locator("a[href]").evaluateAll((els) =>
      els.map((a) => (a as HTMLAnchorElement).getAttribute("href") || "")
    );
    expect(hrefs.join("\n")).not.toMatch(/FIRST_HOUR/i);
    await expect(page.locator("#cardOrientation")).not.toContainText(/docs\/FIRST_/i);
    await expect(page.locator("#cardFirstHour")).not.toContainText(/docs\/FIRST_/i);
  });

  test("S84 first hour form + compare gates", async ({ page }) => {
    await page.locator('[data-hour-step="h2"] .hour-go').click();
    await expect(page.locator("#mnemonic")).toBeVisible();
    await expect(page.locator('[data-hour-step="h2"] .hour-done')).toBeDisabled();
    await expect(page.locator("#btnHourMarkFromDock")).toBeDisabled();
    page.once("dialog", (d) => d.accept());
    await page.locator("#btnGenerate").click();
    await expect(page.locator("#mnemonic")).toHaveValue(/.{20,}/);
    await expect(page.locator("#btnHourMarkFromDock")).toBeEnabled({ timeout: 8000 });
    await page.locator("#learnReturnBarBtn").click();
    await page.locator('[data-hour-step="h5"] .hour-go').click();
    await expect(page.locator("#cardCmpPp")).toBeVisible();
    await expect(page.locator("#btnHourMarkFromDock")).toBeDisabled();
    await page.locator("#cmpPpA").fill("");
    await page.locator("#cmpPpB").fill("");
    await page.locator("#btnCmpPp").click();
    await expect(page.locator("#cmpPpVerdict")).toBeVisible();
    await expect(page.locator("#btnHourMarkFromDock")).toBeDisabled();
    await page.locator("#cmpPpB").fill("test");
    await page.locator("#btnCmpPp").click();
    await expect(page.locator("#cmpPpVerdict")).toContainText(/Different/i);
    await expect(page.locator("#btnHourMarkFromDock")).toBeEnabled({ timeout: 8000 });
    await page.locator("#btnHourMarkFromDock").click();
    await expect(page.locator("#cardFirstHour")).toBeInViewport();
    await expect(page.locator('[data-hour-step="h5"] input')).toBeChecked();
  });

  test("S85 Go h3 before derive", async ({ page }) => {
    await page.locator('[data-hour-step="h3"] .hour-go').click();
    await expect(page.locator("#headingReceive")).toBeInViewport();
    await expect(page.locator("#mnemonic")).not.toBeInViewport();
    await expect(page.locator("#learnReturnBarHint")).toContainText(/Validate & derive/i);
    await expect(page.locator("#btnHourMarkFromDock")).toBeDisabled();
    await expect(page.locator("#cardOps")).not.toBeInViewport();
    const emptyRows = await page.locator("#addrTableBody tr:not(.empty-row)").count();
    expect(emptyRows).toBe(0);
    page.once("dialog", (d) => d.accept());
    await page.locator("#btnGenerate").click();
    await expect(page.locator("#addrTableBody tr:not(.empty-row)").first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.locator("#headingReceive")).toBeInViewport();
    await expect(page.locator("#cardOps")).not.toBeInViewport();
    await expect(page.locator("#btnHourMarkFromDock")).toBeEnabled();
  });

  test("S86 Tools Path playground spacer", async ({ page }) => {
    await page.locator('.nav-item[data-nav="tools"]').click();
    await expect(page.locator("#cardPathPlay")).toBeVisible();
    const gap = await page.evaluate(() => {
      const p = document.getElementById("toolsTeachLine");
      const c = document.getElementById("cardPathPlay");
      if (!p || !c) return -1;
      const a = p.getBoundingClientRect();
      const b = c.getBoundingClientRect();
      return b.top - a.bottom;
    });
    expect(gap).toBeGreaterThanOrEqual(8);
  });

  test("S87 dock names unfinished action", async ({ page }) => {
    await page.locator('[data-hour-step="h4"] .hour-go').click();
    const hint = page.locator("#learnReturnBarHint");
    await expect(hint).toContainText(
      /In Path playground, use purpose, coin, account, change, and index \(Lab path controls\)/
    );
    await expect(hint).not.toContainText(/#deriveNetwork|#deriveCount|#deriveAccount/i);
    await expect(page.locator("#learnReturnBarHint")).not.toContainText(
      /Finish, then Mark done on the checklist/
    );
    await expect(page.locator("#btnHourMarkFromDock")).toBeDisabled();
    await page.locator("#btnPathToLab").click();
    await page.locator("#deriveNetwork").selectOption({ index: 1 });
    await page.locator("#deriveAccount").fill("1");
    await page.locator("#deriveChange").selectOption({ index: 1 });
    await page.locator("#deriveCount").selectOption({ index: 1 });
    const otherTab = page.locator(".seg-tab[data-addr-type]:not(.is-active)").first();
    await otherTab.click();
    await expect(page.locator("#btnHourMarkFromDock")).toBeEnabled({ timeout: 5000 });
  });

  test("S88 quiz 4/4 names next First Hour", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("beginner");
    await page.evaluate(() => {
      localStorage.setItem(
        "bip39lab.quiz",
        JSON.stringify({ q1: true, q2: true, q3: true, q4: true })
      );
    });
    await page.reload();
    await page.locator("#learnLevel").selectOption("beginner");
    await expect(page.locator("#quizHourNext")).toBeVisible();
    await expect(page.locator("#quizHourNext")).toContainText(/7 Network/i);
    await expect(page.locator("#quizHourNext")).toContainText(/8 Raise to Beginner/i);
    await page.locator('[data-hour-step="h6"] .hour-go').click();
    await expect(page.locator("#learnReturnBarHint")).toContainText(/7 Network/i);
    await expect(page.locator("#learnReturnBarHint")).toContainText(/8 Raise to Beginner/i);
  });

  test("S90 first hour dock wraps on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('[data-hour-step="h2"] .hour-go').click();
    await expect(page.locator("#learnReturnBar")).toBeVisible();
    const box = await page.locator("#learnReturnBar").boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeLessThanOrEqual(390);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(24);
  });

  test("S91 Go h3 lands on Receive addresses heading", async ({ page }) => {
    page.once("dialog", (d) => d.accept());
    await page.locator("#btnGenerate").click();
    await expect(page.locator("#addrTableBody tr:not(.empty-row)").first()).toBeVisible({
      timeout: 10_000,
    });
    await page.locator('[data-hour-step="h3"] .hour-go').click();
    await expect(page.locator("#headingReceive")).toBeInViewport();
    await expect(page.locator("#cardOps")).not.toBeInViewport();
    const tableTop = await page.locator("#addrTable").evaluate((el) => el.getBoundingClientRect().top);
    const headTop = await page.locator("#headingReceive").evaluate((el) => el.getBoundingClientRect().top);
    expect(headTop).toBeLessThan(tableTop);
    expect(headTop).toBeGreaterThanOrEqual(-8);
  });

  test("S92 Q2 Go lands on Practice secret", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("beginner");
    await page.locator("#quizOpenShamir, [data-quiz-go='q2']").first().click();
    await expect(page).toHaveURL(/shamir\.html/);
    await expect(page.locator("#headingPracticeSecret")).toBeInViewport();
    const recTop = await page.locator("#shCardRecombine").evaluate((el) => el.getBoundingClientRect().top);
    const pracTop = await page.locator("#headingPracticeSecret").evaluate((el) => el.getBoundingClientRect().top);
    expect(pracTop).toBeLessThan(recTop);
  });

  test("S93 Shamir Mark done visible disabled until fail then M-of-N", async ({ page }) => {
    await page.locator("#learnLevel").selectOption("beginner");
    await page.locator("[data-quiz-go='q2']").click();
    await expect(page.locator("#btnMarkQ2FromShamir")).toBeVisible();
    await expect(page.locator("#btnMarkQ2FromShamir")).toBeDisabled();
    await page.locator("#btnShGen").click();
    await page.locator("#shM").fill("2");
    await page.locator("#shN").fill("3");
    await page.locator("#btnShSplit").click();
    await expect(page.locator(".share-line").first()).toBeVisible();
    const one = await page.locator(".share-line").first().innerText();
    await page.locator("#shRecombineIn").fill(one);
    await page.locator("#btnShRecombine").click();
    await expect(page.locator("#btnMarkQ2FromShamir")).toBeDisabled();
    await page.locator("#btnShFillM").click();
    await page.locator("#btnShRecombine").click();
    await expect(page.locator("#btnMarkQ2FromShamir")).toBeEnabled({ timeout: 8000 });
  });

  test("S95 First Hour auto-advances to Beginner when applicable steps done", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "bip39lab.firstHour",
        JSON.stringify({ h1: true, h2: true, h3: true, h4: true, h5: true })
      );
      localStorage.setItem(
        "bip39lab.quiz",
        JSON.stringify({ q1: true, q2: true, q3: true, q4: true })
      );
      localStorage.setItem("bip39lab.level", "starter");
    });
    await page.reload();
    await expect(page.locator("#learnLevel")).toHaveValue("beginner");
    await expect(page.locator('[data-hour-step="h6"] input')).toBeChecked();
    await expect(page.locator('[data-hour-step="h8"]')).toBeHidden();
    await expect(page.locator("#hourGoBeginner")).toBeHidden();
    await expect(page.locator("#btnReadyBeginner")).toBeHidden();
    await expect(page.locator("#quizHourNextBeginner")).toBeHidden();
    await expect(page.locator("#firstHourNext")).toBeVisible();
    await expect(page.locator('[data-hour-step="h8"]')).toBeHidden();
  });
});
