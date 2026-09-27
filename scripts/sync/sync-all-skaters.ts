/**
 * Runs syncSkater() for every discovered skater that's never been synced
 * (or whose sync is older than --stale-days). At ~6 requests/skater and a
 * 1 req/s throttle, this is slow by design — use --limit to process the
 * backlog in bounded chunks (e.g. from a cron job) rather than one long run.
 *
 * Usage: npx tsx scripts/sync/sync-all-skaters.ts [--limit 200] [--stale-days 90]
 */
import { db } from "./lib/db";
import { syncSkater } from "./sync-skater";

function argValue(flag: string, fallback: number): number {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || !process.argv[idx + 1]) return fallback;
  return Number(process.argv[idx + 1]);
}

async function main() {
  const limit = argValue("--limit", 200);
  const staleDays = argValue("--stale-days", 90);
  const staleBefore = new Date(Date.now() - staleDays * 24 * 60 * 60 * 1000).toISOString();

  const { data: skaters, error } = await db
    .from("skaters")
    .select("id, gender, last_synced_at")
    .or(`last_synced_at.is.null,last_synced_at.lt.${staleBefore}`)
    .order("last_synced_at", { ascending: true, nullsFirst: true })
    .limit(limit);
  if (error) throw error;

  console.log(`Syncing ${skaters?.length ?? 0} skaters (limit ${limit}, stale after ${staleDays}d)...`);

  let done = 0;
  for (const skater of skaters ?? []) {
    try {
      const count = await syncSkater(skater.id, skater.gender as "m" | "f");
      done++;
      console.log(`[${done}/${skaters!.length}] skater ${skater.id}: ${count} results`);
    } catch (err) {
      console.error(`skater ${skater.id} failed:`, err);
    }
  }

  console.log(`Done: ${done}/${skaters?.length ?? 0} skaters synced.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
