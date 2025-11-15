'use client';

import { useQuery } from '@tanstack/react-query';

import { stationsService } from '@/services/stations.service';
import type { SearchFilters } from '@/types/index';

/**
 * Custom hook to fetch stations with filters
 * @param filters - Search filters
 * @returns Query result with stations data
 */
export function useStations(filters?: SearchFilters) {
  return useQuery({
    queryKey: ['stations', filters],
    queryFn: () => stationsService.getStations(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Custom hook to fetch a single station by ID
 * @param id - Station ID
 * @returns Query result with station data
 */
export function useStation(id: number) {
  return useQuery({
    queryKey: ['station', id],
    queryFn: () => stationsService.getStationById(id),
    enabled: !!id,
  });
}

/**
 * Custom hook to fetch nearby stations
 * @param lat - Latitude
 * @param lng - Longitude
 * @param radius - Search radius in kilometers
 * @returns Query result with nearby stations
 */
export function useNearbyStations(lat?: number, lng?: number, radius?: number) {
  return useQuery({
    queryKey: ['stations', 'nearby', lat, lng, radius],
    queryFn: () => stationsService.getStationsNearby(lat!, lng!, radius),
    enabled: !!lat && !!lng,
  });
}
