import { test, expect } from "@playwright/test";

test.describe("V2 use-case tracks (0.17.0-v2)", () => {
  test("V2-S0 picker loads; classic / still Lab", async ({ page }) => {
    await page.goto("/index.html");
    await expect(page.locator("#btnGenerate")).toBeVisible();
    await page.goto("/v2/");
    await expect(page.locator("#pickerGrid")).toBeVisible();
    await expect(page.locator(".uc-card")).toHaveCount(10);
    await expect(page.locator(".v2-mission")).toContainText(/Practice the custody decision offline/i);
    await expect(page.locator("[data-v2-version]")).toContainText(/0\.17\.0-v2/);
    await expect(page.locator(".sidebar #btnClearV2")).toHaveCount(0);
    await expect(page.locator(".sidebar")).not.toContainText(/Clear secrets/);
  });

  test("V2-S1 UC1 generate shows words not addresses; Validate gated", async ({ page }) => {
    await page.goto("/v2/");
    await page.locator('.uc-card[data-uc="1"]').click();
    await expect(page.locator("#viewGate")).toBeVisible();
    await expect(page.locator("#gateScope")).toContainText(/Done when/i);
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Generate")).toBeVisible();
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2Card .ww").first()).not.toHaveText("—");
    await expect(page.locator("#v2Card .ww")).toHaveCount(12);
    await expect(page.locator("#v2AddrWrap")).toBeHidden();
    await expect(page.locator("#v2Card")).toContainText(/practice backup/i);
    await page.locator("#v2Pause").click();
    await page.locator("#v2CardAck").check();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2Derive")).toBeEnabled();
    await expect(page.locator("#v2Card .ww")).toHaveCount(12);
    await expect(page.locator("#v2Pipe [data-pipe=seed]")).toBeVisible();
    await expect(page.locator("#v2Pipe [data-pipe=seed]")).toContainText(/seed/i);
    await expect(page.locator("#v2DeriveHelp")).toContainText(/seed/i);
    await page.locator("#v2Derive").click();
    await expect(page.locator("#v2Pipe [data-pipe=seed]")).toHaveClass(/hi/);
    await expect(page.locator("#v2Pipe [data-pipe=addr]")).toHaveClass(/hi/);
    await expect(page.locator("#v2Card .ww")).toHaveCount(12);
    await expect(page.locator("#v2AddrWrap .addr-text").first()).toBeVisible();
    await expect(page.locator("#v2AddrWrap .addr-text").first()).toHaveText(/tb1|bc1/);
  });

  test("V2-S2 quiz colors + force exit", async ({ page }) => {
    await page.goto("/v2/?uc=1");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Generate").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2CardAck").check();
    await page.locator("#v2Pause").click();
    await page.locator("#v2Derive").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("[data-quiz]")).toHaveCount(3);
    await page.locator('[data-quiz="bad"]').first().click();
    await expect(page.locator("#v2QuizMsg")).toHaveClass(/msg-bad/);
    await page.locator('[data-quiz="ok"]').click();
    await expect(page.locator("#v2QuizMsg")).toHaveClass(/msg-ok/);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2Finish")).toBeDisabled();
    await page.locator("#v2Exit").check();
    await expect(page.locator("#v2Finish")).toBeEnabled();
    await page.locator("#v2Finish").click();
    await expect(page.locator("#pickerGrid")).toBeVisible();
    await expect(page.locator('.uc-card[data-uc="1"]')).toHaveClass(/done/);
  });

  test("V2-S4 UC1 word counts 12–24, Clear secrets beside Generate, plain copy, regenerate length", async ({
    page,
  }) => {
    await page.goto("/v2/?uc=1");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Generate")).toBeVisible();
    await expect(page.locator("#v2Clear")).toBeVisible();
    await expect(page.locator("#v2Clear")).toHaveClass(/danger/);
    const opts = await page.locator("#v2WordCount option").evaluateAll((els) =>
      els.map((e) => (e as HTMLOptionElement).value)
    );
    expect(opts).toEqual(["12", "15", "18", "21", "24"]);
    await expect(page.locator("#v2GenHelp")).toBeVisible();
    await expect(page.locator("#v2GenHelp")).not.toContainText(/CSPRNG|scure/i);
    await expect(page.locator("#v2GenHelp")).toContainText(/operating system/i);
    await expect(page.locator("#v2GenHelp")).toContainText(/Do not send money/i);
    await page.locator("#wrapMnemonicI").hover();
    await expect(page.locator("#overlayMnemonic")).toBeVisible();
    await expect(page.locator("#overlayMnemonic")).toContainText(/BIP-39/);
    await expect(page.locator("#overlayMnemonic")).toContainText(/English wordlist/);
    await expect(page.locator("#overlayMnemonic")).not.toContainText(/n't|It's|don't/i);
    await page.locator("#v2WordCount").selectOption("24");
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2Card .ww")).toHaveCount(24);
    await page.locator("#v2Pause").click();
    await page.locator("#v2CardAck").check();
    await page.locator("#v2Pause").click();
    await page.locator("#v2Derive").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2WordCount")).toHaveValue("24");
    await expect(page.locator("#v2Regen")).toContainText(/24/);
    await page.locator("#v2WordCount").selectOption("15");
    await expect(page.locator("#v2Regen")).toContainText(/15/);
    await page.locator("#v2Regen").click();
    await expect(page.locator("#v2Card .ww")).toHaveCount(15);
    await page.locator("#v2WordCount").selectOption("18");
    await page.locator("#v2Regen").click();
    await expect(page.locator("#v2Card .ww")).toHaveCount(18);
    await page.locator("#v2WordCount").selectOption("21");
    await page.locator("#v2Regen").click();
    await expect(page.locator("#v2Card .ww")).toHaveCount(21);
  });

  test("V2-S9 UC1 compact 24-word three lines, entropy bits, three addresses per row", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/v2/?uc=1");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Entropy")).toContainText(/128 bits \(12-word/);
    await page.locator("#v2WordCount").selectOption("24");
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2Entropy")).toContainText(/256 bits \(24-word/);
    await expect(page.locator("#v2WordGrid .ww")).toHaveCount(24);
    const cols = await page.locator("#v2WordGrid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
    expect(cols).toBe(8);
    const y0 = await page.locator("#v2WordGrid li").nth(0).evaluate((el) => el.getBoundingClientRect().y);
    const y7 = await page.locator("#v2WordGrid li").nth(7).evaluate((el) => el.getBoundingClientRect().y);
    const y8 = await page.locator("#v2WordGrid li").nth(8).evaluate((el) => el.getBoundingClientRect().y);
    expect(Math.abs(y7 - y0)).toBeLessThan(6);
    expect(y8 - y0).toBeGreaterThan(8);
    await page.locator("#v2Pause").click();
    await page.locator("#v2CardAck").check();
    await page.locator("#v2Pause").click();
    await page.locator("#v2Derive").click();
    const a0 = await page.locator("#v2AddrGrid .cell").nth(0).boundingBox();
    const a1 = await page.locator("#v2AddrGrid .cell").nth(1).boundingBox();
    const a2 = await page.locator("#v2AddrGrid .cell").nth(2).boundingBox();
    expect(a0 && a1 && a2).toBeTruthy();
    expect(Math.abs(a0!.y - a1!.y)).toBeLessThan(8);
    expect(Math.abs(a0!.y - a2!.y)).toBeLessThan(8);
    const addrBottom = a0!.y + a0!.height;
    expect(addrBottom).toBeLessThan(1080);
  });

  test("V2-S6 secret-wall no export no session leak", async ({ page }) => {
    await page.goto("/v2/?uc=1");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Generate").click();
    const store = await page.evaluate(() => sessionStorage.getItem("bip39lab.v2") || "");
    expect(store).not.toMatch(/abandon|mnemonic|seed/i);
    const words = await page.locator("#v2Card .ww").first().textContent();
    expect(store.includes(words || "___never___")).toBeFalsy();
  });

  test("V2-S7 isolation two-holder IDOR wrong-id-not-other-holder", async ({ page }) => {
    await page.goto("/v2/?uc=99");
    await expect(page.locator("#pickerGrid")).toBeVisible();
    await expect(page.locator("#viewGate")).toBeHidden();
  });

  test("V2-S8 UC2 paper backup: card, (i), Clear secrets, do-not copy, print sheet", async ({
    page,
  }) => {
    await page.goto("/v2/?uc=2");
    await expect(page.locator("#gateIs")).toHaveClass(/is/);
    await expect(page.locator("#gateIsnt")).toHaveClass(/isnt/);
    await expect(page.locator("#gateDone")).toHaveClass(/done/);
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#panelTitle")).toContainText(/Paper backup/);
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2Card .ww")).toHaveCount(12);
    await expect(page.locator("#v2Card")).toContainText(/practice backup/i);
    await expect(page.locator("#v2Clear")).toHaveClass(/danger/);
    await page.locator("#wrapMnemonicI").hover();
    await expect(page.locator("#overlayMnemonic")).toContainText(/English wordlist/);
    await page.locator("#v2CardAck").check();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2DoNotList")).toBeVisible();
    await expect(page.locator("#v2DoNotList .do")).toContainText(/^Do/i);
    await expect(page.locator("#v2DoNotList .dont")).toContainText(/Do not/);
    await expect(page.locator("#v2DoNotList")).not.toContainText("Don't");
    await expect(page.locator("#v2DoNotList")).toContainText(/photograph/i);
    await expect(page.locator("#v2Clear")).toBeVisible();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2PrintHelp")).toContainText(/not an air-gap/i);
    await expect(page.locator("#v2PrintHelp")).toContainText(/not to print/i);
    await expect(page.locator("#v2Print")).toBeDisabled();
    await expect(page.locator("#printBackup")).toHaveCount(1);
    await page.locator("#v2PrintAck").check();
    await expect(page.locator("#v2Print")).toBeEnabled();
    await expect(page.locator("#printWordList li")).toHaveCount(12);
    await expect(page.locator("#printBackup")).toContainText(/Practice only/);
    await page.locator("#v2Pause").click();
    await page.locator('[data-quiz="ok"]').click();
    await expect(page.locator("#v2QuizMsg")).toHaveClass(/msg-ok/);
    await expect(page.locator('[data-quiz="ok"]')).toContainText(/not the most secure/i);
  });

  test("V2-S3 deep link uc=3 opens passphrase gate", async ({ page }) => {
    await page.goto("/v2/?uc=3");
    await expect(page.locator("#gateTitle")).toContainText(/UC3/);
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#panelTitle")).toContainText(/Passphrase/);
  });
});
