/**
 * M0 placeholder shell. The real catalogue home — rails composed from the
 * BFF response, virtualized — lands in M2 (see IMPLEMENTATION_PLAN.md).
 * This exists only so CI has a real page to run Lighthouse and the DOM/
 * long-task probes against from week 1.
 */
export function App() {
  return (
    <main>
      <h1>Continuum</h1>
      <p>Cross-surface streaming UI — scaffold stage (M0).</p>
      <footer>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </main>
  );
}
