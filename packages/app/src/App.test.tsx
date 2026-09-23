import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("@continuum/app smoke test", () => {
  it("exports a component", () => {
    expect(typeof App).toBe("function");
  });
});
