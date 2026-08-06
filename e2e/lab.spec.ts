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
    await expect(page.locator('.nav-item[data-nav="lab"]')).toBeVisible();
    await expect(page.locator('.nav-item[data-nav="multisig"]')).toBeVisible();
    await expect(page.locator('.nav-item[data-nav="network"]')).toBeVisible();
    await expect(page.locator('.nav-item[data-nav="balance"]')).toBeVisible();
    await expect(page.locator('.nav-item[data-nav="about"]')).toBeVisible();
    // Stable labels (must match Multisig page sidebar)
    await expect(page.locator('.nav-item[data-nav="lab"] strong')).toHaveText("Lab");
  });

  test("S1 generate fills entropy and address table", async ({ page }) => {
    await page.goto("/");
    await page.locator("#wordCount").selectOption("12");
    await page.locator("#btnGenerate").click();
    await waitForTableRows(page, 5);

    const mnemonic = await page.locator("#mnemonic").inputValue();
    expect(mnemonic.trim().split(/\s+/).length).toBe(12);

    await expect(page.locator("#entropyMnemonic")).toHaveText(/128 bits \(12-word BIP-39\)/);

    // Default pad BIP86 → bc1p; switch to BIP84 → bc1q
    await expect(page.locator("#addrTableBody")).toContainText(/bc1p/);
    await page.locator('.seg-tab[data-addr-type="bip84"]').click();
    await expect(page.locator("#addrTableBody")).toContainText(/bc1q/);
  });

  test("S2 abandon golden addresses", async ({ page }) => {
    await page.goto("/");
    await page.locator("#btnClear").click();
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);

    // Default pad: BIP86
    await expect(page.locator("#addrTableBody")).toContainText(ADDR86);
    await page.locator('.seg-tab[data-addr-type="bip84"]').click();
    await expect(page.locator("#addrTableBody")).toContainText(ADDR84);
    await expect(page.locator("#entropyMnemonic")).toHaveText(/128 bits \(12-word BIP-39\)/);
  });

  test("S3 passphrase changes addresses; ENT stays 128", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);
    await page.locator('.seg-tab[data-addr-type="bip84"]').click();
    await expect(page.locator("#addrTableBody")).toContainText(ADDR84);

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
    await page.locator('.seg-tab[data-addr-type="bip84"]').click();
    await expect(page.locator("#addrTableBody")).toContainText(ADDR84);
  });

  test("S5 address type pads one at a time", async ({ page }) => {
    await page.goto("/");
    await pasteMnemonic(page, ABANDON);
    await waitForTableRows(page, 5);

    await expect(page.locator('.seg-tab[data-addr-type="bip86"]')).toHaveClass(/active/);
    await expect(page.locator("#addrTableBody")).toContainText(ADDR86);

    await page.locator('.seg-tab[data-addr-type="bip84"]').click();
    await expect(page.locator("#addrTableBody")).toContainText(ADDR84);
    await expect(page.locator("#addrTableBody")).not.toContainText(ADDR86);

    await page.locator('.seg-tab[data-addr-type="bip49"]').click();
    await expect(page.locator("#addrTableBody")).toContainText("37VucYSaXLCAsxYyAPfbSi9eh4iEcbShgf");

    await page.locator('.seg-tab[data-addr-type="bip44"]').click();
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
      .getByLabel(/Copy address to clipboard|Copied to clipboard/i)
      .first();
    await firstCopy.click();
    // Visible feedback is required (Comet defect: label must change)
    await expect(firstCopy).toHaveText(/Copied/i, { timeout: 3000 });
    await expect(firstCopy).toHaveClass(/copied/);
    await expect(page.locator("#copyFeedback")).toContainText(/Copied to clipboard/i, {
      timeout: 3000,
    });

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
    // Default pad: BIP84 zpub — one card
    await expect(page.locator('.seg-tab[data-wo-type="84"]')).toHaveClass(/active/);
    await page.locator("#btnWatchOnly").click();
    await expect(page.locator("#watchOnlyList .watch-item")).toHaveCount(1, { timeout: 10_000 });

    let listText = await page.locator("#watchOnlyList").innerText();
    expect(listText).toMatch(/zpub/);
    expect(listText).toMatch(/BIP84|native segwit/i);
    expect(listText).not.toMatch(/xprv/i);

    // Switch pad to BIP44 — still one card
    await page.locator('.seg-tab[data-wo-type="44"]').click();
    await expect(page.locator("#watchOnlyList .watch-item")).toHaveCount(1);
    listText = await page.locator("#watchOnlyList").innerText();
    expect(listText).toMatch(/xpub/);
    expect(listText).not.toMatch(/xprv/i);
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

  test("S10 nav balance about multisig and network", async ({ page }) => {
    await page.goto("/");
    await page.locator('.nav-item[data-nav="balance"]').click();
    await expect(page.locator("#panel-balance")).toBeVisible();
    await expect(page.locator("#panel-balance")).toContainText(/mempool|bitcoind|CLI/i);
    await expect(page.locator("#panel-balance")).toContainText(/Network/i);
    await expect(page.locator('.nav-item[data-nav="balance"]')).toHaveClass(/active/);
    // Lab + Multisig + Network + Balance + About
    await expect(page.locator(".nav-item[data-nav]")).toHaveCount(5);
    await expect(page.locator('.nav-item[data-nav="network"]')).toBeVisible();

    await page.locator('.nav-item[data-nav="about"]').click();
    await expect(page.locator("#panel-about")).toBeVisible();
    await expect(page.locator("#panel-about")).toContainText(/No retention|retention/i);

    await page.locator('.nav-item[data-nav="lab"]').click();
    await expect(page.locator("#panel-lab")).toBeVisible();

    await page.locator('.nav-item[data-nav="multisig"]').click();
    await expect(page).toHaveURL(/multisig\.html/);
    await expect(page.getByRole("heading", { name: /Multisig, explained/i })).toBeVisible();
    await expect(page.locator(".nav-item[data-nav]")).toHaveCount(5);
    await expect(page.locator('.nav-item[data-nav="lab"] strong')).toHaveText("Lab");
    await expect(page.locator('.nav-item[data-nav="multisig"]')).toHaveClass(/active/);
    await expect(page.locator('.nav-item[data-nav="network"]')).toBeVisible();

    // Multisig → Network page
    await page.locator('.nav-item[data-nav="network"]').click();
    await expect(page).toHaveURL(/network\.html/);
    await expect(page.getByRole("heading", { name: /Network/i })).toBeVisible();
    await expect(page.locator(".nav-item[data-nav]")).toHaveCount(5);
    await expect(page.locator('.nav-item[data-nav="network"]')).toHaveClass(/active/);

    // Network → Balance deep-link must restore Lab page with Balance panel + full nav
    await page.locator('.nav-item[data-nav="balance"]').click();
    await expect(page).toHaveURL(/index\.html#balance|#balance|\/#balance/);
    await expect(page.locator("#panel-balance")).toBeVisible();
    await expect(page.locator(".nav-item[data-nav]")).toHaveCount(5);
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
