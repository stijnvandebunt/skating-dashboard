/**
 * Placeholder content for the homepage until the sync scripts (phase 2)
 * populate Supabase. Names are invented, not real skaters — swap this file
 * out for real Supabase queries once `results`/`records` have rows.
 */

export const mockTop5_500mMen = [
  { rank: 1, name: "Kasper Lindgren", country: "NOR", timeMs: 34_120 },
  { rank: 2, name: "Ren Kobayashi", country: "JPN", timeMs: 34_260 },
  { rank: 3, name: "Sanne Bakker", country: "NED", timeMs: 34_310 },
  { rank: 4, name: "Aleksander Kowalski", country: "POL", timeMs: 34_480 },
  { rank: 5, name: "Mees Overdijk", country: "NED", timeMs: 34_510 },
];

export const mockRecentRecords = [
  { type: "NR", country: "NED", distance: 1500, name: "Lotte Veenhoven", timeMs: 111_320, date: "2026-01-18" },
  { type: "WR", country: null, distance: 5000, name: "Kasper Lindgren", timeMs: 366_540, date: "2026-02-02" },
  { type: "TR", country: null, distance: 1000, name: "Mei Tanaka", timeMs: 68_910, date: "2026-01-25" },
];

export const mockQuickStats = [
  { label: "Rijders gevolgd", value: "48.200+" },
  { label: "Seizoenen data", value: "26" },
  { label: "Wedstrijden", value: "9.400+" },
];
