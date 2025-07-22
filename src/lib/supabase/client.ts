// src/lib/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

const supabase: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  return (
    supabase ??
    createClient(
      import.meta.env.VITE_SUPABASE_PROJECT_URL as string,
      import.meta.env.VITE_SUPABASE_KEY as string
    )
  );
}
