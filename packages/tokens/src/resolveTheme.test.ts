import { describe, expect, it } from "vitest";
import { resolveTheme } from "./resolveTheme";

describe("resolveTheme", () => {
  it("defaults to dark when the OS has no light preference", () => {
    expect(resolveTheme({ search: "", prefersLight: false })).toBe("dark");
  });

  it("follows the OS preference when it prefers light", () => {
    expect(resolveTheme({ search: "", prefersLight: true })).toBe("light");
  });

  it("lets ?theme= override the OS preference, for manual and CI testing", () => {
    expect(resolveTheme({ search: "?theme=light", prefersLight: false })).toBe("light");
    expect(resolveTheme({ search: "?theme=dark", prefersLight: true })).toBe("dark");
  });

  it("ignores an invalid ?theme= value instead of throwing", () => {
    expect(resolveTheme({ search: "?theme=neon", prefersLight: false })).toBe("dark");
  });
});
