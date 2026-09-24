import { describe, expect, it } from "vitest";
import { core, density, theme } from "./generated/tokens.js";
import { contrastRatio, extractShadowColor } from "./contrast.js";

const THEMES = ["light", "dark"] as const;
const DENSITIES = ["compact", "comfortable", "tv"] as const;

// WCAG 2.1 AA: 4.5:1 for normal text.
const AA_TEXT_MIN = 4.5;
// WCAG 2.1 §1.4.11 (non-text contrast, which is what a focus indicator is): 3:1.
const FOCUS_RING_MIN = 3;

describe("contrast — WCAG 2.1 AA, on the numbers tokens.ts actually ships", () => {
  describe.each(THEMES)("theme: %s", (themeName) => {
    const t = theme[themeName];

    it("body text on the page background", () => {
      expect(contrastRatio(t.colorText, t.colorSurface)).toBeGreaterThanOrEqual(AA_TEXT_MIN);
    });

    it("muted text on the page background", () => {
      expect(contrastRatio(t.colorTextMuted, t.colorSurface)).toBeGreaterThanOrEqual(AA_TEXT_MIN);
    });

    it("text on a raised surface (Button secondary, IconButton)", () => {
      expect(contrastRatio(t.colorText, t.colorSurfaceRaised)).toBeGreaterThanOrEqual(AA_TEXT_MIN);
    });

    it("muted text on a raised surface (Badge neutral)", () => {
      expect(contrastRatio(t.colorTextMuted, t.colorSurfaceRaised)).toBeGreaterThanOrEqual(
        AA_TEXT_MIN
      );
    });
  });

  it("onBrand text on the brand color (Button primary, Badge brand) — independent of theme", () => {
    expect(contrastRatio(core.colorOnBrand, core.colorBrand)).toBeGreaterThanOrEqual(AA_TEXT_MIN);
  });

  describe.each(THEMES)("theme: %s", (themeName) => {
    describe.each(DENSITIES)("density: %s — focus-ring contrast (NFR-11)", (densityName) => {
      it("the glow is visible against the page background at ≥3:1", () => {
        const glowColor = extractShadowColor(density[densityName].borderFocusGlow);
        const surface = theme[themeName].colorSurface;
        expect(contrastRatio(glowColor, surface)).toBeGreaterThanOrEqual(FOCUS_RING_MIN);
      });
    });
  });
});
