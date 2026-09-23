import { describe, expect, it } from "vitest";
import { placeholder } from "./index";

describe("@continuum/virtual smoke test", () => {
  it("loads the package", () => {
    expect(placeholder()).toContain("virtual window");
  });
});
