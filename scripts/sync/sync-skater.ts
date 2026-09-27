/**
 * Syncs one skater's full career: every result across the six Olympic
 * distances, pulled from skater_results.php (which returns a skater's whole
 * history for a distance when `season` is omitted — no need to loop seasons).
 *
 * Usage: npx tsx scripts/sync/sync-skater.ts <skaterId> <gender>
 */
import { ssrApi } from "@/lib/ssr/client";
import { parseSkaterResults, writeParsedResults, refreshPrAndSbFlags, markSkaterSynced } from "./lib/db";

const DISTANCES = [500, 1000, 1500, 3000, 5000, 10000] as const;

export async function syncSkater(skaterId: number, gender: "m" | "f") {
  let total = 0;
  for (const distance of DISTANCES) {
    const response = await ssrApi.skaterResults(skaterId, distance);
    const parsed = parseSkaterResults(skaterId, gender, distance, response.results);
    total += await writeParsedResults(parsed);
  }
  await refreshPrAndSbFlags(skaterId);
  await markSkaterSynced(skaterId);
  return total;
}

async function main() {
  const [, , idArg, genderArg] = process.argv;
  const skaterId = Number(idArg);
  const gender = genderArg as "m" | "f";
  if (!skaterId || (gender !== "m" && gender !== "f")) {
    console.error("Usage: npx tsx scripts/sync/sync-skater.ts <skaterId> <m|f>");
    process.exit(1);
  }
  const count = await syncSkater(skaterId, gender);
  console.log(`Synced skater ${skaterId}: ${count} results written.`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
