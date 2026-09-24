import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

/**
 * Throttled config for WIDE runs against live (bip39.catalyxt.xyz).
 *
 * Live nginx: limit_req zone=catalyxt_req rate=10r/s burst=40 (per client IP,
 * shared across catalyxt vhosts). A cold Lab load is ~17 requests (~10 on the
 * other shells) and every test starts in a fresh context (no cache), so
 * unpaced back-to-back navigations got 503s. The Playwright runner is throttled
 * here and nginx is left alone:
 *   - workers: 1, fullyParallel: false, retries: 0 (one browser, and no
 *     retry cherry-picking)
 *   - slowMo: LIVE_SLOWMO_MS (default 1000) between browser actions, which
 *     spaces navigations about 1s apart or more
 *   - LIVE_TEST_TIMEOUT_MS (default 120000), because slowMo makes long specs slower
 * Usage: npx playwright test -c playwright.live.config.ts e2e/lab.spec.ts e2e/site-chrome.spec.ts
 */
const slowMo = Number(process.env.LIVE_SLOWMO_MS || 1000);

export default defineConfig({
  ...base,
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: Number(process.env.LIVE_TEST_TIMEOUT_MS || 120_000),
  use: {
    ...base.use,
    baseURL: process.env.BASE_URL || "https://bip39.catalyxt.xyz",
    launchOptions: { slowMo },
  },
  webServer: undefined,
});
