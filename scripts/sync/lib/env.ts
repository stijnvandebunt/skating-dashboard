// Sync scripts run outside Next.js, so nothing loads .env.local for them
// automatically — do it once here and import this before anything that
// touches process.env (lib/db.ts imports it first thing).
import { config } from "dotenv";
import path from "node:path";

config({ path: path.resolve(process.cwd(), ".env.local") });
