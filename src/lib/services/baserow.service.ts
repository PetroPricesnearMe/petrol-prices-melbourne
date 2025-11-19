import axios from 'axios';

import type {
  BaserowPetrolStation,
  BaserowListResponse,
} from '@/types/baserow';
import type { PetrolStation } from '@/types/index';
import logger from '@/utils/logger';

const BASEROW_API_URL = process.env.BASEROW_API_URL || 'https://api.baserow.io';
const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN || '';
const PETROL_STATIONS_TABLE_ID = process.env.BASEROW_PETROL_STATIONS_TABLE_ID || '623329';

/**
 * Baserow API client
 */
const baserowClient = axios.create({
  baseURL: `${BASEROW_API_URL}/api/database/rows/table`,
  headers: {
    Authorization: `Token ${BASEROW_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Map Baserow station to application Station type
 */
function mapBaserowStation(baserowStation: BaserowPetrolStation): PetrolStation {
  return {
    id: baserowStation.id,
    stationName: baserowStation['Station Name'],
    address: baserowStation.Address,
    city: baserowStation.City,
    region: baserowStation.Region,
    postalCode: baserowStation['Postal Code'],
    country: baserowStation.Country,
    latitude: baserowStation.Latitude,
    longitude: baserowStation.Longitude,
    brand: baserowStation.brand,
    locationDetails: baserowStation['Location Details'],
  };
}

/**
 * Baserow Service
 * Handles all interactions with Baserow API
 */
export const baserowService = {
  /**
   * Get all petrol stations
   * Handles pagination to fetch all records
   */
  getStations: async (): Promise<PetrolStation[]> => {
    try {
      let allStations: BaserowPetrolStation[] = [];
      let url = `/${PETROL_STATIONS_TABLE_ID}/?size=200`;
      let hasMore = true;

      // Fetch all pages
      while (hasMore) {
        const response = await baserowClient.get<
          BaserowListResponse<BaserowPetrolStation>
        >(url);

        allStations = allStations.concat(response.data.results);

        // Check if there's a next page
        if (response.data.next) {
          // Extract the query parameters from the next URL
          const nextUrl = new URL(response.data.next);
          url = `/${PETROL_STATIONS_TABLE_ID}/${nextUrl.search}`;
          hasMore = true;
        } else {
          hasMore = false;
        }
      }

      logger.info(`Fetched ${allStations.length} stations from Baserow`);
      return allStations.map(mapBaserowStation);
    } catch (error) {
      logger.error('Error fetching stations from Baserow:', error);
      throw error;
    }
  },

  /**
   * Get a single station by ID
   */
  getStationById: async (id: number): Promise<PetrolStation | null> => {
    try {
      const response = await baserowClient.get<BaserowPetrolStation>(
        `/${PETROL_STATIONS_TABLE_ID}/${id}/`
      );

      return mapBaserowStation(response.data);
    } catch (error) {
      logger.error('Error fetching station from Baserow:', error);
      return null;
    }
  },

  /**
   * Create a new station
   */
  createStation: async (
    station: Partial<PetrolStation>
  ): Promise<PetrolStation> => {
    try {
      const baserowData = {
        'Station Name': station.stationName,
        Address: station.address,
        City: station.city,
        Region: station.region,
        'Postal Code': station.postalCode,
        Country: station.country,
        Latitude: station.latitude,
        Longitude: station.longitude,
        brand: station.brand,
        'Location Details': station.locationDetails,
      };

      const response = await baserowClient.post<BaserowPetrolStation>(
        `/${PETROL_STATIONS_TABLE_ID}/`,
        baserowData
      );

      return mapBaserowStation(response.data);
    } catch (error) {
      logger.error('Error creating station in Baserow:', error);
      throw error;
    }
  },

  /**
   * Update a station
   */
  updateStation: async (
    id: number,
    data: Partial<PetrolStation>
  ): Promise<PetrolStation> => {
    try {
      const baserowData: Partial<BaserowPetrolStation> = {};

      if (data.stationName)
        baserowData['Station Name'] = data.stationName;
      if (data.address) baserowData.Address = data.address;
      if (data.city) baserowData.City = data.city;
      if (data.region) baserowData.Region = data.region;
      if (data.postalCode)
        baserowData['Postal Code'] = data.postalCode;
      if (data.country) baserowData.Country = data.country;
      if (data.latitude) baserowData.Latitude = data.latitude;
      if (data.longitude) baserowData.Longitude = data.longitude;
      if (data.brand) baserowData.brand = data.brand;
      if (data.locationDetails)
        baserowData['Location Details'] = data.locationDetails;

      const response = await baserowClient.patch<BaserowPetrolStation>(
        `/${PETROL_STATIONS_TABLE_ID}/${id}/`,
        baserowData
      );

      return mapBaserowStation(response.data);
    } catch (error) {
      logger.error('Error updating station in Baserow:', error);
      throw error;
    }
  },

  /**
   * Delete a station
   */
  deleteStation: async (id: number): Promise<void> => {
    try {
      await baserowClient.delete(`/${PETROL_STATIONS_TABLE_ID}/${id}/`);
    } catch (error) {
      logger.error('Error deleting station from Baserow:', error);
      throw error;
    }
  },
};
