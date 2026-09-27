import tracksData from "../data/tracks.json";
import { parseSsrLocation } from "@/lib/ssr/location";

type TrackRow = { id: number; name: string; country: string };

const tracks = tracksData as TrackRow[];

function key(name: string, country: string) {
  return `${name.trim().toLowerCase()}|${country.toUpperCase()}`;
}

const trackByKey = new Map(tracks.map((t) => [key(t.name, t.country), t.id]));

export function allTracks(): TrackRow[] {
  return tracks;
}

/** Best-effort match — SSR gives us "City (CTY)" strings, not track ids, on
 * most result rows. Returns null rather than guessing when there's no exact
 * name+country match (e.g. a venue not in our static track list yet). */
export function findTrackIdForLocation(location: string): number | null {
  const parsed = parseSsrLocation(location);
  if (!parsed) return null;
  return trackByKey.get(key(parsed.city, parsed.country)) ?? null;
}
