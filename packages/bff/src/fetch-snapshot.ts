/**
 * TMDB fetch script → bff/data/snapshot.json (committed).
 *
 * Run once (or on a schedule), never proxied per-request — see BRD-TRD §13
 * "BFF → TMDB" caching row. This is also the mitigation for the TMDB
 * dependency risk (R in the plan's pre-flight table): the app never depends
 * on TMDB being reachable at runtime.
 *
 * Usage: TMDB_API_KEY=xxxx pnpm --filter @continuum/bff run fetch-snapshot
 */
import { writeFile } from "node:fs/promises";
import https from "node:https";
import path from "node:path";
import type { CardItem, HomePage, Rail } from "./types.js";

// Node's built-in fetch (undici) hits ECONNRESET on some local networks
// (TLS-inspecting proxies/antivirus) even though plain https requests and
// curl succeed against the same host. Falling back to node:https sidesteps it.
function httpsGetJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`TMDB request failed (${res.statusCode}): ${url.split("api_key=")[0]}...`));
          res.resume();
          return;
        }
        let data = "";
        res.setEncoding("utf-8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data) as T);
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", reject);
  });
}

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

// P-4: ~600 unique titles across 20 rails × 40 items (titles repeat across rails,
// same as any real streaming catalogue home page).
const RAIL_GENRES: Array<{ railId: string; title: string; genreId: number }> = [
  { railId: "action", title: "Action", genreId: 28 },
  { railId: "comedy", title: "Comedy", genreId: 35 },
  { railId: "drama", title: "Drama", genreId: 18 },
  { railId: "sci-fi", title: "Sci-Fi", genreId: 878 },
  { railId: "horror", title: "Horror", genreId: 27 },
  { railId: "thriller", title: "Thriller", genreId: 53 },
  { railId: "romance", title: "Romance", genreId: 10749 },
  { railId: "animation", title: "Animation", genreId: 16 },
  { railId: "documentary", title: "Documentary", genreId: 99 },
  { railId: "fantasy", title: "Fantasy", genreId: 14 },
  { railId: "crime", title: "Crime", genreId: 80 },
  { railId: "mystery", title: "Mystery", genreId: 9648 },
  { railId: "family", title: "Family", genreId: 10751 },
  { railId: "adventure", title: "Adventure", genreId: 12 },
  { railId: "war", title: "War", genreId: 10752 },
  { railId: "history", title: "History", genreId: 36 },
  { railId: "music", title: "Music", genreId: 10402 },
  { railId: "western", title: "Western", genreId: 37 },
  { railId: "tv-movie", title: "TV Movies", genreId: 10770 },
  { railId: "top-rated", title: "Top Rated", genreId: 18 },
];

const ITEMS_PER_RAIL = 40;

interface TmdbMovie {
  id: number;
  title: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

async function fetchGenrePage(genreId: number, page: number): Promise<TmdbMovie[]> {
  const url = `${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`;
  const body = await httpsGetJson<{ results: TmdbMovie[] }>(url);
  return body.results;
}

function toCardItem(movie: TmdbMovie): CardItem {
  return {
    id: `tt${movie.id}`,
    title: movie.title,
    artwork: {
      landscape: movie.backdrop_path ? `${IMAGE_BASE}/w780${movie.backdrop_path}` : "",
      portrait: movie.poster_path ? `${IMAGE_BASE}/w500${movie.poster_path}` : "",
    },
    badges: movie.vote_average >= 7.5 ? ["HD", "Top Rated"] : ["HD"],
  };
}

async function buildRail(def: (typeof RAIL_GENRES)[number]): Promise<Rail> {
  const items: CardItem[] = [];
  let page = 1;
  while (items.length < ITEMS_PER_RAIL && page <= 3) {
    const results = await fetchGenrePage(def.genreId, page);
    if (results.length === 0) break;
    for (const movie of results) {
      if (items.length >= ITEMS_PER_RAIL) break;
      if (movie.backdrop_path || movie.poster_path) {
        items.push(toCardItem(movie));
      }
    }
    page += 1;
  }
  return {
    railId: def.railId,
    title: def.title,
    layout: def.railId === "top-rated" ? "portrait" : "landscape",
    items,
  };
}

async function main() {
  if (!TMDB_API_KEY) {
    console.error(
      "TMDB_API_KEY is not set. Get a free key at https://www.themoviedb.org/settings/api " +
        "and run: TMDB_API_KEY=xxxx pnpm --filter @continuum/bff run fetch-snapshot"
    );
    process.exit(1);
  }

  const rails: Rail[] = [];
  for (const def of RAIL_GENRES) {
    console.log(`Fetching rail "${def.title}"...`);
    rails.push(await buildRail(def));
  }

  const snapshot: HomePage = {
    pageId: "home",
    version: new Date().toISOString(),
    rails,
  };

  const outPath = path.resolve(import.meta.dirname, "../data/snapshot.json");
  await writeFile(outPath, JSON.stringify(snapshot, null, 2), "utf-8");

  const uniqueTitles = new Set(rails.flatMap((r) => r.items.map((i) => i.id)));
  console.log(
    `Wrote ${outPath} — ${rails.length} rails, ${uniqueTitles.size} unique titles, ` +
      `${rails.reduce((n, r) => n + r.items.length, 0)} total card slots.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
