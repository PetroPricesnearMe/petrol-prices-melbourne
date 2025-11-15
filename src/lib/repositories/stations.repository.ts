import { baserowService } from '@/lib/services/baserow.service';
import type { PetrolStation, SearchFilters } from '@/types/index';
import { calculateDistance } from '@/utils/geo';

/**
 * Stations Repository
 * Handles data access for petrol stations
 */
export const stationsRepository = {
  /**
   * Find all stations with optional filters
   */
  findAll: async (filters?: SearchFilters): Promise<PetrolStation[]> => {
    try {
      const stations = await baserowService.getStations();

      let filtered = stations;

      // Apply filters
      if (filters?.fuelType) {
        filtered = filtered.filter((station) =>
          station.fuelPrices?.some((fp) => fp.fuelType === filters.fuelType)
        );
      }

      if (filters?.minPrice || filters?.maxPrice) {
        filtered = filtered.filter((station) => {
          const prices =
            station.fuelPrices?.map((fp) => fp.pricePerLiter) || [];
          const minStationPrice = Math.min(...prices);

          if (filters.minPrice && minStationPrice < filters.minPrice)
            return false;
          if (filters.maxPrice && minStationPrice > filters.maxPrice)
            return false;

          return true;
        });
      }

      if (filters?.brands && filters.brands.length > 0) {
        filtered = filtered.filter((station) =>
          station.brand?.some((b) => filters.brands?.includes(b))
        );
      }

      // Apply sorting
      if (filters?.sortBy === 'price_low_high') {
        filtered.sort((a, b) => {
          const pricesA = a.fuelPrices?.map((fp) => fp.pricePerLiter) || [];
          const pricesB = b.fuelPrices?.map((fp) => fp.pricePerLiter) || [];
          return Math.min(...pricesA) - Math.min(...pricesB);
        });
      }

      return filtered;
    } catch (error) {
      console.error('Error finding stations:', error);
      throw new Error('Failed to fetch stations');
    }
  },

  /**
   * Find station by ID
   */
  findById: async (id: number): Promise<PetrolStation | null> => {
    try {
      const station = await baserowService.getStationById(id);
      return station;
    } catch (error) {
      console.error('Error finding station:', error);
      return null;
    }
  },

  /**
   * Find stations near a location
   */
  findNearby: async (
    lat: number,
    lng: number,
    radiusKm: number
  ): Promise<PetrolStation[]> => {
    try {
      const allStations = await baserowService.getStations();

      const nearbyStations = allStations
        .map((station) => {
          const distance = calculateDistance(
            { lat, lng },
            { lat: station.latitude, lng: station.longitude }
          );

          return {
            ...station,
            distance,
          };
        })
        .filter((station) => station.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);

      return nearbyStations;
    } catch (error) {
      console.error('Error finding nearby stations:', error);
      throw new Error('Failed to fetch nearby stations');
    }
  },

  /**
   * Create a new station
   */
  create: async (station: Partial<PetrolStation>): Promise<PetrolStation> => {
    try {
      const newStation = await baserowService.createStation(station);
      return newStation;
    } catch (error) {
      console.error('Error creating station:', error);
      throw new Error('Failed to create station');
    }
  },

  /**
   * Update a station
   */
  update: async (
    id: number,
    data: Partial<PetrolStation>
  ): Promise<PetrolStation> => {
    try {
      const updatedStation = await baserowService.updateStation(id, data);
      return updatedStation;
    } catch (error) {
      console.error('Error updating station:', error);
      throw new Error('Failed to update station');
    }
  },

  /**
   * Delete a station
   */
  delete: async (id: number): Promise<void> => {
    try {
      await baserowService.deleteStation(id);
    } catch (error) {
      console.error('Error deleting station:', error);
      throw new Error('Failed to delete station');
    }
  },
};
