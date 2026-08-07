import { test, expect } from "@playwright/test";
import {
  ABANDON,
  GOLDEN,
  expectNavCount,
  labCspOffline,
  pasteMnemonic,
  waitForTableRows,
} from "./helpers";

test.describe("Lab shell & chrome", () => {
  test("S0 smoke load · 6-nav · chips · CSP offline", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/BIP39/i);
    await expect(page.getByRole("heading", { name: /Offline BIP-39 lab/i })).toBeVisible();
    await expect(page.locator("#btnGenerate")).toBeVisible();
    await expectNavCount(page);
    await expect(page.locator('.nav-item[data-nav="glossary"]')).toBeVisible();
    await expect(page.locator('.nav-item[data-nav="shamir"]')).toBeVisible();
    await expect(page.locator('.nav-item[data-nav="about"]')).toHaveCount(0);
    await expect(page.locator('.nav-item[data-nav="balance"]')).toHaveCount(0);
    await expect(page.locator("#chipOffline")).toContainText(/Offline/i);
    await expect(page.locator("#chipAirgap")).toBeVisible();
    await expect(page.locator("#btnTheme")).toBeVisible();
    await labCspOffline(page);
  });

  test("S0b theme toggle dark ↔ light", async ({ page }) => {
    await page.goto("/");
    const btn = page.locator("#btnTheme");
    await expect(btn).toContainText(/dark|light/i);
    await btn.click();
    await expect(btn).toContainText(/Theme:/i);
    const theme = await page.locator("html").getAttribute("data-theme");
    expect(theme === "light" || theme === "dark").toBeTruthy();
    await btn.click();
  });

  test("S0c keyboard shortcut ? opens Tools", async ({ page }) => {
    await page.goto("/");
    await page.locator("body").click();
    await page.keyboard.press("?");
    await expect(page.locator("#panel-tools")).toBeVisible();
    await expect(page.locator("#pathPlayOut")).toBeVisible();
  });
});

