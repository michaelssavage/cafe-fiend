import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Navbar } from "../components/Navbar";

export const Route = createRootRoute({
  component: () => (
    <>
      <TanStackRouterDevtools position="top-right" />
      <Outlet />
      <hr />
      <Navbar />
    </>
  ),
});
