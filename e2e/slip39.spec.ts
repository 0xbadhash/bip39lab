import { test, expect } from "@playwright/test";
import { expectNavCount, labCspOffline } from "./helpers";

test.describe("SLIP-39 lab shell", () => {
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
    await expect(page.locator("#s39StepRail")).toBeVisible();
    await expect(page.locator("#s39DemoPlaceholder")).toContainText(/Coming in/i);
  });

  test("S57b Shamir deep-link to SLIP-39 lab", async ({ page }) => {
    await page.goto("/shamir.html");
    await expect(page.locator("#shLinkSlip39")).toBeVisible();
    await page.locator("#shLinkSlip39").click();
    await expect(page).toHaveURL(/slip39\.html/);
    await expect(page.locator("#s39Danger")).toBeVisible();
  });
});
