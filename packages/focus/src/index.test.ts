import { describe, expect, it } from "vitest";
import { placeholder } from "./index";

describe("@continuum/focus smoke test", () => {
  it("loads the package", () => {
    expect(placeholder()).toContain("focus engine");
  });
});
