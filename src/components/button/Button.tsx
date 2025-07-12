import { ReactElement } from "react";
import { Flexbox } from "~/styles/global.styles";
import { Spinner } from "../Spinner";
import { StyledBtn } from "./Button.styled";

interface ButtonI {
  text?: string;
  icon?: ReactElement;
  loading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export const Button = ({
  type = "button",
  icon,
  text,
  loading = false,
  disabled = false,
  variant = "primary",
  onClick,
}: ButtonI) => {
  return (
    <StyledBtn
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      variant={variant}
      loading={loading}
    >
      {loading && <Spinner size={12} />}
      <Flexbox id="content" direction="row">
        {icon} {text}
      </Flexbox>
    </StyledBtn>
  );
};
