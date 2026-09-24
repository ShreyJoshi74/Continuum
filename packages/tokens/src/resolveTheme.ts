import type { ThemeMode } from "./generated/tokens.js";

/** Everything resolveTheme needs, expressed as plain data — same reasoning as DensityInputs. */
export interface ThemeInputs {
  /** location.search, e.g. "?theme=light" */
  search: string;
  /** matchMedia("(prefers-color-scheme: light)").matches */
  prefersLight: boolean;
}

const THEME_MODES: readonly ThemeMode[] = ["light", "dark"];

/**
 * Decides which theme a page should render in. Precedence, high to low:
 *   1. `?theme=` in the URL — same testability reasoning as `?density=`.
 *   2. The OS/browser's `prefers-color-scheme`.
 *   3. "dark" as the fallback — this app's default look.
 *
 * Theme is deliberately resolved independently of density (FR-25): nothing
 * here reads viewport size or pointer type, and resolveDensity never reads
 * color-scheme. Any density × theme combination is valid.
 */
export function resolveTheme(inputs: ThemeInputs): ThemeMode {
  const override = new URLSearchParams(inputs.search).get("theme");
  if (isThemeMode(override)) {
    return override;
  }

  return inputs.prefersLight ? "light" : "dark";
}

function isThemeMode(value: string | null): value is ThemeMode {
  return value !== null && (THEME_MODES as readonly string[]).includes(value);
}

/** Reads the real browser environment and applies the resolved theme to <html data-theme>. Call once at boot. */
export function applyTheme(win: Window = window): ThemeMode {
  const mode = resolveTheme({
    search: win.location.search,
    prefersLight: win.matchMedia("(prefers-color-scheme: light)").matches,
  });
  win.document.documentElement.dataset.theme = mode;
  return mode;
}
