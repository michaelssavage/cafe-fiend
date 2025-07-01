import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h1>Cafe Fiend</h1>
      <p>Find your next favourite coffee</p>
    </>
  );
}
