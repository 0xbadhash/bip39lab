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
    await expect(page.locator("#card-mnemonic")).toBeVisible();
    await expect(page.locator("#labStrip")).toBeVisible();
    await expect(page.locator('[data-hour-step="h1"]')).toHaveClass(/is-selected/);
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
    await expect(page.locator("#firstHourList [data-hour-step]")).toHaveCount(6);
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
    await expect(page.locator('[data-hour-step="h1"]')).toHaveClass(/is-selected/);
    await expect(page.locator("#labStrip")).toBeVisible();
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
    await expect(step.locator(".hour-name")).toHaveText("Generate 12-word");
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
    await expect(page.locator("#cardPathPlay")).toBeVisible();
    await expect(page.locator('[data-hour-step="h3"]')).not.toHaveClass(/hour-step-done/);
    await page.locator("#pathPlayIndex").click();
    await expect(page.locator('[data-hour-step="h3"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
  });

  test("S143 Passphrase step not green until Compare clicked", async ({ page }) => {
    await finishGenAddr(page);
    await page.locator('[data-hour-step="h3"]').click();
    await page.locator("#pathPlayIndex").click();
    await expect(page.locator('[data-hour-step="h3"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
    await page.locator('[data-hour-step="h4"]').click();
    await expect(page.locator("#cardCmpPp")).toBeVisible();
    await expect(page.locator('[data-hour-step="h4"]')).not.toHaveClass(/hour-step-done/);
    await page.locator("#btnCmpPp").click();
    await expect(page.locator("#cmpPpResult")).toBeVisible();
    await expect(page.locator('[data-hour-step="h4"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
  });

  test("S144 Self-check is not a First-hour step", async ({ page }) => {
    await expect(page.locator("#firstHourList")).not.toContainText(/Self-check/i);
    await expect(page.locator("#hourSelfCheck")).toHaveCount(0);
  });

  test("S145 mnemonic pad width matches First hour rail", async ({ page }) => {
    await expect(page.locator("#card-mnemonic")).toHaveClass(/hour-pad/);
    const w1 = await page.locator("#card-mnemonic").evaluate((el) => getComputedStyle(el).maxWidth);
    const w2 = await page.locator("#cardFirstHour").evaluate((el) => getComputedStyle(el).maxWidth);
    expect(w1).toBe(w2);
  });
});

test.describe("0.16.31 full-width face + ack cards + validate result", () => {
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

  test("S150 ack overlay is not a raw table hero (two is/isn’t cards)", async ({ page }) => {
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
    await expect(page.locator("#ackOverlay table")).toHaveCount(0);
    await expect(page.locator("#ackOverlay .ack-col-is")).toBeVisible();
    await expect(page.locator("#ackOverlay .ack-col-not")).toBeVisible();
    await expect(page.locator("#ackOverlay #orientationTable")).toContainText(/This lab is/i);
    await expect(page.locator("#ackUnderstand")).toBeVisible();
  });

  test("S151 #card-mnemonic width equals #cardFirstHour width (±8px)", async ({ page }) => {
    const a = await page.locator("#card-mnemonic").boundingBox();
    const b = await page.locator("#cardFirstHour").boundingBox();
    expect(a && b).toBeTruthy();
    expect(Math.abs(a!.width - b!.width)).toBeLessThanOrEqual(8);
  });

  test("S152 while hour step=1, Path / compare pads not visible in layout", async ({ page }) => {
    await expect(page.locator('[data-hour-step="h1"]')).toHaveClass(/is-selected/);
    await expect(page.locator("#panel-tools")).toBeHidden();
    await expect(page.locator("#hourPathPad")).toHaveCount(0);
    await expect(page.locator("#hourPpPad")).toHaveCount(0);
  });

  test("S153 Validate & derive after a phrase shows ≥1 .addr-text in the step-2 pad", async ({
    page,
  }) => {
    await page.locator("#btnGenerate").click();
    await expect(page.locator('[data-hour-step="h1"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
    await expect(page.locator("#labStrip")).toBeVisible();
    await page.locator("#btnDerive").click();
    await expect(page.locator("#addrTableBody .addr-text").first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator("#addrTableBody .addr-text")).toHaveCount(5);
    await expect(page.locator('[data-hour-step="h2"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
  });

  test("S154 rail labels include long form Fill addresses / Compare passphrases", async ({
    page,
  }) => {
    await expect(page.locator("#firstHourList")).toContainText(/Fill addresses/);
    await expect(page.locator("#firstHourList")).toContainText(/Passphrase compare/);
    await expect(page.locator("#firstHourList")).toContainText(/Generate 12-word/);
    await expect(page.locator("#firstHourList")).toContainText(/Set Beginner/);
  });
});

test.describe("0.16.32 existing cards only", () => {
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

  test("S160 Generate leaves #labStrip word tiles visible; address table is not the primary surface", async ({
    page,
  }) => {
    await page.locator("#btnGenerate").click();
    await expect(page.locator("#labStrip")).toBeVisible();
    await expect(page.locator("#stripWordGrid .ww").nth(0)).not.toHaveText("—");
    await expect(page.locator("#card-mnemonic")).toBeVisible();
    await expect(page.locator('[data-hour-step="h1"]')).toHaveClass(/is-selected/);
    const stripBox = await page.locator("#labStrip").boundingBox();
    const addrBox = await page.locator("#addrTable").boundingBox();
    expect(stripBox).toBeTruthy();
    if (addrBox) {
      expect(stripBox!.y).toBeLessThan(addrBox.y);
    }
  });

  test("S161 rail has 6 steps and no Self-check", async ({ page }) => {
    await expect(page.locator("#firstHourList [data-hour-step]")).toHaveCount(6);
    await expect(page.locator("#firstHourList")).not.toContainText(/Self-check/i);
    await expect(page.locator("#firstHourProgress")).toContainText(/0\s*\/\s*6/);
  });

  test("S162 step Path reveals #cardPathPlay", async ({ page }) => {
    await page.locator("#btnGenerate").click();
    await page.locator("#btnDerive").click();
    await expect(page.locator('[data-hour-step="h2"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
    await page.locator('[data-hour-step="h3"]').click();
    await expect(page.locator("#cardPathPlay")).toBeVisible();
    await expect(page.locator("#pathPlayChange")).toBeVisible();
  });

  test("S163 step Passphrase reveals #cardCmpPp", async ({ page }) => {
    await page.locator("#btnGenerate").click();
    await page.locator("#btnDerive").click();
    await page.locator('[data-hour-step="h3"]').click();
    await page.locator("#pathPlayIndex").click();
    await expect(page.locator('[data-hour-step="h3"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
    await page.locator('[data-hour-step="h4"]').click();
    await expect(page.locator("#cardCmpPp")).toBeVisible();
    await expect(page.locator("#btnCmpPp")).toBeVisible();
  });

  test("S164 Open Network is a button (button.btn or a.btn)", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "bip39lab.firstHour",
        JSON.stringify({ h1: true, h2: true, h3: true, h4: true })
      );
      if (window.LearnLevels && LearnLevels.refreshFirstHour) LearnLevels.refreshFirstHour();
    });
    await page.locator('[data-hour-step="h5"]').click();
    const open = page.locator("#hourOpenNetwork");
    await expect(open).toBeVisible();
    await expect(open).toHaveClass(/btn/);
    const tag = await open.evaluate((el) => el.tagName.toLowerCase());
    expect(tag === "a" || tag === "button").toBeTruthy();
  });

  test("S165 Set Beginner changes #learnLevel to beginner and shows #cardQuiz", async ({
    page,
  }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "bip39lab.firstHour",
        JSON.stringify({ h1: true, h2: true, h3: true, h4: true, h5: true })
      );
      if (window.LearnLevels && LearnLevels.refreshFirstHour) LearnLevels.refreshFirstHour();
    });
    await page.locator('[data-hour-step="h6"]').click();
    await page.locator("#hourGoBeginner").click();
    await expect(page.locator("#learnLevel")).toHaveValue("beginner");
    await expect(page.locator("#cardQuiz")).toBeVisible();
    await expect(page.locator("#cardQuiz")).toContainText(/wrong passphrase|Q1|entropy/i);
  });
});

test.describe("0.16.33 rail type size", () => {
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

  test("S166 computed font-size of current step name === future step name", async ({ page }) => {
    await page.locator("#btnGenerate").click();
    await expect(page.locator('[data-hour-step="h1"]')).toHaveClass(/hour-step-done/, {
      timeout: 8000,
    });
    const cur = page.locator('[data-hour-step="h1"] .hour-name');
    const fut = page.locator('[data-hour-step="h3"] .hour-name');
    await expect(cur).toBeVisible();
    await expect(fut).toBeVisible();
    const a = await cur.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    const b = await fut.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(Math.abs(a - b)).toBeLessThanOrEqual(0.5);
    const padA = await cur.evaluate((el) => getComputedStyle(el).padding);
    const padB = await fut.evaluate((el) => getComputedStyle(el).padding);
    expect(padA).toBe(padB);
  });
});

test.describe("0.16.34 stay on words + table + path SVG", () => {
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

  test("S170 after Generate, word tiles filled; Receive heading is not the hero", async ({
    page,
  }) => {
    await page.locator("#btnGenerate").click();
    await expect(page.locator("#card-mnemonic")).toBeVisible();
    await expect(page.locator("#labStrip")).toBeVisible();
    const filled = page.locator("#stripWordGrid .ww").filter({ hasNotText: "—" });
    await expect(filled).toHaveCount(12);
    await expect(page.locator("#headingReceive")).toBeHidden();
    await expect(page.locator("#tableScroll")).toBeHidden();
    await expect(page.locator("#addrTableBody .addr-text")).toHaveCount(0);
    await expect(page.locator('[data-hour-step="h1"]')).toHaveClass(/is-selected/);
  });

  test("S171 Validate fills address table, not the 512-bit essay", async ({ page }) => {
    await page.locator("#btnGenerate").click();
    await page.locator("#btnDerive").click();
    await expect(page.locator("#addrTableBody .addr-text").first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator("#addrTableBody tr:not(.empty-row)")).toHaveCount(5);
    await expect(page.locator("#card-mnemonic #addrTable")).toBeVisible();
    const essay = page.locator("summary").filter({ hasText: /Why .512 bits/i }).first();
    const tableBox = await page.locator("#addrTable").boundingBox();
    const essayBox = await essay.boundingBox();
    expect(tableBox).toBeTruthy();
    if (essayBox) expect(tableBox!.y).toBeLessThan(essayBox.y);
  });

  test("S172 #cardCmpPp offsetWidth <= #card-mnemonic offsetWidth + 16", async ({ page }) => {
    const mw = await page.locator("#card-mnemonic").evaluate((el) => el.getBoundingClientRect().width);
    await page.locator("#btnGenerate").click();
    await page.locator("#btnDerive").click();
    await expect(page.locator('[data-hour-step="h2"]')).toHaveClass(/hour-step-done/, { timeout: 8000 });
    await page.locator('[data-hour-step="h3"]').click();
    await page.locator("#pathPlayIndex").click();
    await page.locator('[data-hour-step="h4"]').click();
    await expect(page.locator("#cardCmpPp")).toBeVisible();
    const cw = await page.locator("#cardCmpPp").evaluate((el) => el.getBoundingClientRect().width);
    expect(cw).toBeLessThanOrEqual(mw + 16);
  });

  test("S173 Path card contains an svg that includes 84h or BIP84", async ({ page }) => {
    await page.locator("#btnGenerate").click();
    await page.locator("#btnDerive").click();
    await page.locator('[data-hour-step="h3"]').click();
    await expect(page.locator("#cardPathPlay svg")).toBeVisible();
    await expect(page.locator("#cardPathPlay")).toContainText(/84h|BIP84/i);
  });

  test("S174 Open Lab path controls is gone; Toggle is a .btn with a verb", async ({ page }) => {
    await page.locator("#btnGenerate").click();
    await page.locator("#btnDerive").click();
    await page.locator('[data-hour-step="h3"]').click();
    await expect(page.locator("#btnPathToLab")).toHaveCount(0);
    await expect(page.locator("#cardPathPlay")).not.toContainText(/Open Lab path controls/i);
    const tog = page.locator("#btnPathToggleChange");
    await expect(tog).toBeVisible();
    await expect(tog).toHaveClass(/btn/);
    await expect(tog).toContainText(/Toggle receive/i);
  });
});

test.describe("0.16.35 banner-width + sticky rail by level", () => {
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

  test("S180 air-gap banner offsetWidth === #card-mnemonic offsetWidth (±4)", async ({
    page,
  }) => {
    const bw = await page.locator("#labSafetyBanner").evaluate((el) => el.getBoundingClientRect().width);
    const mw = await page.locator("#card-mnemonic").evaluate((el) => el.getBoundingClientRect().width);
    expect(Math.abs(bw - mw)).toBeLessThanOrEqual(4);
  });

  test("S181 #cardCmpPp (when shown) offsetWidth === banner offsetWidth (±4)", async ({
    page,
  }) => {
    await page.locator("#btnGenerate").click();
    await page.locator("#btnDerive").click();
    await expect(page.locator('[data-hour-step="h2"]')).toHaveClass(/hour-step-done/, { timeout: 8000 });
    await page.locator('[data-hour-step="h3"]').click();
    await page.locator("#pathPlayIndex").click();
    await page.locator('[data-hour-step="h4"]').click();
    await expect(page.locator("#cardCmpPp")).toBeVisible();
    await page.waitForTimeout(120);
    await page.evaluate(() => {
      if (window.LearnLevels && LearnLevels.syncWorkColumnWidth) LearnLevels.syncWorkColumnWidth();
    });
    const bw = await page.locator("#labSafetyBanner").evaluate((el) => el.getBoundingClientRect().width);
    const cw = await page.locator("#cardCmpPp").evaluate((el) => el.getBoundingClientRect().width);
    expect(Math.abs(cw - bw)).toBeLessThanOrEqual(4);
  });

  test("S182 First hour rail is sticky and stays in viewport after scrolling mnemonic", async ({
    page,
  }) => {
    const pos = await page.locator("#cardFirstHour").evaluate((el) => getComputedStyle(el).position);
    expect(pos).toBe("sticky");
    await page.locator("#card-mnemonic").evaluate((el) => el.scrollIntoView({ block: "end" }));
    await page.waitForTimeout(200);
    const box = await page.locator("#cardFirstHour").boundingBox();
    expect(box).toBeTruthy();
    expect(box!.y).toBeGreaterThanOrEqual(-2);
    expect(box!.y).toBeLessThan(120);
  });

  test("S183 changing #learnLevel to intermediate replaces Starter rail labels", async ({
    page,
  }) => {
    await expect(page.locator("#firstHourList")).toContainText(/Generate 12-word/);
    await page.locator("#learnLevel").selectOption("intermediate");
    await expect(page.locator("#firstHourList")).not.toContainText(/Generate 12-word/);
    await expect(page.locator("#firstHourList")).toContainText(/Keys≠shares|Multisig|PSBT/i);
    await expect(page.locator("#firstHourList")).not.toContainText(/Set Beginner/);
  });
});
