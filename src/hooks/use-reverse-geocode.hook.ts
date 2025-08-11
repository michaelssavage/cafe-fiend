import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import type { LocationI } from "../types/global.type";

export const useReverseGeocoding = (location: LocationI | null) => {
  const [cityName, setCityName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load the geocoding library
  const geocodingLib = useMapsLibrary("geocoding");

  const getCityName = useCallback(async () => {
    // Don't proceed if location is null or geocoding library isn't loaded
    if (!location || !geocodingLib) {
      setCityName("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const geocoder = new geocodingLib.Geocoder();

      const result = await geocoder.geocode({
        location: { lat: location.lat, lng: location.lng },
      });

      if (result.results.length > 0) {
        const addressComponents = result.results[0].address_components;

        // Look for city, town, or locality
        let city = "";

        // Priority order: locality, administrative_area_level_2, administrative_area_level_1
        const cityComponent = addressComponents.find(
          (component) =>
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_2") ||
            component.types.includes("administrative_area_level_1"),
        );

        if (cityComponent) {
          city = cityComponent.long_name;
        } else {
          // Fallback to formatted address
          const formattedAddress = result.results[0].formatted_address;
          city = formattedAddress.split(",")[0]; // Take first part of address
        }

        setCityName(city);
      } else {
        setCityName("");
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      setError("Failed to get location name");
      setCityName("");
    } finally {
      setLoading(false);
    }
  }, [location, geocodingLib]);

  // Auto-fetch city name when location changes or geocoding library loads
  useEffect(() => {
    void getCityName();
  }, [getCityName]);

  return { cityName, loading, error };
};
