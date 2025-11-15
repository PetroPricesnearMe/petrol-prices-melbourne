'use client';

import { useEffect, useState } from 'react';

import type { Coordinates, GeolocationState } from '@/types/index';

/**
 * Custom hook to get user's geolocation
 * @returns Geolocation state with coordinates, loading, and error
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      });
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setState({
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        loading: false,
        error: null,
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setState({
        coordinates: null,
        loading: false,
        error: error.message,
      });
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  }, []);

  return state;
}
