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

/** Dismiss first-visit is/isn’t ack if present. */
export async function dismissAck(page: Page) {
  const ov = page.locator("#ackOverlay");
  if (await ov.isVisible()) {
    await page.locator("#ackUnderstand").click();
    await expect(ov).toBeHidden();
  }
}

/** Click Lab Generate/Derive/Clear (hover help, no OK modal). */
export async function clickLabAction(page: Page, which: "generate" | "derive" | "clear") {
  const btn =
    which === "generate" ? "#btnGenerate" : which === "derive" ? "#btnDerive" : "#btnClear";
  await page.locator(btn).click();
}

/** Slim rail: select a First-hour step then Go. */
export async function hourRailGo(page: Page, step: string) {
  await page.locator(`#firstHourList [data-hour-step="${step}"]`).click();
  await page.locator("#hourRailGo").click();
}

/** Slim rail: select a First-hour step then Mark done. */
export async function hourRailMark(page: Page, step: string) {
  await page.locator(`#firstHourList [data-hour-step="${step}"]`).click();
  await page.locator("#hourRailDone").click();
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
