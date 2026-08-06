import { test, expect, type Page } from "@playwright/test";

/** Public BIP-39 test vector — never a funded wallet for automation. */
const ABANDON =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const ADDR84 = "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu";
const ADDR86 = "bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr";

async function pasteMnemonic(page: Page, text: string) {
  await page.locator("#mnemonic").fill(text);
  // Debounced derive ~280ms
  await page.waitForTimeout(450);
}

async function waitForTableRows(page: Page, min = 5) {
  await expect
    .poll(async () => page.locator("#addrTableBody tr:not(.empty-row)").count(), {
      timeout: 15_000,
    })
    .toBeGreaterThanOrEqual(min);
}

test.describe("BIP39 Lab E2E", () => {
  test("S0 smoke load", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/BIP39/i);
    await expect(page.getByRole("button", { name: /Generate/i })).toBeVisible();
    await expect(page.locator(".nav-item[data-tab=lab]")).toBeVisible();
    await expect(page.locator(".nav-item[data-tab=balance]")).toBeVisible();
    await expect(page.locator(".nav-item[data-tab=about]")).toBeVisible();
  });

  test("S1 generate fills entropy and address table", async ({ page }) => {
    await page.goto("/");
    await page.locator("#wordCount").selectOption("12");
    await page.locator("#btnGenerate").click();
    await waitForTableRows(page, 5);

    const mnemonic = await page.locator("#mnemonic").inputValue();
    expect(mnemonic.trim().split(/\s+/).length).toBe(12);

    await expect(page.locator("#entropyMnemonic")).toHaveText(/128 bits \(12-word BIP-39\)/);

    const body = await page.locator("#addrTableBody").innerText();
    expect(body).toMatch(/bc1p/);
    expect(body).toMatch(/bc1q/);
  });

  test("S2 abandon golden addresses", async ({ page }) => {
    await page.goto("/");
    await page.locator("#btnClear").click();
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);

    const body = await page.locator("#addrTableBody").innerText();
    expect(body).toContain(ADDR86);
    expect(body).toContain(ADDR84);
    await expect(page.locator("#entropyMnemonic")).toHaveText(/128 bits \(12-word BIP-39\)/);
  });

  test("S3 passphrase changes addresses; ENT stays 128", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);

    const before = await page.locator("#addrTableBody").innerText();
    expect(before).toContain(ADDR84);

    await page.locator("#passphrase").fill("test");
    await page.waitForTimeout(500);
    await waitForTableRows(page, 5);

    const after = await page.locator("#addrTableBody").innerText();
    expect(after).not.toContain(ADDR84);
    await expect(page.locator("#entropyMnemonic")).toHaveText(/128 bits \(12-word BIP-39\)/);
    await expect(page.locator("#entropyPassphrase")).toHaveText(/bits \(estimate\)/);

    await page.locator("#passphrase").fill("");
    await page.waitForTimeout(500);
    await waitForTableRows(page, 5);
    await expect(page.locator("#addrTableBody")).toContainText(ADDR84);
  });

  test("S4 account change indices controls", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);

    await page.locator("#deriveCount").selectOption("10");
    await page.waitForTimeout(450);
    await waitForTableRows(page, 10);
    expect(await page.locator("#addrTableBody tr:not(.empty-row)").count()).toBe(10);

    await page.locator("#deriveChange").selectOption("1");
    await page.waitForTimeout(450);
    await expect(page.locator("#derivePathSummary")).toContainText(/change/i);

    await page.locator("#deriveAccount").fill("1");
    await page.waitForTimeout(450);
    const acct1 = await page.locator("#addrTableBody").innerText();
    expect(acct1).not.toContain(ADDR84);

    await page.locator("#deriveAccount").fill("0");
    await page.locator("#deriveChange").selectOption("0");
    await page.locator("#deriveCount").selectOption("5");
    await page.waitForTimeout(450);
    await waitForTableRows(page, 5);
    await expect(page.locator("#addrTableBody")).toContainText(ADDR84);
  });

  test("S5 optional BIP49/BIP44 columns", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);

    await expect(page.locator('th[data-col=bip49]')).toBeHidden();
    await expect(page.locator('th[data-col=bip44]')).toBeHidden();

    await page.locator("#colBip49").check();
    await expect(page.locator('th[data-col=bip49]')).toBeVisible();
    // abandon index-0 nested P2SH
    await expect(page.locator("#addrTableBody")).toContainText("37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf");

    await page.locator("#colBip44").check();
    await expect(page.locator('th[data-col=bip44]')).toBeVisible();
    await expect(page.locator("#addrTableBody")).toContainText("1LqBGSKuX5yYUonjxT5qGfpUsXKYYWeabA");
  });

  test("S6 copy address button", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);

    const firstCopy = page
      .locator("#addrTableBody tr:not(.empty-row)")
      .first()
      .getByLabel("Copy address to clipboard")
      .first();
    await firstCopy.click();
    await expect(firstCopy).toHaveText(/Copied/i, { timeout: 3000 });

    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip.length).toBeGreaterThan(10);
    expect(clip).toMatch(/^(bc1|[13])/);
  });

  test("S7 QR modal offline", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);

    await page
      .locator("#addrTableBody tr:not(.empty-row)")
      .first()
      .getByLabel("Show address QR code")
      .first()
      .click();
    await expect(page.locator("#qrModal")).toBeVisible();
    await expect(page.locator("#qrModalImg")).toHaveAttribute("src", /data:image/);
    const modalText = await page.locator("#qrModalText").innerText();
    expect(modalText).toMatch(/^(bc1|[13])/);

    await page.locator("#btnQrClose").click();
    await expect(page.locator("#qrModal")).toBeHidden();
  });

  test("S8 watch-only export no xprv", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);
    await page.locator("#btnWatchOnly").click();
    await expect(page.locator("#watchOnlyList .watch-item").first()).toBeVisible({ timeout: 10_000 });

    const listText = await page.locator("#watchOnlyList").innerText();
    expect(listText).toMatch(/zpub/);
    expect(listText).toMatch(/xpub/);
    expect(listText).not.toMatch(/xprv/i);
    expect(listText).toMatch(/BIP84|native segwit/i);
  });

  test("S9 clear and hide private", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await page.locator("#passphrase").fill("secret");
    await page.waitForTimeout(300);

    await page.locator("#hidePrivate").check();
    await expect(page.locator("#mnemonic")).toBeHidden();
    await expect(page.locator("#passphrase")).toBeHidden();

    await page.locator("#hidePrivate").uncheck();
    await expect(page.locator("#mnemonic")).toBeVisible();

    await page.locator("#btnClear").click();
    await expect(page.locator("#mnemonic")).toHaveValue("");
    await expect(page.locator("#entropyMnemonic")).toHaveText("—");
    await expect(page.locator("#addrTableBody .empty-row")).toBeVisible();
  });

  test("S10 nav balance and about", async ({ page }) => {
    await page.goto("/");
    await page.locator(".nav-item[data-tab=balance]").click();
    await expect(page.locator("#panel-balance")).toBeVisible();
    await expect(page.locator("#panel-balance")).toContainText(/mempool|bitcoind|CLI/i);

    await page.locator(".nav-item[data-tab=about]").click();
    await expect(page.locator("#panel-about")).toBeVisible();
    await expect(page.locator("#panel-about")).toContainText(/No retention|retention/i);

    await page.locator(".nav-item[data-tab=lab]").click();
    await expect(page.locator("#panel-lab")).toBeVisible();
  });

  test("S11 invalid mnemonic", async ({ page }) => {
    await page.goto("/");
    await page.locator("#btnClear").click();
    await page.locator("#mnemonic").fill("not a real seed phrase here at all xx");
    await page.waitForTimeout(500);

    const ent = await page.locator("#entropyMnemonic").innerText();
    expect(ent).not.toMatch(/^128 bits \(12-word BIP-39\)$/);
    // table should not show golden abandon addresses
    const body = await page.locator("#addrTableBody").innerText();
    expect(body).not.toContain(ADDR84);
  });
});