test.describe("Lab mnemonic & derive", () => {
  test("S1 generate 12-word fills entropy + table", async ({ page }) => {
    await page.goto("/");
    await page.locator("#wordCount").selectOption("12");
    await page.locator("#btnGenerate").click();
    await waitForTableRows(page, 5);
    const mnemonic = await page.locator("#mnemonic").inputValue();
    expect(mnemonic.trim().split(/\s+/).length).toBe(12);
    await expect(page.locator("#entropyMnemonic")).toHaveText(/128 bits \(12-word BIP-39\)/);
    await expect(page.locator("#addrTableBody")).toContainText(/bc1p/);
  });

  test("S1b generate 24-word entropy bits", async ({ page }) => {
    await page.goto("/");
    await page.locator("#wordCount").selectOption("24");
    await page.locator("#btnGenerate").click();
    await waitForTableRows(page, 5);
    const mnemonic = await page.locator("#mnemonic").inputValue();
    expect(mnemonic.trim().split(/\s+/).length).toBe(24);
    await expect(page.locator("#entropyMnemonic")).toHaveText(/256 bits \(24-word BIP-39\)/);
  });

  test("S2 abandon golden BIP86 + BIP84 + BIP49 + BIP44", async ({ page }) => {
    await page.goto("/");
    await page.locator("#btnClear").click();
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);
    await expect(page.locator("#entropyMnemonic")).toHaveText(/128 bits \(12-word BIP-39\)/);

    await page.locator('.seg-tab[data-addr-type="bip86"]').click();
    await expect(page.locator("#addrTableBody")).toContainText(GOLDEN.bip86);

    await page.locator('.seg-tab[data-addr-type="bip84"]').click();
    await expect(page.locator("#addrTableBody")).toContainText(GOLDEN.bip84);

    await page.locator('.seg-tab[data-addr-type="bip49"]').click();
    await expect(page.locator("#addrTableBody")).toContainText(GOLDEN.bip49);

    await page.locator('.seg-tab[data-addr-type="bip44"]').click();
    await expect(page.locator("#addrTableBody")).toContainText(GOLDEN.bip44);
  });

  test("S3 passphrase changes addresses + strength", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);
    await page.locator('.seg-tab[data-addr-type="bip84"]').click();
    await expect(page.locator("#addrTableBody")).toContainText(GOLDEN.bip84);

    await page.locator("#passphrase").fill("test");
    await page.waitForTimeout(500);
    await expect(page.locator("#entropyPassphrase")).toContainText(/bits \(estimate\)/);
    const body = await page.locator("#addrTableBody").innerText();
    expect(body).not.toContain(GOLDEN.bip84);

    await page.locator("#passphrase").fill("");
    await page.waitForTimeout(500);
    await expect(page.locator("#addrTableBody")).toContainText(GOLDEN.bip84);
  });

  test("S4 account change indices path summary", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);

    await page.locator("#deriveCount").selectOption("10");
    await page.waitForTimeout(500);
    await expect(page.locator("#addrTableBody tr:not(.empty-row)")).toHaveCount(10);

    await page.locator("#deriveChange").selectOption("1");
    await page.waitForTimeout(500);
    await expect(page.locator("#derivePathSummary")).toContainText(/change/i);

    await page.locator("#deriveAccount").fill("1");
    await page.waitForTimeout(500);
    await page.locator('.seg-tab[data-addr-type="bip84"]').click();
    const body = await page.locator("#addrTableBody").innerText();
    expect(body).not.toContain(GOLDEN.bip84);

    await page.locator("#deriveAccount").fill("0");
    await page.locator("#deriveChange").selectOption("0");
    await page.locator("#deriveCount").selectOption("5");
    await page.waitForTimeout(500);
    await waitForTableRows(page, 5);
    await expect(page.locator("#addrTableBody")).toContainText(GOLDEN.bip84);
  });

  test("S5 mainnet vs testnet coin type", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);
    await page.locator('.seg-tab[data-addr-type="bip84"]').click();
    await expect(page.locator("#addrTableBody")).toContainText(GOLDEN.bip84);

    await page.locator("#deriveNetwork").selectOption("test");
    await page.waitForTimeout(500);
    await expect(page.locator("#addrTableBody")).toContainText(new RegExp(GOLDEN.bip84testPrefix));
    await expect(page.locator("#derivePathSummary")).toContainText(/testnet|signet|network/i);

    await page.locator("#deriveNetwork").selectOption("main");
    await page.waitForTimeout(500);
    await expect(page.locator("#addrTableBody")).toContainText(GOLDEN.bip84);
  });

  test("S6 copy address feedback", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);
    const copyBtn = page.locator("#addrTableBody .btn-copy").filter({ hasText: /^Copy$/ }).first();
    await copyBtn.click();
    await expect(page.locator("#copyFeedback")).toContainText(/Copied|clipboard/i, { timeout: 5_000 });
  });

  test("S7 QR modal offline", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);
    await page.locator("#addrTableBody button").filter({ hasText: /^QR$/ }).first().click();
    await expect(page.locator("#qrModal")).toBeVisible();
    await expect(page.locator("#qrModalImg")).toBeVisible();
    await expect(page.locator("#qrModalText")).toContainText(/bc1/);
    await page.locator("#btnQrClose").click();
    await expect(page.locator("#qrModal")).toBeHidden();
  });

  test("S8 watch-only zpub then xpub pads", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);
    await page.locator("#btnWatchOnly").click();
    await expect(page.locator("#watchOnlyList .watch-item")).toHaveCount(1, { timeout: 10_000 });
    await expect(page.locator("#watchOnlyList")).toContainText(/zpub/);
    await expect(page.locator("#watchOnlyList")).not.toContainText(/xprv/);

    await page.locator('.seg-tab[data-wo-type="44"]').click();
    await expect(page.locator("#watchOnlyList .watch-item")).toHaveCount(1);
    await expect(page.locator("#watchOnlyList")).toContainText(/xpub/);
    await expect(page.locator("#watchOnlyList")).not.toContainText(/xprv/);
  });

  test("S9 hide private + clear secrets", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);
    await page.locator("#hidePrivate").check();
    await expect(page.locator("#mnemonic")).toBeHidden();
    await page.locator("#hidePrivate").uncheck();
    await expect(page.locator("#mnemonic")).toBeVisible();
    await page.locator("#btnClear").click();
    await expect(page.locator("#mnemonic")).toHaveValue("");
    await expect(page.locator("#entropyMnemonic")).toHaveText("—");
    await expect(page.locator("#addrTableBody .empty-row")).toBeVisible();
  });

  test("S11 invalid mnemonic", async ({ page }) => {
    await page.goto("/");
    await page.locator("#btnClear").click();
    await page.locator("#mnemonic").fill("not a real seed phrase here at all xx");
    await page.waitForTimeout(500);
    const ent = await page.locator("#entropyMnemonic").innerText();
    expect(ent).not.toMatch(/^128 bits \(12-word BIP-39\)$/);
    const body = await page.locator("#addrTableBody").innerText();
    expect(body).not.toContain(GOLDEN.bip84);
  });

  test("S15 seed QR confirm + modal", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    page.once("dialog", (d) => d.accept());
    await page.locator("#btnSeedQr").click();
    await expect(page.locator("#qrModal")).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("#qrModalTitle")).toContainText(/Seed|sensitive|QR/i);
    await page.locator("#btnQrClose").click();
  });

  test("S16 send addresses → Network session bridge", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);
    await page.locator("#btnSendNetwork").click();
    await expect(page).toHaveURL(/network\.html/);
    await page.locator("#balAck").check();
    await page.locator("#btnLoadLab").click();
    const addrs = await page.locator("#balAddrs").inputValue();
    expect(addrs).toMatch(/bc1/i);
    expect(addrs.toLowerCase()).not.toContain("abandon");
  });
});

