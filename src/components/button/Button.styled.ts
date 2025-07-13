import { css, SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { Variants } from "./Button";

interface BtnI {
  variant: Variants;
  $loading: boolean;
  custom?: SerializedStyles;
}

export const StyledBtn = styled.button<BtnI>`
  border-radius: 8px;
  padding: 3px 9px;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s;
  display: grid;
  place-items: center;
  position: relative;

  ${({ variant, custom }) => {
    if (variant === "primary") {
      return css`
        background-color: #fefefe;
        border-color: #646cff;
        color: #646cff;

        &:hover {
          background-color: #646cff;
          color: #fffbfb;
        }
      `;
    }

    if (variant === "secondary") {
      return css`
        background-color: #646cff;
        border-color: transparent;
        color: #fefefe;

        &:hover {
          background-color: #fefefe;
          border-color: #646cff;
          color: #646cff;
        }
      `;
    }

    if (variant === "clear") {
      return css`
        background-color: #ffffff;
        border: 1px solid #333333;
        border-radius: 50%;
        color: #333333;
        padding: 6px;

        &:hover {
          background-color: #f8efef;
        }
      `;
    }

    if (variant === "link") {
      return css`
        background-color: transparent;
        border: none;
        color: #646cff;
        padding: 6px;

        &:hover {
          text-decoration: underline;
        }
      `;
    }

    if (variant === "custom" && custom) {
      return custom;
    }
  }}

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

  ${({ $loading }) =>
    $loading &&
    css`
      #loading-spinner {
        visibility: visible;
      }

      #content {
        visibility: hidden;
      }
    `}
`;

export const heartStyles = css`
  background-color: #fefefe;
  border-color: #00010c;

  &:hover {
    background-color: #f5a3a3;
  }
`;

export const flagStyles = css`
  background-color: #fefefe;
  border-color: #00010c;

  &:hover {
    background-color: #a3f5b1;
  }
`;

export const hideStyles = css`
  color: #84a59d;
  background-color: #fefefe;
  border: 1px solid #84a59d;

  &:hover {
    color: #fefefe;
    background-color: #80a1c1;

    svg {
      color: #fefefe;
    }
  }
`;
