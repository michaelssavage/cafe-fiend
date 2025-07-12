/** Spinner.tsx */
import { keyframes, SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";

interface StyledI {
  size: number;
  styles?: SerializedStyles;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const StyledSpinner = styled.div<StyledI>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border: ${({ size }) => `${size / 8}px`} solid rgba(0, 0, 0, 0.1);
  border-top: ${({ size }) => `${size / 8}px`} solid currentColor;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  ${({ styles }) => styles}
`;

interface SpinnerI {
  size?: number;
  styles?: SerializedStyles;
}

export const Spinner = ({ size = 24, styles }: SpinnerI) => (
  <StyledSpinner
    id="loading-spinner"
    size={size}
    role="status"
    styles={styles}
  />
);
