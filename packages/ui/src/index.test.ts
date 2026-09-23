import { describe, expect, it } from "vitest";
import { placeholder } from "./index";

describe("@continuum/ui smoke test", () => {
  it("loads the package", () => {
    expect(placeholder()).toContain("ui scaffold");
  });
});
