import { test, expect } from "@playwright/test";

const P1 = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
const P2 = "02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5";
const P2SH = "33RQmypKhD6f4tMquiR5a3C6dRT7eBpaiG";

test.describe("Multisig explainer E2E", () => {
  /** Maps to Comet scenario S12 in docs/E2E_COMET_SCENARIOS.md */
  test("S12 build 2-of-2 from public keys and refuse private", async ({ page }) => {
    await page.goto("/multisig.html");
    await expect(page.getByRole("heading", { name: /Multisig, explained/i })).toBeVisible();
    await expect(page.locator("body")).toContainText(/Where do the public keys come from/i);

    await page.locator("#msParts").fill(P1 + "\n" + P2);
    await page.locator("#msM").fill("2");
    await page.locator("#msBip67").check();
    await page.locator("#msBuild").click();

    await expect(page.locator("#msResult")).toBeVisible();
    await expect(page.locator("#msP2sh")).toHaveText(P2SH);
    await expect(page.locator("#msP2wsh")).toContainText(/^bc1/);
    await expect(page.locator("#msStatus")).toContainText(/offline/i);

    await page.locator("#msParts").fill("5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ");
    await page.locator("#msBuild").click();
    await expect(page.locator("#msStatus")).toContainText(/private/i);
  });

  test("S12b generate demo cosigners then build", async ({ page }) => {
    await page.goto("/multisig.html");
    await page.locator("#msDemoN").selectOption("3");
    await page.locator("#msGenDemo").click();
    await expect(page.locator("#msDemoList")).toBeVisible();
    await expect(page.locator("#msDemoList .watch-item")).toHaveCount(3);
    const pubs = await page.locator("#msParts").inputValue();
    expect(pubs.trim().split(/\n/).length).toBe(3);
    expect(pubs).toMatch(/^0[23]/m);
    await page.locator("#msBuild").click();
    await expect(page.locator("#msResult")).toBeVisible();
    await expect(page.locator("#msP2sh")).toContainText(/^3/);
    await expect(page.locator("#msP2wsh")).toContainText(/^bc1/);
  });
});
