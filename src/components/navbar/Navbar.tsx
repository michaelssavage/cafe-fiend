import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/tanstack-react-start";
import { Link } from "@tanstack/react-router";
import { Flexbox } from "~/styles/global.styles";
import { Nav } from "./Navbar.styles";

export const Navbar = () => {
  return (
    <Nav>
      <Flexbox direction="row" align="center" gap="4px">
        <Link to="/">Home</Link>
        <Link
          to="/posts"
          activeProps={{
            className: "font-bold",
          }}
        >
          Posts
        </Link>
      </Flexbox>
      <Flexbox direction="row" align="center" gap="4px">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
      </Flexbox>
    </Nav>
  );
};
