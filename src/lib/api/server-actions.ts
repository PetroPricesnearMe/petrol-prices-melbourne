/**
 * Next.js 15 Server Actions
 * Modern server-side data fetching with automatic caching and revalidation
 * 
 * Benefits:
 * - Type-safe server functions
 * - Automatic deduplication
 * - Built-in caching
 * - No API routes needed
 * - Progressive enhancement
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cache } from 'react';

import { baserowService } from '@/services/BaserowService';
import type { Station, FuelPrice, StationFilters } from '@/types/station';

import { validateStationId, validateFilters } from './validation';

// ============================================================================
// CACHED DATA FETCHERS (React Cache + Next.js Cache)
// ============================================================================

/**
 * Get all stations with automatic caching
 * Uses React cache() for request-level deduplication
 * Uses Next.js cache tags for revalidation
 */
export const getStations = cache(async (): Promise<Station[]> => {
  try {
    const response = await fetch(`${process.env.BASEROW_API_URL}/api/database/rows/table/${process.env.BASEROW_STATIONS_TABLE_ID}/`, {
      headers: {
        'Authorization': `Token ${process.env.BASEROW_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: ['stations'], // Tag for targeted revalidation
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stations: ${response.statusText}`);
    }

    const data = await response.json();
    return transformBaserowToStations(data.results);
  } catch (error) {
    console.error('Error fetching stations:', error);
    // Return empty array instead of throwing in production
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    throw error;
  }
});

/**
 * Get single station by ID with caching
 */
export const getStationById = cache(async (id: number): Promise<Station | null> => {
  // Validate input
  const validationResult = validateStationId(id);
  if (!validationResult.success) {
    throw new Error(validationResult.error);
  }

  try {
    const response = await fetch(`${process.env.BASEROW_API_URL}/api/database/rows/table/${process.env.BASEROW_STATIONS_TABLE_ID}/${id}/`, {
      headers: {
        'Authorization': `Token ${process.env.BASEROW_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 1800, // Cache for 30 minutes
        tags: ['stations', `station-${id}`],
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch station ${id}: ${response.statusText}`);
    }

    const data = await response.json();
    return transformBaserowToStation(data);
  } catch (error) {
    console.error(`Error fetching station ${id}:`, error);
    return null;
  }
});

/**
 * Get stations by suburb with caching
 */
export const getStationsBySuburb = cache(async (suburb: string): Promise<Station[]> => {
  try {
    const allStations = await getStations();
    return allStations.filter(
      station => station.suburb?.toLowerCase() === suburb.toLowerCase()
    );
  } catch (error) {
    console.error(`Error fetching stations for suburb ${suburb}:`, error);
    return [];
  }
});

/**
 * Get fuel prices with caching
 */
export const getFuelPrices = cache(async (): Promise<FuelPrice[]> => {
  try {
    const response = await fetch(`${process.env.BASEROW_API_URL}/api/database/rows/table/${process.env.BASEROW_PRICES_TABLE_ID}/`, {
      headers: {
        'Authorization': `Token ${process.env.BASEROW_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes (prices change frequently)
        tags: ['fuel-prices'],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch fuel prices: ${response.statusText}`);
    }

    const data = await response.json();
    return transformBaserowToFuelPrices(data.results);
  } catch (error) {
    console.error('Error fetching fuel prices:', error);
    return [];
  }
});

/**
 * Search stations with filters
 * Server Action for form submissions
 */
export async function searchStations(filters: StationFilters): Promise<Station[]> {
  // Validate filters
  const validationResult = validateFilters(filters);
  if (!validationResult.success) {
    throw new Error(validationResult.error);
  }

  try {
    const allStations = await getStations();
    
    let filtered = allStations;

    // Apply filters
    if (filters.suburb) {
      filtered = filtered.filter(s => 
        s.suburb?.toLowerCase().includes(filters.suburb!.toLowerCase())
      );
    }

    if (filters.brand) {
      filtered = filtered.filter(s => 
        s.brand?.toLowerCase() === filters.brand!.toLowerCase()
      );
    }

    if (filters.fuelType) {
      filtered = filtered.filter(s => 
        s.fuelPrices?.some(fp => fp.fuelType === filters.fuelType)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(s =>
        s.fuelPrices?.some(fp => fp.price <= filters.maxPrice!)
      );
    }

    if (filters.amenities) {
      filtered = filtered.filter(s =>
        filters.amenities!.every(amenity => s.amenities?.[amenity])
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered = sortStations(filtered, filters.sortBy);
    }

    return filtered;
  } catch (error) {
    console.error('Error searching stations:', error);
    throw new Error('Failed to search stations');
  }
}

/**
 * Get nearby stations using geolocation
 * Server Action
 */
export async function getNearbyStations(
  latitude: number,
  longitude: number,
  radiusKm: number = 5
): Promise<Station[]> {
  try {
    const allStations = await getStations();
    
    // Filter out stations with invalid coordinates FIRST
    // Don't default null to (0,0) as that's in the Atlantic Ocean!
    const validStations = allStations.filter(
      station => station.latitude !== null && station.longitude !== null
    );
    
    return validStations
      .map(station => ({
        ...station,
        distance: calculateDistance(
          latitude,
          longitude,
          station.latitude!, // Safe to use ! after filter
          station.longitude!
        ),
      }))
      .filter(station => station.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error finding nearby stations:', error);
    return [];
  }
}

// ============================================================================
// MUTATIONS (Server Actions for data updates)
// ============================================================================

/**
 * Update station data
 * Server Action with revalidation
 */
export async function updateStation(id: number, data: Partial<Station>): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${process.env.BASEROW_API_URL}/api/database/rows/table/${process.env.BASEROW_STATIONS_TABLE_ID}/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${process.env.BASEROW_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformStationToBaserow(data)),
    });

    if (!response.ok) {
      return { success: false, error: response.statusText };
    }

    // Revalidate cached data
    revalidateTag(`station-${id}`);
    revalidateTag('stations');
    revalidatePath('/directory');
    revalidatePath(`/stations/${id}`);

    return { success: true };
  } catch (error) {
    console.error('Error updating station:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Create new station
 * Server Action with revalidation
 */
export async function createStation(data: Omit<Station, 'id'>): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    const response = await fetch(`${process.env.BASEROW_API_URL}/api/database/rows/table/${process.env.BASEROW_STATIONS_TABLE_ID}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.BASEROW_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformStationToBaserow(data)),
    });

    if (!response.ok) {
      return { success: false, error: response.statusText };
    }

    const result = await response.json();

    // Revalidate cached data
    revalidateTag('stations');
    revalidatePath('/directory');

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Error creating station:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Delete station
 * Server Action with revalidation
 */
export async function deleteStation(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${process.env.BASEROW_API_URL}/api/database/rows/table/${process.env.BASEROW_STATIONS_TABLE_ID}/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${process.env.BASEROW_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      return { success: false, error: response.statusText };
    }

    // Revalidate cached data
    revalidateTag(`station-${id}`);
    revalidateTag('stations');
    revalidatePath('/directory');

    return { success: true };
  } catch (error) {
    console.error('Error deleting station:', error);
    return { success: false, error: String(error) };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function transformBaserowToStations(data: any[]): Station[] {
  return data.map(transformBaserowToStation).filter(Boolean) as Station[];
}

function transformBaserowToStation(data: any): Station | null {
  try {
    return {
      id: data.id,
      name: data['Station Name'] || '',
      brand: data.brand?.[0] || '',
      address: data.Address || '',
      suburb: data.City || '',
      city: data.City || '',
      postcode: data['Postal Code'] || '',
      region: data.Region || '',
      latitude: parseFloat(data.Latitude) || null,
      longitude: parseFloat(data.Longitude) || null,
      category: data.Category || 'PETROL_STATION',
      fuelPrices: [],
      amenities: {},
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error transforming Baserow data:', error);
    return null;
  }
}

function transformBaserowToFuelPrices(data: any[]): FuelPrice[] {
  return data.map(item => ({
    id: item.id,
    stationId: item['Petrol Station']?.[0] || 0,
    fuelType: item['Fuel Type'] || '',
    price: parseFloat(item['Price Per Liter']) || 0,
    lastUpdated: item['Last Updated'] || new Date().toISOString(),
  }));
}

function transformStationToBaserow(station: Partial<Station>): any {
  return {
    'Station Name': station.name,
    'Address': station.address,
    'City': station.suburb || station.city,
    'Region': station.region,
    'Postal Code': station.postcode,
    'Latitude': station.latitude?.toString(),
    'Longitude': station.longitude?.toString(),
    'Category': station.category,
  };
}

function sortStations(stations: Station[], sortBy: string): Station[] {
  switch (sortBy) {
    case 'name':
      return [...stations].sort((a, b) => a.name.localeCompare(b.name));
    case 'price-low':
      return [...stations].sort((a, b) => {
        const aPrice = Math.min(...(a.fuelPrices?.map(fp => fp.price) || [Infinity]));
        const bPrice = Math.min(...(b.fuelPrices?.map(fp => fp.price) || [Infinity]));
        return aPrice - bPrice;
      });
    case 'suburb':
      return [...stations].sort((a, b) => (a.suburb || '').localeCompare(b.suburb || ''));
    default:
      return stations;
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

