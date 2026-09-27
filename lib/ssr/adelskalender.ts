/**
 * Classic Adelskalender: sum of 500m-averages (time / (distance/500)),
 * each truncated to 3 decimals, across the four all-round distances.
 * Mirrors the SQL in supabase/migrations/0002_views.sql — keep both in sync.
 */
export const ADELSKALENDER_DISTANCES = {
  m: [500, 1500, 5000, 10000],
  f: [500, 1500, 3000, 5000],
} as const;

export function truncate3(value: number): number {
  // nudge past float representation error (e.g. 144.633 stored as
  // 144.632999999999998) before truncating, so we don't truncate away a
  // digit that was only ever a float-storage artifact
  const EPSILON = 1e-9;
  return Math.trunc((value + EPSILON) * 1000) / 1000;
}

/** `times` maps distance (meters) to personal-record time in milliseconds. */
export function calculateAdelskalender(
  gender: "m" | "f",
  times: Partial<Record<number, number>>,
): number | null {
  const distances = ADELSKALENDER_DISTANCES[gender];
  let total = 0;
  for (const distance of distances) {
    const timeMs = times[distance];
    if (timeMs === undefined) return null; // incomplete — no Adelskalender entry
    total += truncate3(timeMs / 1000 / (distance / 500));
  }
  return truncate3(total);
}
