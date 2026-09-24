import type { Preview } from "@storybook/react-vite";
import "@continuum/tokens/density.css";

/**
 * The density × theme toolbar (§9 rule 3): every story renders inside a
 * wrapper carrying [data-density] and [data-theme], the same attributes
 * @continuum/tokens' generated CSS selects on. Switching either toolbar
 * control re-renders every story in a different corner of the same 3×2
 * matrix — 6 states per component — with zero change to the component
 * itself, which is the whole point of M1.
 */
const preview: Preview = {
  globalTypes: {
    density: {
      description: "Density mode",
      toolbar: {
        title: "Density",
        icon: "grow",
        items: [
          { value: "compact", title: "Compact (phone)" },
          { value: "comfortable", title: "Comfortable (desktop)" },
          { value: "tv", title: "TV (10-foot)" },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: "Theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    density: "comfortable",
    theme: "dark",
  },
  decorators: [
    (Story, context) => {
      const density = context.globals.density ?? "comfortable";
      const theme = context.globals.theme ?? "dark";

      return (
        <div
          data-density={density}
          data-theme={theme}
          style={{
            background: "var(--color-surface)",
            color: "var(--color-text)",
            padding: "var(--space-4)",
            minHeight: "100vh",
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
