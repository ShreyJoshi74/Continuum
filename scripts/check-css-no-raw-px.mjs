/**
 * The `no-raw-px` ESLint rule only sees JS/TS string and template literals
 * (e.g. inline `style={{ padding: "16px" }}` objects) — it cannot see raw
 * .css files, because ESLint doesn't parse CSS. Since ADR-3 is "CSS custom
 * properties rather than CSS-in-JS" (docs/IMPLEMENTATION_PLAN.md M6), the
 * real component styles for packages/ui live in plain .css files, so this
 * script is the other half of the same no-raw-px gate, scoped to CSS.
 *
 * Every dimension in packages/ui's own stylesheets must come from a token
 * (var(--space-3), var(--type-base), ...) — never a literal "16px". The
 * token *definitions* themselves (packages/tokens/src/generated/density.css)
 * are the one legitimate place raw px belongs, so that file is excluded.
 *
 * Run with: node scripts/check-css-no-raw-px.mjs
 */
import { readFileSync } from "node:fs";
import { glob } from "node:fs/promises";

const RAW_PX_PATTERN = /(?<!var\([^)]*)\b\d+(\.\d+)?px\b/g;
const TARGET_GLOB = "packages/ui/**/*.css";

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

async function main() {
  const violations = [];

  for await (const file of glob(TARGET_GLOB, {
    exclude: ["**/node_modules/**", "**/dist/**", "**/storybook-static/**"],
  })) {
    const raw = readFileSync(file, "utf8");
    const css = stripComments(raw);
    const lines = css.split("\n");

    lines.forEach((line, i) => {
      const matches = line.match(RAW_PX_PATTERN);
      if (matches) {
        violations.push({ file, line: i + 1, text: line.trim(), matches });
      }
    });
  }

  if (violations.length > 0) {
    console.error("no-raw-px (CSS): raw px value found outside var() — use a token instead.\n");
    for (const v of violations) {
      console.error(`  ${v.file}:${v.line}  ${v.text}`);
    }
    console.error(`\n${violations.length} violation(s).`);
    process.exit(1);
  }

  console.log("no-raw-px (CSS): clean — every dimension in packages/ui/**/*.css is a token.");
}

main();
