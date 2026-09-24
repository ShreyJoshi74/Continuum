import js from "@eslint/js";
import tseslint from "typescript-eslint";
import noRawPx from "./eslint-rules/no-raw-px.js";

const continuum = { rules: { "no-raw-px": noRawPx } };

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/storybook-static/**"],
  },
  {
    plugins: { continuum },
    rules: {
      // Stub in M0 — flipped to "error" for packages/ui in M1 (§9 rule 1),
      // once tokens exist to point authors at instead.
      "continuum/no-raw-px": "off",
    },
  },
  {
    // Blocking in M1 (§9 rule 1) — tokens now exist (packages/tokens) to
    // point authors at instead of a literal px value.
    files: ["packages/ui/**/*.{ts,tsx}"],
    plugins: { continuum },
    rules: {
      "continuum/no-raw-px": "error",
    },
  }
);
