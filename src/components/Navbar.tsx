import { Link, useRouter } from "@tanstack/react-router";
import { Flexbox } from "~/styles/Flexbox";
import { UserI } from "~/types/user.type";
import { Button } from "./Button";

export const Navbar = ({ user }: { user: UserI }) => {
  const router = useRouter();

  const handleLogout = () => {
    void router.navigate({ to: "/logout" });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] px-8 py-4 bg-white border-t border-gray-200 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
      <Flexbox
        direction="row"
        align="center"
        justify="space-between"
        gap="4px"
        width="100%"
      >
        <Flexbox direction="row" align="center" gap="4px">
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          {/* // link */}
        </Flexbox>

        {user && <Button variant="link" text="Logout" onClick={handleLogout} />}
      </Flexbox>
    </nav>
  );
};
