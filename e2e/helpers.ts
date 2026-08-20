import { expect, type Page } from "@playwright/test";

/** Public BIP-39 test vector — never a funded wallet. */
export const ABANDON =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

export const GOLDEN = {
  bip86: "bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr",
  bip84: "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
  bip49: "37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf",
  bip44: "1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA",
  /** testnet BIP84 idx0 (coin_type 1) */
  bip84testPrefix: "tb1",
};

/** Six primary nav items (Shamir after Multisig). */
export const NAV = ["lab", "multisig", "shamir", "network", "tools", "glossary"] as const;

/** Click Lab Generate/Derive/Clear then Continue on THAT overlay. */
export async function clickLabAction(page: Page, which: "generate" | "derive" | "clear") {
  const btn =
    which === "generate" ? "#btnGenerate" : which === "derive" ? "#btnDerive" : "#btnClear";
  const overlay =
    which === "generate"
      ? "#overlayGenerate"
      : which === "derive"
        ? "#overlayDerive"
        : "#overlayClear";
  await page.locator(btn).click();
  await expect(page.locator(overlay)).toBeVisible();
  await page.locator(`${overlay} .lab-overlay-continue`).click();
  await expect(page.locator(overlay)).toBeHidden();
}

export async function pasteMnemonic(page: Page, text: string) {
  await page.locator("#mnemonic").fill(text);
  await page.waitForTimeout(450);
}

/** Mainnet goldens (abandon). Lab default network is Testnet. */
export async function selectLabMainnet(page: Page) {
  await page.locator("#deriveNetwork").selectOption("main");
  await page.waitForTimeout(400);
}

export async function waitForTableRows(page: Page, min = 5) {
  await expect
    .poll(async () => page.locator("#addrTableBody tr:not(.empty-row)").count(), {
      timeout: 15_000,
    })
    .toBeGreaterThanOrEqual(min);
}

export async function expectNavCount(page: Page, n = NAV.length) {
  await expect(page.locator(".nav-item[data-nav]")).toHaveCount(n);
  for (const id of NAV) {
    await expect(page.locator(`.nav-item[data-nav="${id}"]`)).toBeVisible();
  }
  await expect(page.locator('.nav-item[data-nav="balance"]')).toHaveCount(0);
  await expect(page.locator('.nav-item[data-nav="shamir"]')).toBeVisible();
}

export async function labCspOffline(page: Page) {
  const csp =
    (await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute("content")) ||
    "";
  expect(csp).toContain("connect-src 'none'");
}
