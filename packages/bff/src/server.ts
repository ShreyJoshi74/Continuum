import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Fastify from "fastify";
import type { HomePage } from "./types.js";

const SNAPSHOT_PATH = path.resolve(import.meta.dirname, "../data/snapshot.json");

let cachedSnapshot: HomePage | null = null;
let cachedEtag = "";

async function loadSnapshot(): Promise<{ snapshot: HomePage; etag: string }> {
  if (cachedSnapshot) return { snapshot: cachedSnapshot, etag: cachedEtag };
  const raw = await readFile(SNAPSHOT_PATH, "utf-8");
  cachedSnapshot = JSON.parse(raw) as HomePage;
  cachedEtag = createHash("sha1").update(raw).digest("hex");
  return { snapshot: cachedSnapshot, etag: cachedEtag };
}

export function buildServer() {
  const app = Fastify({ logger: true });

  // Real page contract from BRD-TRD §13 — stale-while-revalidate is what
  // makes the second launch feel instant on a slow TV connection.
  app.get("/v1/page/home", async (request, reply) => {
    const { snapshot, etag } = await loadSnapshot();

    if (request.headers["if-none-match"] === etag) {
      return reply.code(304).header("ETag", etag).send();
    }

    return reply
      .header("Cache-Control", "max-age=60, stale-while-revalidate=600")
      .header("ETag", etag)
      .send(snapshot);
  });

  // Accepts and discards for now — the real sink (persist + p50/p75/p95
  // dashboard) lands in M6.
  app.post("/v1/rum", async (_request, reply) => {
    return reply.code(204).send();
  });

  return app;
}

async function main() {
  const app = buildServer();
  const port = Number(process.env.PORT ?? 3001);
  await app.listen({ port, host: "0.0.0.0" });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
