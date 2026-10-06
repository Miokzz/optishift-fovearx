import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: process.env.BASE_URL || "http://127.0.0.1:5173",
    browserName: "chromium",
    channel: "chrome",
    headless: true,
    screenshot: "only-on-failure",
    viewport: { width: 1440, height: 900 },
    launchOptions: { args: ["--enable-webgl", "--ignore-gpu-blocklist"] },
  },
  reporter: [["list"], ["html", { open: "never" }]],
});
