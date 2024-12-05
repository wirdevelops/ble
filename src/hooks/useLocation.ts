import { useState, useEffect } from 'react';

export interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

export interface LocationError {
  code: number;
  message: string;
}

interface UseLocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  updateInterval?: number;
}

export function useLocation(options: UseLocationOptions = {}) {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isWatching, setIsWatching] = useState(false);

  const {
    enableHighAccuracy = true,
    timeout = 5000,
    maximumAge = 0,
    updateInterval = 10000,
  } = options;

  useEffect(() => {
    let watchId: number;

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
      setError(null);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError({
        code: error.code,
        message: error.message,
      });
    };

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser',
      });
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    );

    // Start watching position
    watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    );

    setIsWatching(true);

    // Cleanup
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        setIsWatching(false);
      }
    };
  }, [enableHighAccuracy, timeout, maximumAge, updateInterval]);

  return { location, error, isWatching };
}
