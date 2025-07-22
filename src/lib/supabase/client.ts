import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("This function can only be called on the client side");
  }

  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return document.cookie
            .split(";")
            .map((cookie) => cookie.trim().split("="))
            .filter(([name]) => name)
            .map(([name, value]) => ({
              name,
              value: decodeURIComponent(value || ""),
            }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options = {} }) => {
            document.cookie = `${name}=${encodeURIComponent(value)}; path=/; ${
              options.maxAge ? `max-age=${options.maxAge};` : ""
            } ${options.secure ? "secure;" : ""} samesite=lax`;
          });
        },
      },
    }
  );
}
