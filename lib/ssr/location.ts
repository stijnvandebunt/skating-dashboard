/**
 * SSR formats locations as "City (CTY)" or "City-Suffix (CTY)" for tracks
 * that share a city (e.g. "Beijing-National (CHN)"). Used to match a result
 * back to our static tracks table, since skater_results/personal_records
 * don't carry a track id directly.
 */
export function parseSsrLocation(location: string): { city: string; country: string } | null {
  const match = location.trim().match(/^(.+?)\s*\(([A-Z]{3})\)$/);
  if (!match) return null;
  return { city: match[1].trim(), country: match[2] };
}
