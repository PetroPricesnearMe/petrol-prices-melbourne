/**
 * Multi-Provider Data Fetching
 * 
 * Supports multiple data sources:
 * - Baserow (default)
 * - Airtable
 * - Supabase
 * - REST API
 * 
 * Features:
 * - Automatic fallback between providers
 * - ISR support with Next.js cache
 * - Request deduplication
 * - Type-safe responses
 * - Error handling with graceful degradation
 */

import { cache } from 'react';

import { getBaserowClient } from '@/lib/baserow/client';

// ============================================================================
// Types
// ============================================================================

export interface DataProvider {
  name: string;
  fetchStations(): Promise<Station[]>;
  fetchStationById(id: string | number): Promise<Station | null>;
  fetchStationsByFilter?(filters: Record<string, unknown>): Promise<Station[]>;
}

export interface Station {
  id: string | number;
  name: string;
  brand?: string;
  address: string;
  suburb?: string;
  latitude?: number;
  longitude?: number;
  [key: string]: unknown;
}

export interface FetchOptions {
  revalidate?: number; // ISR revalidation time in seconds
  tags?: string[]; // Cache tags for targeted revalidation
  fallback?: boolean; // Enable fallback to next provider
}

// ============================================================================
// Baserow Provider
// ============================================================================

class BaserowProvider implements DataProvider {
  name = 'baserow';

  async fetchStations(): Promise<Station[]> {
    const client = getBaserowClient();
    const tableId = process.env.BASEROW_STATIONS_TABLE_ID;
    
    if (!tableId) {
      throw new Error('BASEROW_STATIONS_TABLE_ID not configured');
    }

    const rows = await client.fetchTableRows<Station>(tableId, tableId, {
      size: 200,
      orderBy: 'id',
    });

    return rows.map(this.transformRow);
  }

  async fetchStationById(id: string | number): Promise<Station | null> {
    const client = getBaserowClient();
    const tableId = process.env.BASEROW_STATIONS_TABLE_ID;
    
    if (!tableId) {
      return null;
    }

    const row = await client.fetchRowById<Station>(tableId, Number(id));
    return row ? this.transformRow(row) : null;
  }

  async fetchStationsByFilter(filters: Record<string, unknown>): Promise<Station[]> {
    const client = getBaserowClient();
    const tableId = process.env.BASEROW_STATIONS_TABLE_ID;
    
    if (!tableId) {
      return [];
    }

    // Build Baserow filters
    const baserowFilters = Object.entries(filters).map(([field, value]) => ({
      field,
      type: 'equal',
      value,
    }));

    const rows = await client.fetchTableRows<Station>(tableId, tableId, {
      filters: baserowFilters,
      size: 200,
    });

    return rows.map(this.transformRow);
  }

  private transformRow(row: Station): Station {
    // Transform Baserow row to Station format
    const transformed: Station = {
      ...row,
      id: row.id,
      name: (row as Record<string, unknown>).name as string ||
            (row as Record<string, unknown>).station_name as string ||
            'Unknown Station',
      brand: (row as Record<string, unknown>).brand as string | undefined || undefined,
      address: (row as Record<string, unknown>).address as string || '',
      suburb: (row as Record<string, unknown>).suburb as string | undefined || undefined,
      latitude: (row as Record<string, unknown>).latitude
        ? Number((row as Record<string, unknown>).latitude)
        : undefined,
      longitude: (row as Record<string, unknown>).longitude
        ? Number((row as Record<string, unknown>).longitude)
        : undefined,
    };
    return transformed;
  }
}

// ============================================================================
// Airtable Provider
// ============================================================================

class AirtableProvider implements DataProvider {
  name = 'airtable';

  async fetchStations(): Promise<Station[]> {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_STATIONS_TABLE || 'Stations';
    const apiKey = process.env.AIRTABLE_API_KEY;

    if (!baseId || !apiKey) {
      throw new Error('Airtable credentials not configured');
    }

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const data = await response.json() as {
      records: Array<{
        id: string;
        fields: Record<string, unknown>;
      }>;
    };
    
    return data.records.map((record) => {
      const fields = record.fields;
      return {
        id: record.id,
        name: (fields.Name as string) || 'Unknown Station',
        brand: (fields.Brand as string | undefined) || undefined,
        address: (fields.Address as string) || '',
        suburb: (fields.Suburb as string | undefined) || undefined,
        latitude: (fields.Latitude as number | undefined) || undefined,
        longitude: (fields.Longitude as number | undefined) || undefined,
        ...fields,
      };
    });
  }

