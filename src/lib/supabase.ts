import { createServerClient } from "@supabase/ssr";
import { parseCookies, setCookie } from "@tanstack/react-start/server";

interface Cookie {
  name: string;
  value: string;
}

const PROJECT_URL = process.env.SUPABASE_PROJECT_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

export function getSupabaseServerClient() {
  return createServerClient(PROJECT_URL!, SUPABASE_KEY!, {
    cookies: {
      getAll() {
        return Object.entries(parseCookies()).map(([name, value]) => ({
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
  });
}
