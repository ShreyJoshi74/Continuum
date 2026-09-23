import { defineConfig, devices } from "@playwright/test";

// The "tv" project is the same Chromium engine at TV density — not a fourth
// engine. Be precise about that distinction in the README (BRD-TRD §15).
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  webServer: {
    command: "pnpm --filter @continuum/app run preview -- --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:4173",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    {
      name: "tv",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
        extraHTTPHeaders: {},
      },
    },
  ],
});
