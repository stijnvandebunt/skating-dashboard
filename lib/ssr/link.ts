/**
 * SSR result links look like:
 *   http://speedskatingresults.com/index.php?p=3&e=20389&r=13&s=1598
 * `e` is the competition id, `r` the race (heat/distance-within-competition) id.
 */
export function parseSsrLink(link: string): { competitionId: number | null; raceId: number | null } {
  try {
    const url = new URL(link);
    const e = url.searchParams.get("e");
    const r = url.searchParams.get("r");
    return {
      competitionId: e ? Number(e) : null,
      raceId: r ? Number(r) : null,
    };
  } catch {
    return { competitionId: null, raceId: null };
  }
}
