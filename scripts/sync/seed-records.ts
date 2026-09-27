/**
 * Refreshes world, Olympic and national records. Safe to re-run — each type
 * (and each country, for NR) is fully replaced from a fresh API response
 * rather than merged, since these endpoints already return the complete
 * current set.
 *
 * Usage: npx tsx scripts/sync/seed-records.ts
 */
import { ssrApi } from "@/lib/ssr/client";
import { parseSsrTime } from "@/lib/ssr/time";
import type { TablesInsert } from "@/lib/db/database.types";
import { upsertSkaterStub, replaceRecords } from "./lib/db";
import countries from "./data/countries.json";

type SsrRecordEntry = {
  gender: "m" | "f";
  age?: "sr" | "jr";
  distance: number;
  time: string;
  date?: string;
  location?: string;
  skater?: { id: number; givenname: string; familyname: string; country: string };
};

async function toRows(
  type: "WR" | "OR" | "NR",
  entries: SsrRecordEntry[],
  country: string | null,
): Promise<TablesInsert<"records">[]> {
  const rows: TablesInsert<"records">[] = [];
  for (const entry of entries) {
    const timeMs = parseSsrTime(entry.time);
    if (timeMs === null) continue;

    if (entry.skater) {
      await upsertSkaterStub(entry.skater, entry.gender);
    }

    rows.push({
      type,
      country,
      gender: entry.gender,
      age: entry.age ?? "sr",
      distance: entry.distance,
      time_ms: timeMs,
      time_raw: entry.time,
      race_date: entry.date ?? null,
      skater_id: entry.skater?.id ?? null,
    });
  }
  return rows;
}

async function main() {
  const world = await ssrApi.worldRecords();
  const worldRows = await toRows("WR", world.records, null);
  await replaceRecords("WR", worldRows);
  console.log(`WR: ${worldRows.length} records.`);

  const olympic = await ssrApi.olympicRecords();
  const olympicRows = await toRows("OR", olympic.records, null);
  await replaceRecords("OR", olympicRows);
  console.log(`OR: ${olympicRows.length} records.`);

  for (const country of countries as string[]) {
    const response = await ssrApi.countryRecords(country);
    const rows = await toRows("NR", response.records, country);
    await replaceRecords("NR", rows, { country });
    console.log(`NR ${country}: ${rows.length} records.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
