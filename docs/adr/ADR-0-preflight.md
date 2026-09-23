# ADR-0 — Pre-flight decisions

Locked before any code was written, per IMPLEMENTATION_PLAN.md's pre-flight table. Each is a decision that gets an order of magnitude more expensive once code depends on it.

## P-1 — BFF runtime: Fastify vs. Spring Boot

**Decision:** Fastify (Node + TypeScript).

**Why:** Keeps the whole project one language, which is a real (if modest) engineering-velocity argument, not just convenience. The page contract in BRD-TRD §13 is runtime-agnostic, so switching to Spring Boot later would not require reshaping the client.

## P-2 — Tizen/webOS → Chromium version mapping

**Decision:** webOS 4.x ≈ Chromium 53 as the transpilation floor (`.browserslistrc`).

**Why:** This sets `browserslist`, which sets the `@vitejs/plugin-legacy` transpile target, which sets what CSS/JS syntax is off the table (no optional chaining, no CSS `gap`, etc.). Getting this wrong silently breaks the legacy build in ways that only surface on real hardware.

**Status:** Widely-published mapping used as the working default. **TODO:** verify against current Samsung Tizen and LG webOS developer documentation before quoting it externally (README, resume, interview) — see the `TODO(P-2)` marker in `.browserslistrc`. Quoting a version wrong in an interview is worse than not quoting one.

## P-3 — Monorepo tool: pnpm workspaces

**Decision:** pnpm workspaces.

**Why:** Six packages (`focus`, `virtual`, `tokens`, `ui`, `app`, `bff`) from day one, all cross-referencing each other via `workspace:*`. pnpm's content-addressable store keeps install size and time down versus npm/yarn, and its stricter dependency resolution catches phantom-dependency bugs early. Retrofitting a workspace layout mid-milestone would cost a day that's cheaper to spend now.

## P-4 — TMDB API key and snapshot scope

**Decision:** ~600 unique titles across 20 rails × 40 items each (some titles repeat across rails, matching real streaming catalogue behaviour).

**Why:** The DOM-node budget (NFR-06, ≤ 1,500 steady-state nodes) is only a meaningful claim at a stated catalogue size — "virtualized 800 card slots down to ~60 rendered" only means something if the 800 is fixed and never silently changes.

**Status:** `packages/bff/src/fetch-snapshot.ts` is the real fetch script (needs `TMDB_API_KEY`, see `packages/bff/.env.example`). Until a key is provisioned, `packages/bff/data/snapshot.json` holds a synthetic placeholder with the same shape (20 rails × 40 items, ~515 unique ids) so the rest of M0's harness can be exercised end to end. Swap it for a real TMDB pull before any benchmark numbers are recorded — synthetic data does not belong in a committed bullet.

## P-5 — HLS test stream: Mux

**Decision:** Mux's public test HLS stream, deferred to M4.

**Why:** Needs to still resolve months later or the demo breaks silently. Mux's test streams are maintained specifically for this purpose.

## P-6 — Host: Vercel

**Decision:** Vercel.

**Why:** The demo link is load-bearing for the resume bullets (R-6). Vercel's free tier is sufficient for a static Vite build plus a small Fastify BFF (via serverless functions or a separate small host for the BFF if needed), and it's the option most likely to actually stay maintained across months of not touching this repo.
