import { ControlPosition, MapControl, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Locate, LocateFixed } from "lucide-react";
import { FormEvent, memo, useCallback, useState } from "react";
import { useAutocompleteSuggestions } from "~/hooks/use-auto-complete.hook";
import { useGeolocation } from "~/hooks/use-location.hook";
import { Flexbox } from "~/styles/Flexbox";
import { LocationI } from "~/types/global.type";
import { Button } from "./Button";

interface Props {
  onPlaceSelect: (place: LocationI) => void;
  isLoading: boolean;
}

const AutoComplete = ({ onPlaceSelect, isLoading }: Props) => {
  const places = useMapsLibrary("places");
  const [inputValue, setInputValue] = useState<string>("");
  const { suggestions, resetSession } = useAutocompleteSuggestions(inputValue);

  const handleInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    setInputValue((event.target as HTMLInputElement).value);
  }, []);

  const { error: locationError, loading, getCurrentLocation } = useGeolocation();

  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places) return;
      if (!suggestion.placePrediction) return;

      const place = suggestion.placePrediction.toPlace();

      await place.fetchFields({
        fields: ["viewport", "location", "svgIconMaskURI", "iconBackgroundColor"],
      });

      setInputValue("");
      resetSession();

      if (place.location) {
        const location = {
          lat: place.location.lat(),
          lng: place.location.lng(),
        };

        onPlaceSelect(location);
      }
    },
    [places, onPlaceSelect, resetSession],
  );

  return (
    <MapControl position={ControlPosition.TOP_LEFT}>
      <div className="my-2 mx-1">
        <Flexbox direction="row">
          <input
            id="search-input"
            value={inputValue}
            onInput={(event) => handleInput(event)}
            placeholder="Search for a place..."
            className="bg-white rounded border border-gray-800 focus:border-indigo-500 px-2 py-1 w-full"
          />
          <Button
            variant="clear"
            icon={loading ? <LocateFixed size={16} /> : <Locate size={16} />}
            onClick={getCurrentLocation}
          />
        </Flexbox>

        {isLoading && <p>Loading coffee shops...</p>}
        {locationError && <p>Failed to get user location</p>}

        {suggestions.length > 0 && (
          <ul className="bg-white border border-gray-800 list-none p-2 rounded mt-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  handleSuggestionClick(suggestion).catch(console.error);
                }}
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              >
                {suggestion.placePrediction?.text.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </MapControl>
  );
};

export default memo(AutoComplete);
