import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/** Read-only, public-anon client — safe to use in Server and Client Components. */
export function createSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
