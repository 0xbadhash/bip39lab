import { test, expect } from "@playwright/test";

test.describe("V2 use-case tracks (0.17.41-v2)", () => {
  test("V2-S0 picker loads; classic / still Lab", async ({ page }) => {
    await page.goto("/index.html");
    await expect(page.locator("#btnGenerate")).toBeVisible();
    await page.goto("/v2/");
    await expect(page.locator("#pickerGrid")).toBeVisible();
    await expect(page.locator(".uc-card")).toHaveCount(15);
    await expect(page.locator(".v2-mission")).toContainText(/Practice the custody decision offline/i);
    await expect(page.locator("[data-v2-version]")).toContainText(/0\.17\.41-v2/);
    await expect(page.locator(".sidebar #btnClearV2")).toHaveCount(0);
    await expect(page.locator(".sidebar")).not.toContainText(/Clear secrets/);
    await expect(page.locator(".topbar-actions #v2Clear")).toBeVisible();
    await expect(page.locator(".topbar-actions #v2Clear")).toHaveClass(/danger/);
  });

  test("V2-S1 UC1 generate shows words not addresses; Validate gated", async ({ page }) => {
    await page.goto("/v2/");
    await page.locator('.uc-card[data-uc="1"]').click();
    await expect(page.locator("#viewGate")).toBeVisible();
    await expect(page.locator("#gateScope")).toContainText(/Done when/i);
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Generate")).toBeVisible();
    await expect(page.locator(".v2-donot .do")).toBeVisible();
    await expect(page.locator(".v2-donot .dont")).toContainText(/Do not import/i);
    await expect(page.locator("#v2OsLock")).toBeVisible();
    await expect(page.locator("#v2OsLock")).toHaveClass(/idle/);
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2OsLock")).toHaveClass(/ok/);
    await expect(page.locator("#v2OsLock")).toContainText(/Stronger seed/i);
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
    await expect(page.locator("#v2Net")).toBeVisible();
    await expect(page.locator("#v2Net")).toHaveValue("test");
    await page.locator("#v2Derive").click();
    await expect(page.locator("#v2AddrWrap .addr-text").first()).toHaveText(/^tb1/);
    await page.locator("#v2Net").selectOption("main");
    await expect(page.locator("#v2AddrWrap .addr-text").first()).toHaveText(/^bc1/);
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
    await expect(page.locator("#v2Entropy")).toContainText(/128 bits/);
    await expect(page.locator("#v2Entropy")).toContainText(/12-word BIP-39/);
    await page.locator("#v2WordCount").selectOption("24");
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2Entropy")).toContainText(/256 bits/);
    await expect(page.locator("#v2Entropy")).toContainText(/24-word BIP-39/);
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
    await expect(page.locator("#uc2Viz .atom")).toHaveCount(3);
    await expect(page.locator('#uc2Viz [data-atom="1"]')).toHaveClass(/hi/);
    await page.locator("#wrapMnemonicI").hover();
    await expect(page.locator("#overlayMnemonic")).toContainText(/English wordlist/);
    await page.locator("#v2CardAck").check();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2DoNotList")).toBeVisible();
    await expect(page.locator("#v2DoNotList .do")).toContainText(/^Do/i);
    await expect(page.locator("#v2DoNotList .dont")).toContainText(/Do not/);
    await expect(page.locator("#v2DoNotList")).not.toContainText("Don't");
    await expect(page.locator("#v2DoNotList")).toContainText(/photograph/i);
    await expect(page.locator("#trackBody .v2-pp-key-img")).toBeVisible();
    await expect(page.locator("#trackBody .v2-pp-key-img")).toHaveAttribute("src", /beginner-key\.png/);
    await expect(page.locator("#v2Clear")).toBeVisible();
    await page.locator("#v2Pause").click();
    await expect(page.locator('#uc2Viz [data-atom="3"]')).toHaveClass(/hi/);
    await expect(page.locator("#v2PrintHelp")).toContainText(/not an air-gap/i);
    await expect(page.locator("#v2PrintHelp")).toContainText(/not to print/i);
    await expect(page.locator("#v2Print")).toBeDisabled();
    await expect(page.locator("#printBackup")).toHaveCount(1);
    await page.locator("#v2PrintAck").check();
    await expect(page.locator("#v2Print")).toBeEnabled();
    await expect(page.locator("#printWordList li")).toHaveCount(12);
    await expect(page.locator("#printBackup")).toContainText(/Practice only/);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2Uc2Quiz [data-quiz]")).toHaveCount(4);
    await page.locator("#v2Qhand").click();
    await expect(page.locator("#v2QuizMsg")).not.toContainText(/Select both right sentences/i);
    await expect(page.locator("#v2Pause")).toBeDisabled();
    await page.locator("#v2Qprint").click();
    await expect(page.locator("#v2QuizMsg")).toHaveClass(/msg-ok/);
    await expect(page.locator("#v2Qhand")).toContainText(/Write the numbered cells by hand/);
    await expect(page.locator("#v2Qprint")).toContainText(/not the most secure/);
  });

  test("V2-S3 deep link uc=3 opens passphrase gate", async ({ page }) => {
    await page.goto("/v2/?uc=3");
    await expect(page.locator("#gateTitle")).toContainText(/UC3/);
    await expect(page.locator("#gateIs")).toHaveClass(/is/);
    await expect(page.locator("#gateIsnt")).toHaveClass(/isnt/);
    await expect(page.locator("#gateDone")).toHaveClass(/done/);
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#panelTitle")).toContainText(/Passphrase/);
    await expect(page.locator("#trackBody .v2-pp-key-img")).toBeVisible();
    await expect(page.locator("#trackBody .v2-pp-key-img")).toHaveAttribute("src", /beginner-key\.png/);
    await expect(page.locator(".v2-donot .do")).toBeVisible();
    await expect(page.locator(".v2-donot .dont")).toBeVisible();
    await expect(page.locator("#v2WordCount option")).toHaveCount(5);
    await page.locator("#v2WordCount").selectOption("24");
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2Card .ww")).toHaveCount(24);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2PpKeyUc3b .v2-pp-key-img")).toBeVisible();
    await page.locator("#v2Cmp").click();
    await expect(page.locator(".v2-verdict")).toContainText(/two wallets/i);
    await expect(page.locator("#v2CmpOut")).not.toContainText(/empty vs empty/i);
  });

  test("V2-S10 UC4 index increments; Back to index 0", async ({ page }) => {
    await page.goto("/v2/?uc=4");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2PathDemo")).toContainText("m/84'/1'/0'/0/0");
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2PathLine")).toHaveText("m/84'/1'/0'/0/0");
    await expect(page.locator("#v2Idx")).toHaveText(/Show index 1 \(next receive address\)/);
    const t0 = await page.locator("#v2Tail").textContent();
    await page.locator("#v2Idx").click();
    await expect(page.locator("#v2PathLine")).toHaveText("m/84'/1'/0'/0/1");
    await expect(page.locator("#v2Idx")).toHaveText(/Show index 2/);
    const t1 = await page.locator("#v2Tail").textContent();
    expect(t1).not.toEqual(t0);
    await page.locator("#v2Idx").click();
    await expect(page.locator("#v2PathLine")).toHaveText("m/84'/1'/0'/0/2");
    await page.locator("#v2IdxZero").click();
    await expect(page.locator("#v2PathLine")).toHaveText("m/84'/1'/0'/0/0");
    await expect(page.locator("#v2Idx")).toHaveText(/Show index 1 \(next receive address\)/);
  });

  test("V2-S11 UC6 three cosigner zpubs; rail back to M-of-N", async ({ page }) => {
    await page.goto("/v2/?uc=6");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2MofnPic")).toContainText(/M = 2/);
    await expect(page.locator("#v2MofnPic")).toContainText(/N = 3/);
    await page.locator("#v2Pause").click();
    await expect(page.locator(".v2-cosigner")).toHaveCount(3);
    await expect(page.locator("#v2Pause")).toBeDisabled();
    for (let i = 0; i < 3; i++) {
      await page.locator(`[data-cs-gen="${i}"]`).click();
      await expect(page.locator(".v2-cosigner").nth(i).locator(".ww").first()).not.toHaveText("—");
      await page.locator(`[data-cs-zpub="${i}"]`).click();
      await expect(page.locator(`#v2CsZpub${i}`)).toHaveText(/^zpub/);
    }
    await expect(page.locator("#v2CsReady")).toBeVisible();
    await expect(page.locator("#v2Pause")).toBeEnabled();
    await page.locator("#v2Pause").click();
    await page.locator('[data-quiz="bad"]').first().click();
    await expect(page.locator("#v2QuizMsg")).toContainText(/Wrong/);
    await expect(page.locator("#v2QuizMsg")).toContainText(/Shamir/i);
    await page.locator('.rail-jump[data-step="0"]').click();
    await expect(page.locator("#v2MofnPic")).toBeVisible();
    await page.locator('[data-concept-step="1"]').click();
    await expect(page.locator(".v2-cosigner")).toHaveCount(3);
  });

  test("V2-S12 quiz wrong answer explains why", async ({ page }) => {
    await page.goto("/v2/?uc=1");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Generate").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2CardAck").check();
    await page.locator("#v2Pause").click();
    await page.locator("#v2Derive").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2Pause").click();
    await page.locator('[data-quiz="bad"]').first().click();
    await expect(page.locator("#v2QuizMsg")).toHaveClass(/msg-bad/);
    await expect(page.locator("#v2QuizMsg")).toContainText(/Wrong/);
    await expect(page.locator("#v2QuizMsg")).toContainText(/refund/i);
    await expect(page.locator("#v2QuizMsg")).not.toContainText(/Not that one/i);
    await page.locator('#conceptStrip [data-concept-step="0"]').click();
    await expect(page.locator("#v2Generate")).toBeVisible();
    await expect(page.locator('#uc1Viz [data-atom="1"]')).toHaveClass(/hi/);
    await page.locator('#conceptStrip [data-concept-step="2"]').click();
    await expect(page.locator("#v2Derive")).toBeVisible();
    await expect(page.locator('#uc1Viz [data-atom="2"]')).toHaveClass(/hi/);
    await expect(page.locator("#uc1Viz .atom")).toHaveCount(3);
    await expect(page.locator("#v2WordGrid, #v2Card .ww").first()).toBeVisible();
  });

  test("V2-S13 UC3–UC13 concept atoms mount", async ({ page }) => {
    for (const uc of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]) {
      await page.goto(`/v2/?uc=${uc}`);
      const start = page.locator("#btnGateStart");
      if (await start.isVisible()) await start.click();
      await expect(page.locator(`#uc${uc}Viz .atom`)).toHaveCount(3);
      await expect(page.locator(`#uc${uc}Viz [data-atom="1"]`)).toHaveClass(/hi/);
      if (uc === 8) {
        await page.locator("#v2Pause").click();
        await page.locator("#v2Psbt").click();
        await expect(page.locator("#v2PsbtOut")).toContainText(/What this is/i);
        await expect(page.locator("#v2PsbtOut")).not.toContainText("{");
      }
    }
  });

  test("V2-S14 UC11–UC13 pads, quiz, force exit", async ({ page }) => {
    await page.goto("/v2/?uc=11");
    await page.locator("#btnGateStart").click();
    await expect(page.locator(".v2-donot .do")).toBeVisible();
    await expect(page.locator("#v2Who")).toBeVisible();
    await page.locator("#v2Who-ex-they").click();
    await page.locator("#v2Who-app-they").click();
    await page.locator("#v2Who-paper-you").click();
    await page.locator("#v2Who-bank-they").click();
    await expect(page.locator("#v2Who-ex-they")).toHaveClass(/v2-who-ok/);
    await page.locator("#v2Who-paper-they").click();
    await expect(page.locator("#v2Who-paper-they")).toHaveClass(/v2-who-bad/);
    await page.locator("#v2Who-paper-you").click();
    await expect(page.locator("#v2Who-paper-you")).toHaveClass(/v2-who-ok/);
    await expect(page.locator("#v2WhoOut")).toContainText(/company/i);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2Pause")).toContainText(/no seed/i);
    await expect(page.locator("#v2Pause")).toBeDisabled();
    await expect(page.locator("#v2ExBal .v2-btc-num")).toHaveText("0.184");
    await expect(page.locator("#v2ExBal")).toContainText(/bitcoin/i);
    await page.locator("#v2ExExport").click();
    await expect(page.locator("#v2ExExportNote")).toContainText(/seed phrase/i);
    await expect(page.locator("#v2ExExportNote")).toHaveClass(/v2-callout/);
    await page.locator("#v2ExRestore").click();
    await expect(page.locator("#v2ExRestoreOut")).toContainText(/cannot open|seed phrase/i);
    await expect(page.locator("#v2ExRestoreOut")).toHaveClass(/v2-callout/);
    await expect(page.locator("#v2ExTimer")).toContainText(/seconds/i);
    await expect(page.locator("#v2ExBal")).toHaveClass(/is-frozen/, { timeout: 12000 });
    await expect(page.locator("#v2ExBal .v2-btc-num")).toHaveText("0.184");
    await expect(page.locator("#v2ExBal")).toContainText(/0\.184 bitcoin/i);
    await expect(page.locator("#v2ExTimer")).toContainText(/locked out/i);
    await expect(page.locator("#v2ExRestore")).toBeDisabled();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#trackBody h2")).toContainText(/You hold/i);
    await expect(page.locator("#v2HoldBal .v2-btc-num")).toHaveText("0.184");
    await expect(page.locator(".v2-hold-split")).toBeVisible();
    await expect(page.locator("#v2HoldOneH")).toContainText(/One signer/i);
    await expect(page.locator("#v2HoldMsH")).toContainText(/Co-signer/i);
    await page.locator("#v2HoldSpend").click();
    await expect(page.locator("#v2HoldSpendOut")).toHaveClass(/v2-callout/);
    await page.locator("#v2HoldLose").click();
    await page.locator("#v2HoldMsAlone").click();
    await page.locator("#v2HoldMsPaper").click();
    await page.locator("#v2HoldMsSend").click();
    await page.locator("#v2Pause").click();
    await page.locator('[data-quiz="ok"]').click();
    await expect(page.locator("#v2QuizMsg")).toHaveClass(/msg-ok/);
    await page.locator("#v2Pause").click();
    await page.locator("#v2Exit").check();
    await page.locator("#v2Finish").click();
    await expect(page.locator('.uc-card[data-uc="11"]')).toHaveClass(/done/);

    await page.goto("/v2/?uc=12");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#uc12Viz .atom")).toHaveCount(3);
    await expect(page.locator("#trackBody h2")).toContainText(/Hot wallet on phone/i);
    await page.locator("#v2PlacePhone").click();
    await expect(page.locator("#v2PhoneAmt")).toContainText(/0\.184/);
    await expect(page.locator("#v2PlacePhoneOut")).toContainText(/private key/i);
    await page.locator("#v2Malware").click();
    await expect(page.locator("#v2PhoneAmt")).toContainText(/0\.000/, { timeout: 8000 });
    await expect(page.locator("#v2Pause")).toContainText(/Hot wallet/i);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#trackBody h2")).toContainText(/Hardware/i);
    await page.locator("#v2PlaceHw").click();
    await expect(page.locator("#v2HwAmt")).toContainText(/0\.184/);
    await page.locator("#v2Usb").click();
    await expect(page.locator("#v2UsbOut")).toContainText(/air-gap/i);
    await page.locator("#v2TypeSeed").click();
    await expect(page.locator("#v2TypeSeedOut")).toContainText(/Vault killed/i, { timeout: 8000 });
    await page.locator("#v2Pause").click();
    await page.locator('[data-quiz="bad"]').first().click();
    await expect(page.locator("#v2QuizMsg")).toContainText(/Wrong/);
    await expect(page.locator("#v2QuizMsg")).toContainText(/air-gap/i);

    await page.goto("/v2/?uc=13");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#uc13Viz [data-atom=\"1\"]")).toHaveClass(/hi/);
    await page.locator("#v2Sort-exchange").selectOption("custodial");
    await page.locator("#v2Sort-phone").selectOption("hot");
    await page.locator("#v2Sort-hardware").selectOption("cold");
    await page.locator("#v2Sort-watch").selectOption("watch");
    await page.locator("#v2Pause").click();
    await expect(page.locator("#trackBody .v2-callout.done")).toContainText(/Four objects/i);
    await page.locator("#v2TrapCold").click();
    await expect(page.locator("#v2TrapOut")).toContainText(/Wrong/i);
    await page.locator("#v2TrapHot").click();
    await page.locator("#v2Pause").click();
    await page.locator('[data-quiz="ok"]').click();
    await expect(page.locator("#v2QuizMsg")).toHaveClass(/msg-ok/);
  });

  test("V2-S15 UC14 few d6 TOO LOW; 12–24 mint; roll until enough", async ({ page }) => {
    await page.goto("/v2/?uc=14");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#uc14Viz .atom")).toHaveCount(3);
    await expect(page.locator("#v2Dice")).toBeVisible();
    await expect(page.locator("#v2EntDice")).toBeVisible();
    await expect(page.locator("#v2EntDice")).toHaveAttribute("src", /beginner-dice\.png/);
    await expect(page.locator("#v2EntLock .v2-lock-img")).toHaveAttribute("src", /beginner-lock\.png/);
    await expect(page.locator("#v2EntLock")).toHaveClass(/idle/);
    await page.locator("#v2Dice").click();
    await page.locator("#v2Dice").click();
    await page.locator("#v2Dice").click();
    await expect(page.locator("#v2EntBits")).toHaveText(/^[78]$/);
    await expect(page.locator("#v2EntLock")).toHaveClass(/low/);
    await expect(page.locator("#v2EntLock")).toContainText(/Weak seed/i);
    await expect(page.locator("#v2EntFace")).toContainText(/TOO LOW/i);
    await expect(page.locator("#v2EntMeta")).toContainText(/TOO LOW/i);
    await expect(page.locator("#v2EntMeta")).toContainText(/256/);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2EntWc")).toBeVisible();
    await page.locator("#v2EntMint").click();
    await expect(page.locator("#v2EntWords .ww")).toHaveCount(12);
    await expect(page.locator("#v2EntMintNote")).toContainText(/TOO LOW/i);
    await expect(page.locator("#v2EntSuff")).toContainText(/TOO LOW/i);
    await page.locator("#v2EntWc").selectOption("24");
    await expect(page.locator("#v2EntWords .ww")).toHaveCount(24);
    await expect(page.locator("#v2EntSuff")).toContainText(/256/);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2Coin")).toBeVisible();
    await expect(page.locator("#trackBody")).toContainText(/256/i);
    await page.locator("#v2Coin").click();
    await expect(page.locator("#v2EntMeta")).toContainText(/1 bit/i);
    await page.locator("#v2EntWc").selectOption("12");
    for (let i = 0; i < 5; i++) await page.locator("#v2Dice10").click();
    await page.locator("#v2EntMint").click();
    await expect(page.locator("#v2EntSuff")).toContainText(/Sufficient/i);
    await expect(page.locator("#v2EntSuff")).not.toContainText(/TOO LOW/i);
    await expect(page.locator("#v2EntLock")).toHaveClass(/ok/);
    await expect(page.locator("#v2EntLock")).toContainText(/Stronger seed/i);
    const bitsAfter = Number(await page.locator("#v2EntBits").innerText());
    expect(bitsAfter).toBeGreaterThanOrEqual(128);
    await page.locator("#v2EntWc").selectOption("24");
    await expect(page.locator("#v2EntSuff")).toContainText(/TOO LOW/i);
    for (let i = 0; i < 8; i++) await page.locator("#v2Dice10").click();
    await page.locator("#v2EntMint").click();
    const bitsHigh = Number(await page.locator("#v2EntBits").innerText());
    expect(bitsHigh).toBeGreaterThan(256);
    await expect(page.locator("#v2EntSuff")).toContainText(/Sufficient/i);
    await expect(page.locator("#v2EntWords .ww")).toHaveCount(24);
  });

  test("V2-S16 UC15 pad plus passphrase stack", async ({ page }) => {
    await page.goto("/v2/?uc=15");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#uc15Viz .atom")).toHaveCount(3);
    await page.locator("#v2Dice").click();
    await page.locator("#v2Dice").click();
    await page.locator("#v2Dice").click();
    await page.locator("#v2EntMint").click();
    await expect(page.locator("#v2EntWords .ww")).toHaveCount(12);
    await expect(page.locator("#v2EntSuff")).toContainText(/TOO LOW/i);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#trackBody .v2-pp-key-img")).toBeVisible();
    await expect(page.locator("#trackBody .v2-pp-key-img").first()).toHaveAttribute("src", /beginner-key\.png/);
    await page.locator("#v2EntPp").fill("a");
    await expect(page.locator("#v2EntStack")).toContainText(/weak/i);
    await expect(page.locator("#v2EntStack")).toContainText(/TOO LOW/i);
    await page.locator("#v2EntPp").fill("Correct-Horse-Battery-Staple-9");
    await expect(page.locator("#v2EntStack")).toContainText(/fair|stronger/i);
    await expect(page.locator("#v2EntStack")).toContainText(/does not fix|TOO LOW|pad is still/i);
  });
});
