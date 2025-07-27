/** Spinner.tsx */
import { cn } from "~/utils/class-names";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner = ({ size = 24, className }: SpinnerProps) => {
  const sizeStyles = {
    width: `${size}px`,
    height: `${size}px`,
    borderWidth: `${size / 8}px`,
  };

  return (
    <div
      id="loading-spinner"
      role="status"
      className={cn("rounded-full border-black/10 border-t-current animate-spin", className)}
      style={sizeStyles}
    />
  );
};
