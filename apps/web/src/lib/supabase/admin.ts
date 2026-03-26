import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../lib/supabase/types";

/**
 * Admin client — sadece server-side API route'larında kullan.
 * RLS'i bypass eder (service_role key).
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
