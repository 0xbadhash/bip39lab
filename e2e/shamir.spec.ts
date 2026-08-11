import { test, expect } from "@playwright/test";
import { expectNavCount, labCspOffline } from "./helpers";

test.describe("Shamir educational page", () => {
  test("S53 shell · 6-nav · offline CSP · danger banner", async ({ page }) => {
    await page.goto("/shamir.html");
    await expect(page.getByRole("heading", { name: /Shamir secret sharing/i })).toBeVisible();
    await expectNavCount(page);
    await expect(page.locator('.nav-item[data-nav="shamir"]')).toHaveAttribute(
      "aria-current",
      "page"
    );
    await labCspOffline(page);
    await expect(page.locator("#shDanger")).toContainText(/not SLIP-39|Educational/i);
    await expect(page.locator("body")).toContainText(/Multisig/i);
  });

  test("S54 generate + split 2-of-3 → three share cards", async ({ page }) => {
    await page.goto("/shamir.html");
    await page.locator("#btnShGen").click();
    await expect(page.locator("#shSecret")).not.toHaveValue("");
    await page.locator("#shM").fill("2");
    await page.locator("#shN").fill("3");
    await page.locator("#btnShSplit").click();
    await expect(page.locator("#shStatus")).toContainText(/Split OK|educational/i);
    await expect(page.locator(".shamir-share-card")).toHaveCount(3);
    await expect(page.locator(".share-line").first()).toContainText(/^share:\d+:[0-9a-f]+/i);
  });

  test("S55 empty secret errors without fake success", async ({ page }) => {
    await page.goto("/shamir.html");
    await page.locator("#shSecret").fill("");
    await page.locator("#btnShSplit").click();
    await expect(page.locator("#shStatus")).toContainText(/empty|Practice secret/i);
    await expect(page.locator(".shamir-share-card")).toHaveCount(0);
  });

  test("S56 recombine verifies practice secret offline", async ({ page }) => {
    await page.goto("/shamir.html");
    await expect(page.locator("#shCardRecombine")).toBeVisible();
    await page.locator("#btnShGen").click();
    const secret = await page.locator("#shSecret").inputValue();
    expect(secret.length).toBeGreaterThan(0);
    await page.locator("#shM").fill("2");
    await page.locator("#shN").fill("3");
    await page.locator("#btnShSplit").click();
    await expect(page.locator(".shamir-share-card")).toHaveCount(3);
    // Exercise Fill M path (clears auto-prefill from split)
    await page.locator("#shRecombineIn").fill("");
    await page.locator("#btnShFillM").click();
    await expect(page.locator("#shRecombineIn")).not.toHaveValue("");
    await page.locator("#btnShRecombine").click();
    await expect(page.locator("#shRecombineOut")).toContainText(/Matches practice secret|Recovered/i);
    await expect(page.locator("#shStatus")).toContainText(/Recombine OK/i);
  });
});

