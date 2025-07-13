import { SerializedStyles } from "@emotion/react";
import { ReactElement } from "react";
import { Flexbox } from "~/styles/global.styles";
import { Spinner } from "../Spinner";
import { StyledBtn } from "./Button.styled";

export type Variants = "primary" | "secondary" | "clear" | "link" | "custom";

interface ButtonI {
  text?: string;
  icon?: ReactElement;
  loading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  variant?: Variants;
  custom?: SerializedStyles;
  disabled?: boolean;
}

export const Button = ({
  type = "button",
  icon,
  text,
  loading = false,
  disabled = false,
  variant = "primary",
  custom,
  onClick,
}: ButtonI) => {
  return (
    <StyledBtn
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      variant={variant}
      $loading={loading}
      custom={custom}
    >
      {loading && <Spinner size={12} />}
      <Flexbox id="content" direction="row">
        {icon} {text}
      </Flexbox>
    </StyledBtn>
  );
};
