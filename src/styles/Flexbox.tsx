import clsx from "clsx";
import React from "react";

export interface FlexboxProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  align?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: string;
  width?: string;
  flex?: string;
  margin?: string;
  visibility?: "visible" | "hidden" | "collapse";
  children?: React.ReactNode;
}

export const Flexbox: React.FC<FlexboxProps> = ({
  direction = "column",
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
  const justifyClassMap = {
    "flex-start": "justify-start",
    "flex-end": "justify-end",
    center: "justify-center",
    "space-between": "justify-between",
    "space-around": "justify-around",
    "space-evenly": "justify-evenly",
  };

  const alignClassMap = {
    stretch: "items-stretch",
    "flex-start": "items-start",
    "flex-end": "items-end",
    center: "items-center",
    baseline: "items-baseline",
  };

  const wrapClassMap = {
    nowrap: "flex-nowrap",
    wrap: "flex-wrap",
    "wrap-reverse": "flex-wrap-reverse",
  };

  return (
    <div
      className={clsx(
        "flex",
        `flex-${direction}`,
        gap,
        justify && justifyClassMap[justify],
        align && alignClassMap[align],
        wrap && wrapClassMap[wrap],
        visibility !== "visible" && `invisible`, // Tailwind doesn't have `collapse` for divs
        width,
        flex,
        margin,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
