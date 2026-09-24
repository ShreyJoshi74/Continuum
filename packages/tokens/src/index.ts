/**
 * @continuum/tokens — density and theme token source.
 *
 * Design decisions live as data in tokens/core.json and
 * tokens/density/{compact,comfortable,tv}.json. scripts/build-tokens.mjs
 * compiles them into two synced outputs under src/generated/:
 *   - density.css — CSS custom properties for components (var(--space-3))
 *   - tokens.ts   — the same values as typed constants, for code that
 *     needs the real number (the focus engine, contrast tests) without
 *     parsing CSS at runtime.
 */
export { core, density, theme } from "./generated/tokens.js";
export type { DensityMode, ThemeMode } from "./generated/tokens.js";
export { resolveDensity, applyDensity } from "./resolveDensity.js";
export type { DensityInputs } from "./resolveDensity.js";
export { resolveTheme, applyTheme } from "./resolveTheme.js";
export type { ThemeInputs } from "./resolveTheme.js";
export { contrastRatio, extractShadowColor } from "./contrast.js";
