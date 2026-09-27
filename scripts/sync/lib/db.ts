import "./env";
import { createSupabaseAdminClient } from "@/lib/db/admin-client";
import type { TablesInsert } from "@/lib/db/database.types";
import { findTrackIdForLocation } from "./tracks";
import { seasonForDate } from "@/lib/ssr/season";
import { parseSsrTime } from "@/lib/ssr/time";
import { parseSsrLink } from "@/lib/ssr/link";

export const db = createSupabaseAdminClient();

export async function upsertTracksFromStaticList() {
  const { allTracks } = await import("./tracks");
  const rows: TablesInsert<"tracks">[] = allTracks().map((t) => ({
    id: t.id,
    name: t.name,
    country: t.country,
    city: t.name,
  }));
  const { error } = await db.from("tracks").upsert(rows, { onConflict: "id" });
  if (error) throw error;
  return rows.length;
}

export async function upsertSkaterStub(
  skater: { id: number; givenname: string; familyname: string; country: string },
  gender: "m" | "f",
) {
  const { slugForSkater } = await import("./slug");
  const row: TablesInsert<"skaters"> = {
    id: skater.id,
    slug: slugForSkater(skater.givenname, skater.familyname, skater.country, skater.id),
    given_name: skater.givenname,
    family_name: skater.familyname,
    country: skater.country,
    gender,
  };
  // Insert-only: never clobber a skater we've already enriched (category,
  // birthdate, ...) with a bare stub from records/topn discovery.
  const { error } = await db.from("skaters").upsert(row, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw error;
}

export async function upsertSkaterDetails(skater: {
  id: number;
  givenname: string;
  familyname: string;
  country: string;
  gender: "m" | "f";
  category?: string;
}) {
  const { slugForSkater } = await import("./slug");
  const row: TablesInsert<"skaters"> = {
    id: skater.id,
    slug: slugForSkater(skater.givenname, skater.familyname, skater.country, skater.id),
    given_name: skater.givenname,
    family_name: skater.familyname,
    country: skater.country,
    gender: skater.gender,
    category: skater.category ?? null,
  };
  const { error } = await db.from("skaters").upsert(row, { onConflict: "id" });
  if (error) throw error;
}

export async function markSkaterSynced(skaterId: number) {
  const { error } = await db
    .from("skaters")
    .update({ last_synced_at: new Date().toISOString() })
    .eq("id", skaterId);
  if (error) throw error;
}

type CompetitionUpsert = {
  id: number;
  name: string;
  date: string; // one known race date for this competition
  trackId?: number | null;
  ssrLink?: string | null;
};

/**
 * Competitions are encountered one result at a time, so a single sync pass
 * only ever sees one date for a multi-day meet. Read-merge-write against
 * whatever's already stored so start/end widen over time instead of
 * flip-flopping to whichever result happened to sync last.
 */
export async function upsertCompetitionsMerged(competitions: CompetitionUpsert[]) {
  if (competitions.length === 0) return;
  const ids = [...new Set(competitions.map((c) => c.id))];
  const { data: existing, error: selectError } = await db
    .from("competitions")
    .select("id, start_date, end_date, track_id")
    .in("id", ids);
  if (selectError) throw selectError;

  const existingById = new Map(existing?.map((row) => [row.id, row]) ?? []);
  const merged = new Map<number, TablesInsert<"competitions">>();

  for (const comp of competitions) {
    const prior = merged.get(comp.id) ?? existingById.get(comp.id);
    const startDate = prior?.start_date && prior.start_date < comp.date ? prior.start_date : comp.date;
    const endDate =
      prior?.end_date && prior.end_date > comp.date ? prior.end_date : (prior?.end_date ?? comp.date);
    merged.set(comp.id, {
      id: comp.id,
      name: comp.name,
      season: seasonForDate(comp.date),
      start_date: startDate,
      end_date: endDate > startDate ? endDate : startDate,
      track_id: comp.trackId ?? prior?.track_id ?? null,
      ssr_link: comp.ssrLink ?? null,
    });
  }

  const { error } = await db.from("competitions").upsert([...merged.values()], { onConflict: "id" });
  if (error) throw error;
}

type RaceKey = { competitionId: number; ssrRaceId: number | null; distance: number; gender: "m" | "f" };

/** Upserts races and returns a lookup from race key -> races.id, for linking results. */
export async function upsertRacesAndGetIds(races: RaceKey[]): Promise<Map<string, number>> {
  const keyOf = (r: RaceKey) => `${r.competitionId}|${r.ssrRaceId}|${r.distance}|${r.gender}`;
  const unique = new Map(races.map((r) => [keyOf(r), r]));
  if (unique.size === 0) return new Map();

  const rows: TablesInsert<"races">[] = [...unique.values()].map((r) => ({
    competition_id: r.competitionId,
    ssr_race_id: r.ssrRaceId,
    distance: r.distance,
    gender: r.gender,
  }));

  const { data, error } = await db
    .from("races")
    .upsert(rows, { onConflict: "competition_id,ssr_race_id,distance,gender" })
    .select("id, competition_id, ssr_race_id, distance, gender");
  if (error) throw error;

  const keyToId = new Map<string, number>();
  for (const row of data ?? []) {
    keyToId.set(
      keyOf({
        competitionId: row.competition_id,
        ssrRaceId: row.ssr_race_id,
        distance: row.distance,
        gender: row.gender as "m" | "f",
      }),
      row.id,
    );
  }
  return keyToId;
}

export type ParsedResult = {
  skaterId: number;
  gender: "m" | "f";
  distance: number;
  timeMs: number;
  timeRaw: string;
  raceDate: string;
  competitionId: number | null;
  raceId: number | null; // ssr race id, from the link
  trackId: number | null;
  name: string;
  ssrLink: string | null;
};

/** Turns raw SSR result rows into typed, parsed results — skips rows whose
 * time can't be parsed (DNF/DQ/blank) rather than failing the whole batch. */
export function parseSkaterResults(
  skaterId: number,
  gender: "m" | "f",
  distance: number,
  results: { time: string; date: string; location?: string; name?: string; link?: string }[],
): ParsedResult[] {
  const parsed: ParsedResult[] = [];
  for (const r of results) {
    const timeMs = parseSsrTime(r.time);
    if (timeMs === null) continue;
    const { competitionId, raceId } = r.link ? parseSsrLink(r.link) : { competitionId: null, raceId: null };
    parsed.push({
      skaterId,
      gender,
      distance,
      timeMs,
      timeRaw: r.time,
      raceDate: r.date,
      competitionId,
      raceId,
      trackId: r.location ? findTrackIdForLocation(r.location) : null,
      name: r.name ?? "Onbekende wedstrijd",
      ssrLink: r.link ?? null,
    });
  }
  return parsed;
}

/** Writes a batch of parsed results for one skater: upserts the
 * competitions and races they reference, then the results themselves. */
export async function writeParsedResults(results: ParsedResult[]) {
  const withCompetition = results.filter((r) => r.competitionId !== null);

  await upsertCompetitionsMerged(
    withCompetition.map((r) => ({
      id: r.competitionId!,
      name: r.name,
      date: r.raceDate,
      trackId: r.trackId,
    })),
  );

  const raceIdByKey = await upsertRacesAndGetIds(
    withCompetition.map((r) => ({
      competitionId: r.competitionId!,
      ssrRaceId: r.raceId,
      distance: r.distance,
      gender: r.gender,
    })),
  );

  const rows: TablesInsert<"results">[] = results.map((r) => ({
    skater_id: r.skaterId,
    race_id: r.competitionId
      ? (raceIdByKey.get(`${r.competitionId}|${r.raceId}|${r.distance}|${r.gender}`) ?? null)
      : null,
    competition_id: r.competitionId,
    track_id: r.trackId,
    distance: r.distance,
    gender: r.gender,
    season: seasonForDate(r.raceDate),
    time_ms: r.timeMs,
    time_raw: r.timeRaw,
    race_date: r.raceDate,
    ssr_link: r.ssrLink,
  }));

  if (rows.length === 0) return 0;
  const { error } = await db
    .from("results")
    .upsert(rows, { onConflict: "skater_id,distance,race_date,time_ms,competition_id", ignoreDuplicates: true });
  if (error) throw error;
  return rows.length;
}

/** Recomputes is_pr/is_sb flags for one skater. Cheap enough to run after
 * every sync — it's a handful of rows per distance, not the whole table. */
export async function refreshPrAndSbFlags(skaterId: number) {
  const { data: rows, error } = await db
    .from("results")
    .select("id, distance, season, time_ms")
    .eq("skater_id", skaterId);
  if (error) throw error;
  if (!rows || rows.length === 0) return;

  const prByDistance = new Map<number, { id: number; time_ms: number }>();
  const sbBySeasonDistance = new Map<string, { id: number; time_ms: number }>();

  for (const row of rows) {
    const currentPr = prByDistance.get(row.distance);
    if (!currentPr || row.time_ms < currentPr.time_ms) prByDistance.set(row.distance, row);

    const sbKey = `${row.season}|${row.distance}`;
    const currentSb = sbBySeasonDistance.get(sbKey);
    if (!currentSb || row.time_ms < currentSb.time_ms) sbBySeasonDistance.set(sbKey, row);
  }

  const prIds = new Set([...prByDistance.values()].map((r) => r.id));
  const sbIds = new Set([...sbBySeasonDistance.values()].map((r) => r.id));

  await db.from("results").update({ is_pr: false }).eq("skater_id", skaterId).eq("is_pr", true);
  await db.from("results").update({ is_sb: false }).eq("skater_id", skaterId).eq("is_sb", true);
  if (prIds.size > 0) await db.from("results").update({ is_pr: true }).in("id", [...prIds]);
  if (sbIds.size > 0) await db.from("results").update({ is_sb: true }).in("id", [...sbIds]);
}

export async function replaceRecords(
  type: "WR" | "OR" | "NR",
  rows: TablesInsert<"records">[],
  scope: { country?: string } = {},
) {
  let del = db.from("records").delete().eq("type", type);
  if (scope.country) del = del.eq("country", scope.country);
  const { error: deleteError } = await del;
  if (deleteError) throw deleteError;

  if (rows.length === 0) return 0;
  const { error } = await db.from("records").insert(rows);
  if (error) throw error;
  return rows.length;
}

export async function getSyncState(job: string) {
  const { data, error } = await db.from("sync_state").select("*").eq("job", job).maybeSingle();
  if (error) throw error;
  return data;
}

export async function setSyncState(
  job: string,
  fields: { cursor?: unknown; status?: string; last_error?: string | null },
) {
  const { error } = await db.from("sync_state").upsert(
    {
      job,
      cursor: fields.cursor as never,
      status: fields.status ?? "idle",
      last_error: fields.last_error ?? null,
      last_run_at: new Date().toISOString(),
    },
    { onConflict: "job" },
  );
  if (error) throw error;
}
