# Benchmark: M0 baseline (empty page)

- **Date:** 2026-09-23
- **Commit SHA:** `4a819f5`
- **Profile file hash:** `413dae86d22e0b22feb3db2f3ba166aee9b60234` (`sha1sum perf/low-end-profile.json`)
- **Reproduce with:**
  ```bash
  pnpm --filter @continuum/app run build
  npx lhci autorun
  npx playwright test e2e/probes --project chromium
  ```

This is the M0 placeholder page — a single heading, a paragraph and a TMDB attribution footer, no rails, no images, no catalogue data fetch. It exists only to prove the harness itself works: every number below is expected to move (mostly upward in cost, then back down as M2/M3 optimize) once real features land. The point of recording it now is that every later claim ("cut DOM nodes from X to Y") needs a real X.

## Metrics (3-run median, Lighthouse CI, low-end profile: 6x CPU, 1.6/0.75 Mbps, 150ms RTT, 1280×720)

| Metric | Value |
| --- | --- |
| LCP (median of 3) | 4662 ms |
| TBT (median of 3) | 1 ms |
| CLS (median of 3) | 0 |
| Lighthouse performance score (median of 3) | 0.67 |
| DOM nodes (chromium) | 19 |
| JS bundle, modern, gzip | 45.98 KB |
| JS bundle, legacy (`nomodule`), gzip | 45.38 KB + 23.07 KB polyfills |
| CSS bundle, gzip | 85 B |

## Notes

- LCP is high (4.6s median) for a near-empty page under 6x CPU throttling + 150ms RTT — this is expected on the low-end profile and is itself useful data: it's the floor the real app's LCP has to beat once rails and images are added, not a target to preserve.
- The 3 individual LCP runs (3158ms, 4662ms, 5907ms) show real variance on this machine as a shared/local runner — consistent with R-3 in the plan's risk register. Re-validate gate stability over ~10 runs once CI is wired (M5).
- JS/CSS bundle sizes are trivially small because the app has no real UI yet; these numbers are not meaningful baselines for the size-limit budget itself (see `package.json` `size-limit` config, 180 KB / 40 KB), only a sanity check that the pipeline measures correctly.
- No BFF data fetch happens on this page yet, so TMDB/BFF latency is not reflected here.
