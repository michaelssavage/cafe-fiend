import clsx from "clsx";
import { ReactElement } from "react";
import { Flexbox } from "~/styles/Flexbox";
import { Spinner } from "./atoms/Spinner";

export const heartStyles = "bg-white border border-black hover:bg-red-200";
export const flagStyles = "bg-white border border-black hover:bg-green-200";
export const hideStyles =
  "text-teal-500 bg-white border border-teal-500 hover:text-white hover:bg-blue-400 [&_svg]:hover:text-white";

export type Variants = "primary" | "secondary" | "clear" | "link" | "custom";

interface ButtonI {
  text?: string;
  icon?: ReactElement;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  variant?: Variants;
  custom?: string; // Tailwind classes as a string
  disabled?: boolean;
}

export const Button = ({
  type = "button",
  icon,
  text,
  loading = false,
  disabled = false,
  variant = "primary",
  custom = "",
  onClick,
}: ButtonI) => {
  const base =
    "rounded px-2 py-1 text-base font-medium font-inherit transition-all grid place-items-center cursor-pointer";

  const variants: Record<Variants, string> = {
    primary:
      "bg-white border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white",
    secondary:
      "bg-indigo-500 border border-transparent text-white hover:bg-white hover:text-indigo-500 hover:border-indigo-500",
    clear:
      "bg-white border border-gray-800 rounded-full text-gray-800 p-1 hover:bg-gray-100",
    link: "bg-transparent border-none text-indigo-500 hover:underline px-2 py-1",
    custom: custom,
  };

  const finalClass = clsx(
    base,
    variant !== "custom" ? variants[variant] : custom
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={finalClass}
    >
      {loading ? (
        <Spinner size={12} />
      ) : (
        <Flexbox direction="row">
          {icon} {text}
        </Flexbox>
      )}
    </button>
  );
};
