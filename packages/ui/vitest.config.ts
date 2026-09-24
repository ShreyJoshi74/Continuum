import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    // Required for @testing-library/react's automatic cleanup() between
    // tests — without it, each render() leaks into the next test in the
    // same file and getByRole() starts finding duplicates.
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
  },
});
