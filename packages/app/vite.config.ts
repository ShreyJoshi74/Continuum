import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Legacy plugin is wired but not yet tuned (M0). Real feature-detection and
// the es-check gate on the emitted chunk land in M5 — see BRD-TRD §15/§18
// and IMPLEMENTATION_PLAN.md M5.
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["chrome >= 53"],
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      "/v1": "http://localhost:3001",
    },
  },
});
