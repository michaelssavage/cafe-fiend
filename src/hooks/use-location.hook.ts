import { useCallback, useState } from "react";
import type { LocationI } from "../types/global.type";

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes
};

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationI | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log("Geolocation success:", newLocation);

        if (isNaN(newLocation.lat) || isNaN(newLocation.lng)) {
          setError("Invalid coordinates received");
          setLoading(false);
          return;
        }

        if (
          newLocation.lat < -90 ||
          newLocation.lat > 90 ||
          newLocation.lng < -180 ||
          newLocation.lng > 180
        ) {
          setError("Coordinates out of valid range");
          setLoading(false);
          return;
        }

        setLocation(newLocation);
        setLoading(false);
      },
      (err) => {
        let errorMessage = "An error occurred";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timeout";
            break;
        }

        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  }, []);

  return { location, setLocation, error, loading, getCurrentLocation };
};
