import { StyledBtn } from "./Button.styled";

interface ButtonI {
  text: string;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export const Button = ({
  type = "button",
  text,
  disabled = false,
  variant = "primary",
  onClick,
}: ButtonI) => {
  return (
    <StyledBtn
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
    >
      {text}
    </StyledBtn>
  );
};
