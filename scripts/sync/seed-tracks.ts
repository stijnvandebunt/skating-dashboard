/**
 * One-time (well, run-whenever-you-like — it's idempotent) load of the
 * static track list scraped from speedskatingresults.com/index.php?p=203
 * into the `tracks` table. SSR has no track API endpoint, so this list
 * lives in scripts/sync/data/tracks.json; refresh it by re-scraping that
 * page if new tracks appear.
 *
 * Usage: npx tsx scripts/sync/seed-tracks.ts
 */
import { upsertTracksFromStaticList } from "./lib/db";

async function main() {
  const count = await upsertTracksFromStaticList();
  console.log(`Upserted ${count} tracks.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
