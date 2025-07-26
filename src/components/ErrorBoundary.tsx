import type { ErrorComponentProps } from "@tanstack/react-router";
import { ErrorComponent, Link, rootRouteId, useMatch, useRouter } from "@tanstack/react-router";
import { Flexbox } from "~/styles/Flexbox";
import { Button } from "./Button";

export const ErrorBoundary = ({ error }: ErrorComponentProps) => {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  const tryAgain = () => {
    void router.invalidate();
  };

  console.error(error);

  return (
    <div className="max-w-[900px] mx-auto mt-8">
      <ErrorComponent error={error} />
      <Flexbox direction="row" align="center">
        <Button onClick={tryAgain} text="Try Again" />
        {isRoot ? (
          <Link to="/">Home</Link>
        ) : (
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            Go Back
          </Link>
        )}
      </Flexbox>
    </div>
  );
};
