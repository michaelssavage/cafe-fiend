/// <reference types="vite/client" />
import { ClerkProvider } from "@clerk/tanstack-react-start";
import { getAuth } from "@clerk/tanstack-react-start/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { APIProvider } from "@vis.gl/react-google-maps";
import * as React from "react";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { Head } from "~/components/Head";
import { Navbar } from "~/components/navbar/Navbar";
import { NotFound } from "~/components/NotFound.js";

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

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <APIProvider apiKey={key}>
        <ClerkProvider>
          <RootDocument>
            <Outlet />
          </RootDocument>
        </ClerkProvider>
      </APIProvider>
    </QueryClientProvider>
  );
}
const fetchClerkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const { userId } = await getAuth(getWebRequest()!);

  return {
    userId,
  };
});

export const Route = createRootRoute({
  beforeLoad: async () => {
    const { userId } = await fetchClerkAuth();
    return { userId };
  },
  head: Head,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <ErrorBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});