test.describe("Lab Tools panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);
  });

  test("S14 path playground + tools open", async ({ page }) => {
    await page.locator('.nav-item[data-nav="tools"]').click();
    await expect(page.locator("#panel-tools")).toBeVisible();
    await expect(page.locator("#pathPlayOut")).toContainText(/m\/\d+'/);
  });

  test("S17 entropy pad dice coin clear", async ({ page }) => {
    await page.locator('.nav-item[data-nav="tools"]').click();
    await page.locator("#btnDice").click();
    await page.locator("#btnDice").click();
    await page.locator("#btnCoin").click();
    await expect(page.locator("#entPadOut")).toContainText(/d6:/);
    await expect(page.locator("#entPadOut")).toContainText(/coin:/);
    await expect(page.locator("#entPadMeta")).toContainText(/events/);
    await page.locator("#btnEntClear").click();
    await expect(page.locator("#entPadOut")).toHaveText("—");
  });

  test("S18 compare passphrases", async ({ page }) => {
    await page.locator('.nav-item[data-nav="tools"]').click();
    // No Lab visit: Compare auto-generates a test phrase when empty
    await page.locator("#cmpPpB").fill("test");
    await page.locator("#btnCmpPp").click();
    await expect(page.locator("#cmpPpOut")).toContainText(/Different|Same address/);
    await expect(page.locator("#cmpPpOut")).toContainText(/A:/);
    await expect(page.locator("#mnemonic")).not.toHaveValue("");
  });

  test("S18b tools generate test phrase then compare", async ({ page }) => {
    await page.locator('.nav-item[data-nav="tools"]').click();
    await page.locator("#btnCmpGen").click();
    await expect(page.locator("#cmpPpOut")).toContainText(/Generated/);
    await expect(page.locator("#mnemonic")).not.toHaveValue("");
    await page.locator("#cmpPpB").fill("test");
    await page.locator("#btnCmpPp").click();
    await expect(page.locator("#cmpPpOut")).toContainText(/Different/);
  });

  test("S19 descriptors refresh", async ({ page }) => {
    await page.locator('.nav-item[data-nav="tools"]').click();
    await page.locator("#btnDescRefresh").click();
    await expect(page.locator("#descOut")).toContainText(/wpkh\(|tr\(|pkh\(|sh\(/);
  });

  test("S20 PSBT inspector educational", async ({ page }) => {
    await page.locator('.nav-item[data-nav="tools"]').click();
    await page.locator("#psbtIn").fill("cHNidP8BAAoCAAAAAA==");
    await page.locator("#btnPsbt").click();
    await expect(page.locator("#psbtOut")).toContainText(/ok|Educational|PSBT|magic/i);
  });

  test("S21 PSBT refuse secrets", async ({ page }) => {
    await page.locator('.nav-item[data-nav="tools"]').click();
    await page.locator("#psbtIn").fill("xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi");
    await page.locator("#btnPsbt").click();
    await expect(page.locator("#psbtOut")).toContainText(/refus|error|secret/i);
  });

  test("S22 descriptor explain public + refuse private", async ({ page }) => {
    await page.locator('.nav-item[data-nav="tools"]').click();
    await page.locator("#descExplainIn").fill("wpkh(zpub6demo/0/*)");
    await page.locator("#btnDescExplain").click();
    await expect(page.locator("#descExplainOut")).toContainText(/wpkh|ok/i);

    await page.locator("#descExplainIn").fill("xprvABC secret seed phrase abandon abandon");
    await page.locator("#btnDescExplain").click();
    await expect(page.locator("#descExplainOut")).toContainText(/refus|error|private/i);
  });

  test("S23 tools keyboard shortcuts card present", async ({ page }) => {
    await page.locator('.nav-item[data-nav="tools"]').click();
    await expect(page.locator("#panel-tools")).toContainText(/Keyboard shortcuts/i);
    await expect(page.locator("#panel-tools")).toContainText(/Generate|derive/i);
  });
});

test.describe("Lab Network CLI redirect + Glossary security", () => {
  test("S24 old #balance deep-links to Network CLI guidance", async ({ page }) => {
    await page.goto("/#balance");
    await expect(page).toHaveURL(/network\.html/);
    await expect(page.locator("#netCardBal")).toBeVisible();
    await expect(page.locator("#netCardBal")).toContainText(/knots|mempool|CLI|rpc-cookie/i);
  });

  test("S25 glossary hosts threat model + no retention", async ({ page }) => {
    await page.goto("/#glossary");
    await expect(page.locator("#panel-glossary")).toBeVisible();
    await expect(page.locator("#glossary-security")).toContainText(/No retention|retention/i);
    await expect(page.locator("#glossary-threat")).toContainText(/Threat model/i);
    await expect(page.locator("#glossary-threat")).toContainText(/Malicious|clipboard|Network page/i);
    // legacy #about hash redirects to glossary panel
    await page.goto("/#about");
    await expect(page.locator("#panel-glossary")).toBeVisible();
    await expect(page.locator("#glossary-threat")).toBeVisible();
  });
});

test.describe("Lab nav matrix", () => {
  test("S10 full nav Lab→Tools→Glossary→Multisig→Shamir→Network", async ({ page }) => {
    await page.goto("/");
    await expectNavCount(page);

    await page.locator('.nav-item[data-nav="tools"]').click();
    await expect(page.locator("#panel-tools")).toBeVisible();

    await page.locator('.nav-item[data-nav="glossary"]').click();
    await expect(page.locator("#panel-glossary")).toBeVisible();
    await expect(page.locator("#glossary-threat")).toBeVisible();

    await page.locator('.nav-item[data-nav="lab"]').click();
    await expect(page.locator("#panel-lab")).toBeVisible();

    await page.locator('.nav-item[data-nav="multisig"]').click();
    await expect(page).toHaveURL(/multisig\.html/);
    await expectNavCount(page);

    await page.locator('.nav-item[data-nav="shamir"]').click();
    await expect(page).toHaveURL(/shamir\.html/);
    await expectNavCount(page);
    await expect(page.locator("#shDanger")).toContainText(/SLIP-39|Educational/i);

    await page.locator('.nav-item[data-nav="network"]').click();
    await expect(page).toHaveURL(/network\.html/);
    await expectNavCount(page);
    await expect(page.locator("#netCardBal")).toContainText(/CLI|knots|mempool/i);
  });
});