  async fetchStationById(id: string | number): Promise<Station | null> {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_STATIONS_TABLE || 'Stations';
    const apiKey = process.env.AIRTABLE_API_KEY;

    if (!baseId || !apiKey) {
      return null;
    }

    const url = `https://api.airtable.com/v0/${baseId}/${tableName}/${id}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: {
        revalidate: 1800,
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`);
    }

    const record = await response.json() as {
      id: string;
      fields: Record<string, unknown>;
    };
    
    const fields = record.fields;
    return {
      id: record.id,
      name: (fields.Name as string) || 'Unknown Station',
      brand: (fields.Brand as string | undefined) || undefined,
      address: (fields.Address as string) || '',
      suburb: (fields.Suburb as string | undefined) || undefined,
      latitude: (fields.Latitude as number | undefined) || undefined,
      longitude: (fields.Longitude as number | undefined) || undefined,
      ...fields,
    };
  }
}

// ============================================================================
// Supabase Provider
// ============================================================================

class SupabaseProvider implements DataProvider {
  name = 'supabase';

  async fetchStations(): Promise<Station[]> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const tableName = process.env.SUPABASE_STATIONS_TABLE || 'stations';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as Station[];
  }

  async fetchStationById(id: string | number): Promise<Station | null> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const tableName = process.env.SUPABASE_STATIONS_TABLE || 'stations';

    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}?id=eq.${id}`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 1800,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data[0] || null;
  }
}

// ============================================================================
// REST API Provider
// ============================================================================

class RestApiProvider implements DataProvider {
  name = 'rest';

  async fetchStations(): Promise<Station[]> {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      throw new Error('API_URL not configured');
    }

    const endpoint = `${apiUrl}/stations`;
    
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error(`REST API error: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data.data) ? data.data : data;
  }

  async fetchStationById(id: string | number): Promise<Station | null> {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      return null;
    }

    const endpoint = `${apiUrl}/stations/${id}`;
    
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 1800,
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`REST API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || data;
  }
}

// ============================================================================
// Provider Manager
// ============================================================================

class ProviderManager {
  private providers: DataProvider[] = [];
  private activeProvider: DataProvider | null = null;

  constructor() {
    // Initialize providers in order of preference
    if (process.env.BASEROW_API_TOKEN) {
      this.providers.push(new BaserowProvider());
    }
    if (process.env.AIRTABLE_API_KEY) {
      this.providers.push(new AirtableProvider());
    }
    if (process.env.SUPABASE_URL) {
      this.providers.push(new SupabaseProvider());
    }
    if (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL) {
      this.providers.push(new RestApiProvider());
    }

    // Set active provider based on env or default to first available
    const preferredProvider = process.env.DATA_PROVIDER?.toLowerCase();
    this.activeProvider = 
      this.providers.find(p => p.name === preferredProvider) || 
      this.providers[0] ||
      null;
  }

  getActiveProvider(): DataProvider {
    if (!this.activeProvider) {
      throw new Error('No data provider configured. Please set up at least one provider.');
    }
    return this.activeProvider;
  }

  async fetchWithFallback<T>(
    fetchFn: (provider: DataProvider) => Promise<T>,
    options: FetchOptions = {}
  ): Promise<T> {
    const { fallback = true } = options;
    
    if (!fallback) {
      return fetchFn(this.getActiveProvider());
    }

    // Try each provider until one succeeds
    const errors: Error[] = [];
    
    for (const provider of this.providers) {
      try {
        return await fetchFn(provider);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        errors.push(err);
        console.warn(`Provider ${provider.name} failed:`, err.message);
        continue;
      }
    }

    // All providers failed
    throw new Error(
      `All data providers failed. Errors: ${errors.map(e => e.message).join('; ')}`
    );
  }
}

// Singleton instance
const providerManager = new ProviderManager();

// ============================================================================
// Cached Server Functions (React cache + Next.js ISR)
// ============================================================================

/**
 * Get all stations with ISR support and automatic fallback
 */
export const getStations = cache(async (options: FetchOptions = {}): Promise<Station[]> => {
  return providerManager.fetchWithFallback(
    (provider) => provider.fetchStations(),
    options
  );
});

/**
 * Get single station by ID with ISR support
 */
export const getStationById = cache(
  async (id: string | number, options: FetchOptions = {}): Promise<Station | null> => {
    return providerManager.fetchWithFallback(
      (provider) => provider.fetchStationById(id),
      options
    );
  }
);

/**
 * Get stations with filters
 */
export const getStationsByFilter = cache(
  async (
    filters: Record<string, unknown>,
    options: FetchOptions = {}
  ): Promise<Station[]> => {
    return providerManager.fetchWithFallback(
      (provider) => {
        if (provider.fetchStationsByFilter) {
          return provider.fetchStationsByFilter(filters);
        }
        // Fallback: fetch all and filter client-side
        return provider.fetchStations().then(stations =>
          stations.filter(station => {
            return Object.entries(filters).every(([key, value]) => {
              const stationValue = (station as Record<string, unknown>)[key];
              return stationValue === value || 
                     String(stationValue).toLowerCase().includes(String(value).toLowerCase());
            });
          })
        );
      },
      options
    );
  }
);

/**
 * Get active provider name
 */
export function getActiveProviderName(): string {
  try {
    return providerManager.getActiveProvider().name;
  } catch {
    return 'none';
  }
}

export default providerManager;

