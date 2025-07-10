import { createFileRoute } from "@tanstack/react-router";
import { logoutFn } from "~/functions/logout.fn";

export const Route = createFileRoute("/logout")({
  preload: false,
  loader: () => logoutFn(),
});
