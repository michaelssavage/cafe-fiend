import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { OptionsI } from "~/types/global.type";

interface PillToggleI {
  text: string;
  disabled?: boolean;
  setActiveOptions: (vals: Set<OptionsI>) => void;
  activeOptions: Set<OptionsI>;
}

const options: Array<OptionsI> = ["nearby", "favorites", "wishlist", "open now"];

export const PillToggle = ({
  text,
  disabled = false,
  setActiveOptions,
  activeOptions,
}: PillToggleI) => {
  const toggleOption = (option: OptionsI) => {
    const newActiveOptions = new Set(activeOptions);
    if (newActiveOptions.has(option)) {
      newActiveOptions.delete(option);
    } else {
      newActiveOptions.add(option);
    }
    setActiveOptions(newActiveOptions);
  };

  return (
    <div className="ml-auto flex flex-col gap-1">
      {text && (
        <p className={cn("text-xs", disabled ? "text-gray-400" : "text-gray-900")}>{text}</p>
      )}
      <div className="flex items-center justify-center bg-gray-50">
        <div className="flex rounded-full border border-gray-200 bg-white">
          {options.map((option, index) => (
            <Button
              key={option}
              variant="ghost"
              size="sm"
              onClick={() => toggleOption(option)}
              className={cn(
                "px-4 py-1 text-xs transition-all duration-200 capitalize cursor-pointer",
                index === 0 ? "rounded-l-full" : "",
                index === options.length - 1 ? "rounded-r-full" : "",
                index > 0 && index < options.length - 1 ? "rounded-none" : "",
                activeOptions.has(option)
                  ? "bg-green-500 border-1 border-green-600 text-white hover:bg-green-600"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
