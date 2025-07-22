import { createServerClient } from "@supabase/ssr";
import { parseCookies, setCookie } from "@tanstack/react-start/server";

interface Cookie {
  name: string;
  value: string;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
}

const options = {
  cookies: {
    getAll() {
      const cookies = parseCookies();
      console.log("Server - getAll: Parsed cookies:", cookies); // Debugging line
      return Object.entries(cookies).map(([name, value]) => ({
        name,
        value,
      }));
    },
    setAll(cookiesToSet: Array<Cookie>) {
      console.log("Server - setAll: Setting cookies:", cookiesToSet); // Debugging line
      cookiesToSet.forEach((cookie) => {
        setCookie(cookie.name, cookie.value, {
          expires: cookie.expires,
          path: cookie.path,
          domain: cookie.domain,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite,
          maxAge: cookie.maxAge,
        });
      });
    },
    remove(name: string) {
      console.log("Server - remove: Removing cookie:", name);
      setCookie(name, "", { expires: new Date(0), path: "/" });
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
