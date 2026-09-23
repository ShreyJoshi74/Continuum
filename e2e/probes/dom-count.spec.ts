import { expect, test } from "@playwright/test";

// NFR-06: steady-state DOM node ceiling. M0's page has almost nothing on it,
// so this only proves the probe itself works — the real assertion value
// (≤ 1,500 after scrolling 20 rails) is set once M2 lands.
test("reports the current DOM node count", async ({ page }, testInfo) => {
  const url = testInfo.project.name === "tv" ? "/?density=tv" : "/";
  await page.goto(url);

  const domCount = await page.evaluate(() => document.querySelectorAll("*").length);

  console.log(`[dom-count] ${testInfo.project.name}: ${domCount} nodes`);
  expect(domCount).toBeGreaterThan(0);
});
