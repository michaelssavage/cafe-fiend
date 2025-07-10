/// <reference types="vite/client" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { APIProvider } from "@vis.gl/react-google-maps";
import * as React from "react";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { Head } from "~/components/Head";
import { Navbar } from "~/components/navbar/Navbar";
import { NotFound } from "~/components/NotFound.js";
import { fetchUser } from "~/functions/fetch-user.function";

const queryClient = new QueryClient();
const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="top-right" />
        <Scripts />
        <Navbar />
      </body>
    </html>
  );
}

export const Route = createRootRoute({
  beforeLoad: async () => {
    const user = await fetchUser();
    return { user };
  },
  head: Head,
  notFoundComponent: () => <NotFound />,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <ErrorBoundary {...props} />
      </RootDocument>
    );
  },
  component: () => (
    <QueryClientProvider client={queryClient}>
      <APIProvider apiKey={key}>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </APIProvider>
    </QueryClientProvider>
  ),
});
