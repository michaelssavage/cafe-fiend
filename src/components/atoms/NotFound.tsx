import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";
import { Flexbox } from "~/styles/Flexbox";
import { Button } from "../Button";

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <div>
      {children ?? <p>The page you are looking for does not exist.</p>}
      <Flexbox direction="row">
        <Button onClick={() => window.history.back()} text="Go back" />
        <Link to="/">Start Over</Link>
      </Flexbox>
    </div>
  );
}
