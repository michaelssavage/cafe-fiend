import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/lib/supabase";

export const loginFn = createServerFn({ method: "POST" })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }
  });
