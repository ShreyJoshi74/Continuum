// Lets TS accept `import "./Button.css";` — components are styled with
// plain global CSS (ADR-3: custom properties, not CSS-in-JS), imported for
// its side effect only, so no exported shape is needed.
declare module "*.css";
