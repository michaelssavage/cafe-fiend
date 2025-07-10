import { Link } from "@tanstack/react-router";
import { Flexbox } from "~/styles/global.styles";
import { Nav } from "./Navbar.styled";

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
    </Nav>
  );
};
