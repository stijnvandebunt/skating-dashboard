/** Refreshes the Adelskalender materialized view. Run after any sync that
 * touches `results` — it doesn't update itself. */
import { db } from "./lib/db";

export async function refreshAdelskalender() {
  const { error } = await db.rpc("refresh_mv_adelskalender" as never);
  if (error) throw error;
}

if (require.main === module) {
  refreshAdelskalender()
    .then(() => console.log("mv_adelskalender refreshed."))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
