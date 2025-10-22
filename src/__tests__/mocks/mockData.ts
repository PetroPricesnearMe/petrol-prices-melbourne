/**
 * Mock Data
 *
 * Reusable mock data for tests
 */

import type { PetrolStation, FuelPrice} from '@/types/index';
import { FuelType, PriceTrend } from '@/types/index';

export const mockFuelPrices: FuelPrice[] = [
  {
    id: 1,
    fuelType: FuelType.UNLEADED,
    pricePerLiter: 1.89,
    lastUpdated: '2025-01-01T00:00:00Z',
    priceSource: 'Test Source',
    priceTrend: PriceTrend.STABLE,
  },
  {
    id: 2,
    fuelType: FuelType.DIESEL,
    pricePerLiter: 1.95,
    lastUpdated: '2025-01-01T00:00:00Z',
    priceSource: 'Test Source',
    priceTrend: PriceTrend.DECREASING,
  },
  {
    id: 3,
    fuelType: FuelType.PREMIUM_UNLEADED,
    pricePerLiter: 2.05,
    lastUpdated: '2025-01-01T00:00:00Z',
    priceSource: 'Test Source',
    priceTrend: PriceTrend.INCREASING,
  },
];

export const mockStations: PetrolStation[] = [
  {
    id: 1,
    stationName: 'Shell Melbourne CBD',
    address: '123 Collins St',
    city: 'Melbourne',
    region: 'VIC',
    postalCode: '3000',
    country: 'Australia',
    latitude: -37.8136,
    longitude: 144.9631,
    brand: ['Shell'],
    category: 'petrol-station',
    locationDetails: 'Corner of Collins and Swanston',
    fuelPrices: [mockFuelPrices[0], mockFuelPrices[2]],
    distance: 0.5,
  },
  {
    id: 2,
    stationName: 'BP Southbank',
    address: '456 Southbank Blvd',
    city: 'Melbourne',
    region: 'VIC',
    postalCode: '3006',
    country: 'Australia',
    latitude: -37.8226,
    longitude: 144.9670,
    brand: ['BP'],
    category: 'petrol-station',
    fuelPrices: [mockFuelPrices[0], mockFuelPrices[1]],
    distance: 1.2,
  },
  {
    id: 3,
    stationName: '7-Eleven Richmond',
    address: '789 Bridge Rd',
    city: 'Richmond',
    region: 'VIC',
    postalCode: '3121',
    country: 'Australia',
    latitude: -37.8197,
    longitude: 145.0015,
    brand: ['7-Eleven'],
    category: 'petrol-station',
    fuelPrices: mockFuelPrices,
    distance: 2.8,
  },
];

export const mockLargeStationList = Array.from({ length: 100 }, (_, i) => ({
  ...mockStations[0],
  id: i + 1,
  stationName: `Test Station ${i + 1}`,
  distance: (i * 0.5) + 0.5,
}));

export const mockApiResponse = {
  data: mockStations,
  status: 200,
  message: 'Success',
};

export const mockPaginatedResponse = {
  data: mockStations.slice(0, 10),
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10,
  },
};

export const mockCoordinates = {
  lat: -37.8136,
  lng: 144.9631,
};

export const mockSearchFilters = {
  fuelType: FuelType.UNLEADED,
  maxDistance: 10,
  minPrice: 1.50,
  maxPrice: 2.50,
  brands: ['Shell', 'BP'],
};

export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user' as const,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockError = {
  message: 'Test error message',
  statusCode: 400,
  errors: {
    field1: ['Error 1', 'Error 2'],
  },
};

/**
 * Factory functions
 */
export const createMockStation = (overrides: Partial<PetrolStation> = {}): PetrolStation => ({
  ...mockStations[0],
  ...overrides,
});

export const createMockFuelPrice = (overrides: Partial<FuelPrice> = {}): FuelPrice => ({
  ...mockFuelPrices[0],
  ...overrides,
});
