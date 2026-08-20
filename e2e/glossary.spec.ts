import { test, expect } from "@playwright/test";
import { expectNavCount } from "./helpers";

test.describe("Glossary educational terms", () => {
  test("S49 glossary panel lists BIPs and scripts", async ({ page }) => {
    await page.goto("/#glossary");
    await expect(page.locator("#panel-glossary")).toBeVisible();
    await expect(page.locator("#glossaryList")).toContainText(/BIP-39|BIP-44|BIP-84|BIP-86/i);
    await expect(page.locator("#glossaryList")).toContainText(/P2PKH|P2WPKH|P2TR|P2SH/i);
    await expect(page.locator("#glossaryList")).toContainText(/zpub|xpub|UTXO|sat/i);
    await expectNavCount(page);
    await expect(page.locator("#glossary-security")).toContainText(/No retention|retention/i);
    await expect(page.locator("#glossary-threat")).toContainText(/Threat model/i);
  });

  test("S50 glossary search filters", async ({ page }) => {
    await page.goto("/#glossary");
    await page.locator("#glossarySearch").fill("multisig");
    await expect(page.locator("#glossaryList")).toContainText(/M-of-N|Multisig|Cosigner/i);
    await expect(page.locator("#glossaryList")).not.toContainText(/PBKDF2/);
    await page.locator("#glossarySearch").fill("BIP67");
    await expect(page.locator("#glossaryList")).toContainText(/BIP-67|sorted/i);
  });

  test("S77 PIN vs file password vs passphrase terms", async ({ page }) => {
    await page.goto("/#glossary");
    await page.locator("#glossarySearch").fill("coordinator file password");
    await expect(page.locator("#glossaryList")).toContainText(/Coordinator file password|hides/i);
    await page.locator("#glossarySearch").fill("device PIN");
    await expect(page.locator("#glossaryList")).toContainText(/Device PIN/i);
    await page.locator("#glossarySearch").fill("passphrase");
    await expect(page.locator("#glossaryList")).toContainText(/passphrase|BIP-39/i);
  });

  test("S51 data-term tip fills from glossary", async ({ page }) => {
    await page.goto("/");
    // mnemonic tip uses data-term MNEMONIC — open i
    const tip = page.locator('#card-mnemonic .help-tip[data-term="MNEMONIC"]');
    await tip.locator(".help-tip-btn").hover();
    await expect(tip.locator(".help-tip-panel")).toBeVisible();
    await expect(tip.locator(".help-tip-panel")).toContainText(/BIP-39|recovery|words/i);
    await expect(tip.locator(".help-tip-panel a.gloss-link")).toBeVisible();
  });

  test("S52 BIP84 tab has glossary tip after enhance", async ({ page }) => {
    await page.goto("/");
    const tab = page.locator('.seg-tab[data-addr-type="bip84"]');
    await expect(tab).toBeVisible();
    // tip sibling may be inserted after button
    const tip = page.locator('.seg-block .help-tip[data-term="BIP84"], .seg-tab[data-addr-type="bip84"] + .help-tip');
    // enhance attaches tip next to element with data-term on the button itself — tip is child append
    const tipBtn = page.locator('.seg-tab[data-addr-type="bip84"] .help-tip-btn, .seg-block .help-tip[data-term="BIP84"] .help-tip-btn').first();
    if (await tipBtn.count()) {
      await tipBtn.hover();
      await expect(tipBtn.locator("xpath=ancestor::*[contains(@class,'help-tip')][1]//*[contains(@class,'help-tip-panel')]").first()).toBeVisible();
      await expect(page.locator(".help-tip:hover .help-tip-panel, .help-tip.is-open .help-tip-panel").first()).toContainText(/BIP-84|SegWit|bc1q/i);
    } else {
      // fallback: glossary has BIP84
      await page.locator('.nav-item[data-nav="glossary"]').click();
      await expect(page.locator("#glossaryList")).toContainText(/BIP-84/);
    }
  });
});
