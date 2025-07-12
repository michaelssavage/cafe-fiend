import { css } from "@emotion/react";
import styled from "@emotion/styled";

interface BtnI {
  variant: "primary" | "secondary";
  loading: boolean;
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
  display: grid;
  place-items: center;
  position: relative;

  ${({ variant }) =>
    variant === "secondary" &&
    css`
      background-color: #cbf4e2;
    `}

  &:hover {
    background-color: #646cff;
    border-color: #646cff;
    color: #fffbfb;
  }

  #loading-spinner,
  #content {
    grid-area: 1 / 1; /* Stack spinner and content in the same grid cell */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #loading-spinner {
    visibility: hidden;
  }

  ${({ loading }) =>
    loading && css`
    #loading-spinner {
      visibility: visible;
    }

    #content {
      visibility: hidden;
    }
  `}
`;