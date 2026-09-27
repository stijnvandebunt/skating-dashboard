/**
 * Daily job: discover this season's skaters (cheap — 12 topn calls), sync
 * anyone new or not synced in the last day, then refresh the Adelskalender
 * view. Meant to run from a scheduled GitHub Actions workflow.
 *
 * Usage: npx tsx scripts/sync/incremental.ts
 */
import { ssrApi } from "@/lib/ssr/client";
import { seasonForDate } from "@/lib/ssr/season";
import { db, upsertSkaterStubs, setSyncState } from "./lib/db";
import { syncSkater } from "./sync-skater";
import { refreshAdelskalender } from "./refresh-views";

const DISTANCES = [500, 1000, 1500, 3000, 5000, 10000] as const;
const GENDERS = ["m", "f"] as const;

async function discoverCurrentSeason(season: number) {
  const found = new Set<number>();
  for (const gender of GENDERS) {
    for (const distance of DISTANCES) {
      const response = await ssrApi.topN({ gender, season, distance, skater: "y", max: 100 });
      const fresh = response.topn.filter((entry) => !found.has(entry.skater.id));
      for (const entry of fresh) found.add(entry.skater.id);
      await upsertSkaterStubs(fresh.map((entry) => ({ skater: entry.skater, gender })));
    }
  }
  return found;
}

async function main() {
  await setSyncState("incremental", { status: "running" });

  try {
    const season = seasonForDate(new Date().toISOString().slice(0, 10));
    const activeSkaterIds = await discoverCurrentSeason(season);
    console.log(`Discovered ${activeSkaterIds.size} skaters active in ${season}/${season + 1}.`);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: skaters, error } = await db
      .from("skaters")
      .select("id, gender, last_synced_at")
      .in("id", [...activeSkaterIds])
      .or(`last_synced_at.is.null,last_synced_at.lt.${oneDayAgo}`);
    if (error) throw error;

    let done = 0;
    for (const skater of skaters ?? []) {
      const count = await syncSkater(skater.id, skater.gender as "m" | "f");
      done++;
      console.log(`[${done}/${skaters!.length}] skater ${skater.id}: ${count} results`);
    }

    await refreshAdelskalender();
    await setSyncState("incremental", { status: "ok", cursor: { season, syncedCount: done } });
    console.log(`Incremental sync done: ${done} skaters updated.`);
  } catch (err) {
    await setSyncState("incremental", { status: "error", last_error: String(err) });
    throw err;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
