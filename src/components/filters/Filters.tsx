import { useCallback } from "react";
import { SingleValue } from "react-select";
import { Flexbox } from "~/styles/global.styles";
import { FiltersI, SelectType, SetState } from "~/types/global.type";
import { RATING_OPTIONS, REVIEWS_OPTIONS } from "~/utils/constants";
import { SelectForm } from "../form/SelectForm";
import { Trackbar } from "../track-bar/Trackbar";

interface FiltersComponentI {
  filters: FiltersI;
  setFilters: SetState<FiltersI>;
}

export const Filters = ({ filters, setFilters }: FiltersComponentI) => {
  const handleFilter = useCallback(
    (key: string, v?: SingleValue<SelectType>) => {
      setFilters((prev: FiltersI) => ({
        ...prev,
        [key]: v?.value,
      }));
    },
    [setFilters]
  );

  const handleSlider = useCallback(
    (key: string, v: number) => {
      setFilters((prev: FiltersI) => ({ ...prev, [key]: v }));
    },
    [setFilters]
  );

  return (
    <Flexbox direction="row" gap="1rem" margin="1rem 0">
      <SelectForm<SelectType | undefined>
        id="review-select"
        label="Reviews"
        value={REVIEWS_OPTIONS.find(({ value }) => value === filters.reviews)}
        options={REVIEWS_OPTIONS}
        onChange={(r) => handleFilter("reviews", r as SingleValue<SelectType>)}
      />

      <SelectForm<SelectType | undefined>
        id="ratings-select"
        label="Ratings"
        value={RATING_OPTIONS.find(({ value }) => value === filters.rating)}
        options={RATING_OPTIONS}
        onChange={(r) => handleFilter("rating", r as SingleValue<SelectType>)}
      />

      <Trackbar
        id="radius-slider"
        label="Distance"
        value={filters.radius}
        onValueChange={(val) => handleSlider("radius", val[0])}
      />
    </Flexbox>
  );
};
