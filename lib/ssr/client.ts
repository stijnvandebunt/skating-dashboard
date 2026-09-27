import { z } from "zod";

const BASE_URL = "https://speedskatingresults.com/api/json";

// SSR has no documented rate limit, but we're a guest on someone else's
// server — stay polite and predictable rather than fast.
const MIN_INTERVAL_MS = 1000;
let lastRequestAt = 0;

async function throttle() {
  const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastRequestAt = Date.now();
}

export class SsrApiError extends Error {
  constructor(
    message: string,
    public readonly path: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "SsrApiError";
  }
}

async function getJson<T>(
  path: string,
  params: Record<string, string | number | undefined>,
  schema: z.ZodType<T>,
  attempt = 1,
): Promise<T> {
  await throttle();

  const url = new URL(`${BASE_URL}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { "User-Agent": "skating-dashboard-sync (contact: stijn@futureflowai.nl)" },
    });
  } catch (err) {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
      return getJson(path, params, schema, attempt + 1);
    }
    throw new SsrApiError(`Network error fetching ${url}: ${err}`, path);
  }

  if (!response.ok) {
    if (response.status >= 500 && attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
      return getJson(path, params, schema, attempt + 1);
    }
    throw new SsrApiError(`SSR API ${response.status} for ${url}`, path, response.status);
  }

  const body = await response.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new SsrApiError(`Unexpected shape from ${url}: ${parsed.error.message}`, path, response.status);
  }
  return parsed.data;
}

import {
  ssrPersonalRecordsResponseSchema,
  ssrSkaterResultsResponseSchema,
  ssrTopNResponseSchema,
  ssrTrackCompetitionsResponseSchema,
  ssrRecordsResponseSchema,
  ssrSkaterLookupResponseSchema,
} from "./schemas";

export const ssrApi = {
  personalRecords: (skater: number) =>
    getJson("personal_records", { skater }, ssrPersonalRecordsResponseSchema),

  skaterResults: (skater: number, distance: number, season?: number) =>
    getJson("skater_results.php", { skater, distance, season }, ssrSkaterResultsResponseSchema),

  topN: (opts: {
    gender: "m" | "f";
    season?: number;
    distance?: number;
    skater?: "y" | "n";
    max?: number;
    country?: string;
    track?: number;
    age?: string;
  }) => getJson("topn.php", opts, ssrTopNResponseSchema),

  trackCompetitions: (track: number, season?: number) =>
    getJson("track_competitions.php", { track, season }, ssrTrackCompetitionsResponseSchema),

  worldRecords: () => getJson("world_records", {}, ssrRecordsResponseSchema),
  olympicRecords: () => getJson("olympic_records", {}, ssrRecordsResponseSchema),
  nationalRecords: (country: string) => getJson("national_records", { country }, ssrRecordsResponseSchema),

  skaterLookup: (familyname: string, country?: string) =>
    getJson("skater_lookup", { familyname, country }, ssrSkaterLookupResponseSchema),
};
