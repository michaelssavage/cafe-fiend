import { css } from "@emotion/react";
import styled from "@emotion/styled";

interface BtnI {
  variant: "primary" | "secondary";
}

export const StyledBtn = styled.button<BtnI>`
  border-radius: 8px;
  border: 1px solid #959af8;
  padding: 3px 9px;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  color: #1a1a1a;
  background-color: #fffbfb;
  cursor: pointer;
  transition: all 0.25s;

  ${({variant}) => variant === 'secondary' && css`
    
    background-color: #cbf4e2;
  `}

  &:hover {
  background-color: #646cff;
  border-color: #646cff;
  color: #fffbfb;
}

`