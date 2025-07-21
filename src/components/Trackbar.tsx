import { Range, Root, Thumb, Track } from "@radix-ui/react-slider";
import { cn } from "~/lib/utils";

interface SliderProps {
  id: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onValueChange: (value: Array<number>) => void;
  className?: string;
}

export const Trackbar = ({
  id,
  label,
  min = 200,
  max = 10_000,
  step = 100,
  value,
  onValueChange,
  className,
}: SliderProps) => {
  return (
    <div className={cn("flex flex-row items-center gap-1", className)}>
      {label && <label htmlFor={id}>{label}:</label>}
      <div className="flex flex-row items-center gap-2.5 border border-gray-300 rounded h-[30px] px-1">
        <span>{min / 1000}km</span>
        <Root
          min={min}
          max={max}
          step={step}
          value={[value]}
          form={id}
          onValueChange={onValueChange}
          className="relative flex items-center select-none touch-none w-[100px] h-5"
        >
          <Track className="bg-gray-800 relative flex-grow rounded-full h-[3px]">
            <Range className="absolute bg-gray-800 rounded-full h-full" />
          </Track>
          <Thumb className="block w-5 h-5 bg-indigo-500 shadow-[0_2px_10px_theme(colors.gray.800)] rounded-[10px] cursor-grab hover:bg-indigo-600 focus:outline-none" />
        </Root>
        <span>{max / 1000}km</span>
      </div>
    </div>
  );
};
