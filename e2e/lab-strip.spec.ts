import { test, expect } from "@playwright/test";
import { dismissAck } from "./helpers";

test.describe("gradual visual teach strip (0.16.25–0.16.29)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.clear();
        localStorage.setItem("lab:ack-v1", "1");
      } catch (e) {
        /* ignore */
      }
    });
    await page.goto("/index.html");
    await dismissAck(page);
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

  test("S117 #btnReadyBeginner stays hidden", async ({ page }) => {
    await expect(page.locator("#btnReadyBeginner")).toBeHidden();
    await page.locator('#firstHourList [data-hour-step="h1"]').click();
    await expect(page.locator("#btnReadyBeginner")).toBeHidden();
  });

  test("S118 Generate click auto-marks first-hour step 1 (no Mark done required)", async ({
    page,
  }) => {
    await expect(page.locator("#hourRailDone")).toBeHidden();
    await page.locator("#btnGenerate").click();
    await expect(page.locator('[data-hour-step="h1"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
    await expect(page.locator("#mnemonic")).not.toHaveValue("");
    await expect(page.locator('[data-hour-step="h2"]')).toHaveClass(/is-selected/);
  });

  test("S119 Derive/validate with a phrase auto-marks step 2", async ({ page }) => {
    await page.locator("#btnGenerate").click();
    await expect(page.locator("#mnemonic")).not.toHaveValue("");
    await page.locator("#btnDerive").click();
    await expect(page.locator('[data-hour-step="h2"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
  });

  test("S120 #hourRailDone hidden for generate/address steps", async ({ page }) => {
    await page.locator('#firstHourList [data-hour-step="h1"]').click();
    await expect(page.locator("#hourRailDone")).toBeHidden();
  });

  test("S121 hover #btnGenerate shows overlay with practice recovery phrase; no OK", async ({
    page,
  }) => {
    await page.locator("#btnGenerate").hover();
    await expect(page.locator("#overlayGenerate")).toBeVisible();
    await expect(page.locator("#overlayGenerate")).toContainText(/practice recovery phrase/i);
    await expect(page.locator("#overlayGenerate .lab-overlay-ok")).toHaveCount(0);
    await expect(page.locator("#overlayGenerate")).not.toContainText(/^OK$/);
    await expect(page.locator("#wrapGenerate button.lab-overlay-ok")).toHaveCount(0);
  });
});

test.describe("0.16.29 first-run ack + 7-step rail", () => {
  test("S130 first load without lab:ack-v1 shows ack overlay", async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.clear();
        localStorage.removeItem("lab:ack-v1");
      } catch (e) {
        /* ignore */
      }
    });
    await page.goto("/index.html");
    await expect(page.locator("#ackOverlay")).toBeVisible();
    await expect(page.locator("#ackOverlay #orientationTable")).toContainText(/This lab is/i);
    await expect(page.locator("#ackUnderstand")).toBeVisible();
    await expect(page.locator("#ackOverlay button")).toHaveCount(1);
    await expect(page.locator("#cardOrientation")).toBeHidden();
  });

  test("S131 ack click sets lab:ack-v1 and lands on Generate", async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto("/index.html");
    await page.locator("#ackUnderstand").click();
    await expect(page.locator("#ackOverlay")).toBeHidden();
    const ack = await page.evaluate(() => localStorage.getItem("lab:ack-v1"));
    expect(ack).toBe("1");
    await expect(page.locator('[data-hour-step="h1"]')).toHaveClass(/is-selected/);
    await expect(page.locator("#btnGenerate")).toBeVisible();
  });

  test("S132 rail has 7 steps horizontal (no Air-gap warn)", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("lab:ack-v1", "1"));
    await page.goto("/index.html");
    await expect(page.locator("#firstHourList [data-hour-step]")).toHaveCount(7);
    await expect(page.locator("#firstHourList")).not.toContainText(/Air-gap warn/i);
    await expect(page.locator("#firstHourList")).toContainText(/Generate/);
    const display = await page.locator("#firstHourList").evaluate((el) => getComputedStyle(el).display);
    expect(display).toContain("flex");
  });

  test("S133 Generate auto-completes step 1 and selects step 2", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("lab:ack-v1", "1"));
    await page.goto("/index.html");
    await page.locator("#btnGenerate").click();
    await expect(page.locator('[data-hour-step="h1"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
    await expect(page.locator('[data-hour-step="h2"]')).toHaveClass(/is-selected/);
  });

  test("S134 Starter step 1: passphrase strength + quiz board not visible", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("lab:ack-v1", "1"));
    await page.goto("/index.html");
    await expect(page.locator("#ppStrengthBlock")).toBeHidden();
    await expect(page.locator("#cardQuiz")).toBeHidden();
  });

  test("S135 Reset first hour clears lab:ack-v1", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("lab:ack-v1", "1"));
    await page.goto("/index.html");
    page.once("dialog", (d) => d.accept());
    await page.locator("#btnResetFirstHour").click();
    const ack = await page.evaluate(() => localStorage.getItem("lab:ack-v1"));
    expect(ack).toBeFalsy();
    await expect(page.locator("#ackOverlay")).toBeVisible();
  });
});

