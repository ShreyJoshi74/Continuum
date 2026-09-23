/**
 * Custom ESLint rule stub (§9 rule 1). Flags raw pixel values in
 * styled-string literals so every dimension traces back to a token.
 * Stub only in M0 — enabled and made blocking in M1 once tokens exist to
 * point authors at.
 */
const RAW_PX_PATTERN = /\b\d+(\.\d+)?px\b/;

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow raw px values outside the token system.",
    },
    schema: [],
    messages: {
      rawPx: "Raw px value found ({{value}}). Use a token from @continuum/tokens instead.",
    },
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === "string" && RAW_PX_PATTERN.test(node.value)) {
          context.report({ node, messageId: "rawPx", data: { value: node.value } });
        }
      },
      TemplateElement(node) {
        if (RAW_PX_PATTERN.test(node.value.raw)) {
          context.report({ node, messageId: "rawPx", data: { value: node.value.raw } });
        }
      },
    };
  },
};
