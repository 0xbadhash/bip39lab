import { test, expect } from "@playwright/test";
import { expectNavCount, labCspOffline } from "./helpers";

const P1 = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
const P2 = "02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5";
const P2SH = "33RQmypKhD6f4tMquiR5a3C6dRT7eBpaiG";

test.describe("Multisig explainer E2E", () => {
  test("S26 shell offline CSP · 6-nav · checklist", async ({ page }) => {
    await page.goto("/multisig.html");
    await expect(page.getByRole("heading", { name: /Multisig, explained/i })).toBeVisible();
    await expectNavCount(page);
    await labCspOffline(page);
    await expect(page.locator("body")).toContainText(/Where do the public keys come from/i);
    await expect(page.locator("body")).toContainText(/Cosigner checklist/i);
    await expect(page.locator("#msPolicy")).toBeVisible();
    // Calculator banner + dual chips in topbar (no mid-page step rail)
    await expect(page.locator("body")).toContainText(/Address calculator only/i);
    await expect(page.locator("#chipOffline")).toBeVisible();
    await expect(page.locator("#chipAirgap")).toBeVisible();
    await expect(page.locator("[data-step-rail], #msStepRail")).toHaveCount(0);
    await expect(page.locator("#msCardIntro")).toBeVisible();
  });

  test("S12 build 2-of-2 golden + refuse private", async ({ page }) => {
    await page.goto("/multisig.html");
    await page.locator("#msParts").fill(P1 + "\n" + P2);
    await page.locator("#msM").fill("2");
    await page.locator("#msBip67").check();
    await page.locator("#msBuild").click();

    await expect(page.locator("#msResult")).toBeVisible();
    await expect(page.locator("#msP2sh")).toHaveText(P2SH);
    await expect(page.locator("#msP2wsh")).toContainText(/^bc1/);
    await expect(page.locator("#msStatus")).toContainText(/offline/i);
    await expect(page.locator("#msPolicy")).toContainText(/2-of-2|Policy|BIP67/i);
    await expect(page.locator("#msScript")).not.toHaveText("");
    await expect(page.locator("#msKeys")).toContainText(/02|03/);

    await page.locator("#msParts").fill("5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ");
    await page.locator("#msBuild").click();
    await expect(page.locator("#msStatus")).toContainText(/private/i);
  });

  test("S12b demo cosigners N=3 then build", async ({ page }) => {
    await page.goto("/multisig.html");
    await page.locator("#msDemoN").selectOption("3");
    await page.locator('#msWordTabs .seg-tab[data-words="12"]').click();
    await page.locator("#msGenDemo").click();
    await expect(page.locator("#msDemoList")).toBeVisible();
    await expect(page.locator("#msDemoList .watch-item")).toHaveCount(3);
    await expect(page.locator("#msDemoList")).toContainText(/BIP84 zpub|zpub/i);
    const pubs = await page.locator("#msParts").inputValue();
    expect(pubs.trim().split(/\n/).length).toBe(3);
    expect(pubs).toMatch(/^0[23]/m);
    await page.locator("#msBuild").click();
    await expect(page.locator("#msResult")).toBeVisible();
    await expect(page.locator("#msP2sh")).toContainText(/^3/);
    await expect(page.locator("#msP2wsh")).toContainText(/^bc1/);
    await expect(page.locator("#msPolicy")).toContainText(/2-of-3|3-of-3|of-3|Policy/i);
  });

  test("S27 demo word-count pads 24", async ({ page }) => {
    await page.goto("/multisig.html");
    await page.locator("#msDemoN").selectOption("2");
    await page.locator('#msWordTabs .seg-tab[data-words="24"]').click();
    await page.locator("#msGenDemo").click();
    await expect(page.locator("#msDemoList")).toBeVisible();
    await expect(page.locator("#msDemoList")).toContainText(/256 bits|24/);
  });

  test("S28 BIP67 off changes messaging", async ({ page }) => {
    await page.goto("/multisig.html");
    await expect(page.locator("#msBip67Warn")).toBeHidden();
    await page.locator("#msParts").fill(P1 + "\n" + P2);
    await page.locator("#msM").fill("2");
    await page.locator("#msBip67").uncheck();
    await expect(page.locator("#msBip67Warn")).toBeVisible();
    await page.locator("#msBuild").click();
    await expect(page.locator("#msResult")).toBeVisible();
    await expect(page.locator("#msPolicy")).toContainText(/BIP67 sort OFF|OFF/i);
    await page.locator("#msBip67").check();
    await expect(page.locator("#msBip67Warn")).toBeHidden();
  });

  test("S29 clear resets result", async ({ page }) => {
    await page.goto("/multisig.html");
    await page.locator("#msParts").fill(P1 + "\n" + P2);
    await page.locator("#msBuild").click();
    await expect(page.locator("#msResult")).toBeVisible();
    await page.locator("#msClear").click();
    await expect(page.locator("#msResult")).toBeHidden();
    await expect(page.locator("#msParts")).toHaveValue("");
  });

  test("S30 copy P2SH feedback", async ({ page }) => {
    await page.goto("/multisig.html");
    await page.locator("#msParts").fill(P1 + "\n" + P2);
    await page.locator("#msBuild").click();
    await expect(page.locator("#msResult")).toBeVisible();
    await page.locator("#msCopyP2sh").click();
    await expect(page.locator("#msCopyFeedback")).toContainText(/Copied|clipboard|Copy/i, {
      timeout: 5_000,
    });
  });

  test("S31 nav to Lab and Network from Multisig", async ({ page }) => {
    await page.goto("/multisig.html");
    await page.locator('.nav-item[data-nav="lab"]').click();
    await expect(page).toHaveURL(/index\.html|\/$/);
    await page.goto("/multisig.html");
    await page.locator('.nav-item[data-nav="network"]').click();
    await expect(page).toHaveURL(/network\.html/);
  });
});
