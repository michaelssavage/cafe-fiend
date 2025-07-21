import { createServerClient } from "@supabase/ssr";
import { parseCookies, setCookie } from "@tanstack/react-start/server";

interface Cookie {
  name: string;
  value: string;
}

const options = {
  cookies: {
    getAll() {
      const cookies = parseCookies();
      return Object.entries(cookies).map(([name, value]) => ({
        name,
        value,
      }));
    },
    setAll(cookies: Array<Cookie>) {
      cookies.forEach((cookie) => {
        setCookie(cookie.name, cookie.value);
      });
    },
  },
};

export function getSupabaseServerClient() {
  const url =
    process.env.SUPABASE_PROJECT_URL ?? process.env.VITE_SUPABASE_PROJECT_URL;
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase project URL and key must be set in environment variables."
    );
  }

  return createServerClient(url, key, options);
}
