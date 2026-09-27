/**
 * A season is named after its starting year (SSR convention: "2024" means
 * the 2024-2025 season). The season runs July through June — the World Cup
 * circuit starts in autumn and the season's championships wrap up in March,
 * well before the next one begins.
 */
export function seasonForDate(isoDate: string): number {
  const [yearStr, monthStr] = isoDate.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  return month >= 7 ? year : year - 1;
}
