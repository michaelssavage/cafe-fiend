import { Range, Root, Thumb, Track } from "@radix-ui/react-slider";
import { Flexbox } from "~/styles/global.styles";
import { SlideWrapper } from "./Trackbar.styled";

interface SliderI {
  id: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onValueChange: (value: Array<number>) => void;
}

export const Trackbar = ({
  id,
  label,
  min = 200,
  max = 10_000,
  step = 100,
  value,
  onValueChange,
}: SliderI) => {
  return (
    <Flexbox gap="4px" direction="row" align="center">
      {label && <label htmlFor={id}>{label}:</label>}
      <SlideWrapper>
        <span>{min / 1000}km</span>
        <Root
          min={min}
          max={max}
          step={step}
          value={[value]}
          form={id}
          onValueChange={onValueChange}
          className="slider-root"
        >
          <Track className="slider-track">
            <Range className="slider-range" />
          </Track>
          <Thumb className="slider-thumb" />
        </Root>
        <span>{max / 1000}km</span>
      </SlideWrapper>
    </Flexbox>
  );
};
