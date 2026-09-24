import React from "react";
import ReactDOM from "react-dom/client";
import { applyDensity, applyTheme } from "@continuum/tokens";
import { App } from "./App";
import "@continuum/tokens/density.css";
import "./styles.css";

// Runs before the first render so the density- and theme-scoped CSS
// variables are already in place — no flash of the wrong size/colors
// while React boots. The two are independent (FR-25): either can change
// without touching the other.
applyDensity();
applyTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
