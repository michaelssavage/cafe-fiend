import {
  ControlPosition,
  MapControl,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Locate, LocateFixed } from "lucide-react";
import React, { FormEvent, useCallback, useState } from "react";
import { useAutocompleteSuggestions } from "~/hooks/use-auto-complete.hook";
import { useGeolocation } from "~/hooks/use-location.hook";
import { Flexbox } from "~/styles/global.styles";
import { LocationI } from "~/types/global.type";
import { Button } from "../button/Button";
import { SuggestionItem, SuggestionList, Wrapper } from "./AutoComplete.styled";

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

  const {
    error: locationError,
    loading,
    getCurrentLocation,
  } = useGeolocation();

  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places) return;
      if (!suggestion.placePrediction) return;

      const place = suggestion.placePrediction.toPlace();

      await place.fetchFields({
        fields: [
          "viewport",
          "location",
          "svgIconMaskURI",
          "iconBackgroundColor",
        ],
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
    [places, onPlaceSelect, resetSession]
  );

  return (
    <MapControl position={ControlPosition.TOP_LEFT}>
      <Wrapper>
        <Flexbox direction="row" gap="4px">
          <input
            id="search-input"
            value={inputValue}
            onInput={(event) => handleInput(event)}
            placeholder="Search for a place..."
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
          <SuggestionList>
            {suggestions.map((suggestion, index) => {
              return (
                <SuggestionItem
                  key={index}
                  onClick={() => {
                    handleSuggestionClick(suggestion).catch(console.error);
                  }}
                >
                  {suggestion.placePrediction?.text.text}
                </SuggestionItem>
              );
            })}
          </SuggestionList>
        )}
      </Wrapper>
    </MapControl>
  );
};

export default React.memo(AutoComplete);
