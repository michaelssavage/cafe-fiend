import { useCallback, useState } from 'react';
import { defaultPosition } from '~/utils/constants';
import type { LocationI } from '../types/global.type';

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000 // 5 minutes
};

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationI>({ ...defaultPosition });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
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

  return { location, setLocation, error, loading, getCurrentLocation };
};