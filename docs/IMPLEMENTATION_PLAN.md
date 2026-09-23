# Continuum — Milestone Implementation Plan

Companion to `Continuum — Cross-Surface Streaming UI (BRD & TRD).md`.
Created 2026-09-22 · 8 weeks · ~10–12 h/week · solo

---

## How to use this document

The BRD/TRD says *what* Continuum is and *why*. This says *what you do in which week*, in what order, and what has to be true before you are allowed to call a milestone finished.

Three rules that override everything below:

1. **The harness ships before the feature.** M0 exists so that every later number has a before-value. A budget you add in week six is a budget you negotiated with yourself.
2. **M2 before M3, always.** Focus must be able to land on a card that virtualization has not rendered. That coupling is the hardest part of the project; discover it in week four, not week seven.
3. **The cut line is real.** If the end of week 5 arrives and M3 is not done, you ship M0–M3 and stop. See [The cut-line gate](#the-cut-line-gate).

### Legend

| Tag | Meaning |
| --- | --- |
| `[M]` | Must — inside the minimum shippable cut |
| `[S]` | Should — build if the milestone lands early |
| `[C]` | Could — first thing to drop |
| `→ FR-xx` | Satisfies that functional requirement |
| `→ NFR-xx` / `→ KR-x` | Closes that budget or key result |
| 📊 | Produces a committed number in `benchmarks/` |

---

## Pre-flight — decisions to lock before writing code

Do these in one sitting. Each is a decision that gets an order of magnitude more expensive once code depends on it.

| # | Decision | Default | Why it cannot wait |
| --- | --- | --- | --- |
| P-1 | BFF runtime: Fastify vs. Spring Boot | Fastify | Deciding late costs you week 1. If TypeScript-everywhere is not worth a learning day, take Spring Boot and keep the contract identical. |
| P-2 | Verify Tizen→Chromium and webOS→Chromium version mappings against current Samsung/LG docs; cite in README | webOS 4.x ≈ Chromium 53 floor | This sets `browserslist`, which sets the transpile target, which sets what CSS you may write. Quoting it wrong is worse than not quoting it. |
| P-3 | Monorepo tool | pnpm workspaces | Six packages from day one; retrofitting a workspace mid-M1 is a day lost. |
| P-4 | TMDB API key and snapshot scope | ~600 titles, 20 rails × 40 | The DOM-node bullet is only meaningful at a stated catalogue size. Fix it now, never change it. |
| P-5 | HLS test stream URL (Mux / Apple / Akamai) | Mux test stream | It needs to still resolve in six months — a dead stream kills the demo. |
| P-6 | Host: Vercel vs. Netlify | Vercel | The demo link is load-bearing; pick the one you will actually keep alive. |

**Pre-flight exit:** `docs/adr/ADR-0-preflight.md` records P-1 through P-6, one paragraph each. TMDB attribution is already in the README.

---

## M0 — Foundations and the measurement harness

**Week 1 · ~11 h · [M]**

> **Goal:** a repo where an empty page already fails CI if it gets slower. Nothing here is a feature; all of it is scaffolding you cannot retrofit.

### Tasks

**Repo and toolchain (~3 h)**
- [ ] `[M]` pnpm workspace with the six packages from §18: `focus`, `virtual`, `tokens`, `ui`, `app`, `bff`
- [ ] `[M]` TypeScript strict mode, path aliases, shared `tsconfig.base.json`
- [ ] `[M]` Vite app entry with `@vitejs/plugin-legacy` wired — not yet tuned, just present
- [ ] `[M]` `browserslist` pinned to the §5 support matrix including the webOS floor
- [ ] `[M]` ESLint and Prettier; add the **no-raw-px** custom rule stub now, enable it in M1
- [ ] `[S]` Vitest configured with a passing smoke test per package

**Data (~2 h)**
- [ ] `[M]` TMDB fetch script → `bff/data/snapshot.json`, committed — this is also the mitigation for the TMDB dependency risk
- [ ] `[M]` Snapshot shaped to P-4's size, with per-aspect artwork URLs
- [ ] `[M]` TMDB attribution in the README footer and the app footer

**BFF skeleton (~2 h)**
- [ ] `[M]` Fastify serving `GET /v1/page/home` from the snapshot, matching §13's page contract exactly → FR-02
- [ ] `[M]` `Cache-Control: max-age=60, stale-while-revalidate=600` plus a strong `ETag`
- [ ] `[S]` `POST /v1/rum` accepting and discarding payloads — the real sink lands in M6

**The harness — the actual point of M0 (~4 h)**
- [ ] `[M]` `perf/low-end-profile.json` committed: 6x CPU, 1.6 Mbps / 750 Kbps / 150 ms RTT, 1280×720, `density=tv` → NFR-03, NFR-04, NFR-05
- [ ] `[M]` Lighthouse CI in GitHub Actions, **3 runs, assert on the median** → mitigates R-3
- [ ] `[M]` `size-limit` with JS ≤ 180 KB and CSS ≤ 40 KB gates → NFR-01, NFR-02
- [ ] `[M]` Playwright installed with the 4-project matrix: chromium, firefox, webkit, tv → KR-10
- [ ] `[M]` `e2e/probes/dom-count.spec.ts` — asserts `document.querySelectorAll('*').length` → NFR-06
- [ ] `[M]` `e2e/probes/long-tasks.spec.ts` — `PerformanceObserver` for `longtask` → NFR-07
- [ ] `[M]` `benchmarks/README.md` defining the recording protocol: date, commit SHA, profile, 3-run median

**Documentation (~1 h)**
- [ ] `[M]` `docs/dfd/level-0.md` and `docs/dfd/level-1.md` as committed mermaid sources
- [ ] `[M]` BRD/TRD moved into `docs/`
- [ ] `[M]` README skeleton in §18's order, with the performance table as an empty shell

### Exit criteria

| Check | How you prove it |
| --- | --- |
| CI reports a Lighthouse score on every PR | Open a no-op PR; the check comment shows LCP and TBT |
| The gate can actually fail | Temporarily set the JS budget to 1 KB, confirm red, revert |
| DFDs render | GitHub preview of both mermaid files |
| Baseline recorded 📊 | `benchmarks/2026-wk01-baseline.md` has empty-page LCP, TBT, DOM count, bundle size |

> **M0's real deliverable is a failing build.** If you cannot make CI go red on demand by the end of week 1, M0 is not done — and everything measured afterwards is a claim rather than evidence.

---

## M1 — The token and density system

**Weeks 2–3 · ~20 h · [M] · Pillar A**

> **Goal:** one component renders correctly at 35 cm, 60 cm and 3 m with zero per-surface branches. This extends QuizArena's token work, so it is the milestone where you start from something you already half-know.

### Tasks

**Token source (~5 h)**
- [ ] `[M]` `tokens/core.json` — brand constants: palette, radii, z-index, timing
- [ ] `[M]` `tokens/density/{compact,comfortable,tv}.json` with **four independent curves**, not one multiplier:
  - type — larger base on TV, *tighter* step ratio
  - spacing — scales faster than type, because grouping is read before content at 3 m
  - borders and focus rings — scale *less* than linearly; TV gets a scale transform plus outer glow, not a thicker ring
  - radii — near-constant across modes, because corner radius is a brand value not a distance function
- [ ] `[M]` Multipliers documented as **intent in comments**, with explicit values in the JSON — never computed in code
- [ ] `[M]` `--safe-inset-block` and `--safe-inset-inline`: 0 on web, 5% configurable on TV → FR-24

**Build pipeline (~3 h)**
- [ ] `[M]` Style Dictionary → `density.css` scoped by `[data-density]` **and** `tokens.ts` typed constants
- [ ] `[M]` Both outputs from one source; `tokens.ts` is what lets the focus engine read spacing without parsing CSS and lets the contrast tests assert on the numbers the stylesheet ships
- [ ] `[M]` Density resolution at boot from viewport, `pointer`/`hover` media queries and TV user-agent strings → `documentElement.dataset.density` → FR-22
- [ ] `[M]` `?density=` override — **this is what makes M1 testable in CI**, not a convenience → FR-22

**Component library (~9 h)**
- [ ] `[M]` ~15 components: Card (landscape and portrait), Rail shell, RailHeader, Button, IconButton, Badge, Skeleton, Modal, Spinner, TextField, ProgressBar, SafeArea shell, FocusRing, Grid cell, EmptyState
- [ ] `[M]` **Focusable-first authoring** — design the focused state before the default state, because on TV the focused state is the one the user is looking at → §9 rule 4
- [ ] `[M]` Enable the no-raw-px lint rule and make it blocking → §9 rule 1
- [ ] `[M]` Zero `if (density === 'tv')` anywhere in `packages/ui` — a needed branch means a missing token → §9 rule 2, KR-9
- [ ] `[S]` Light and dark as an orthogonal token swap, no component-level overrides → FR-25, NFR-10

**Verification (~3 h)**
- [ ] `[M]` Storybook with a density × theme toolbar — 6 render states per component → §9 rule 3
- [ ] `[M]` Contrast suite asserting WCAG 2.1 AA on the same numbers the CSS ships → NFR-10
- [ ] `[M]` Focus-indicator contrast ≥ 3:1 in all six states → NFR-11
- [ ] `[S]` Playwright visual snapshots: every component × 3 densities × 2 themes
- [ ] `[S]` Storybook deployed

### Exit criteria

| Check | Threshold |
| --- | --- |
| Per-surface forks | **0** — a grep for a density conditional in `packages/ui` returns nothing |
| Storybook render states | 6 per component, all green |
| Contrast suite | Passes AA on all 6 states → NFR-10, NFR-11 |
| no-raw-px lint | Blocking and passing |
| CSS budget | ≤ 40 KB gzipped → NFR-02 |

> **The week-3 temptation.** You will hit one component where a TV branch is obviously easier than a new token. That is the moment KR-9 is won or lost. Add the token.

---

## M2 — The virtualized rail renderer

**Weeks 3–4 · ~16 h · [M] · Pillar C · Highest-value bullet**

> **Goal:** 20 rails × 40 items renders under 1,500 DOM nodes and holds heap flat. This produces the strongest resume bullet in the project (C-A), so the before-number matters as much as the after.

### Tasks

**📊 Record the "before" FIRST (~1 h)**
- [ ] `[M]` Render all 800 cards naively, unvirtualized. Commit it on a branch.
- [ ] `[M]` Run the M0 probes: DOM count, LCP, TBT, heap at 5 minutes
- [ ] `[M]` `benchmarks/2026-wk03-pre-virtualization.md` with date, SHA and profile

> Skipping this step means bullet C-A reads "≤ 1,500 DOM nodes" instead of "cut DOM nodes from 9,400 to 1,180". The delta *is* the bullet.

**Window calculator — `packages/virtual` (~4 h)**
- [ ] `[M]` Pure and framework-agnostic, returns index ranges — no React import anywhere
- [ ] `[M]` Vertical window: only rails intersecting the viewport plus one viewport of overscan are mounted
- [ ] `[M]` Horizontal window per mounted rail: visible span plus a small overscan each side
- [ ] `[M]` Computed arithmetically from fixed card size and gap read from `tokens.ts` — **no measurement in the hot path**, which is also what makes CLS structurally near-zero → NFR-05
- [ ] `[M]` Unit tests on the range maths: edges, empty rail, single item, window larger than the list

**Card pool and recycling (~4 h)**
- [ ] `[M]` Keep instances alive and reassign props as the window slides — mount/unmount churn at 30 Hz generates garbage and GC pauses that land as dropped frames
- [ ] `[M]` **Key by pool slot, content id as a prop.** This inverts the usual advice about keys; write the JSDoc explaining why before you write the code, because an interviewer who knows React will ask
- [ ] `[M]` Verify there is no mount/unmount churn under a scripted 30 Hz scroll

**Image lifecycle — the leverage point (~4 h)**
- [ ] `[M]` Three bands: Visible (`src` set), Warm (within overscan, `src` set and kept), Cold (**`src` removed, node kept, placeholder shown**)
- [ ] `[M]` Removing `src` is what releases decoded image memory; keeping the node is what avoids layout work. A 300×450 poster is ~540 KB decoded regardless of JPEG size
- [ ] `[M]` `IntersectionObserver` with `rootMargin` matched to the overscan; feature-detect with a throttled-scroll fallback
- [ ] `[M]` `loading="lazy"` as a baseline only — it releases nothing and its heuristics are tuned for documents, not horizontal rails
- [ ] `[M]` Heap probe proving the cold band works → NFR-09, KR-4

**Rail scroll and home page (~3 h)**
- [ ] `[M]` Scroll applied as `transform: translate3d(...)` — a compositor-only change that keeps cached rects valid in rail-local space. Layout is never re-run for scrolling, which is what M3 depends on
- [ ] `[M]` Catalogue home composed from the BFF response, not hardcoded → FR-01, FR-02
- [ ] `[M]` Card with artwork, title and up to two badges, sized per density → FR-03
- [ ] `[M]` Per-rail error boundary — one bad rail cannot blank the home page → NFR-18
- [ ] `[M]` Failed rail degrades to a skeleton and retries with backoff → NFR-16
- [ ] `[S]` `content-visibility: auto` with `contain-intrinsic-size` on off-screen rails — **a bonus on modern Chromium, never the mechanism**, since the webOS 4.x floor lacks it
- [ ] `[S]` Title detail page with synopsis, cast, duration and a play action → FR-04

**The seam M3 depends on**
- [ ] `[M]` Each rail exposes a **logical item count** and an index→element mapping. Build it now; this is what lets focus move into a card that is not in the DOM.

### Exit criteria

| Check | Threshold |
| --- | --- |
| DOM nodes, home, steady state after scrolling all 20 rails and returning | **≤ 1,500** → NFR-06, KR-3 |
| Rendered card set | ~60 regardless of catalogue size |
| Heap over a 5-minute scripted browse | < 10% growth across 3 samples → NFR-09 |
| CLS | ≤ 0.05 → NFR-05 |
| Long tasks during scroll | 0 desktop, ≤ 2 throttled → NFR-07 |
| 📊 After-numbers committed | `benchmarks/2026-wk04-post-virtualization.md` |

---

## M3 — The spatial navigation engine

**Week 5 · ~12 h · [M] · Pillar B · Timeboxed**

> **Goal:** a direction key lands focus where a human would point, in under 100 ms, on a CPU ten times slower than yours.
>
> **Hard timebox: one week for the core geometric algorithm** (R-2). Focus memory and focus traps are separable follow-ups — if the scorer eats the week, ship the scorer and defer the rest.

### Tasks

**Core algorithm — `packages/focus` (~4 h)**
- [ ] `[M]` Headless, zero React imports — this is what makes it publishable (bullet C-G), and it is also the honest architectural reason: geometry does not need a rendering library
- [ ] `[M]` Registry of focusables holding **cached rects**
- [ ] `[M]` Half-plane candidate filter by direction
- [ ] `[M]` Scoring: `d_primary + w·d_cross − o·overlap`, starting at `w = 2`, `o = 0.5`
- [ ] `[M]` Unit tests on the scorer as a pure function: rail traversal, diagonal rejection, rail-to-rail descent
- [ ] `[M]` **Write down why you tuned the weights as you did.** "At w=1, Down from the end of a long rail jumped three columns left" is the interview answer; the formula is not.

**The performance discipline — why this pillar exists (~4 h)**
- [ ] `[M]` **Never** call `getBoundingClientRect()` per keypress — 400 focusables means 400 forced synchronous layouts, and if a handler has written to the DOM since the last frame each read flushes pending layout too
- [ ] `[M]` Event-driven invalidation only: `ResizeObserver` on the app shell, `MutationObserver` scoped to rail containers, explicit invalidation when the virtual window changes
- [ ] `[M]` Batch all re-measurement into a **single read phase inside one rAF, before any writes in that frame**. Reads and writes never interleave
- [ ] `[M]` Add the rail's current offset arithmetically to rail-local cached rects — valid because M2 made rail movement compositor-only

**Integration with virtualization — the hard seam (~2 h)**
- [ ] `[M]` Within a rail, the engine asks **the renderer, not the DOM**, for the next logical index → uses M2's item-count contract
- [ ] `[M]` The renderer extends the window, commits, and focus lands **in the same frame**
- [ ] `[M]` Pure geometry only for movement *between* rails
- [ ] `[M]` Scroll intent keeps the focused card fully inside the safe area, never partially clipped → FR-12

**Input and repeat (~2 h)**
- [ ] `[M]` Arrow keys and D-pad move to the nearest focusable by geometry, not DOM order → FR-09
- [ ] `[M]` Enter activates; Back and the TV-specific back keycodes pop navigation → FR-10
- [ ] `[M]` Platform keycode map (Tizen, webOS, desktop) detected at boot, normalised to semantic events (`back`, `play`, `pause`) before anything downstream sees them — **verify the codes against vendor docs**, not a single blog post
- [ ] `[M]` Key repeat at 20–30 Hz triggers no re-measure
- [ ] `[M]` Scroll animation **interruptible and additive**: track a target offset and let one loop chase it. Never queue per-step animations, or the rail keeps moving after the user stops → FR-13

**State and focus memory (~2 h)**
- [ ] `[M]` Zustand store with selector subscriptions — only the two cards whose focused state changed re-render, not all 60 → ADR-4
- [ ] `[M]` Per-rail focus memory: record the child on exit, restore it on re-entry from any direction → FR-11
- [ ] `[M]` Edge case: if the remembered child was unmounted by virtualization, fall back to the **nearest rendered sibling by index**, not by geometry
- [ ] `[S]` Modal focus trap; Back closes it and restores focus to the invoking element → FR-14
- [ ] `[S]` Mouse hover and touch set focus through the same engine, so all three inputs share one focus model → FR-15, NFR-12

**Instrumentation (included above)**
- [ ] `[M]` `performance.mark('focus:keydown')` on the event and `focus:painted` in a rAF after the focus class lands
- [ ] `[M]` 📊 Scripted 200-keypress E2E run, assert p95, record before and after rect caching

### Exit criteria

| Check | Threshold |
| --- | --- |
| Focus keydown→paint, p95, throttled profile | **≤ 100 ms** → NFR-08, KR-5 |
| Forced synchronous layouts per keypress | 0, verified in a DevTools trace |
| Focus into an un-rendered card | Lands in the same frame, no flash |
| Frame rate during held-key traversal | ≥ 55 fps desktop, ≥ 28 fps throttled → KR-6 |
| Keyboard-only operability | The whole app, same code path as the D-pad → NFR-12 |
| 📊 Before/after committed | `benchmarks/2026-wk05-focus-latency.md` |

---

## The cut-line gate

**End of week 5 — stop and decide.**

| If | Then |
| --- | --- |
| M0–M3 all meet their exit criteria and three weeks remain | Continue to M4 |
| M3 is incomplete, or fewer than three weeks remain | **Finish M3, then jump straight to M5 and M6.** Skip M4 entirely. |

Shipping M0–M3 plus hardening and docs is a complete, defensible project: a cross-surface design system, a virtualized renderer, a focus engine and a CI performance gate. It carries four of the five weak JD rows on its own and projects to roughly 86 on §20's rubric — most of the gain for about half the work.

What you lose by stopping there is the playback story and the RUM dashboard. Both are real, neither is load-bearing for the JD.

What you must **not** do is ship seven half-finished milestones. A shallow project with seven features reads worse than a deep one with four.

---

## M4 — The playback shell

**Week 6 · ~12 h · [S] — the first thing cut**

> **Goal:** you are not building a video player. `hls.js` handles manifests, segments and adaptive bitrate. You build the shell — which is what a Watch Experience team actually spends its time on.

### Tasks

**Integration (~3 h)**
- [ ] `[M]` `hls.js` over MSE for Chromium and Firefox → FR-16
- [ ] `[M]` Native HLS on Safari and iOS — set `video.src` directly; MSE support differs there
- [ ] `[M]` Branch on `Hls.isSupported()` falling back to `canPlayType('application/vnd.apple.mpegurl')`
- [ ] `[M]` On TV, verify MSE at boot and surface a clear error rather than a black screen

**Transport state machine (~4 h)**
- [ ] `[M]` States: Loading → Playing ⇄ Paused, Playing → Seeking, → Ended, → Error → Loading
- [ ] `[M]` **Seeking is its own state.** Holding a direction key accumulates a seek target and commits **once on release** — firing a seek per keydown cascades segment requests and stalls playback → FR-17
- [ ] `[M]` ±10 s D-pad seek
- [ ] `[S]` Seek-preview scrubber showing the target timestamp while a key is held → FR-19

**Control bar (~2 h)**
- [ ] `[M]` Auto-hides after 4 s of no input; any key brings it back
- [ ] `[M]` Focus moves between controls through the **same M3 engine** — the player is not a special case
- [ ] `[M]` Controls sit inside the TV safe area, which is why the safe-area token is applied at the shell rather than per page → FR-24
- [ ] `[M]` `prefers-reduced-motion` disables the fade → NFR-15
- [ ] `[M]` Accessible names on all controls; captions toggleable independently of audio → NFR-14

**Resume (~2 h)**
- [ ] `[M]` Persist position on `timeupdate` throttled to once every 5 s, plus on pause and unload → FR-18
- [ ] `[M]` Offer "Resume from 24:13" versus "Start over" — **never resume silently**
- [ ] `[M]` Discard saved positions inside the first 30 s or the last 5% of runtime
- [ ] `[S]` "Continue watching" rail first when a resume position exists → FR-05

**Tracks and metrics (~1 h)**
- [ ] `[S]` List and switch subtitle and audio tracks → FR-20
- [ ] `[M]` 📊 Mark at `play()` intent and at `loadeddata`; take the median of 5 broadband runs → KR-8
- [ ] `[C]` Next-episode autoplay with a cancellable countdown → FR-21

### Exit criteria

| Check | Threshold |
| --- | --- |
| Time to first video frame, broadband | ≤ 2 s → KR-8 |
| Held-key seek | One request burst on release, not one per keydown |
| Player focus | Handled by `packages/focus`, no bespoke key handling |
| Safari | Plays via the native HLS path, verified in the Playwright webkit project |
| 📊 Committed | `benchmarks/2026-wk06-first-frame.md` |

---

## M5 — Hardening: budgets, legacy build, engine matrix

**Week 7 · ~12 h · [M]**

> **Goal:** the budgets stop being reports and start being gates. This is the cheapest milestone per point of JD score in the whole project.

### Tasks

**Make the gate blocking (~3 h)**
- [ ] `[M]` Flip every budget from advisory to a **required status check** → NFR-01 through NFR-09
- [ ] `[M]` CI comments the deltas on the PR, not just pass or fail
- [ ] `[M]` Confirm the median-of-3 smoothing holds across ~10 runs. If it still flaps, add headroom rather than disabling the gate → R-3
- [ ] `[M]` Wire the heap-trend probe as a gate — this is the specific test that catches someone deleting the cold-band logic

**Legacy build (~5 h)**
- [ ] `[M]` `@vitejs/plugin-legacy` emitting a second bundle loaded via `nomodule`
- [ ] `[M]` **Separate entry point** — a legacy failure must not be able to break the modern build → R-4
- [ ] `[M]` Boot-time feature detection for `IntersectionObserver`, MSE and CSS `gap`
- [ ] `[M]` Where a polyfill is expensive, degrade instead: without `IntersectionObserver`, fall back to a throttled scroll handler for image loading rather than shipping a large shim
- [ ] `[M]` `es-check` against `es5` on the legacy chunk — a direct, automatable assertion about the emitted output
- [ ] `[M]` Run the legacy bundle through Playwright's oldest available Chromium; the E2E suite must pass
- [ ] `[M]` README states the gap plainly: *"Verified by static analysis and emulation; not tested on retail hardware."*

**Engine matrix and remaining coverage (~4 h)**
- [ ] `[M]` Full E2E suite green on Chromium, Firefox and WebKit → KR-10
- [ ] `[M]` Journeys covering FR-01 through FR-18: browse, focus traversal, detail, play, resume
- [ ] `[M]` Be precise everywhere you describe it: the `tv` project is **the same Chromium at TV density**, not a fourth engine. Claiming you tested on a TV when you tested at TV density is the overstatement that costs credibility under probing
- [ ] `[S]` Visual snapshot matrix (component × 3 densities × 2 themes) running in CI
- [ ] `[S]` Genre browse as a paginated grid on the same virtualization primitives → FR-06
- [ ] `[S]` Debounced search with an explicit empty state, using `useDeferredValue` **for search only** → FR-07, ADR-5
- [ ] `[C]` D-pad on-screen keyboard for TV search → FR-08

### Exit criteria

| Check | Threshold |
| --- | --- |
| A PR that regresses any budget | Fails, with the delta in the comment |
| E2E | Green on all three engines |
| Legacy chunk | Passes `es-check es5`; E2E green on the oldest Chromium |
| Gate stability | 10 consecutive runs with no false failures |

---

## M6 — Observability, documentation, ship

**Week 8 · ~12 h · [M]**

> **Goal:** the README is the project. Most people who look at this spend ninety seconds on it and never clone.

### Tasks

**RUM (~4 h)**
- [ ] `[M]` `web-vitals` for LCP, CLS, INP and TTFB
- [ ] `[M]` Custom marks: focus latency p95, rail window recompute duration, time to first frame, long tasks per session
- [ ] `[M]` Boot-time segmentation: density mode, engine, `navigator.deviceMemory` tier — **this is the row that makes the rest useful.** An aggregate LCP spanning a MacBook and a 2021 TV means nothing
- [ ] `[M]` Batch and send on `visibilitychange` via `navigator.sendBeacon`, falling back to `fetch` with `keepalive`. Never block navigation on telemetry
- [ ] `[M]` Wrapped so a failing RUM endpoint cannot break the app → NFR-19
- [ ] `[M]` `POST /v1/rum` persists; a dashboard route shows p50/p75/p95 per metric segmented by density — **a plain table, not a chart**, because this is the one screen where you read exact values
- [ ] `[M]` Dashboard and README both labelled *"Synthetic and self-reported sessions, n=‹N›"*
- [ ] `[S]` BFF serves a cached last-good catalogue when the upstream snapshot is unavailable, with a header marking it stale → NFR-17
- [ ] `[S]` Rails expose correct roles and labels; card counts announced to assistive technology → NFR-13

**ADRs (~4 h — one hour each)**

Each is three paragraphs: context, decision, consequences. These are also the six questions you are most likely to be asked.

- [ ] `[M]` ADR-1 — Build the focus engine rather than adopt an existing library
- [ ] `[M]` ADR-2 — Hand-rolled virtualization rather than `react-window` *(hold this one lightly; a reviewer may reasonably disagree)*
- [ ] `[M]` ADR-3 — CSS custom properties rather than CSS-in-JS
- [ ] `[M]` ADR-4 — Zustand rather than Context for UI state
- [ ] `[M]` ADR-5 — Limited use of React concurrent features
- [ ] `[M]` ADR-6 — Client-side rendering rather than SSR *(most likely to be challenged; have the "why not Next.js" answer ready)*

**README and ship (~4 h)**
- [ ] `[M]` README in this exact order: one sentence on what it is → GIF of the TV UI with focus moving → live demo link → **before/after performance table** → architecture diagram → setup instructions
- [ ] `[M]` The performance table above the fold. That is the thing a JioHotstar engineer stops scrolling for
- [ ] `[M]` Screenshot of a Chrome DevTools trace showing your User Timing marks inline with the browser's own events
- [ ] `[M]` Deploy, pin it, verify the demo link → R-6
- [ ] `[M]` 90-second screen recording embedded in the README as a fallback for when the link dies
- [ ] `[M]` JSDoc on all public module surfaces explaining **why**, not what
- [ ] `[S]` Storybook deployed and linked

### Exit criteria

| Check | Threshold |
| --- | --- |
| Public URL | Loads; TV density reachable via `?density=tv` |
| README | Shows before/after numbers, every one sourced from `benchmarks/` |
| ADRs | Six committed under `docs/adr/` |
| DFDs | Level 0 and Level 1 committed as mermaid |
| Every resume number | Reproducible by one command against the repo |

---

## Post-M6 — stretch, only once the above is genuinely done

| Item | Value | Effort |
| --- | --- | --- |
| Publish `@continuum/focus` to npm under MIT | Converts JD row 17 from absent into real; fills bullet C-G | ~4 h |
| Import-graph audit script for KR-9 | Fills the "‹N›% of components shared" slot with a reproducible number | ~2 h |
| Tizen `.wgt` / webOS `.ipk` packaging | Adds process, not engineering signal. Lowest priority in the whole document | ~8 h |

---

## Cross-cutting practice

### Definition of done — every milestone

A milestone is done when **every** row is true. Not "mostly".

- [ ] Works in all three density modes with no per-density branch in any component *(M1 onward)*
- [ ] An E2E spec covers the happy path, green on all three engines *(M2 onward)*
- [ ] Unit tests cover the pure logic added
- [ ] Budgets still pass; if a budget moved, the delta is recorded in `benchmarks/` *(M2 onward)*
- [ ] Public module surfaces carry JSDoc explaining *why*, not *what*
- [ ] README section updated with what this milestone added
- [ ] An ADR exists for any decision you had to think about for more than an hour

### The benchmark protocol

Every entry in `benchmarks/` records **date · commit SHA · profile file hash · 3-run median · the exact command that reproduces it.**

| Optimisation | Measure before and after | Feeds bullet |
| --- | --- | --- |
| Rail virtualization | DOM nodes, LCP, heap | C-A — "cut DOM nodes from X to Y" |
| Image release bands | Heap at 5 minutes | C-A — "held heap flat over a 5-minute browse" |
| Rect caching in the focus engine | Focus p95 | C-B — "cut focus latency from X ms to Y ms" |
| Route-level code splitting | Initial JS gzipped | C-D — "cut initial bundle by Z%" |
| Transform-based rail scroll | Long tasks during scroll | C-D — "eliminated long tasks during scroll" |

Five optimisations, five measured deltas. You only need three of them to be good.

**The honesty rule:** every number that reaches the resume comes from a run you can reproduce on demand. If an interviewer says "show me", you open the repo, run one command, and point at the output. Anything you cannot reproduce that way does not go on the page.

### PR discipline

One pull request per milestone, even though you approve it yourself. Write the description as if a reviewer were reading it: what changed, why, what you measured, what you are unsure about. Review your own diff a day later and leave real comments.

This sounds like theatre. It is not — it produces a public PR history that visibly shows engineering practice, which is a far more credible answer to "tell me about your code review experience" than an internship bullet alone.

---

## Requirement coverage by milestone

| Milestone | FRs | NFRs and KRs |
| --- | --- | --- |
| M0 | FR-02 | NFR-01, 02 wired; KR-10 harness |
| M1 | FR-03, 22, 23, 24, 25 | NFR-02, 10, 11; KR-9 |
| M2 | FR-01, 02, 03, 04 | NFR-05, 06, 07, 09, 16, 18; KR-3, 4, 6 |
| M3 | FR-09 – FR-15 | NFR-08, 12; KR-5 |
| M4 | FR-05, 16 – 21 | NFR-14, 15; KR-8 |
| M5 | FR-06, 07, 08 | NFR-01 – 09 as blocking gates; KR-10; support matrix |
| M6 | — | NFR-13, 17, 19; KR-1, 2, 7 |

If M4 is cut at the week-5 gate, FR-05 and FR-16 through FR-21 go unclaimed. Say so in the README under a "not built" heading rather than leaving it ambiguous — the precision is itself the signal.

## Risk burn-down schedule

| Risk | Retired by | When |
| --- | --- | --- |
| R-5 — you measure nothing and cannot defend the bullets | M0's harness landing before any feature | Week 1 |
| R-3 — Lighthouse flaps on shared runners | Median-of-3 plus headroom, validated over 10 runs | Week 1, re-validated week 7 |
| R-1 — scope creep, never ships | The week-5 cut-line gate being an actual decision point | Week 5 |
| R-2 — the focus engine eats three weeks | One-week timebox on the scorer; memory and traps are separable | Week 5 |
| R-4 — legacy transpilation breaks invisibly | `es-check` on the output, separate entry point, honest README | Week 7 |
| R-6 — the demo link dies before an interview | Pinned deploy, monthly check, 90-second recording in the README | Week 8, ongoing |

R-1 and R-5 are the two that actually sink projects like this. R-1 costs you the deliverable; R-5 costs you the bullets — which is the entire point.
