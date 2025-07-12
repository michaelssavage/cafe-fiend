import styled from "@emotion/styled";

export interface FlexboxProps {
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
}

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

export const Flexbox = styled.div<FlexboxProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction ?? "column"};
  gap: ${({ gap }) => gap ?? "10px"};
  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};
  flex-wrap: ${({ wrap }) => wrap};
  width: ${({ width }) => width};
  margin: ${({ margin }) => margin};
  flex: ${({ flex }) => flex};
  visibility: ${({ visibility }) => visibility ?? "visible"};
`;
