/**
 * Reads tokens/core.json + tokens/density/*.json + tokens/theme/*.json (the
 * design decisions, as data) and generates two synced outputs from that
 * single source:
 *
 *   - src/generated/density.css — CSS custom properties, scoped by
 *     [data-density="..."] and [data-theme="..."], for components to
 *     consume via var(--x)
 *   - src/generated/tokens.ts   — the same values as typed JS constants,
 *     for code (the focus engine, contrast tests) that needs the real
 *     number and cannot afford to parse CSS at runtime
 *
 * Density and theme are orthogonal (§9 rule 3 / FR-25): a page can be any
 * density × either theme, and each is scoped by its own attribute, so
 * nothing here couples them together.
 *
 * Run with: pnpm --filter @continuum/tokens run build:tokens
 */
import StyleDictionary from "style-dictionary";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const outDir = path.join(root, "src", "generated");

const DENSITIES = ["compact", "comfortable", "tv"];
const THEMES = ["light", "dark"];

/** Loads one token file through Style Dictionary and returns its flat token list. */
async function loadTokens(sourceFile) {
  const sd = new StyleDictionary({
    source: [sourceFile],
    platforms: { web: {} },
  });
  const dictionary = await sd.getPlatformTokens("web");
  // "comment" keys are documentation, not design values — drop them.
  return dictionary.allTokens.filter((token) => !token.path.includes("comment"));
}

/** 'surfaceRaised' -> 'surface-raised' */
function toKebab(segment) {
  return segment.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/** ['border', 'focusWidth'] -> '--border-focus-width' (real CSS convention, matches the plan's own --safe-inset-block naming) */
function cssVarName(tokenPath) {
  return `--${tokenPath.map(toKebab).join("-")}`;
}

/** ['border', 'focusWidth'] -> 'borderFocusWidth' (real JS convention) */
function camelName(tokenPath) {
  return tokenPath
    .map((segment, i) => (i === 0 ? segment : segment[0].toUpperCase() + segment.slice(1)))
    .join("");
}

/** '12px' -> 12, '1.2' -> 1.2 (numbers the focus engine can do arithmetic on); anything else (colors, "320ms", "5%") stays a string. */
function toJsValue(rawValue) {
  const pxMatch = /^(-?\d+(?:\.\d+)?)px$/.exec(rawValue);
  if (pxMatch) return Number(pxMatch[1]);
  if (/^-?\d+(?:\.\d+)?$/.test(rawValue)) return Number(rawValue);
  return rawValue;
}

function cssBlock(selector, tokens) {
  if (tokens.length === 0) return "";
  const lines = tokens.map((t) => `  ${cssVarName(t.path)}: ${t.value};`);
  return `${selector} {\n${lines.join("\n")}\n}\n`;
}

function tsObjectFor(tokens, indent) {
  return tokens
    .map((t) => `${indent}  ${camelName(t.path)}: ${JSON.stringify(toJsValue(t.value))},`)
    .join("\n");
}

async function loadGroup(names, dir) {
  const result = {};
  for (const name of names) {
    result[name] = await loadTokens(path.join(root, "tokens", dir, `${name}.json`));
  }
  return result;
}

async function build() {
  const core = await loadTokens(path.join(root, "tokens", "core.json"));
  const perDensity = await loadGroup(DENSITIES, "density");
  const perTheme = await loadGroup(THEMES, "theme");

  const cssParts = [
    "/* GENERATED FILE — do not edit by hand.",
    " * Source: packages/tokens/tokens/*.json",
    " * Regenerate: pnpm --filter @continuum/tokens run build:tokens */",
    "",
    cssBlock(":root", core),
    ...DENSITIES.map((name) => cssBlock(`[data-density="${name}"]`, perDensity[name])),
    ...THEMES.map((name) => cssBlock(`[data-theme="${name}"]`, perTheme[name])),
  ];

  const tsParts = [
    "// GENERATED FILE — do not edit by hand.",
    "// Source: packages/tokens/tokens/*.json",
    "// Regenerate: pnpm --filter @continuum/tokens run build:tokens",
    "",
    "export const core = {",
    tsObjectFor(core, ""),
    "} as const;",
    "",
    "export const density = {",
    ...DENSITIES.map((name) => `  ${name}: {\n${tsObjectFor(perDensity[name], "  ")}\n  },`),
    "} as const;",
    "",
    "export const theme = {",
    ...THEMES.map((name) => `  ${name}: {\n${tsObjectFor(perTheme[name], "  ")}\n  },`),
    "} as const;",
    "",
    "export type DensityMode = keyof typeof density;",
    "export type ThemeMode = keyof typeof theme;",
    "",
  ];

  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "density.css"), cssParts.join("\n"));
  writeFileSync(path.join(outDir, "tokens.ts"), tsParts.join("\n"));
}

build();
