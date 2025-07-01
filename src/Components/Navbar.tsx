import { Link } from "@tanstack/react-router";
import { Flex } from "./atoms/Flex";

export const Navbar = () => {
  return (
    <Flex direction="row" gap="20px" margin="10px 20px">
      <Link to="/">Home</Link> <Link to="/about">About</Link>
    </Flex>
  );
};
