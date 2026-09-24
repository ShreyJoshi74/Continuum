import { describe, expect, it } from "vitest";
import { resolveDensity } from "./resolveDensity";

const desktop = {
  search: "",
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120",
  viewportWidth: 1440,
  pointerCoarse: false,
  hoverNone: false,
};

describe("resolveDensity", () => {
  it("defaults a mouse-driven desktop viewport to comfortable", () => {
    expect(resolveDensity(desktop)).toBe("comfortable");
  });

  it("treats a narrow touch viewport as compact", () => {
    expect(
      resolveDensity({ ...desktop, viewportWidth: 390, pointerCoarse: true, hoverNone: true })
    ).toBe("compact");
  });

  it("treats a large no-pointer, no-hover viewport as tv", () => {
    expect(
      resolveDensity({ ...desktop, viewportWidth: 1920, pointerCoarse: true, hoverNone: true })
    ).toBe("tv");
  });

  it("recognizes a Tizen smart-TV user agent regardless of pointer signals", () => {
    expect(
      resolveDensity({
        ...desktop,
        userAgent: "Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0)",
        pointerCoarse: false,
        hoverNone: false,
      })
    ).toBe("tv");
  });

  it("recognizes a webOS smart-TV user agent", () => {
    expect(
      resolveDensity({ ...desktop, userAgent: "Mozilla/5.0 (Web0S; Linux/SmartTV)" })
    ).toBe("tv");
  });

  it("lets ?density= override every other signal, for manual and CI testing", () => {
    expect(resolveDensity({ ...desktop, search: "?density=tv" })).toBe("tv");
    expect(
      resolveDensity({
        ...desktop,
        search: "?density=compact",
        userAgent: "Mozilla/5.0 (Tizen 6.0)",
      })
    ).toBe("compact");
  });

  it("ignores an invalid ?density= value instead of throwing", () => {
    expect(resolveDensity({ ...desktop, search: "?density=huge" })).toBe("comfortable");
  });
});
