import { KeyboardEvent, useState } from "react";
import { cn } from "~/utils/class-names";

interface ToggleSwitchProps {
  text?: string;
  disabled?: boolean;
  onColor?: string;
  offColor?: string;
  onChange: (isOn: boolean) => void;
  value: boolean;
}

export default function ToggleSwitch({
  text,
  disabled = false,
  onColor = "bg-blue-500",
  offColor = "bg-gray-300",
  onChange,
  value = false,
}: ToggleSwitchProps) {
  const [isOn, setIsOn] = useState(value);

  const handleToggle = () => {
    if (disabled) return;

    const newValue = !isOn;
    setIsOn(newValue);
    onChange(newValue);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="ml-auto flex flex-row items-center gap-1">
      {text && (
        <label className={cn("text-xs", disabled ? "text-gray-400" : "text-gray-900")}>
          {text}
        </label>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          "cursor-pointer relative inline-flex h-6 w-15 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
          isOn ? onColor : offColor,
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out",
            isOn ? "translate-x-10" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}
