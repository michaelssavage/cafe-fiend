import styled from "@emotion/styled";

interface FlexI {
  direction?: "row" | "column";
  gap?: string;
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
  align?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around";
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  flex?: string;
  margin?: string;
}

export const Flex = styled.div<FlexI>`
  display: flex;
  flex-direction: ${({ direction }) => direction || "column"};
  gap: ${({ gap }) => gap || "10px"};
  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => align};
  flex-wrap: ${({ wrap }) => wrap};
  flex: ${({ flex }) => flex};
  margin: ${({ margin }) => margin};
`;
