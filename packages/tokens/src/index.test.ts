import { describe, expect, it } from "vitest";
import { core, density, theme } from "./index";

describe("@continuum/tokens", () => {
  it("exposes core tokens shared across every density", () => {
    expect(core.radiusCard).toBe(8);
  });

  it("gives each density its own spacing scale", () => {
    expect(density.compact.space3).toBe(12);
    expect(density.comfortable.space3).toBe(16);
    expect(density.tv.space3).toBe(32);
  });

  it("keeps corner radius near-constant across densities (a brand value, not a distance function)", () => {
    // radius is deliberately in core.json (shared), not density/*.json — this
    // test exists so a future author who "helpfully" moves radius into a
    // density file gets caught immediately.
    expect(core.radiusCard).toBe(8);
  });

  it("scales spacing faster than type from compact to tv", () => {
    const typeGrowth = density.tv.typeBase / density.compact.typeBase;
    const spaceGrowth = density.tv.space3 / density.compact.space3;
    expect(spaceGrowth).toBeGreaterThan(typeGrowth);
  });

  it("keeps brand color identical across themes, but flips surface/text (FR-25: orthogonal swap)", () => {
    expect(theme.light.colorSurface).not.toBe(theme.dark.colorSurface);
    expect(theme.light.colorText).not.toBe(theme.dark.colorText);
    // brand lives in core.json, not theme/*.json, precisely so it can't drift between themes.
    expect(core.colorBrand).toBe("#e50914");
  });
});
