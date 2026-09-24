// GENERATED FILE — do not edit by hand.
// Source: packages/tokens/tokens/*.json
// Regenerate: pnpm --filter @continuum/tokens run build:tokens

export const core = {
  colorBrand: "#e50914",
  colorOnBrand: "#ffffff",
  radiusCard: 8,
  radiusControl: 6,
  radiusPill: 999,
  zIndexModal: 1000,
  zIndexFocusRing: 10,
  timingFast: "120ms",
  timingNormal: "200ms",
  timingSlow: "320ms",
} as const;

export const density = {
  compact: {
    typeBase: 14,
    typeScale: 1.2,
    space1: 4,
    space2: 8,
    space3: 12,
    space4: 16,
    space5: 24,
    borderWidth: 1,
    borderFocusWidth: 2,
    borderFocusOffset: 2,
    borderFocusGlow: "0 0 0 2px rgba(229, 9, 20, 1)",
    borderFocusScale: 1.03,
    safeInsetBlock: 0,
    safeInsetInline: 0,
  },
  comfortable: {
    typeBase: 16,
    typeScale: 1.25,
    space1: 4,
    space2: 8,
    space3: 16,
    space4: 24,
    space5: 32,
    borderWidth: 1,
    borderFocusWidth: 2,
    borderFocusOffset: 2,
    borderFocusGlow: "0 0 0 3px rgba(229, 9, 20, 1)",
    borderFocusScale: 1.04,
    safeInsetBlock: 0,
    safeInsetInline: 0,
  },
  tv: {
    typeBase: 28,
    typeScale: 1.15,
    space1: 12,
    space2: 20,
    space3: 32,
    space4: 48,
    space5: 64,
    borderWidth: 1,
    borderFocusWidth: 2,
    borderFocusOffset: 2,
    borderFocusGlow: "0 0 0 8px rgba(229, 9, 20, 1)",
    borderFocusScale: 1.06,
    safeInsetBlock: "5%",
    safeInsetInline: "5%",
  },
} as const;

export const theme = {
  light: {
    colorSurface: "#ffffff",
    colorSurfaceRaised: "#f0f0f0",
    colorText: "#141414",
    colorTextMuted: "#5c5c5c",
  },
  dark: {
    colorSurface: "#141414",
    colorSurfaceRaised: "#1f1f1f",
    colorText: "#eaeaea",
    colorTextMuted: "#a0a0a0",
  },
} as const;

export type DensityMode = keyof typeof density;
export type ThemeMode = keyof typeof theme;
