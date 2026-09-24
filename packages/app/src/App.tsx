/**
 * M0 placeholder shell. The real catalogue home — rails composed from the
 * BFF response, virtualized — lands in M2 (see IMPLEMENTATION_PLAN.md).
 * This exists only so CI has a real page to run Lighthouse and the DOM/
 * long-task probes against from week 1.
 */
import { Badge, Button, Card, IconButton, Rail } from "@continuum/ui";

const DEMO_TITLES = [
  { title: "The Signal", badges: ["4K", "HDR"] },
  { title: "Nightfall Express", badges: ["NEW"] },
  { title: "Glass Horizon", badges: [] },
  { title: "Ember & Ash", badges: ["4K"] },
  { title: "Quiet Static", badges: ["NEW", "4K"] },
  { title: "The Long Dusk", badges: [] },
];

export function App() {
  const density =
    typeof document !== "undefined" ? document.documentElement.dataset.density : undefined;
  const theme = typeof document !== "undefined" ? document.documentElement.dataset.theme : undefined;

  return (
    <main>
      <h1>Continuum</h1>
      <p>Cross-surface streaming UI — scaffold stage (M0).</p>
      <p>
        Resolved density: <strong>{density ?? "unknown"}</strong> (try appending{" "}
        <code>?density=tv</code>, <code>?density=compact</code> or{" "}
        <code>?density=comfortable</code> to the URL)
      </p>
      <p>
        Resolved theme: <strong>{theme ?? "unknown"}</strong> (try appending{" "}
        <code>?theme=light</code> or <code>?theme=dark</code> to the URL)
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "16px 0" }}>
        <Button>Play</Button>
        <Button variant="secondary">More info</Button>
        <IconButton aria-label="Mute" icon={<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8" /></svg>} />
        <Badge>4K</Badge>
        <Badge variant="brand">NEW</Badge>
      </div>

      <Rail title="Trending Now (placeholder data — the real BFF-backed home page lands in M2)">
        {DEMO_TITLES.map((item, i) => (
          <Card
            key={item.title}
            title={item.title}
            imageUrl={`https://picsum.photos/seed/continuum-${i}/400/225`}
            badges={item.badges}
          />
        ))}
      </Rail>

      <footer>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </main>
  );
}
