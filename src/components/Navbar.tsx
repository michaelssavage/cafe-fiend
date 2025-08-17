import { Link, useRouter } from "@tanstack/react-router";
import { getSupabaseClient } from "~/lib/supabase-client";
import { Flexbox } from "~/styles/Flexbox";
import { UserI } from "~/types/user.type";
import { Button } from "./Button";

export const Navbar = ({ user }: { user: UserI }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    await router.navigate({ to: "/" });
  };

  return (
    <nav className="z-[1000] px-8 py-4 bg-white border-t border-gray-200 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
      <Flexbox direction="row" align="items-center" width="100%">
        <Flexbox direction="row" align="items-center" gap="gap-5" margin="mr-auto">
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <Link to="/saved" className="text-blue-600 hover:underline">
            Saved
          </Link>
        </Flexbox>

        {user && <Button variant="link" text="Logout" onClick={() => void handleLogout()} />}
      </Flexbox>
    </nav>
  );
};
