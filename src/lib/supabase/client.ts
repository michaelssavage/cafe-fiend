import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  return createClient(
    import.meta.env.VITE_SUPABASE_PROJECT_URL as string,
    import.meta.env.VITE_SUPABASE_KEY as string
  );
}
