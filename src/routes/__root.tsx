/// <reference types="vite/client" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Head } from "~/components/atoms/Head";
import { NotFound } from "~/components/atoms/NotFound";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { Navbar } from "~/components/Navbar";
import { ThemeProvider } from "~/context/theme-provider.context";
import { getSupabaseClient } from "~/lib/supabase/client";
import { getSupabaseServerClient } from "~/lib/supabase/server";
import { RootUserI } from "~/types/user.type";

const queryClient = new QueryClient();

const fetchUserFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user?.email) return null;

  return {
    email: data.user.email,
  };
});

function RootDocument({ children, user }: RootUserI) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="top-right" />
        <Scripts />
        <Navbar user={user} />
      </body>
    </html>
  );
}

export const Route = createRootRoute({
  beforeLoad: async () => {
    let user = await fetchUserFn();

    // If no server-side user, check client-side (for fresh logins)
    if (!user && typeof window !== "undefined") {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        user = { email: data.user.email };
      }
    }

    return { user };
  },
  head: Head,
  notFoundComponent: () => <NotFound />,
  errorComponent: (props) => {
    return (
      <RootDocument user={null}>
        <ErrorBoundary {...props} />
      </RootDocument>
    );
  },
  component: function RootComponent() {
    const { user } = Route.useRouteContext();

    return (
      <QueryClientProvider client={queryClient}>
        <APIProvider
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}
        >
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <RootDocument user={user}>
              <Outlet />
            </RootDocument>
          </ThemeProvider>
        </APIProvider>
      </QueryClientProvider>
    );
  },
});
