/**
 * SSR formats a time as "M.SS,cc" once it passes a minute, or "SS,cc" below it
 * — never "MM:SS.cc". This parses either into whole milliseconds.
 */
export function parseSsrTime(raw: string): number | null {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(?:(\d+)\.)?(\d{1,2}),(\d{1,3})$/);
  if (!match) return null;

  const minutes = match[1] ? Number(match[1]) : 0;
  const seconds = Number(match[2]);
  const centis = match[3].padEnd(3, "0").slice(0, 3);

  return minutes * 60_000 + seconds * 1000 + Number(centis);
}

export function formatMsAsSsrTime(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  const rest = ms - minutes * 60_000;
  const seconds = Math.floor(rest / 1000);
  const centis = Math.round((rest - seconds * 1000) / 10);
  const secondsPart = `${seconds.toString().padStart(minutes > 0 ? 2 : 1, "0")},${centis
    .toString()
    .padStart(2, "0")}`;
  return minutes > 0 ? `${minutes}.${secondsPart}` : secondsPart;
}