test.describe("0.16.30 tiles + path/PP/self-check", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.clear();
        localStorage.setItem("lab:ack-v1", "1");
      } catch (e) {
        /* ignore */
      }
    });
    await page.goto("/index.html");
  });

  async function finishGenAddr(page: import("@playwright/test").Page) {
    await page.locator("#btnGenerate").click();
    await expect(page.locator('[data-hour-step="h1"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
    await page.locator("#btnDerive").click();
    await expect(page.locator('[data-hour-step="h2"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
  }

  test("S140 word tile = separate .wi square + .ww rect; 12 tiles at wordcount 12", async ({
    page,
  }) => {
    await page.locator("#wordCount").selectOption("12");
    const tiles = page.locator("#stripWordGrid li:not(.strip-empty)");
    await expect(tiles).toHaveCount(12);
    await expect(tiles.first().locator(".wi")).toBeVisible();
    await expect(tiles.first().locator(".ww")).toBeVisible();
    const wi = await tiles.first().locator(".wi").boundingBox();
    const ww = await tiles.first().locator(".ww").boundingBox();
    expect(wi && ww).toBeTruthy();
    expect(Math.abs(wi!.width - wi!.height)).toBeLessThan(6);
    expect(ww!.x).toBeGreaterThan(wi!.x + wi!.width - 2);
  });

  test("S141 rail: step number is not inside the name chip (two nodes)", async ({ page }) => {
    const step = page.locator('[data-hour-step="h1"]');
    await expect(step.locator(".hour-num-circle")).toHaveText("1");
    await expect(step.locator(".hour-name")).toHaveText("Generate");
    const circ = await step.locator(".hour-num-circle").boundingBox();
    const name = await step.locator(".hour-name").boundingBox();
    expect(circ && name).toBeTruthy();
    expect(name!.x).toBeGreaterThan(circ!.x + circ!.width - 4);
  });

  test("S142 Path does not complete until receive/change or index is toggled", async ({
    page,
  }) => {
    await finishGenAddr(page);
    await page.locator('[data-hour-step="h3"]').click();
    await expect(page.locator("#hourPathPad")).toBeVisible();
    await expect(page.locator('[data-hour-step="h3"]')).not.toHaveClass(/hour-step-done/);
    await page.locator("#hourPathIndex").click();
    await expect(page.locator('[data-hour-step="h3"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
  });

  test("S143 Passphrase step not green until Compare clicked", async ({ page }) => {
    await finishGenAddr(page);
    await page.locator('[data-hour-step="h3"]').click();
    await page.locator("#hourPathIndex").click();
    await expect(page.locator('[data-hour-step="h3"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
    await page.locator('[data-hour-step="h4"]').click();
    await expect(page.locator("#hourPpPad")).toBeVisible();
    await expect(page.locator('[data-hour-step="h4"]')).not.toHaveClass(/hour-step-done/);
    await page.locator("#hourPpCompare").click();
    await expect(page.locator("#hourPpResult")).toBeVisible();
    await expect(page.locator('[data-hour-step="h4"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
  });

  test("S144 click Self-check shows Continue pad (not empty)", async ({ page }) => {
    await finishGenAddr(page);
    await page.locator('[data-hour-step="h3"]').click();
    await page.locator("#hourPathIndex").click();
    await expect(page.locator('[data-hour-step="h3"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
    await page.locator('[data-hour-step="h4"]').click();
    await page.locator("#hourPpCompare").click();
    await expect(page.locator('[data-hour-step="h4"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
    await page.locator('[data-hour-step="h5"]').click();
    await expect(page.locator("#hourSelfCheck")).toBeVisible();
    await expect(page.locator("#hourSelfCheckContinue")).toBeVisible();
    await expect(page.locator("#hourSelfCheck")).toContainText(/Q1–Q4|Q1-Q4|quiz exists/i);
  });

  test("S145 all hour work pads share one content width class", async ({ page }) => {
    await expect(page.locator("#card-mnemonic")).toHaveClass(/hour-pad/);
    await expect(page.locator("#hourPathPad")).toHaveClass(/hour-pad/);
    await expect(page.locator("#hourPpPad")).toHaveClass(/hour-pad/);
    await expect(page.locator("#hourSelfCheck")).toHaveClass(/hour-pad/);
    const w1 = await page.locator("#card-mnemonic").evaluate((el) => getComputedStyle(el).maxWidth);
    const w2 = await page.locator("#hourPathPad").evaluate((el) => getComputedStyle(el).maxWidth);
    expect(w1).toBe(w2);
  });
});
