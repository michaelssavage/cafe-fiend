import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";
import { Flexbox } from "~/styles/global.styles";
import { Button } from "./button/Button";

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <div>
      <div>
        {children ?? <p>The page you are looking for does not exist.</p>}
      </div>
      <Flexbox direction="row">
        <Button onClick={() => window.history.back()} text="Go back" />
        <Link
          to="/"
          className="bg-cyan-600 text-white px-2 py-1 rounded uppercase font-black text-sm"
        >
          Start Over
        </Link>
      </Flexbox>
    </div>
  );
}
