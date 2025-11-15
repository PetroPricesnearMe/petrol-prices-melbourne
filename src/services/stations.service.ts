import { api } from '@/lib/api/client';
import type {
  PaginatedResponse,
  PetrolStation,
  SearchFilters,
} from '@/types/index';

/**
 * Stations Service
 * Handles all station-related API calls
 */
export const stationsService = {
  /**
   * Get all stations with optional filters
   */
  getStations: async (
    filters?: SearchFilters
  ): Promise<PaginatedResponse<PetrolStation>> => {
    const params = new URLSearchParams();

    if (filters?.fuelType) params.append('fuelType', filters.fuelType);
    if (filters?.maxDistance)
      params.append('maxDistance', filters.maxDistance.toString());
    if (filters?.minPrice)
      params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice)
      params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.brands) params.append('brands', filters.brands.join(','));

    const response = await api.get<PaginatedResponse<PetrolStation>>(
      `/stations?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single station by ID
   */
  getStationById: async (id: number): Promise<PetrolStation> => {
    const response = await api.get<PetrolStation>(`/stations/${id}`);
    return response.data;
  },

  /**
   * Get stations near a location
   */
  getStationsNearby: async (
    lat: number,
    lng: number,
    radius: number = 10
  ): Promise<PetrolStation[]> => {
    const response = await api.get<PetrolStation[]>(
      `/stations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    return response.data;
  },

  /**
   * Search stations by query
   */
  searchStations: async (query: string): Promise<PetrolStation[]> => {
    const response = await api.get<PetrolStation[]>(
      `/stations/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },
};
