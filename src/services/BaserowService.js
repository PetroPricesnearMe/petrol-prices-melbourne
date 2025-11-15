/**
 * BaserowService - Real-time integration with Baserow API
 * Fetches petrol stations and fuel prices from Baserow tables
 *
 * Tables:
 * - Petrol Stations: 623329
 * - Fuel Prices: 623330
 */

import config from '../config';

class BaserowService {
  constructor() {
    this.baseUrl = config.baserow.apiUrl;
    this.token = config.baserow.token;
    this.publicToken = config.baserow.publicToken;
    this.stationsTableId = config.tables.petrolStations.id;
    this.pricesTableId = config.tables.fuelPrices.id;

    // Cache configuration
    this.cache = {
      stations: null,
      prices: null,
      stationsTTL: 0,
      pricesTTL: 0,
    };

    // Cache durations (in milliseconds)
    this.CACHE_DURATION = {
      stations: 24 * 60 * 60 * 1000, // 24 hours
      prices: 15 * 60 * 1000, // 15 minutes
    };
  }

  /**
   * Fetch data from Baserow with retry logic and pagination
   */
  async fetchWithRetry(url, options = {}, maxRetries = 3) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter
            ? parseInt(retryAfter) * 1000
            : Math.pow(2, attempt) * 1000;
          console.warn(`⚠️ Rate limited. Waiting ${waitTime / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries - 1) {
          console.error(
            `❌ Request failed after ${maxRetries} attempts:`,
            error.message
          );
          throw lastError;
        }

        const backoffTime = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Retrying in ${backoffTime / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }

    throw lastError;
  }

  /**
   * Fetch all rows from a table with pagination
   */
  async fetchAllRows(tableId, usePublicToken = false) {
    let allRows = [];
    let nextUrl = usePublicToken
      ? `${this.baseUrl}/database/rows/table/${tableId}/?user_field_names=true&size=200&public_token=${this.publicToken}`
      : `${this.baseUrl}/database/rows/table/${tableId}/?user_field_names=true&size=200`;

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (!usePublicToken) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    try {
      while (nextUrl) {
        const data = await this.fetchWithRetry(nextUrl, {
          method: 'GET',
          headers,
          mode: 'cors',
          credentials: 'omit',
        });

        if (!data.results || !Array.isArray(data.results)) {
          throw new Error('Invalid API response structure');
        }

        allRows.push(...data.results);

        // Handle pagination
        nextUrl = data.next;
        if (nextUrl && usePublicToken && !nextUrl.includes('public_token')) {
          nextUrl += `&public_token=${this.publicToken}`;
        }
      }

      return allRows;
    } catch (error) {
      console.error(
        `❌ Error fetching rows from table ${tableId}:`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Fetch all petrol stations from Baserow
   */
  async fetchStations(forceRefresh = false) {
    const now = Date.now();

    // Return cached data if still valid
    if (!forceRefresh && this.cache.stations && now < this.cache.stationsTTL) {
      console.log('📦 Returning cached stations data');
      return this.cache.stations;
    }

    try {
      console.log('🔄 Fetching stations from Baserow...');
      const rows = await this.fetchAllRows(this.stationsTableId, true);

      // Normalize station data
      const stations = rows.map((row) => this.normalizeStation(row));

      // Update cache
      this.cache.stations = stations;
      this.cache.stationsTTL = now + this.CACHE_DURATION.stations;

      console.log(`✅ Fetched ${stations.length} stations from Baserow`);
      return stations;
    } catch (error) {
      console.error('❌ Error fetching stations:', error.message);

      // Return cached data if available, even if expired
      if (this.cache.stations) {
        console.warn('⚠️ Returning stale cached data');
        return this.cache.stations;
      }

      throw error;
    }
  }

  /**
   * Fetch fuel prices from Baserow
   */
  async fetchFuelPrices(forceRefresh = false) {
    const now = Date.now();

    // Return cached data if still valid
    if (!forceRefresh && this.cache.prices && now < this.cache.pricesTTL) {
      console.log('📦 Returning cached prices data');
      return this.cache.prices;
    }

    try {
      console.log('🔄 Fetching fuel prices from Baserow...');
      const rows = await this.fetchAllRows(this.pricesTableId, true);

      // Normalize price data
      const prices = rows.map((row) => this.normalizeFuelPrice(row));

      // Update cache
      this.cache.prices = prices;
      this.cache.pricesTTL = now + this.CACHE_DURATION.prices;

      console.log(`✅ Fetched ${prices.length} fuel prices from Baserow`);
      return prices;
    } catch (error) {
      console.error('❌ Error fetching fuel prices:', error.message);

      // Return cached data if available
      if (this.cache.prices) {
        console.warn('⚠️ Returning stale cached data');
        return this.cache.prices;
      }

      throw error;
    }
  }

  /**
   * Fetch stations with their current fuel prices
   */
  async fetchStationsWithPrices(forceRefresh = false) {
    try {
      const [stations, prices] = await Promise.all([
        this.fetchStations(forceRefresh),
        this.fetchFuelPrices(forceRefresh),
      ]);

      // Create a map of station ID to prices
      const pricesByStation = this.groupPricesByStation(prices);

      // Merge stations with their prices
      const stationsWithPrices = stations.map((station) => ({
        ...station,
        fuelPrices: pricesByStation[station.id] || [],
        prices: this.formatPricesObject(pricesByStation[station.id] || []),
      }));

      return stationsWithPrices;
    } catch (error) {
      console.error('❌ Error fetching stations with prices:', error.message);
      throw error;
    }
  }

  /**
   * Normalize station data from Baserow format
   */
  normalizeStation(row) {
    return {
      id: row.id,
      name: row['Station Name'] || 'Unknown Station',
      address: row['Address'] || '',
      city: row['City'] || '',
      postalCode: row['Postal Code'] || '',
      state: row['Region'] || 'VIC',
      country: row['Country'] || 'AUSTRALIA',
      latitude: parseFloat(row['Latitude']) || 0,
      longitude: parseFloat(row['Longitude']) || 0,
      lat: parseFloat(row['Latitude']) || 0,
      lng: parseFloat(row['Longitude']) || 0,
      locationDetails: row['Location Details'] || '',
      category: row['Category'] || '',
      brand: Array.isArray(row['brand'])
        ? row['brand'].join(', ')
        : row['brand'] || '',
      // Link to fuel prices (relationship field)
      fuelPriceIds: Array.isArray(row['Fuel Prices']) ? row['Fuel Prices'] : [],
    };
  }

  /**
   * Normalize fuel price data from Baserow format
   */
  normalizeFuelPrice(row) {
    // Map option IDs to fuel types
    const fuelTypeMap = {
      3812408: 'unleaded',
      3812409: 'premium',
      3812410: 'diesel',
      3812411: 'lpg',
      3812412: 'unleaded95',
    };

    // Map trend option IDs
    const trendMap = {
      3812413: 'increasing',
      3812414: 'stable',
      3812415: 'decreasing',
    };

    const fuelTypeId = row['Fuel Type'];
    const trendId = row['Price Trend'];

    return {
      id: row.id,
      stationIds: Array.isArray(row['Petrol Station'])
        ? row['Petrol Station']
        : [],
      fuelType: fuelTypeMap[fuelTypeId] || 'unknown',
      fuelTypeId: fuelTypeId,
      price: parseFloat(row['Price Per Liter']) || 0,
      pricePerLiter: parseFloat(row['Price Per Liter']) || 0,
      priceSource: row['Price Source'] || '',
      priceTrend: trendMap[trendId] || 'stable',
      lastUpdated: row['Last Updated'] || new Date().toISOString(),
      locations: row['Locations'] || '',
    };
  }

  /**
   * Group prices by station ID
   */
  groupPricesByStation(prices) {
    const grouped = {};

    prices.forEach((price) => {
      price.stationIds.forEach((stationId) => {
        if (!grouped[stationId]) {
          grouped[stationId] = [];
        }
        grouped[stationId].push({
          fuelType: price.fuelType,
          price: price.price,
          trend: price.priceTrend,
          lastUpdated: price.lastUpdated,
        });
      });
    });

    return grouped;
  }

  /**
   * Format prices as an object for easier access
   */
  formatPricesObject(priceArray) {
    const pricesObj = {};

    priceArray.forEach((price) => {
      pricesObj[price.fuelType] = price.price;
    });

    return pricesObj;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {
      stations: null,
      prices: null,
      stationsTTL: 0,
      pricesTTL: 0,
    };
    console.log('🧹 Cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    const now = Date.now();
    return {
      stations: {
        cached: !!this.cache.stations,
        valid: now < this.cache.stationsTTL,
        expiresIn: Math.max(0, this.cache.stationsTTL - now),
      },
      prices: {
        cached: !!this.cache.prices,
        valid: now < this.cache.pricesTTL,
        expiresIn: Math.max(0, this.cache.pricesTTL - now),
      },
    };
  }
}

// Export singleton instance
const baserowService = new BaserowService();
export default baserowService;
