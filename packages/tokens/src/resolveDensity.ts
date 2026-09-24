import type { DensityMode } from "./generated/tokens.js";

/**
 * Everything resolveDensity needs, expressed as plain data instead of a
 * `Window` — this is what lets the decision be unit-tested without a real
 * browser or a DOM testing library.
 */
export interface DensityInputs {
  /** location.search, e.g. "?density=tv" */
  search: string;
  /** navigator.userAgent */
  userAgent: string;
  /** window.innerWidth */
  viewportWidth: number;
  /** matchMedia("(pointer: coarse), (pointer: none)").matches */
  pointerCoarse: boolean;
  /** matchMedia("(hover: none)").matches */
  hoverNone: boolean;
}

const DENSITY_MODES: readonly DensityMode[] = ["compact", "comfortable", "tv"];

// Smart TV browsers identify themselves in the UA string; this is the one
// signal that's unambiguous on its own, no viewport/pointer heuristics needed.
const TV_USER_AGENT_PATTERN = /Tizen|SmartTV|Web0S|WebOS|HbbTV|NetCast|GoogleTV|AFT[A-Z]/i;

// Below this width we're confident it's a phone regardless of pointer type
// (a coarse-pointer tablet above this width still reads as "comfortable").
const COMPACT_MAX_WIDTH = 767;

// A remote-controlled TV has no fine pointer and no hover, same as a touch
// phone — the viewport width is what tells the two apart.
const TV_MIN_WIDTH_WITHOUT_POINTER = 960;

/**
 * Decides which density mode a page should render in, given the environment
 * it's running in. Precedence, high to low:
 *   1. `?density=` in the URL — always wins, because this is what makes the
 *      three modes testable in CI and by hand without owning a TV.
 *   2. A known smart-TV user agent string.
 *   3. No fine pointer and no hover, at a TV-sized viewport → "tv".
 *   4. Narrow viewport → "compact".
 *   5. Otherwise → "comfortable".
 */
export function resolveDensity(inputs: DensityInputs): DensityMode {
  const override = new URLSearchParams(inputs.search).get("density");
  if (isDensityMode(override)) {
    return override;
  }

  if (TV_USER_AGENT_PATTERN.test(inputs.userAgent)) {
    return "tv";
  }

  if (inputs.pointerCoarse && inputs.hoverNone && inputs.viewportWidth >= TV_MIN_WIDTH_WITHOUT_POINTER) {
    return "tv";
  }

  if (inputs.viewportWidth <= COMPACT_MAX_WIDTH) {
    return "compact";
  }

  return "comfortable";
}

function isDensityMode(value: string | null): value is DensityMode {
  return value !== null && (DENSITY_MODES as readonly string[]).includes(value);
}

/** Reads the real browser environment and applies the resolved density to <html data-density>. Call once at boot. */
export function applyDensity(win: Window = window): DensityMode {
  const mode = resolveDensity({
    search: win.location.search,
    userAgent: win.navigator.userAgent,
    viewportWidth: win.innerWidth,
    pointerCoarse: win.matchMedia("(pointer: coarse), (pointer: none)").matches,
    hoverNone: win.matchMedia("(hover: none)").matches,
  });
  win.document.documentElement.dataset.density = mode;
  return mode;
}
