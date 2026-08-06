import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:4173";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Only start static server when testing local default URL
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "python3 -m http.server 4173 --directory web",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
});
