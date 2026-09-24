# Continuum — Cross-Surface Streaming UI (Web + Smart TV)

A virtualized, cross-surface streaming catalogue UI with a headless D-pad spatial-navigation engine, built to render identically at phone, desktop and 10-foot TV distance.

<!-- TODO: GIF of the TV UI with focus moving between rails -->

**Live demo:** _not yet deployed — lands in M6_

## Performance, before and after

_Populated milestone by milestone as `benchmarks/` entries land. Every number below must be reproducible with the command next to it — see `benchmarks/README.md`._

| Metric | Before | After | Command |
| --- | --- | --- | --- |
| DOM nodes (steady state) | — | — | — |
| Focus latency, p95 (ms) | — | — | — |
| JS bundle, gzipped (KB) | — | — | — |
| Heap growth over 5 min browse | — | — | — |
| Time to first video frame (s) | — | — | — |

## Architecture

See [`docs/dfd/level-0.md`](docs/dfd/level-0.md) and [`docs/dfd/level-1.md`](docs/dfd/level-1.md) for the data-flow diagrams, and [`docs/BRD-TRD.md`](docs/BRD-TRD.md) §8 for the full writeup.

## Status

Following [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md). **M1 — The token and density system — complete.** All 15 planned components (Button, IconButton, Badge, Card, Rail, RailHeader, Skeleton, Spinner, ProgressBar, EmptyState, FocusRing, SafeArea, GridCell, TextField, Modal) render identically at compact/comfortable/tv density and light/dark theme from one token source (`packages/tokens`), with zero per-surface branches, a blocking `no-raw-px` lint gate, and a WCAG AA contrast suite. Currently starting: **M2 — The virtualized rail renderer.**

## Setup

Requires Node ≥ 20 (Playwright's minimum) and [pnpm](https://pnpm.io/).

```bash
pnpm install

# A real TMDB-sourced snapshot is already committed (packages/bff/data/snapshot.json).
# To refresh it, get a free key at https://www.themoviedb.org/settings/api, then:
TMDB_API_KEY=xxxx pnpm --filter @continuum/bff run fetch-snapshot

# Run the BFF and the app together
pnpm --filter @continuum/bff run dev
pnpm dev
```

Open `http://localhost:5173`. Append `?density=tv|compact|comfortable` and/or `?theme=light|dark` to override what would otherwise be auto-detected from the viewport/pointer/user-agent and the OS color-scheme preference.

To browse the component library in isolation, with a toolbar to flip through all 3 densities × 2 themes per component:

```bash
pnpm --filter @continuum/ui run storybook
```

### Tests and gates

```bash
pnpm test          # unit tests, all packages
pnpm lint           # ESLint, including the no-raw-px rule
pnpm typecheck       # TypeScript, strict mode
pnpm size            # bundle-size budgets
npx playwright test  # E2E across chromium, firefox, webkit, tv-density
npx lhci autorun      # Lighthouse CI against the low-end profile
```

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB logo" height="24" />
