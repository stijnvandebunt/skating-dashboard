/**
 * Builds the skater roster by walking topn.php (skater=y mode, which returns
 * one entry per skater rather than per result) across seasons, distances and
 * genders. This is how we find skater ids to sync in full via sync-skater.ts
 * — SSR has no "list all skaters" endpoint.
 *
 * Bounded to the top `max` per season/distance/gender, which misses
 * lower-ranked skaters in older seasons; the incremental sync (current
 * season, run daily) will pick up anyone new as they place.
 *
 * Usage: npx tsx scripts/sync/discover-skaters.ts [fromSeason] [toSeason]
 */
import { ssrApi } from "@/lib/ssr/client";
import { upsertSkaterStubs } from "./lib/db";
import { seasonForDate } from "@/lib/ssr/season";

const DISTANCES = [500, 1000, 1500, 3000, 5000, 10000] as const;
const GENDERS = ["m", "f"] as const;
const MAX_PER_QUERY = 100;

async function main() {
  const currentSeason = seasonForDate(new Date().toISOString().slice(0, 10));
  const fromSeason = Number(process.argv[2] ?? 2015);
  const toSeason = Number(process.argv[3] ?? currentSeason);

  const seen = new Set<number>();

  for (let season = fromSeason; season <= toSeason; season++) {
    for (const gender of GENDERS) {
      for (const distance of DISTANCES) {
        const response = await ssrApi.topN({ gender, season, distance, skater: "y", max: MAX_PER_QUERY });
        const fresh = response.topn.filter((entry) => !seen.has(entry.skater.id));
        for (const entry of fresh) seen.add(entry.skater.id);
        await upsertSkaterStubs(fresh.map((entry) => ({ skater: entry.skater, gender })));
        console.log(
          `${season}/${season + 1} ${gender} ${distance}m: ${response.topn.length} entries, ${seen.size} skaters total`,
        );
      }
    }
  }

  console.log(`Done. ${seen.size} unique skaters discovered.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
