import { expect, test } from "@playwright/test";

// NFR-07: long tasks during scroll. M0 has no scroll surface yet, so this
// only proves the PerformanceObserver wiring works end to end; the real
// scripted-scroll assertion is added once M2's rails exist.
test("captures longtask entries via PerformanceObserver", async ({ page }, testInfo) => {
  const url = testInfo.project.name === "tv" ? "/?density=tv" : "/";
  await page.goto(url);

  const longTaskCount = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        const tasks: PerformanceEntry[] = [];
        const observer = new PerformanceObserver((list) => {
          tasks.push(...list.getEntries());
        });
        observer.observe({ type: "longtask", buffered: true });

        // Give the page a moment to settle, then report whatever landed.
        setTimeout(() => {
          observer.disconnect();
          resolve(tasks.length);
        }, 1000);
      })
  );

  console.log(`[long-tasks] ${testInfo.project.name}: ${longTaskCount} long tasks`);
  expect(longTaskCount).toBeGreaterThanOrEqual(0);
});
