/** "Jutta Leerdam" (NED, id 31536) -> "jutta-leerdam-ned-31536" — the SSR id
 * suffix guarantees uniqueness even for identical names, so this never
 * collides and never needs a lookup-and-retry. */
export function slugForSkater(givenName: string, familyName: string, country: string, ssrId: number): string {
  const base = `${givenName} ${familyName}`
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${country.toLowerCase()}-${ssrId}`;
}
