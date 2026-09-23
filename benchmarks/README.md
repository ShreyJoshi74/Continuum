# Benchmark recording protocol

Every entry in this directory records:

- **Date**
- **Commit SHA** (`git rev-parse HEAD`)
- **Profile file hash** (`sha1sum perf/low-end-profile.json`)
- **3-run median** for each metric
- **The exact command that reproduces it**

## Why this exists

Every number that reaches the resume must come from a run you can reproduce on demand. If an interviewer says "show me," you open the repo, run one command, and point at the output. Anything you cannot reproduce this way does not go on the page (see IMPLEMENTATION_PLAN.md, "The honesty rule").

## How to record an entry

1. Build the app: `pnpm --filter @continuum/app run build`
2. Run Lighthouse CI locally: `npx lhci autorun`
3. Run the DOM-count and long-task probes: `npx playwright test e2e/probes`
4. Run `pnpm size` for bundle size
5. Copy `TEMPLATE.md`, fill in every field, name it `YYYY-wkNN-<milestone-slug>.md`

## Template

See [`TEMPLATE.md`](./TEMPLATE.md).
