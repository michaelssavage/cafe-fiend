import clsx from "clsx";
import React from "react";

export interface FlexboxProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  justify?:
    | "justify-start"
    | "justify-end"
    | "justify-center"
    | "justify-between"
    | "justify-around"
    | "justify-evenly";
  align?: "items-stretch" | "items-start" | "items-end" | "items-center" | "items-baseline";
  wrap?: "flex-nowrap" | "flex-wrap" | "flex-wrap-reverse";
  gap?: string;
  width?: string;
  flex?: string;
  margin?: string;
  visibility?: "visible" | "hidden" | "collapse";
  children?: React.ReactNode;
}

export const Flexbox: React.FC<FlexboxProps> = ({
  direction = "col",
  justify,
  align,
  wrap,
  gap = "gap-1",
  width,
  flex,
  margin,
  visibility = "visible",
  children,
  className,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        "flex",
        `flex-${direction}`,
        gap,
        justify,
        align,
        wrap,
        visibility !== "visible" && `invisible`, // Tailwind doesn't have `collapse` for divs
        width,
        flex,
        margin,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
