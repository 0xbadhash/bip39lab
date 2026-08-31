import { test, expect, type Page } from "@playwright/test";

async function enterV2(page: Page, url = "/v2/") {
  await page.goto(url);
  const ack = page.locator("#v2AckUnderstand");
  if (await ack.isVisible()) await ack.click();
}

test.describe("V2 use-case tracks (0.17.134-v2)", () => {
  // AC-4 picker 35; classic Generate; chip 0.17.90-v2
  test("V2-S0 picker loads; classic / still Lab", async ({ page }) => {
    await page.goto("/index.html");
    await expect(page.locator("#btnGenerate")).toBeVisible();
    await page.goto("/v2/");
    await expect(page.locator("#v2AckOverlay")).toBeVisible();
    await expect(page.locator("#v2AckOverlay")).toContainText(/These tracks are/i);
    await expect(page.locator("#v2AckOverlay")).toContainText(/These tracks are not/i);
    await expect(page.locator("#v2AckUnderstand")).toContainText(/start the tracks/i);
    await page.locator("#v2AckUnderstand").click();
    await expect(page.locator("#v2AckOverlay")).toBeHidden();
    await expect(page.locator("#pickerGrid")).toBeVisible();
    await expect(page.locator(".uc-card")).toHaveCount(3);
    await expect(page.locator(".v2-path-h").first()).toContainText(/Start here/i);
    await expect(page.locator("#v2Continue")).toContainText(/First wallet/i);
    await expect(page.locator('[data-path-filter="start"]')).toHaveClass(/is-on/);
    await expect(page.locator('.uc-card[data-uc="1"]')).toHaveClass(/first-step/);
    await expect(page.locator(".v2-path-next")).toContainText(/Keys and backup/i);
    await expect(page.locator(".uc-atom")).toHaveCount(3);
    await expect(page.locator(".v2-start-dots li")).toHaveCount(3);
    await expect(page.locator(".uc-ghost")).toHaveCount(3);
    await page.locator('.v2-path-filters [data-path-filter="all"]').click();
    await expect(page.locator(".uc-card")).toHaveCount(35);
    await expect(page.locator(".v2-mission")).toContainText(/Practice the custody decision offline/i);
    await expect(page.locator("[data-v2-version]")).toContainText(/0\.17\.131-v2/);
    await expect(page.locator(".v2-path-hero .v2-step-path li")).toHaveCount(3);
    await expect(page.locator(".topbar-actions #v2HardRefresh")).toBeVisible();
    await expect(page.locator(".sidebar #btnClearV2")).toHaveCount(0);
    await expect(page.locator(".sidebar")).not.toContainText(/Clear secrets/);
    await expect(page.locator(".topbar-actions #v2Clear")).toBeVisible();
    await expect(page.locator(".topbar-actions #v2Clear")).toHaveClass(/danger/);
  });

  test("V2-S1 UC1 generate shows words not addresses; Validate gated", async ({ page }) => {
    await enterV2(page, "/v2/");
    await page.locator('.uc-card[data-uc="1"]').click();
    await expect(page.locator("#viewGate")).toBeVisible();
    await expect(page.locator("#gateScope")).toContainText(/Done when/i);
    await expect(page.locator("#gateViz .atom")).toHaveCount(3);
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Generate")).toBeVisible();
    await expect(page.locator("#v2Bip39What")).toBeVisible();
    await expect(page.locator("#v2Bip39What")).toContainText(/numbered list of English words/i);
    await expect(page.locator("#v2Bip39What")).toContainText(/mailbox is not the backup/i);
    await expect(page.locator("#v2Bip39What").locator(".help-tip-btn")).toHaveCount(2);
    await expect(page.locator("#v2MnemonicLine")).toContainText(/English words only/i);
    await expect(page.locator("#v2MnemonicLine")).toBeVisible();
    await expect(page.locator("#v2EntropyWhat")).toHaveCount(0);
    await expect(page.locator("#v2Entropy")).toHaveCount(0);
    await expect(page.locator("#v2Bip39Spec")).toHaveAttribute(
      "href",
      "https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki"
    );
    await expect(page.locator("#v2PasteMn")).toBeVisible();
    await expect(page.locator("#v2PasteApply")).toBeVisible();
    await expect(page.locator(".v2-donot .do")).toBeVisible();
    await expect(page.locator(".v2-donot .dont")).toContainText(/Do not import/i);
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2Card .ww").first()).not.toHaveText("—");
    await expect(page.locator("#v2Entropy")).toBeVisible();
    await expect(page.locator("#v2EntropyWhat")).toBeVisible();
    await expect(page.locator("#v2EntropyWhat")).toContainText(/Entropy 128 bits/i);
    await expect(page.locator("#v2Entropy")).toContainText(/128 bits/);
    await expect(page.locator("#v2Entropy")).toContainText(/12-word/);
    await expect(page.locator("#v2Card .ww")).toHaveCount(12);
    await expect(page.locator("#v2AddrWrap")).toBeHidden();
    await expect(page.locator("#v2Card")).toContainText(/practice backup/i);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2CardWhat")).toBeVisible();
    await expect(page.locator("#v2CardWhat")).toContainText(/Each cell is a number/i);
    await expect(page.locator("#v2EntChip")).toContainText(/12 words · 128 bits/);
    await expect(page.locator("#v2OsEnt")).toHaveCount(0);
    await expect(page.locator("#v2EntropyWhat")).toHaveCount(0);
    await page.locator("#v2CardAck").check();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2Derive")).toBeEnabled();
    await expect(page.locator("#v2Card .ww")).toHaveCount(12);
    await expect(page.locator("#v2Pipe [data-pipe=seed]")).toBeVisible();
    await expect(page.locator("#v2Pipe [data-pipe=seed]")).toContainText(/hidden number/i);
    await expect(page.locator("#v2DeriveHelp")).toContainText(/address/i);
    await page.locator("#v2Derive").click();
    await expect(page.locator("#v2Pipe [data-pipe=seed]")).toHaveClass(/hi/);
    await expect(page.locator("#v2Pipe [data-pipe=addr]")).toHaveClass(/hi/);
    await expect(page.locator("#v2Card .ww")).toHaveCount(12);
    await expect(page.locator("#v2AddrWrap .addr-text").first()).toBeVisible();
    await expect(page.locator("#v2AddrWrap .addr-text").first()).toHaveText(/tb1|bc1/);
    await expect(page.locator("#v2AddrGrid [data-copy]")).toHaveCount(5);
    await expect(page.locator("#v2AddrGrid [data-qr]")).toHaveCount(5);
    await expect(page.locator('#v2AddrType [data-addr-type="bip84"]')).toHaveClass(/active/);
    await expect(page.locator("#v2AddrType [data-addr-type]")).toHaveCount(4);
  });

  test("V2-S2 quiz colors + force exit", async ({ page }) => {
    await enterV2(page, "/v2/?uc=1");
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
    await expect(page.locator('.uc-card[data-uc="1"] .uc-step.is-done')).toBeVisible();
    await expect(page.locator("#v2Continue")).toContainText(/Paper backup/i);
    await Promise.all([
      page.waitForLoadState("domcontentloaded"),
      page.locator("#v2HardRefresh").click()
    ]);
    await expect(page.locator("#v2AckUnderstand")).toBeVisible();
    await page.locator("#v2AckUnderstand").click();
    await expect(page.locator("#v2AckOverlay")).toBeHidden();
    await expect(page.locator("#pickerGrid")).toBeVisible();
    await expect(page.locator('.uc-card[data-uc="1"]')).not.toHaveClass(/done/);
    await expect(page.locator("#v2Continue")).toContainText(/First wallet/i);
  });

  test("V2-S4 UC1 word counts 12–24, Clear secrets beside Generate, plain copy, regenerate length", async ({
    page,
  }) => {
    await enterV2(page, "/v2/?uc=1");
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
    await enterV2(page, "/v2/?uc=1");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2WordCount")).toHaveValue("12");
    await page.locator("#v2WordCount").selectOption("24");
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2WordGrid .ww")).toHaveCount(24);
    await expect(page.locator("#v2Entropy")).toContainText(/256 bits/);
    await expect(page.locator("#v2Entropy")).toContainText(/24-word/);
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
    await enterV2(page, "/v2/?uc=1");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Generate").click();
    const store = await page.evaluate(() => sessionStorage.getItem("bip39lab.v2") || "");
    expect(store).not.toMatch(/abandon|mnemonic|seed/i);
    const words = await page.locator("#v2Card .ww").first().textContent();
    expect(store.includes(words || "___never___")).toBeFalsy();
  });

  test("V2-S7 isolation two-holder IDOR wrong-id-not-other-holder", async ({ page }) => {
    await enterV2(page, "/v2/?uc=99");
    await expect(page.locator("#pickerGrid")).toBeVisible();
    await expect(page.locator("#viewGate")).toBeHidden();
  });

  // AC-1 AC-2: PP example + no repeated real-money copy
  test("V2-S8 UC2 paper backup: card, (i), Clear secrets, do-not copy, print sheet", async ({
    page,
  }) => {
    await enterV2(page, "/v2/?uc=2");
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
    await expect(page.locator("#v2PpEx")).toBeVisible();
    const ex1 = (await page.locator("#v2PpEx").innerText()).trim();
    expect(ex1.split("-").length).toBeGreaterThanOrEqual(4);
    await page.locator("#v2PpExGen").click();
    await expect(page.locator("#v2PpEx")).not.toHaveText(ex1);
    await expect(page.locator("#trackBody")).not.toContainText(/If these words were real money/i);
    await expect(page.locator("#v2MnemonicLine")).toHaveCount(0);
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
    await expect(page.locator("#v2Qprint")).toContainText(/weaker/i);
  });

  test("V2-S3 deep link uc=3 opens passphrase gate", async ({ page }) => {
    await enterV2(page, "/v2/?uc=3");
    await expect(page.locator("#gateTitle")).toContainText(/UC3/);
    await expect(page.locator("#gateIs")).toHaveClass(/is/);
    await expect(page.locator("#gateIsnt")).toHaveClass(/isnt/);
    await expect(page.locator("#gateDone")).toHaveClass(/done/);
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#panelTitle")).toContainText(/hidden 25th/i);
    await expect(page.locator("#trackBody .v2-pp-key-img")).toHaveCount(0);
    await expect(page.locator(".v2-donot .do")).toBeVisible();
    await expect(page.locator(".v2-donot .dont")).toBeVisible();
    await expect(page.locator("#v2WordCount option")).toHaveCount(5);
    await expect(page.locator("#v2Regen")).toHaveCount(0);
    await page.locator("#v2WordCount").selectOption("24");
    await expect(page.locator("#v2Generate")).toContainText(/24-word phrase/);
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2Card .ww")).toHaveCount(24);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2PpKeyUc3b .v2-pp-key-img")).toBeVisible();
    await expect(page.locator(".v2-cmp-split .v2-cmp-face")).toBeVisible();
    await expect(page.locator(".v2-cmp-fields #ppA")).toBeVisible();
    await expect(page.locator(".v2-cmp-fields #ppA")).toHaveAttribute("type", "password");
    await expect(page.locator(".v2-cmp-fields #ppB")).toBeVisible();
    await expect(page.locator(".v2-cmp-fields #ppB")).toHaveAttribute("type", "password");
    await expect(page.locator("#v2CmpTable")).toBeVisible();
    await expect(page.locator("#v2Cmp")).toHaveCount(0);
    await expect(page.locator("#v2CmpStoryA")).toHaveCount(0);
    await page.locator("#ppB").fill("test");
    await expect(page.locator("#v2PpCharsB")).toHaveText(/4 chars/);
    await expect(page.locator("#v2PpEstB")).toHaveClass(/v2-pp-est-weak/);
    await expect(page.locator("#v2CmpPpB")).toHaveCount(0);
    await page.locator("#ppA").fill("abcdefghijklmnopqrstuvwxyz");
    await expect(page.locator("#v2PpCharsA")).toHaveText(/26 chars/);
    await expect(page.locator("#v2CmpAddrA")).toHaveText(/^tb1/, { timeout: 8000 });
    await expect(page.locator(".v2-verdict")).toHaveText(
      /Diverged — two wallets\. Same words, different passphrases, different addresses/
    );
    await expect(page.locator("#v2CmpOut")).not.toContainText(/empty vs empty/i);
    await expect(page.locator("#v2CmpTable")).toBeVisible();
  });

  test("V2-S10 UC4 index increments; Back to index 0", async ({ page }) => {
    await enterV2(page, "/v2/?uc=4");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2PathLine")).toContainText("m/84'/1'/0'/0/0");
    await expect(page.locator("#v2PathPlayTable")).toBeVisible();
    await expect(page.locator("#v2PathCellPurpose")).toHaveText("84'");
    await expect(page.locator("#v2Pause")).toBeDisabled();
    await expect(page.locator("#v2FolderAmt")).toHaveClass(/v2-amt-chip/);
    await expect(page.locator("#v2FolderAmt")).toHaveText(/0\.184 BTC/);
    const t0 = await page.locator("#v2Tail").textContent();
    const a0 = await page.locator("#v2FolderAmt").textContent();
    await page.locator("#v2Idx").click();
    await expect(page.locator("#v2PathLine")).toHaveText("m/84'/1'/0'/0/1");
    await expect(page.locator("#v2PathCellIndex")).toHaveText("1");
    await expect(page.locator("#v2Pause")).toBeEnabled();
    const t1 = await page.locator("#v2Tail").textContent();
    expect(t1).not.toEqual(t0);
    await expect(page.locator("#v2FolderAmt")).not.toHaveText(a0 || "");
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2PathLine")).toHaveText("m/84'/1'/0'/0/0");
    await expect(page.locator("#v2Idx")).toBeVisible();
    await page.locator("#v2Idx").click();
    await expect(page.locator("#v2PathLine")).toHaveText("m/84'/1'/0'/0/1");
    await page.locator("#v2Idx").click();
    await expect(page.locator("#v2PathLine")).toHaveText("m/84'/1'/0'/0/2");
    await page.locator("#v2IdxZero").click();
    await expect(page.locator("#v2PathLine")).toHaveText("m/84'/1'/0'/0/0");
    await page.locator("#v2Change").click();
    await expect(page.locator("#v2RcPair")).toBeVisible();
    await expect(page.locator("#v2RcAmt0")).toHaveText(/0\.184/);
    await expect(page.locator("#v2RcAmt1")).toHaveText(/0\.003/);
    await expect(page.locator("#v2RcSum")).toHaveText(/0\.187 BTC/);
    const recvAmt = await page.locator("#v2RcAmt0").textContent();
    const chgAmt = await page.locator("#v2RcAmt1").textContent();
    expect(recvAmt).not.toEqual(chgAmt);
    await expect(page.locator("#v2RcChg")).toHaveClass(/is-on/);
    await expect(page.locator("#v2PathLine")).toHaveText("m/84'/1'/0'/1/0");
    await expect(page.locator("#v2Change")).toContainText(/receive folder/i);
  });

  test("V2-S11 UC6 three cosigner zpubs; rail back to M-of-N", async ({ page }) => {
    await enterV2(page, "/v2/?uc=6");
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
    await expect(page.locator("#v2MsPolicy")).toContainText(/2-of-3/);
    await expect(page.locator("#v2MsDesc")).toContainText(/wsh\(sortedmulti\(2,/);
    await expect(page.locator("#v2MsDesc")).toContainText(/zpub/);
    await expect(page.locator("#v2Pause")).toBeEnabled();
    await page.locator("#v2Pause").click();
    await page.locator('[data-quiz="bad"]').first().click();
    await expect(page.locator("#v2QuizMsg")).toContainText(/Wrong/);
    await page.locator('.rail-jump[data-step="0"]').click();
    await expect(page.locator("#v2MofnPic")).toBeVisible();
    await page.locator('[data-concept-step="1"]').click();
    await expect(page.locator(".v2-cosigner")).toHaveCount(3);
  });

  test("V2-S12 quiz wrong answer explains why", async ({ page }) => {
    await enterV2(page, "/v2/?uc=1");
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
    await expect(page.locator("#v2QuizMsg")).not.toContainText(/Not that one/i);
    await page.locator('#conceptStrip [data-concept-step="0"]').click();
    await expect(page.locator("#v2Generate")).toBeVisible();
    await expect(page.locator('#uc1Viz [data-atom="1"]')).toHaveClass(/hi/);
    await page.locator('#conceptStrip [data-concept-step="2"]').click();
    await expect(page.locator("#v2Derive")).toBeVisible();
    await expect(page.locator('#uc1Viz [data-atom="3"]')).toHaveClass(/hi/);
    await expect(page.locator("#uc1Viz .atom")).toHaveCount(3);
    await expect(page.locator("#v2WordGrid, #v2Card .ww").first()).toBeVisible();
  });

  test("V2-S13 UC3–UC13 concept atoms mount", async ({ page }) => {
    for (const uc of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]) {
      await enterV2(page, `/v2/?uc=${uc}`);
      const start = page.locator("#btnGateStart");
      if (await start.isVisible()) await start.click();
      await expect(page.locator(`#uc${uc}Viz .atom`)).toHaveCount(3);
      await expect(page.locator(`#uc${uc}Viz [data-atom="1"]`)).toHaveClass(/hi/);
      if (uc === 8) {
        await page.locator("#v2Pause").click();
        await page.locator("#v2Psbt").click();
        await expect(page.locator("#v2PsbtTeach")).toContainText(/unfinished bitcoin send/i);
        await expect(page.locator("#v2PsbtOut")).toContainText(/status ok|does not sign/i);
        await expect(page.locator("#v2PsbtOut")).not.toContainText("{");
        await expect(page.locator("#v2PsbtStory")).toBeVisible();
        await expect(page.locator("#v2PsbtPartial")).toBeVisible();
      }
    }
  });

  test("V2-S14 UC11–UC13 pads, quiz, force exit", async ({ page }) => {
    await enterV2(page, "/v2/?uc=11");
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
    await expect(page.locator("#v2Pause")).toContainText(/you hold the words/i);
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
    await expect(page.locator(".v2-hold-col-one")).toBeVisible();
    await expect(page.locator("#v2HoldOneH")).toContainText(/One signer/i);
    await expect(page.locator("#v2HoldMsH")).toContainText(/Co-signer/i);
    await page.locator("#v2HoldSpend").click();
    await expect(page.locator("#v2HoldSpendOut")).toHaveClass(/v2-callout/);
    await page.locator("#v2HoldLose").click();
    await page.locator("#v2HoldMsAlone").click();
    await page.locator("#v2HoldMsPaper").click();
    await page.locator("#v2HoldMsSend").click();
    await page.locator("#v2Pause").click();
    const uc11Ok = page.locator(".v2-quiz-q [data-quiz='ok']");
    await expect(uc11Ok).toHaveCount(5);
    for (let i = 0; i < 5; i++) await uc11Ok.nth(i).click();
    await expect(page.locator("#v2QuizMsg")).toHaveClass(/msg-ok/);
    await page.locator("#v2Pause").click();
    await page.locator("#v2Exit").check();
    await page.locator("#v2Finish").click();
    await expect(page.locator('.uc-card[data-uc="11"]')).toHaveClass(/done/);

    await enterV2(page, "/v2/?uc=12");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#uc12Viz .atom")).toHaveCount(3);
    await expect(page.locator("#trackBody h2")).toContainText(/Hot wallet on phone/i);
    await page.locator("#v2PlacePhone").click();
    await expect(page.locator("#v2PhoneAmt")).toContainText(/0\.184/);
    await expect(page.locator("#v2PlacePhoneOut")).toContainText(/private key/i);
    await page.locator("#v2Malware").click();
    await expect(page.locator("#v2PhoneAmt")).toContainText(/0\.000/, { timeout: 8000 });
    await expect(page.locator("#v2Pause")).toContainText(/hardware keeps the seed/i);
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

    await enterV2(page, "/v2/?uc=13");
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
    await enterV2(page, "/v2/?uc=14");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#uc14Viz .atom")).toHaveCount(3);
    await expect(page.locator("#v2Dice")).toBeVisible();
    await expect(page.locator("#v2EntDice")).toBeVisible();
    await expect(page.locator("#v2EntDice")).toHaveAttribute("src", /beginner-dice\.png/);
    await expect(page.locator("#v2EntLock .v2-lock-img")).toHaveAttribute("src", /beginner-lock\.png/);
    await expect(page.locator("#v2EntLock")).toHaveClass(/low/);
    await expect(page.locator("#v2EntLock")).toContainText(/Weak seed/i);
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
    const mintGroup = page.locator(".v2-ent-mint-group");
    await expect(mintGroup.locator("#v2EntWc")).toBeVisible();
    await expect(mintGroup.locator("#v2EntMint")).toBeVisible();
    const wcBox = await page.locator("#v2EntWc").boundingBox();
    const mintBox = await page.locator("#v2EntMint").boundingBox();
    expect(wcBox && mintBox).toBeTruthy();
    expect(mintBox!.x).toBeLessThan(wcBox!.x + wcBox!.width + 96);
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
    await page.locator("#v2EntWc").selectOption("15");
    await expect(page.locator("#v2EntSuff")).toContainText(/TOO LOW/i);
    await expect(page.locator("#v2EntLock")).not.toHaveClass(/ok/);
    await expect(page.locator("#v2EntFace")).toHaveClass(/low/);
    await page.locator("#v2EntWc").selectOption("24");
    await expect(page.locator("#v2EntSuff")).toContainText(/TOO LOW/i);
    await expect(page.locator("#v2EntLock")).not.toHaveClass(/ok/);
    for (let i = 0; i < 8; i++) await page.locator("#v2Dice10").click();
    await page.locator("#v2EntMint").click();
    const bitsHigh = Number(await page.locator("#v2EntBits").innerText());
    expect(bitsHigh).toBeGreaterThan(256);
    await expect(page.locator("#v2EntSuff")).toContainText(/Sufficient/i);
    await expect(page.locator("#v2EntWords .ww")).toHaveCount(24);
  });

  test("V2-S16 UC15 pad plus passphrase stack", async ({ page }) => {
    await enterV2(page, "/v2/?uc=15");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#uc15Viz .atom")).toHaveCount(3);
    await expect(page.locator("#v2EntDice")).toBeVisible();
    await expect(page.locator("#v2EntFace")).toBeVisible();
    await expect(page.locator("#v2EntLock")).toBeVisible();
    await expect(page.locator("#v2PpKeyUc15Start .v2-pp-key-img")).toBeVisible();
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
    const sixtyFour = "a".repeat(64);
    await page.locator("#v2EntPp").fill(sixtyFour);
    await expect(page.locator("#v2EntPp")).toHaveValue(sixtyFour);
    await expect(page.locator("#v2EntPp")).toHaveAttribute("maxlength", "128");
    await expect(page.locator("#v2EntPpCount")).toContainText("64 / 128");
  });

  // AC-2: restore checksum + same address
  test("V2-S17 UC16 restore drill: hide card, type words, same address", async ({ page }) => {
    await enterV2(page, "/v2/?uc=16");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Generate")).toBeVisible();
    await expect(page.locator("#v2WordCount")).toBeVisible();
    await expect(page.locator("#v2WordCount")).toHaveValue("12");
    await expect(page.locator("#v2GenRow .help-tip-btn")).toBeVisible();
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2Card .ww")).toHaveCount(12);
    const words = await page.locator("#v2Card .ww").allTextContents();
    await page.locator("#v2Pause").click();
    await page.locator("#v2RestoreHide").click();
    await expect(page.locator("#v2Card")).toHaveClass(/v2-hidden/);
    await expect(page.locator("#v2RestoreFill")).toBeVisible();
    await page.locator("#v2RestoreFill").click();
    await expect(page.locator("#v2RestoreW0")).toHaveValue(words[0]);
    await page.locator("#v2RestoreCheck").click();
    await expect(page.locator("#v2RestoreMsg")).toHaveClass(/msg-ok/);
    await expect(page.locator("#v2RestoreMsg")).toContainText(/same receive address/i);
    await expect(page.locator(".v2-restore-cell")).toHaveCount(12);
  });

  test("V2-S17b UC16 24-word generate then restore cells match", async ({ page }) => {
    await enterV2(page, "/v2/?uc=16");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2WordCount").selectOption("24");
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2Card .ww")).toHaveCount(24);
    await page.locator("#v2Pause").click();
    await expect(page.locator(".v2-restore-cell")).toHaveCount(24);
    await page.locator("#v2RestoreFill").click();
    await page.locator("#v2RestoreCheck").click();
    await expect(page.locator("#v2RestoreMsg")).toHaveClass(/msg-ok/);
  });

  // AC-3: amount tiers
  test("V2-S18 UC17 amount tiers: coffee not 2-of-3; large not exchange", async ({ page }) => {
    await enterV2(page, "/v2/?uc=17");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("[data-amt]")).toHaveCount(3);
    await page.locator('[data-amt="coffee"] [data-bin="mofn"]').click();
    await expect(page.locator("#v2TierOut")).toContainText(/trap|coffee|2-of-3/i);
    await page.locator('[data-amt="coffee"] [data-bin="phone"]').click();
    await page.locator('[data-amt="mid"] [data-bin="hww"]').click();
    await page.locator('[data-amt="large"] [data-bin="mofn"]').click();
    await expect(page.locator("#v2TierOut")).toContainText(/placed/i);
    await expect(page.locator("#v2Pause")).toBeEnabled();
  });

  // AC-4: first receive sim tBTC
  test("V2-S19 UC19 first receive: compare, wait, refuse dust, never fund", async ({ page }) => {
    await enterV2(page, "/v2/?uc=19");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Generate").click();
    await expect(page.locator("#v2AddrWrap .addr-text").first()).toBeVisible();
    await expect(page.locator("[data-recv-pick]")).toHaveCount(2);
    await page.locator('[data-recv-pick="scam"]').click();
    await expect(page.locator("#v2RecvCmpOut")).toHaveClass(/msg-bad/);
    await expect(page.locator("#v2Pause")).toBeDisabled();
    await page.locator('[data-recv-pick="ok"]').click();
    await expect(page.locator("#v2RecvCmpOut")).toHaveClass(/msg-ok/);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2WatchSame")).toBeVisible();
    await page.locator('[data-recv-wait="0"]').click();
    await expect(page.locator("#v2RecvWaitOut")).toHaveClass(/msg-bad/);
    await page.locator('[data-recv-wait="1"]').click();
    await expect(page.locator("#v2SimBal")).toContainText(/0\.000184/);
    await page.locator("#v2Pause").click();
    await page.locator('[data-recv-dust="mix"]').click();
    await expect(page.locator("#v2RecvDustOut")).toHaveClass(/msg-bad/);
    await page.locator('[data-recv-dust="leave"]').click();
    await expect(page.locator("#v2RecvDustOut")).toHaveClass(/msg-ok/);
    await expect(page.locator("#trackBody")).toContainText(/Do not fund/i);
    await expect(page.locator("[data-v2-dock]")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  // AC-5: air-gap loop never signs
  test("V2-S20 UC23 air-gap loop order; tab never signs", async ({ page }) => {
    await enterV2(page, "/v2/?uc=23");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("[data-loop]")).toHaveCount(4);
    await page.locator('[data-loop="0"]').click();
    await page.locator('[data-loop="1"]').click();
    await page.locator('[data-loop="2"]').click();
    await page.locator('[data-loop="3"]').click();
    await expect(page.locator("#v2LoopOut")).toContainText(/never signs/i);
    await expect(page.locator("#v2Pause")).toBeEnabled();
  });

  test("V2-S21 UC20 four-letter plate shows full word then stamp", async ({ page }) => {
    await enterV2(page, "/v2/?uc=20");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await page.locator('.v2-metal-card[data-metal="ss"]').click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2StampPlate .v2-stamp-cell")).toHaveCount(12);
    const first = page.locator("#v2StampPlate .v2-stamp-cell").first();
    await expect(first.locator(".v2-stamp-full")).toHaveText(/^[a-z]+$/);
    await expect(first.locator(".v2-stamp-4")).toHaveText(/^[a-z]{3,4}$/i);
    const full = (await first.locator(".v2-stamp-full").textContent()) || "";
    const stamp = ((await first.locator(".v2-stamp-4").textContent()) || "").toLowerCase();
    expect(full.slice(0, stamp.length)).toBe(stamp);
    expect(full.length).toBeGreaterThanOrEqual(stamp.length);
  });

  test("V2-S22 UC22 unbox names Ledger Trezor Coldcard Tangem before firmware tick", async ({ page }) => {
    await enterV2(page, "/v2/?uc=22");
    await page.locator("#btnGateStart").click();
    await expect(page.locator(".v2-auth-card")).toHaveCount(4);
    await expect(page.locator(".v2-auth-grid")).toContainText(/Ledger/);
    await expect(page.locator(".v2-auth-grid")).toContainText(/Trezor/);
    await expect(page.locator(".v2-auth-grid")).toContainText(/Coldcard/);
    await expect(page.locator(".v2-auth-grid")).toContainText(/Tangem/);
    await expect(page.locator(".v2-auth-grid")).toContainText(/genuine/i);
    await expect(page.locator("#v2Pause")).toBeDisabled();
    await page.locator("#v2Fw").check();
    await expect(page.locator("#v2Pause")).toBeEnabled();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#trackBody h2")).toContainText(/Words already on a laptop/i);
    await page.locator("#v2ImportLaptop").click();
    await expect(page.locator("#v2CerOut")).toHaveClass(/msg-bad/);
    await expect(page.locator("#v2Pause")).toBeDisabled();
    await page.locator("#v2RefuseSeed").click();
    await expect(page.locator("#v2CerOut")).toHaveClass(/msg-ok/);
    await expect(page.locator("#v2CerOut")).toContainText(/software wallet/i);
    await expect(page.locator("#v2Pause")).toBeEnabled();
  });

  test("V2-S23 UC32 SeedXOR needs every part", async ({ page }) => {
    await enterV2(page, "/v2/?uc=32");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2XorTeach")).toContainText(/N-of-N/i);
    await page.locator("#v2Pause").click();
    await page.locator("#v2XorMake12").click();
    await page.locator("#v2XorSplit").click();
    await expect(page.locator("#v2XorSplitOut")).toContainText(/Split done/i);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2XorA .ww")).toHaveCount(12);
    await expect(page.locator("#v2XorB .ww")).toHaveCount(12);
    await page.locator("#v2Pause").click();
    await page.locator("#v2XorHide").click();
    await expect(page.locator("#v2XorNeedAll")).toContainText(/Not enough/i);
    await page.locator("#v2XorAll").click();
    await expect(page.locator("#v2XorNeedAll")).toContainText(/All parts/i);
    await expect(page.locator("#v2XorNeedAll")).toContainText(/N-of-N/i);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S24 UC33 timelock FSM no signer", async ({ page }) => {
    await enterV2(page, "/v2/?uc=33");
    await page.locator("#btnGateStart").click();
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
    await page.locator("#v2TlArm").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2TlHeir").click();
    await expect(page.locator("#v2TlOut")).toContainText(/Locked/i);
    await page.locator("#v2TlTick").click();
    await page.locator("#v2TlTick").click();
    await page.locator("#v2TlTick").click();
    await page.locator("#v2TlHeir").click();
    await expect(page.locator("#v2TlOut")).toContainText(/Practice only/i);
    await expect(page.locator("#v2TlOut")).toContainText(/did not sign/i);
    await page.locator("#v2TlRefresh").click();
    await expect(page.locator("#v2TlOut")).toContainText(/locked again/i);
  });

  test("V2-S25 UC34 descriptor ack", async ({ page }) => {
    await enterV2(page, "/v2/?uc=34");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2DescLine")).toContainText(/wpkh/);
    await page.locator("#v2Pause").click();
    await page.locator("#v2DescRefreshLab").click();
    await expect(page.locator("#v2DescList [data-copy]").first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator("#v2DescList")).toContainText(/wpkh\(|tr\(|pkh\(/);
    const pub = (await page.locator("#v2DescList .v2-copy-val").first().textContent()) || "";
    await page.locator("#v2Pause").click();
    await page.locator("#v2DescPaste").fill("xprv9s21ZrQH143Kpractice");
    await page.locator("#v2DescExplain").click();
    await expect(page.locator("#v2DescExplainOut")).toContainText(/refus/i);
    await page.locator("#v2DescPaste").fill(pub || "wpkh(tpubD6NzVbNrCqUK1practice/0/*)");
    await page.locator("#v2DescExplain").click();
    await expect(page.locator("#v2DescExplainOut")).toContainText(/ok|wpkh|tr|pkh|public/i);
    await expect(page.locator("#v2Pause")).toBeEnabled();
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S26 UC35 Electrum vs BIP-39 restore", async ({ page }) => {
    await enterV2(page, "/v2/?uc=35");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Card .ww")).toHaveCount(12);
    await page.locator("#v2Pause").click();
    await page.locator("#v2ElBip39").click();
    await expect(page.locator("#v2ElAddr")).toHaveText(/^tb1/, { timeout: 8000 });
    await page.locator("#v2ElElectrum").click();
    await expect(page.locator("#v2ElOut")).toContainText(/wrong vault/i);
    await expect(page.locator("#v2ElOut")).toContainText(/does not run Electrum/i);
  });

  test("V2-S27 UC1 paste mnemonic", async ({ page }) => {
    await enterV2(page, "/v2/?uc=1");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2PasteMn").fill("not a phrase");
    await page.locator("#v2PasteApply").click();
    await expect(page.locator("#v2PasteMsg")).toContainText(/Need 12, 15, 18, 21, or 24/i);
    await page.locator("#v2PasteMn").fill(
      "idea glance debate faculty win kingdom super next dish rhythm prosper umbrella"
    );
    await page.locator("#v2PasteApply").click();
    await expect(page.locator("#v2PasteMsg")).toContainText(/checksum/i);
    await expect(page.locator("#v2Card .ww").first()).toHaveText("—");
    await page.locator("#v2PasteMn").fill(
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    );
    await page.locator("#v2PasteApply").click();
    await expect(page.locator("#v2Card .ww")).toHaveCount(12);
    await expect(page.locator("#v2Card .ww").first()).not.toHaveText("—");
    await expect(page.locator("#v2Entropy")).toContainText(/128 bits/);
    await expect(page.locator("#v2Pause")).toBeEnabled();
  });

  test("V2-S28 UC1 address type tabs 44/49/84/86", async ({ page }) => {
    await enterV2(page, "/v2/?uc=1");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Generate").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2CardAck").check();
    await page.locator("#v2Pause").click();
    await page.locator("#v2Derive").click();
    const native = await page.locator("#v2AddrWrap .addr-text").first().innerText();
    await expect(page.locator("#v2AddrWrap .addr-text").first()).toHaveText(/^tb1q/);
    await page.locator('#v2AddrType [data-addr-type="bip86"]').click();
    await expect(page.locator("#v2AddrWrap .addr-text").first()).toHaveText(/^tb1p/);
    await page.locator('#v2AddrType [data-addr-type="bip49"]').click();
    const nested = await page.locator("#v2AddrWrap .addr-text").first().innerText();
    expect(nested).not.toBe(native);
    await page.locator('#v2AddrType [data-addr-type="bip44"]').click();
    const legacy = await page.locator("#v2AddrWrap .addr-text").first().innerText();
    expect(legacy).not.toBe(native);
    expect(legacy).not.toMatch(/^tb1/);
    await page.locator('#v2AddrType [data-addr-type="bip84"]').click();
    await expect(page.locator("#v2AddrWrap .addr-text").first()).toHaveText(native);
  });

  test("V2-S29 UC3 masked PP strength bar", async ({ page }) => {
    await enterV2(page, "/v2/?uc=3");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Generate").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#ppA")).toHaveAttribute("type", "password");
    await expect(page.locator("#ppB")).toHaveAttribute("type", "password");
    await expect(page.locator("#v2PpBarA")).toHaveClass(/pp-tier-empty/);
    await expect(page.locator("#v2PpBarB")).toHaveClass(/pp-tier-weak/);
    await page.locator("#ppA").fill("abcdefghijklmnopqrstuvwxyz");
    await expect(page.locator("#v2PpBarA")).toHaveClass(/pp-tier-(fair|strong)/);
    const now = await page.locator("#v2PpBarA").getAttribute("aria-valuenow");
    expect(Number(now)).toBeGreaterThan(6);
  });

  test("V2-S30 UC4 live path table + purpose tabs", async ({ page }) => {
    await enterV2(page, "/v2/?uc=4");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2PathPlayTable")).toBeVisible();
    await expect(page.locator("#v2PathCellPurpose")).toHaveText("84'");
    await expect(page.locator("#v2PathCellCoin")).toHaveText("1'");
    await expect(page.locator("#v2PathCellIndex")).toHaveText("0");
    await page.locator("#v2Idx").click();
    await expect(page.locator("#v2PathCellIndex")).toHaveText("1");
    await expect(page.locator("#v2PathLine")).toHaveText("m/84'/1'/0'/0/1");
    const amt84 = await page.locator("#v2FolderAmt").textContent();
    await page.locator('#v2PathPurpose [data-purpose="86"]').click();
    await expect(page.locator("#v2PathCellPurpose")).toHaveText("86'");
    await expect(page.locator("#v2PathLine")).toHaveText("m/86'/1'/0'/0/1");
    await expect(page.locator("#v2FolderAmt")).not.toHaveText(amt84 || "");
    await expect(page.locator("#v2PathPurpose [data-purpose]")).toHaveCount(4);
  });

  test("V2-S31 UC4 five quiz questions shuffled", async ({ page }) => {
    await enterV2(page, "/v2/?uc=4");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Idx").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2Change").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator(".v2-quiz-q")).toHaveCount(5);
    await expect(page.locator(".v2-quiz-q [data-quiz]")).toHaveCount(15);
    const firstOkPos = await page.locator(".v2-quiz-q").first().locator("[data-quiz]").evaluateAll((btns) =>
      btns.findIndex((b) => b.getAttribute("data-quiz") === "ok")
    );
    expect(firstOkPos).toBeGreaterThanOrEqual(0);
    expect(firstOkPos).toBeLessThan(3);
    for (let i = 0; i < 5; i++) {
      await page.locator(".v2-quiz-q").nth(i).locator('[data-quiz="ok"]').click();
    }
    await expect(page.locator("#v2Pause")).toBeEnabled();
  });

  test("V2-S32 UC5 purpose tabs + descriptor refresh", async ({ page }) => {
    await enterV2(page, "/v2/?uc=5");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2WoType [data-wo-type]")).toHaveCount(4);
    await expect(page.locator('#v2WoType [data-wo-type="86"]')).toHaveClass(/active/);
    await expect(page.locator('#v2WoType [data-wo-type="86"]')).toContainText(/Taproot/);
    await expect(page.locator("#v2WoList [data-copy]")).toHaveCount(1, { timeout: 8000 });
    await expect(page.locator("#v2WoList .v2-copy-val")).toContainText(/^xpub/);
    await expect(page.locator("#v2DescOut")).toContainText(/tr\(/);
    await expect(page.locator("#v2DescOut")).toContainText(/BIP86 Taproot receive/);
    await expect(page.locator("#v2DescOut")).toContainText(/BIP86 Taproot change/);
    await expect(page.locator("#v2DescOut")).toContainText(/\/1\/\*/);
    await expect(page.locator("#v2DescOut")).not.toContainText(/wpkh/);
    await page.locator('#v2WoType [data-wo-type="84"]').click();
    await expect(page.locator("#v2WoList .v2-copy-val")).toContainText(/^zpub/);
    await expect(page.locator("#v2DescOut")).toContainText(/wpkh/);
    await expect(page.locator("#v2DescOut")).toContainText(/BIP84 change/);
    await expect(page.locator("#v2DescOut")).not.toContainText(/tr\(/);
    await page.locator('#v2WoType [data-wo-type="49"]').click();
    await expect(page.locator("#v2WoList .v2-copy-val")).toContainText(/^ypub/);
    await expect(page.locator("#v2DescOut")).toContainText(/sh\(wpkh/);
    await expect(page.locator("#v2DescOut")).toContainText(/BIP49 nested change/);
    await page.locator('#v2WoType [data-wo-type="44"]').click();
    await expect(page.locator("#v2WoList .v2-copy-val")).toContainText(/^xpub/);
    await expect(page.locator("#v2DescOut")).toContainText(/pkh\(/);
    await expect(page.locator("#v2DescOut")).toContainText(/BIP44 legacy change/);
    await expect(page.locator("#v2WoList [data-qr]")).toHaveCount(1);
    await expect(page.locator("#v2DescLine")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S33 UC6 wsh sortedmulti policy from three zpubs", async ({ page }) => {
    await enterV2(page, "/v2/?uc=6");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    for (let i = 0; i < 3; i++) {
      await page.locator(`[data-cs-gen="${i}"]`).click();
      await page.locator(`[data-cs-zpub="${i}"]`).click();
    }
    await expect(page.locator("#v2MsPolicy")).toContainText(/2-of-3/);
    const line = await page.locator("#v2MsDesc").innerText();
    expect(line).toMatch(/^wsh\(sortedmulti\(2,/);
    expect(line.split("zpub").length - 1).toBe(3);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S34 UC8 paste PSBT inspect-only", async ({ page }) => {
    await enterV2(page, "/v2/?uc=8");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2PsbtIn")).toBeVisible();
    await expect(page.locator("#v2PsbtInspect")).toBeVisible();
    await page.locator("#v2PsbtIn").fill("cHNidP8A");
    await page.locator("#v2PsbtInspect").click();
    await expect(page.locator("#v2PsbtTeach")).toContainText(/unfinished bitcoin send/i);
    await expect(page.locator("#v2PsbtOut")).toContainText(/status ok/i);
    await expect(page.locator("#v2PsbtOut")).toContainText(/does not sign/i);
    await page.locator("#v2PsbtIn").fill("xprv secret looking");
    await page.locator("#v2PsbtInspect").click();
    await expect(page.locator("#v2PsbtOut")).toContainText(/Refused|seed/i);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S35 UC6 five quiz questions shuffled", async ({ page }) => {
    await enterV2(page, "/v2/?uc=6");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    for (let i = 0; i < 3; i++) {
      await page.locator(`[data-cs-gen="${i}"]`).click();
      await page.locator(`[data-cs-zpub="${i}"]`).click();
    }
    await page.locator("#v2Pause").click();
    await expect(page.locator(".v2-quiz-q")).toHaveCount(5);
    await expect(page.locator(".v2-quiz-q [data-quiz]")).toHaveCount(15);
    for (let i = 0; i < 5; i++) {
      await page.locator(".v2-quiz-q").nth(i).locator('[data-quiz="ok"]').click();
    }
    await expect(page.locator("#v2Pause")).toBeEnabled();
  });

  test("V2-S36 UC8 five quiz questions shuffled", async ({ page }) => {
    await enterV2(page, "/v2/?uc=8");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2Psbt").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator(".v2-quiz-q")).toHaveCount(5);
    await expect(page.locator(".v2-quiz-q [data-quiz]")).toHaveCount(15);
    for (let i = 0; i < 5; i++) {
      await page.locator(".v2-quiz-q").nth(i).locator('[data-quiz="ok"]').click();
    }
    await expect(page.locator("#v2Pause")).toBeEnabled();
  });

  test("V2-S37 UC8 network dock no fetch without txid", async ({ page }) => {
    await enterV2(page, "/v2/?uc=8");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2Psbt").click();
    await expect(page.locator("#v2PsbtNetMsg")).toContainText(/no on-chain txid|not found/i);
    await expect(page.locator("#v2PsbtNetOpen")).toBeHidden();
    await expect(page.locator("#v2PsbtOut")).toContainText(/does not sign/i);
    await expect(page.locator("#v2PsbtNetLive")).toContainText(/No fetch|not found/i);
    const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
    expect(csp || "").toMatch(/connect-src 'self' https:\/\/mempool\.space/);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S38 UC8 leak-ack fetches same-origin /api/mempool/tx", async ({ page }) => {
    const prev =
      "cHNidP8BADwBAAAAARERERERERERERERERERERERERERERERERERERERERERAAAAAAD/////AegDAAAAAAAAAAAAAAAA";
    await page.route("**/api/mempool/tx/**", async (route) => {
      const url = route.request().url();
      expect(url).toContain("/api/mempool/tx/");
      expect(url).not.toContain("mempool.space");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ txid: "11".repeat(32), confirmed: false }),
      });
    });
    await enterV2(page, "/v2/?uc=8");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2PsbtIn").fill(prev);
    await page.locator("#v2PsbtInspect").click();
    await expect(page.locator("#v2PsbtOut")).toContainText(/Prevout txid/i);
    await page.locator("#v2PsbtNetAck").check();
    await expect(page.locator("#v2PsbtNetLive")).toContainText(/Found|same-origin|txid/i);
    await expect(page.locator("#v2PsbtNetOpen")).toBeVisible();
    const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
    expect(csp || "").toMatch(/connect-src 'self' https:\/\/mempool\.space/);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S39 UC7 phrase first then M-of-N split/combine", async ({ page }) => {
    await enterV2(page, "/v2/?uc=7");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2ShPhrase")).toBeVisible();
    await expect(page.locator("#v2ShWc")).toBeVisible();
    await expect(page.locator("#v2ShWc")).toHaveValue("12");
    await expect(page.locator("#v2Pause")).toBeDisabled();
    await page.locator("#v2ShPhrase").click();
    await expect(page.locator("#v2ShWordGrid .ww").first()).not.toHaveText("—");
    await expect(page.locator("#v2ShMN")).toBeVisible();
    await expect(page.locator("#v2Pause")).toBeDisabled();
    await page.locator("#v2Sh").click();
    await expect(page.locator("#v2ShStory")).toContainText(/one practice BIP-39 phrase/i);
    await expect(page.locator("#v2ShStory")).toContainText(/not SLIP-39/i);
    await expect(page.locator("#v2ShOut")).toContainText(/share:1:/i);
    await expect(page.locator("#v2ShOut")).not.toContainText(/When \/ where/i);
    await page.locator("#v2ShCombine").click();
    await expect(page.locator("#v2ShOut")).toContainText(/Match original phrase: true/i);
    await expect(page.locator("#v2ShOut")).toHaveClass(/msg-ok/);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S44 UC7 paste M shares and try recombine", async ({ page }) => {
    await enterV2(page, "/v2/?uc=7");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2ShPhrase").click();
    await page.locator("#v2Sh").click();
    await expect(page.locator("#v2ShRecombineIn")).toBeVisible();
    await expect(page.locator("#v2ShCombine")).toBeVisible();
    const raw = await page.locator("#v2ShRecombineIn").inputValue();
    const two = raw.split("\n").filter(Boolean).slice(0, 2).join("\n");
    await page.locator("#v2ShRecombineIn").fill(two);
    await page.locator("#v2ShTry").click();
    await expect(page.locator("#v2ShTryOut")).toContainText(/Match original phrase: true/i);
    await expect(page.locator("#v2ShTryOut")).toHaveClass(/msg-ok/);
    const three = raw.split("\n").filter(Boolean);
    expect(three.length).toBeGreaterThanOrEqual(3);
    const poisoned = three[0] + "\n" + three[1] + "\n" + three[2].replace(/:[0-9a-f]+$/i, ":deadbeef");
    await page.locator("#v2ShRecombineIn").fill(poisoned);
    await page.locator("#v2ShTry").click();
    await expect(page.locator("#v2ShTryOut")).toContainText(/Match original phrase: true/i);
    const oddHex = three[0] + "\n" + three[1] + "\n" + three[2].slice(0, -1);
    await page.locator("#v2ShRecombineIn").fill(oddHex);
    await page.locator("#v2ShTry").click();
    await expect(page.locator("#v2ShTryOut")).toContainText(/Match original phrase: true/i);
    await expect(page.locator("#v2ShTryOut")).not.toContainText(/Could not read a share line/i);
    await expect(page.locator("#v2ShTryOut")).toHaveClass(/msg-ok/);
    await expect(page.locator("#v2ShTryOut")).toContainText(/skipped a share|Used indices/i);
    await page.locator("#v2ShRecombineIn").fill("share:1:00");
    await page.locator("#v2ShTry").click();
    await expect(page.locator("#v2ShTryOut")).toContainText(/Need at least 2|honest|failed/i);
    await expect(page.locator("#v2ShTryOut")).toHaveClass(/msg-bad/);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S40 UC7 practice SLIP-39 word shares", async ({ page }) => {
    await enterV2(page, "/v2/?uc=7");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2ShPhrase").click();
    await page.locator("#v2Sh").click();
    await page.locator("#v2ShCombine").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2S39")).toBeVisible();
    await expect(page.getByRole("link", { name: /SLIP-39 room/i })).toBeVisible();
    await page.locator("#v2S39").click();
    await expect(page.locator("#v2S39Story")).toContainText(/SLIP-39|Trezor-shaped/i);
    await expect(page.locator("#v2S39Out")).toHaveValue(/Master hex/i);
    await page.locator("#v2S39Combine").click();
    await expect(page.locator("#v2S39Out")).toHaveValue(/Master hex/i);
    await expect(page.locator("#v2S39TryOut")).toContainText(/Match: true/i);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S45 UC7 try two SLIP-39 share lists rebuild hex", async ({ page }) => {
    await enterV2(page, "/v2/?uc=7");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2ShPhrase").click();
    await page.locator("#v2Sh").click();
    await page.locator("#v2ShCombine").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2S39").click();
    await expect(page.locator("#v2S39s0")).not.toHaveValue("");
    await expect(page.locator("#v2S39s1")).not.toHaveValue("");
    await expect(page.locator("#v2S39s2")).not.toHaveValue("");
    await page.locator("#v2S39Try").click();
    await expect(page.locator("#v2S39TryOut")).toContainText(/not the exercise/i);
    await expect(page.locator("#v2S39TryOut")).toContainText(/2-of-3/i);
    await expect(page.locator("#v2S39TryOut")).not.toHaveClass(/msg-ok/);
    await expect(page.locator("#v2S39TryOut")).toHaveClass(/msg-warn/);
    await page.locator("#v2S39s2").fill("");
    await page.locator("#v2S39Try").click();
    await expect(page.locator("#v2S39TryOut")).toContainText(/Match practice hex: true/i);
    await expect(page.locator("#v2S39TryOut")).toHaveClass(/msg-ok/);
    await page.locator("#v2S39s1").fill("");
    await page.locator("#v2S39Try").click();
    await expect(page.locator("#v2S39TryOut")).toContainText(/Need any 2|honest/i);
    await expect(page.locator("#v2S39Combine")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S50 UC7 same two SLIP-39 shares empty vs extra secret differ", async ({ page }) => {
    await enterV2(page, "/v2/?uc=7");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2ShPhrase").click();
    await page.locator("#v2Sh").click();
    await page.locator("#v2ShCombine").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2S39").click();
    await page.locator("#v2S39s2").fill("");
    await page.locator("#v2S39Try").click();
    await expect(page.locator("#v2S39TryOut")).toHaveClass(/msg-ok/);
    await page.locator("#v2S39s1").fill("");
    await page.locator("#v2S39Try").click();
    await expect(page.locator("#v2S39TryOut")).toContainText(/Need any 2|honest/i);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#trackBody h2")).toContainText(/extra secret/i);
    await expect(page.locator("#v2S39Pp")).toHaveValue("lab");
    await page.locator("#v2S39PpGo").click();
    await expect(page.locator("#v2S39HexA")).toContainText(/Recovered hex/i);
    await expect(page.locator("#v2S39TagA")).toContainText(/MATCHES the practice master/i);
    await expect(page.locator("#v2S39TagB")).toContainText(/DIFFERENT vault/i);
    await expect(page.locator("#v2S39PpOut")).toContainText(/not a BIP-39 25th/i);
    const a = await page.locator("#v2S39HexA").innerText();
    const b = await page.locator("#v2S39HexB").innerText();
    expect(a).not.toBe(b);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S41 UC8 three public example txs after leak-ack", async ({ page }) => {
    await page.route("**/api/mempool/tx/**", async (route) => {
      const url = route.request().url();
      expect(url).toContain("/api/mempool/tx/");
      expect(url).not.toContain("mempool.space");
      const id = url.split("/api/mempool/tx/")[1].split("?")[0];
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          txid: id,
          status: { confirmed: true, block_height: 170 },
          vin: [{}],
          vout: [{}, {}],
        }),
      });
    });
    await enterV2(page, "/v2/?uc=8");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("[data-v2-ex-txid]")).toHaveCount(6);
    await expect(page.locator("[data-v2-ex-txid]").nth(0)).toContainText(/Genesis coinbase/);
    await expect(page.locator("[data-v2-ex-txid]").nth(1)).toContainText(/First transfer/);
    await expect(page.locator("[data-v2-ex-txid]").nth(2)).toContainText(/Pizza day/);
    await expect(page.locator("[data-v2-ex-txid]").nth(3)).toContainText(/OP_RETURN note/);
    await expect(page.locator("[data-v2-ex-txid]").nth(4)).toContainText(/Inscription 0/);
    await expect(page.locator("[data-v2-ex-txid]").nth(5)).toContainText(/Runestone etch/);
    await page.locator("[data-v2-ex-txid]").nth(1).click();
    await page.locator("#v2PsbtNetAck").check();
    await page.locator("#v2TxInspect").click();
    await expect(page.locator("#v2PsbtNetLive")).toContainText(/Found|txid|block=/i);
    await expect(page.locator("#v2PsbtNetMsg")).toContainText(/First transfer/);
    await expect(page.locator("#v2PsbtNetOpen")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S41b UC8 classroom snapshot when mempool proxy missing", async ({ page }) => {
    await page.route("**/api/mempool/tx/**", (route) => route.abort());
    await page.route("https://mempool.space/**", (route) => route.abort());
    await enterV2(page, "/v2/?uc=8");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await page.locator("[data-v2-ex-txid]").nth(0).click();
    await page.locator("#v2PsbtNetAck").check();
    await page.locator("#v2TxInspect").click();
    await expect(page.locator("#v2TxStory")).toContainText(/Genesis coinbase/i);
    await expect(page.locator("#v2TxStory")).toContainText(/50 BTC/i);
    await expect(page.locator("#v2PsbtNetLive")).toContainText(/classroom snapshot|On the chain/i);
    await expect(page.locator("#v2PsbtNetLive")).toContainText(/block height: 0|block=0/);
    await expect(page.locator("#v2PsbtNetLive")).not.toContainText(/Failed to fetch/);
    await expect(page.locator("#v2PsbtNetLive")).not.toContainText(/first bitcoin output/i);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S41c UC8 OP_RETURN inscription runestone snapshots decode extra data", async ({ page }) => {
    await page.route("**/api/mempool/tx/**", (route) => route.abort());
    await page.route("https://mempool.space/**", (route) => route.abort());
    await enterV2(page, "/v2/?uc=8");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2PsbtNetAck").check();
    await page.locator("[data-v2-ex-txid]").nth(3).click();
    await page.locator("#v2TxInspect").click();
    await expect(page.locator("#v2TxStory")).toContainText(/OP_RETURN|charley loves heidi/i);
    await expect(page.locator("#v2PsbtNetLive")).toContainText(/On-chain data/i);
    await expect(page.locator("#v2PsbtNetLive")).toContainText(/charley loves heidi/i);
    await page.locator("[data-v2-ex-txid]").nth(4).click();
    await page.locator("#v2TxInspect").click();
    await expect(page.locator("#v2TxStory")).toContainText(/Inscription 0|ordinal/i);
    await expect(page.locator("#v2PsbtNetLive")).toContainText(/ord|inscription|witness/i);
    await page.locator("[data-v2-ex-txid]").nth(5).click();
    await page.locator("#v2TxInspect").click();
    await expect(page.locator("#v2TxStory")).toContainText(/Runestone|840000|halving/i);
    await expect(page.locator("#v2PsbtNetLive")).toContainText(/runestone|OP_13/i);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S42 UC10 leak-ack fetches fees via /api/mempool", async ({ page }) => {
    await page.route("**/api/mempool/**", async (route) => {
      const url = route.request().url();
      expect(url).toContain("/api/mempool");
      expect(url).not.toContain("mempool.space");
      if (url.includes("/v1/fees/recommended")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            fastestFee: 8,
            halfHourFee: 4,
            hourFee: 2,
            economyFee: 1,
            minimumFee: 1,
          }),
        });
        return;
      }
      if (url.includes("/blocks/tip/height")) {
        await route.fulfill({ status: 200, contentType: "text/plain", body: "900000" });
        return;
      }
      if (/\/api\/mempool\/mempool\/?$/.test(url.split("?")[0])) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ count: 1234, vsize: 8000000 }),
        });
        return;
      }
      await route.fulfill({ status: 404, body: "not found" });
    });
    await enterV2(page, "/v2/?uc=10");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2NetSnap")).toBeDisabled();
    await page.locator("#v2NetAck").check();
    await page.locator("#v2NetSnap").click();
    await expect(page.locator("#v2SnapStatus")).toContainText(/Snapshot OK/i);
    await expect(page.locator("#v2FeeOut")).toContainText(/fastest\s+8 sat\/vB/);
    await expect(page.locator("#v2FeeBands")).toContainText(/fastest/);
    await expect(page.locator("#v2FeeExample")).toContainText(/140 vB/);
    await expect(page.locator("#v2TrafficOut")).toContainText(/Tip block height: 900000/);
    await expect(page.locator("#v2TrafficOut")).toContainText(/Mempool tx count: 1234/);
    const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
    expect(csp || "").toMatch(/connect-src 'self' https:\/\/mempool\.space/);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S43 UC10 address 404 is unknown not zero", async ({ page }) => {
    await page.route("**/api/mempool/address/**", async (route) => {
      await route.fulfill({ status: 404, body: "not found" });
    });
    await page.route("https://mempool.space/**/address/**", async (route) => {
      await route.fulfill({ status: 404, body: "not found" });
    });
    await enterV2(page, "/v2/?uc=10");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2NetAck").check();
    await page.locator("#v2NetAddr").fill("bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4");
    await page.locator("#v2NetBal").click();
    await expect(page.locator("#v2BalStatus")).toContainText(/1 unknown\/error/i);
    await expect(page.locator("#v2BalStatus")).toContainText(/fail-closed/i);
    await expect(page.locator("#v2BalTableBody")).toContainText(/unknown/i);
    await expect(page.locator("#v2BalTableBody")).not.toContainText(/0 \(empty\)/);
    await expect(page.getByRole("link", { name: /Open Network/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S49 UC10 empty address is ok 0 (empty) not unknown", async ({ page }) => {
    const empty = {
      chain_stats: { funded_txo_sum: 0, spent_txo_sum: 0 },
    };
    await page.route("**/api/mempool/address/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(empty),
      });
    });
    await enterV2(page, "/v2/?uc=10");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2NetAck").check();
    await page.locator("#v2NetAddr").fill("bc1q20q0l72fukhasulxqng4mkl5clxg9xr3ujlp5r");
    await page.locator("#v2NetBal").click();
    await expect(page.locator("#v2BalStatus")).toContainText(/Done: 1 ok, 0 unknown\/error/i);
    await expect(page.locator("#v2BalTableBody")).toContainText(/bc1q20q0l72fukhasulxqng4mkl5clxg9xr3ujlp5r/);
    await expect(page.locator("#v2BalTableBody")).toContainText(/ok/);
    await expect(page.locator("#v2BalTableBody")).toContainText(/0 \(empty\)/);
    await expect(page.locator("#v2BalTableBody")).toContainText(/valid empty result/i);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S47 UC10 classroom fee snapshot when proxy missing", async ({ page }) => {
    await page.route("**/api/mempool/**", (route) => route.abort());
    await page.route("https://mempool.space/**", (route) => route.abort());
    await enterV2(page, "/v2/?uc=10");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2NetAck").check();
    await page.locator("#v2NetSnap").click();
    await expect(page.locator("#v2SnapStatus")).toContainText(/Classroom snapshot/i);
    await expect(page.locator("#v2SnapStatus")).not.toContainText(/Snapshot failed/i);
    await expect(page.locator("#v2FeeOut")).toContainText(/fastest\s+8 sat\/vB/);
    await expect(page.locator("#v2FeeBands")).toContainText(/fastest/);
    await expect(page.locator("#v2FeeExample")).toContainText(/140 vB/);
    await expect(page.locator("#v2TrafficOut")).toContainText(/Tip block height: 900000/);
    await expect(page.locator("#v2TrafficOut")).toContainText(/classroom snapshot/i);
    const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content");
    expect(csp || "").toMatch(/mempool\.space/);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S48 UC10 proxy miss falls back to mempool.space", async ({ page }) => {
    await page.route("**/api/mempool/**", (route) => route.abort());
    await page.route("https://mempool.space/**", async (route) => {
      const url = route.request().url();
      expect(url).toContain("mempool.space");
      if (url.includes("/v1/fees/recommended")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            fastestFee: 9,
            halfHourFee: 5,
            hourFee: 3,
            economyFee: 1,
            minimumFee: 1,
          }),
        });
        return;
      }
      if (url.includes("/blocks/tip/height")) {
        await route.fulfill({ status: 200, contentType: "text/plain", body: "900001" });
        return;
      }
      if (/\/mempool\/?$/.test(url.split("?")[0])) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ count: 99, vsize: 1000 }),
        });
        return;
      }
      await route.fulfill({ status: 404, body: "not found" });
    });
    await enterV2(page, "/v2/?uc=10");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2NetAck").check();
    await page.locator("#v2NetSnap").click();
    await expect(page.locator("#v2SnapStatus")).toContainText(/Snapshot OK/i);
    await expect(page.locator("#v2FeeOut")).toContainText(/fastest\s+9 sat\/vB/);
    await expect(page.locator("#v2TrafficOut")).toContainText(/Tip block height: 900001/);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S46 UC14 +10 d6 (fast) and send pad to First wallet", async ({ page }) => {
    page.on("dialog", (d) => d.accept());
    await enterV2(page, "/v2/?uc=14");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Dice10")).toBeVisible();
    await expect(page.locator("#v2Dice10")).toHaveText(/\+10 d6 \(fast\)/);
    await page.locator("#v2Dice10").click();
    await page.locator("#v2Pause").click();
    await page.locator("#v2EntMint").click();
    await expect(page.locator("#v2EntWords .ww")).toHaveCount(12);
    await expect(page.locator("#v2EntToLab")).toBeVisible();
    const words = await page.locator("#v2EntWords .ww").allTextContents();
    await page.locator("#v2EntToLab").click();
    await expect(page.locator("#v2Card .ww")).toHaveCount(12);
    await expect(page.locator("#trackBody h2")).toContainText(/Make practice words/i);
    const dest = await page.locator("#v2Card .ww").allTextContents();
    expect(dest.join(" ")).toBe(words.join(" "));
    const store = await page.evaluate(() => sessionStorage.getItem("bip39lab.v2") || "");
    expect(store).not.toMatch(/abandon|mnemonic/i);
    for (const w of words) {
      expect(store.includes(w)).toBeFalsy();
    }
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S52 UC32 split live 12-word then drop-one fails then combine matches", async ({ page }) => {
    await enterV2(page, "/v2/?uc=32");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2XorSrcMsg")).toContainText(/12|No live/i);
    await page.locator("#v2XorMake12").click();
    await page.locator("#v2XorSplit").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2XorA .ww")).toHaveCount(12);
    await page.locator("#v2Pause").click();
    await page.locator("#v2XorAll").click();
    await expect(page.locator("#v2Pause")).toBeDisabled();
    await page.locator("#v2XorHide").click();
    await expect(page.locator("#v2XorNeedAll")).toHaveClass(/msg-bad/);
    await page.locator("#v2XorAll").click();
    await expect(page.locator("#v2XorNeedAll")).toHaveClass(/msg-ok/);
    await expect(page.locator("#v2Pause")).toBeEnabled();
  });

  test("V2-S53 UC34 refresh from phrase + refuse private + explain", async ({ page }) => {
    await enterV2(page, "/v2/?uc=34");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await expect(page.getByRole("button", { name: "Refresh descriptors from this phrase" })).toBeVisible();
    await page.locator("#v2DescRefreshLab").click();
    await expect(page.locator("#v2DescSrcNote")).toContainText(/Throwaway|live practice/i);
    await expect(page.locator("#v2DescList [data-copy]").first()).toBeVisible({ timeout: 8000 });
    const pub = await page.locator("#v2DescList .v2-copy-val").first().textContent();
    await page.locator("#v2Pause").click();
    await expect(page.getByRole("button", { name: "Explain this descriptor" })).toBeVisible();
    await page.locator("#v2DescPaste").fill("abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about");
    await page.locator("#v2DescExplain").click();
    await expect(page.locator("#v2DescExplainOut")).toContainText(/refus/i);
    await page.locator("#v2DescPaste").fill(String(pub || "wpkh(tpub/0/*)"));
    await page.locator("#v2DescExplain").click();
    await expect(page.locator("#v2DescExplainOut")).not.toContainText(/refus/i);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S54 UC9 leak kits, five future addresses, spend fails", async ({ page }) => {
    await enterV2(page, "/v2/?uc=9");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2LeakTeach")).toContainText(/no second export/i);
    await expect(page.locator("#v2Xpub")).toHaveCount(0);
    await page.locator("#v2Pause").click();
    await expect(page.locator("[data-leak-kit]")).toHaveCount(4);
    await page.locator("[data-leak-kit='forum']").click();
    await expect(page.locator("#v2LeakKitOut")).toHaveClass(/msg-bad/);
    await page.locator("[data-leak-kit='support']").click();
    await page.locator("[data-leak-kit='public']").click();
    await page.locator("[data-leak-kit='invoice']").click();
    await expect(page.locator("#v2LeakKitOut")).toHaveClass(/msg-warn/);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2LeakGap")).toBeVisible();
    await expect(page.locator("#v2Xpub")).toHaveCount(0);
    await page.locator("#v2LeakSpend").click();
    await expect(page.locator("#v2Pause")).toBeDisabled();
    await page.locator("#v2LeakGap").click();
    await expect(page.locator("#v2LeakTable tbody tr")).toHaveCount(5);
    await expect(page.locator("#v2LeakTable")).toContainText(/tb1/i);
    await expect(page.locator("#v2Pause")).toBeEnabled();
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S55 UC30 mint practice child #0; child is not parent backup", async ({ page }) => {
    await enterV2(page, "/v2/?uc=30");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Uc30Teach")).toContainText(/not a backup of the parent/i);
    await page.locator("#v2Pause").click();
    await page.locator("#v2Bip85Mint").click();
    await expect(page.locator("#v2Bip85MintOut")).toContainText(/Child minted/i);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2Bip85Card .ww")).toHaveCount(12);
    await expect(page.locator("#v2Bip85Path")).toContainText(/child number 0/i);
    await expect(page.locator("#v2Bip85Path")).toContainText(/83696968/);
    await page.locator("#v2Bip85Parent").click();
    await expect(page.locator("#v2Bip85NeedOut")).toContainText(/Parent backup is still required/i);
    await expect(page.locator("#v2Pause")).toBeEnabled();
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
    await expect(page.locator("a[href*='cardBip85']")).toBeVisible();
  });

  test("V2-S56 UC27 select 0.05 coin then change path folder 1", async ({ page }) => {
    await enterV2(page, "/v2/?uc=27");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Uc27Teach")).toContainText(/pieces/i);
    await page.locator("#v2Pause").click();
    await page.locator("#v2UtxoPick").click();
    await expect(page.locator("#v2UtxoPickOut")).toContainText(/0\.05/);
    await page.locator("#v2Pause").click();
    await page.locator("#v2UtxoChange").click();
    await expect(page.locator("#v2UtxoChangeOut")).toContainText(/tb1/i);
    await expect(page.locator("#v2UtxoPath")).toContainText(/84'/);
    await expect(page.locator("#v2UtxoPath")).toContainText(/1\/0/);
    await expect(page.locator("#v2UtxoWords")).toContainText(/unchanged/i);
    await expect(page.locator("#v2Pause")).toBeEnabled();
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S51 UC18 heir kits, map packet, open while alive", async ({ page }) => {
    await enterV2(page, "/v2/?uc=18");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#trackBody h2")).toContainText(/Heirs fail on objects/i);
    await expect(page.locator("#v2InhTeach")).toContainText(/not probate/i);
    await expect(page.locator("[data-inh-kit]")).toHaveCount(4);
    await page.locator("[data-inh-kit='chat']").click();
    await expect(page.locator("#v2InhKitOut")).toContainText(/Chat is a copy/i);
    await page.locator("[data-inh-kit='nopass']").click();
    await expect(page.locator("#v2InhKitOut")).toContainText(/extra secret/i);
    await page.locator("[data-inh-kit='onekey']").click();
    await page.locator("[data-inh-kit='later']").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2InhPackTeach")).toContainText(/not a second copy/i);
    await page.locator("[data-inh-shape='keys']").click();
    await page.locator("[data-inh-pack='desc']").click();
    await page.locator("[data-inh-pack='where']").click();
    await page.locator("[data-inh-pack='date']").click();
    await page.locator("#v2InhBuild").click();
    await expect(page.locator("#v2InhPackOut")).toContainText(/Packet OK/i);
    await page.locator("#v2Pause").click();
    await page.locator("#v2InhTryLive").click();
    await expect(page.locator("#v2InhLiveOut")).toContainText(/Fail at least once/i);
    await page.locator("#v2InhTryNopass").click();
    await expect(page.locator("#v2InhLiveOut")).toHaveClass(/msg-bad/);
    await page.locator("#v2InhTryLive").click();
    await expect(page.locator("#v2InhLiveOut")).toHaveClass(/msg-ok/);
    await expect(page.locator("#v2Pause")).toBeEnabled();
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

  test("V2-S57 every UC 1–35 starts: pause, three atoms, no Sign, Clear secrets", async ({ page }) => {
    test.setTimeout(180000);
    await enterV2(page, "/v2/");
    for (let uc = 1; uc <= 35; uc++) {
      await page.goto(`/v2/?uc=${uc}`);
      const ack = page.locator("#v2AckUnderstand");
      if (await ack.isVisible()) await ack.click();
      const start = page.locator("#btnGateStart");
      if (await start.isVisible()) await start.click();
      await expect(page.locator("#trackBody"), `UC${uc} body`).not.toHaveText(/^\s*$/);
      await expect(page.locator("#v2Pause"), `UC${uc} pause`).toBeVisible();
      await expect(page.locator(`#uc${uc}Viz .atom`), `UC${uc} atoms`).toHaveCount(3);
      await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
      await expect(page.locator(".topbar-actions #v2Clear")).toBeVisible();
    }
  });

  test("V2-S58 leftover UCs 21 24 26 28 29 31 + UC25 BIP-352 drill", async ({ page }) => {
    await enterV2(page, "/v2/?uc=21");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Uc21Teach")).toContainText(/one key/i);
    await page.locator('[data-co-pol="they1"]').click();
    await expect(page.locator("#v2CoPolOut")).toHaveClass(/msg-bad/);
    await page.locator('[data-co-pol="you2"]').click();
    await expect(page.locator("#v2CoPolOut")).toHaveClass(/msg-ok/);
    await page.locator("#v2Pause").click();
    await page.locator('[data-co-q="steal"][data-co-a="yes"]').click();
    await expect(page.locator("#v2CoThreatOut")).toHaveClass(/msg-bad/);
    await page.locator('[data-co-q="steal"][data-co-a="no"]').click();
    await page.locator('[data-co-q="freeze"][data-co-a="yes"]').click();
    await expect(page.locator("#v2CoThreatOut")).toHaveClass(/msg-bad/);
    await page.locator('[data-co-q="freeze"][data-co-a="no"]').click();
    await page.locator('[data-co-q="help"][data-co-a="yes"]').click();
    await expect(page.locator("#v2CoThreatOut")).toHaveClass(/msg-ok/);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);

    await enterV2(page, "/v2/?uc=24");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await page.locator('[data-geo="garage"]').click();
    await expect(page.locator("#v2GeoOut")).toBeVisible();
    await page.locator('[data-geo="home"]').click();
    await page.locator('[data-geo="else"]').click();
    await page.locator('[data-geo="person"]').click();

    await enterV2(page, "/v2/?uc=25");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Uc25Teach")).toContainText(/BIP-352/i);
    await page.locator("#v2SpReuse").click();
    await expect(page.locator("#v2SpReuseOut")).toContainText(/same script|link/i);
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2SpCode")).toContainText(/lab-sp1q/i);
    await page.locator("#v2SpSend").click();
    await page.locator("#v2SpSend").click();
    await expect(page.locator("#v2SpSendOut")).toContainText(/Send 1:/);
    await expect(page.locator("#v2SpSendOut")).toContainText(/Send 2:/);
    const sendDump = await page.locator("#v2SpSendOut").innerText();
    const s1 = (sendDump.match(/Send 1:\s*(\S+)/) || [])[1];
    const s2 = (sendDump.match(/Send 2:\s*(\S+)/) || [])[1];
    expect(s1).toBeTruthy();
    expect(s2).toBeTruthy();
    expect(s1).not.toEqual(s2);
    await page.locator("#v2Pause").click();
    await page.locator('[data-sp-import]').click();
    await expect(page.locator("#v2SpImportOut")).toHaveClass(/msg-bad/);
    await page.locator('[data-sp-key="xpub"]').click();
    await expect(page.locator("#v2SpKeyOut")).toHaveClass(/msg-bad/);
    await page.locator('[data-sp-key="scan"]').click();
    await expect(page.locator("#v2SpKeyOut")).toHaveClass(/msg-ok/);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);

    await enterV2(page, "/v2/?uc=26");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator("#v2Uc26Teach")).toContainText(/not your node|someone/i);
    await expect(page.locator('[data-v2-dock="26"]')).toBeVisible();

    await enterV2(page, "/v2/?uc=28");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Uc28Teach")).toContainText(/UTXO/i);
    await page.locator('[data-cj-piece="cafe"]').click();
    await page.locator('[data-cj-piece="salary"]').click();
    await page.locator("#v2Pause").click();
    await page.locator('[data-cj-spend="one"]').click();
    await expect(page.locator("#v2CjTxMsg")).toHaveClass(/msg-bad/);
    await page.locator('[data-cj-spend="both"]').click();
    await expect(page.locator("#v2CjTx")).toContainText(/one owner/i);
    await page.locator('[data-cj-spend="one"]').click();
    await expect(page.locator("#v2CjTx")).toContainText(/unspent/i);
    await page.locator("#v2Pause").click();
    await page.locator('[data-cj-join="hide"]').click();
    await expect(page.locator("#v2CjJoin")).toHaveClass(/msg-bad/);
    await page.locator('[data-cj-join="join"]').click();
    await expect(page.locator("#v2CjJoin")).toContainText(/Guess 1 of 5/i);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);

    await enterV2(page, "/v2/?uc=29");
    await page.locator("#btnGateStart").click();
    await expect(page.locator("#v2Uc29Teach")).toContainText(/extra secret/i);
    const emptyA = (await page.locator("#v2DrEmpty").innerText()).trim();
    const extraA = (await page.locator("#v2DrExtra").innerText()).trim();
    expect(emptyA.startsWith("tb1")).toBeTruthy();
    expect(extraA.startsWith("tb1")).toBeTruthy();
    expect(emptyA).not.toEqual(extraA);
    await page.locator("#v2DrFund").click();
    await expect(page.locator("#v2DrBalEmpty")).toContainText(/0\.01/);
    await expect(page.locator("#v2DrBalExtra")).toContainText(/0\.50/);
    await page.locator("#v2Pause").click();
    await page.locator('[data-dr-pin="wipe-kill"]').click();
    await expect(page.locator("#v2DrPinOut")).toHaveClass(/msg-bad/);
    await page.locator('[data-dr-pin="ledger"]').click();
    await page.locator('[data-dr-pin="wipe-ok"]').click();
    await expect(page.locator("#v2DrPinOut")).toHaveClass(/msg-ok/);
    await page.locator("#v2Pause").click();
    await page.locator("#v2DrWipe").click();
    await expect(page.locator("#v2DrWipeOut")).toContainText(/chain/i);

    await enterV2(page, "/v2/?uc=31");
    await page.locator("#btnGateStart").click();
    await page.locator("#v2Pause").click();
    await expect(page.locator('[data-v2-dock="31"]')).toHaveAttribute("href", /slip39/);
    await expect(page.getByRole("button", { name: "Sign", exact: true })).toHaveCount(0);
  });

});

