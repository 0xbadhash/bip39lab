import { test, expect } from "@playwright/test";
import { expectNavCount, labCspOffline } from "./helpers";

test.describe("SLIP-39 lab", () => {
  test("S57 shell · 6-nav · offline CSP · danger banner · compare table", async ({
    page,
  }) => {
    await page.goto("/slip39.html");
    await expect(page.getByRole("heading", { name: /SLIP-39 lab/i })).toBeVisible();
    await expectNavCount(page);
    await labCspOffline(page);
    await expect(page.locator("#s39Danger")).toContainText(
      /lab|educational|Trezor Suite|funded/i
    );
    await expect(page.locator("#s39CompareTable")).toBeVisible();
    await expect(page.locator("#s39CompareTable")).toContainText(/Wordlist/i);
    await expect(page.locator("#s39CompareTable")).toContainText(/Passphrase/i);
    await expect(page.locator("#s39CompareTable")).toContainText(/Groups/i);
    await expect(page.locator("[data-step-rail], #s39StepRail")).toHaveCount(0);
    await expect(page.locator("#btnS39Split")).toBeVisible();
    // Not a 7th primary nav item — sidebar stays 6; Shamir marked as deep-link parent
    await expect(page.locator("aside.sidebar nav.nav .nav-item")).toHaveCount(6);
    await expect(page.locator('aside.sidebar a[data-nav="slip39"]')).toHaveCount(0);
    await expect(page.locator('aside.sidebar a[data-nav="shamir"]')).toHaveClass(/active/);
  });

  test("S57b Shamir deep-link to SLIP-39 lab", async ({ page }) => {
    await page.goto("/shamir.html");
    await expect(page.locator("#shLinkSlip39")).toBeVisible();
    await page.locator("#shLinkSlip39").click();
    await expect(page).toHaveURL(/slip39\.html/);
    await expect(page.locator("#s39Danger")).toBeVisible();
  });

  test("S58 happy 2-of-3 split+combine match", async ({ page }) => {
    await page.goto("/slip39.html");
    await page.locator("#btnS39Gen").click();
    await expect(page.locator("#s39Secret")).not.toHaveValue("");
    await page.locator("#s39Preset").selectOption("2of3");
    await page.locator("#btnS39Split").click();
    await expect(page.locator("#s39Status")).toContainText(/Split OK/i);
    await expect(page.locator("#s39Shares .card-sub")).toHaveCount(3);
    await page.locator("#btnS39Combine").click();
    await expect(page.locator("#s39CombineStatus")).toContainText(/Match/i);
    await expect(page.locator("#s39Recovered")).not.toHaveText("—");
  });

  test("S59 under-threshold combine errors", async ({ page }) => {
    await page.goto("/slip39.html");
    await page.locator("#btnS39Gen").click();
    await page.locator("#btnS39Split").click();
    await expect(page.locator("#s39Shares .card-sub")).toHaveCount(3);
    // Only one share line
    const first = await page.locator("#s39Shares .share-line").first().innerText();
    await page.locator("#s39CombineIn").fill(first);
    await page.locator("#btnS39Combine").click();
    await expect(page.locator("#s39CombineStatus")).toHaveClass(/err/);
    await expect(page.locator("#s39CombineStatus")).not.toContainText(/^Match/i);
  });

  test("S60 wrong passphrase mismatch demo", async ({ page }) => {
    await page.goto("/slip39.html");
    await page.locator("#btnS39WrongPp").click();
    await expect(page.locator("#s39CombineStatus")).toHaveClass(/err/);
    await expect(page.locator("#s39CombineStatus")).toContainText(
      /Mismatch|Wrong-passphrase|does not match/i
    );
    await expect(page.locator("#s39GroupDiagram")).toBeVisible();
    await expect(page.locator("#s39GroupDiagram")).toContainText(/1-of-1/i);
    await expect(page.locator("#s39GroupDiagram")).toContainText(/2-of-3/i);
    await expect(page.locator("#s39GroupDiagram [data-group='1']")).toBeVisible();
    await expect(page.locator("#s39GroupDiagram [data-group='2']")).toBeVisible();
    await expect(page.locator("#s39GroupDiagram [data-policy]")).toBeVisible();
  });

  test("S60b manual combine with wrong passphrase mismatches", async ({
    page,
  }) => {
    await page.goto("/slip39.html");
    await page.locator("#btnS39Gen").click();
    await page.locator("#s39Passphrase").fill("correct");
    await page.locator("#s39Preset").selectOption("2of3");
    await page.locator("#btnS39Split").click();
    await expect(page.locator("#s39Status")).toContainText(/Split OK/i);
    // Clear split-passphrase fallback path: set combine field only to wrong
    await page.locator("#s39PassphraseCombine").fill("wrong");
    await page.locator("#btnS39Combine").click();
    await expect(page.locator("#s39CombineStatus")).toHaveClass(/err/);
    await expect(page.locator("#s39CombineStatus")).toContainText(
      /Mismatch|wrong passphrase|does not match/i
    );
    await expect(page.locator("#s39Recovered")).not.toHaveText("—");
    // Recovered must not equal expected practice hex
    const expected = await page.locator("#s39Expected").inputValue();
    const recovered = (await page.locator("#s39Recovered").innerText()).trim();
    expect(recovered.toLowerCase()).not.toBe(expected.trim().toLowerCase());
  });
});
