import { describe, expect, it } from "vitest";
import { buildServer } from "./server";

describe("GET /v1/page/home", () => {
  it("returns the page contract with caching headers", async () => {
    const app = buildServer();
    const response = await app.inject({ method: "GET", url: "/v1/page/home" });

    expect(response.statusCode).toBe(200);
    expect(response.headers["cache-control"]).toBe("max-age=60, stale-while-revalidate=600");
    expect(response.headers.etag).toBeTruthy();

    const body = response.json();
    expect(body.pageId).toBe("home");
    expect(Array.isArray(body.rails)).toBe(true);
    expect(body.rails.length).toBeGreaterThan(0);
  });

  it("returns 304 when If-None-Match matches the current ETag", async () => {
    const app = buildServer();
    const first = await app.inject({ method: "GET", url: "/v1/page/home" });
    const etag = first.headers.etag as string;

    const second = await app.inject({
      method: "GET",
      url: "/v1/page/home",
      headers: { "if-none-match": etag },
    });

    expect(second.statusCode).toBe(304);
  });
});

describe("POST /v1/rum", () => {
  it("accepts and discards the payload", async () => {
    const app = buildServer();
    const response = await app.inject({
      method: "POST",
      url: "/v1/rum",
      payload: { metric: "LCP", value: 1200 },
    });

    expect(response.statusCode).toBe(204);
  });
});
