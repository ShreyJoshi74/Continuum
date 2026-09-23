import { describe, expect, it } from "vitest";
import { placeholder } from "./index";

describe("@continuum/tokens smoke test", () => {
  it("loads the package", () => {
    expect(placeholder()).toContain("tokens scaffold");
  });
});
