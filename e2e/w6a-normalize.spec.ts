import { test, expect } from "@playwright/test";

/**
 * W6a DS normalize: chip-ok green, return-dock --warn, touch ≥44, radii.
 * Comet scenarios S184–S187.
 */

function rgbChannels(css: string): [number, number, number] | null {
  const m = css.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function isGreenish(css: string): boolean {
  const c = rgbChannels(css);
  if (!c) return false;
  const [r, g, b] = c;
  return g > r && g > b && g >= 80;
}

function isBluishAccent(css: string): boolean {
  const c = rgbChannels(css);
  if (!c) return false;
  const [r, g, b] = c;
  return b > r && b >= g && b >= 180;
}

test.describe("W6a DS normalize (chip / dock / touch / radii)", () => {
  test("S184 chip-ok (airgap online) paints --ok green not accent blue", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const el = document.getElementById("chipAirgap");
      if (!el) throw new Error("missing chipAirgap");
      el.classList.add("chip", "chip-airgap", "chip-ok");
      el.classList.remove("chip-bad", "chip-warn");
    });
    const color = await page.locator("#chipAirgap").evaluate((el) => getComputedStyle(el).color);
    const border = await page.locator("#chipAirgap").evaluate((el) => getComputedStyle(el).borderColor);
    expect(isGreenish(color), `color should be greenish, got ${color}`).toBe(true);
    expect(isBluishAccent(color), `color must not be accent blue, got ${color}`).toBe(false);
    expect(isBluishAccent(border), `border must not be accent blue, got ${border}`).toBe(false);

    const ok = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--ok").trim()
    );
    expect(ok).toMatch(/^#/i);
  });

  test("S185 return dock border/button use --warn; radius 12", async ({ page }) => {
    await page.goto("/");
    await page.locator("#learnReturnBar").evaluate((el) => {
      el.removeAttribute("hidden");
      (el as HTMLElement).hidden = false;
      el.style.display = "flex";
    });
    const dock = page.locator("#learnReturnBar");
    await expect(dock).toBeVisible();

    const styles = await dock.evaluate((el) => {
      const s = getComputedStyle(el);
      const btn = el.querySelector(".btn") as HTMLElement | null;
      const bs = btn ? getComputedStyle(btn) : null;
      return {
        borderColor: s.borderColor,
        radius: s.borderRadius,
        warn: getComputedStyle(document.documentElement).getPropertyValue("--warn").trim(),
        btnBg: bs ? bs.backgroundColor : "",
      };
    });

    expect(styles.radius).toMatch(/^12px/);
    // border should resolve to --warn (#cf9f02 → rgb(207, 159, 2))
    const border = rgbChannels(styles.borderColor);
    const warnHex = styles.warn.replace("#", "");
    expect(warnHex.length).toBeGreaterThanOrEqual(6);
    const wr = parseInt(warnHex.slice(0, 2), 16);
    const wg = parseInt(warnHex.slice(2, 4), 16);
    const wb = parseInt(warnHex.slice(4, 6), 16);
    expect(border, `borderColor=${styles.borderColor}`).not.toBeNull();
    expect(Math.abs(border![0] - wr)).toBeLessThanOrEqual(2);
    expect(Math.abs(border![1] - wg)).toBeLessThanOrEqual(2);
    expect(Math.abs(border![2] - wb)).toBeLessThanOrEqual(2);

    // Must not be drifted rgb(240,193,77)
    expect(styles.borderColor.replace(/\s/g, "")).not.toMatch(/240,\s*193,\s*77/);

    const btn = rgbChannels(styles.btnBg);
    expect(btn, `btnBg=${styles.btnBg}`).not.toBeNull();
    expect(Math.abs(btn![0] - wr)).toBeLessThanOrEqual(2);
    expect(Math.abs(btn![1] - wg)).toBeLessThanOrEqual(2);
    expect(Math.abs(btn![2] - wb)).toBeLessThanOrEqual(2);
  });

  test("S186 touch hit targets ≥44px (help-tip + Teach/Theme/Reset/Generate + dock dismiss)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.locator("#learnReturnBar").evaluate((el) => {
      el.removeAttribute("hidden");
      (el as HTMLElement).hidden = false;
      el.style.display = "flex";
    });

    const ids = ["btnTeach", "btnTheme", "btnResetClassroom", "btnGenerate", "learnReturnBarDismiss"];
    for (const id of ids) {
      const box = await page.locator(`#${id}`).boundingBox();
      expect(box, id).not.toBeNull();
      expect(box!.height, `${id} height`).toBeGreaterThanOrEqual(44);
      expect(box!.width, `${id} width`).toBeGreaterThanOrEqual(44);
    }

    const tip = page.locator(".help-tip-btn").first();
    await expect(tip).toBeVisible();
    const tipBox = await tip.boundingBox();
    expect(tipBox).not.toBeNull();
    expect(tipBox!.height).toBeGreaterThanOrEqual(44);
    expect(tipBox!.width).toBeGreaterThanOrEqual(44);
  });

  test("S187 radii: inputs 8px, dock 12px, chips pill 999", async ({ page }) => {
    await page.goto("/");
    await page.locator("#learnReturnBar").evaluate((el) => {
      el.removeAttribute("hidden");
      (el as HTMLElement).hidden = false;
      el.style.display = "flex";
    });

    const inputRadius = await page.locator('input[type="text"], input[type="number"]').first().evaluate(
      (el) => getComputedStyle(el).borderRadius
    );
    expect(inputRadius).toMatch(/^8px/);

    // Prefer a number input if present
    const num = page.locator('input[type="number"]').first();
    if ((await num.count()) > 0) {
      const nr = await num.evaluate((el) => getComputedStyle(el).borderRadius);
      expect(nr).toMatch(/^8px/);
    }

    const dockR = await page.locator("#learnReturnBar").evaluate((el) => getComputedStyle(el).borderRadius);
    expect(dockR).toMatch(/^12px/);

    const chipR = await page.locator(".chip").first().evaluate((el) => getComputedStyle(el).borderRadius);
    // pill chips stay fully rounded
    expect(parseFloat(chipR)).toBeGreaterThanOrEqual(999);
  });
});
