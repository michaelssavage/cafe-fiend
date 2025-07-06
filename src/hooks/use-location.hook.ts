import { useCallback, useState } from 'react';
import type { LocationI } from '../utils/global.types';


const initialLocation = {
  lat: 41.38879, 
  lng: 2.15899,
  accuracy: 1,
  timestamp: 0
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationI>(initialLocation);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setLoading(true);
    setError('');

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'An error occurred';
        
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timeout';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  }, []);

  return { location, error, loading, getCurrentLocation };
};