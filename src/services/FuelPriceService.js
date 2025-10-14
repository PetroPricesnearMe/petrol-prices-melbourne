/**
 * Fuel Price Service
 * 
 * Handles fetching and managing fuel price data from Baserow
 * Merges price data with station information
 */

import config, { baserowAPI } from '../config';

class FuelPriceService {
  constructor() {
    this.priceCache = new Map();
    this.lastFetchTime = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
    this.isLoading = false;
  }

  /**
   * Check if cached data is still valid
   * @returns {boolean} True if cache is valid
   */
  isCacheValid() {
    if (!this.lastFetchTime) return false;
    return Date.now() - this.lastFetchTime < this.cacheTimeout;
  }

  /**
   * Clear all cached data
   */
  clearCache() {
    console.log('🗑️ Clearing fuel price cache');
    this.priceCache.clear();
    this.lastFetchTime = null;
  }

  /**
   * Fetch all fuel prices from Baserow
   * @param {boolean} forceRefresh - Force refresh even if cache is valid
   * @returns {Promise<Array>} Array of fuel price data
   */
  async fetchFuelPrices(forceRefresh = false) {
    const cacheKey = 'fuel_prices';

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.isCacheValid() && this.priceCache.has(cacheKey)) {
      console.log('📦 Returning cached fuel price data');
      return this.priceCache.get(cacheKey);
    }

    // Prevent multiple simultaneous requests
    if (this.isLoading) {
      console.log('⏳ Price fetch already in progress, waiting...');
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.isLoading) {
            resolve(this.priceCache.get(cacheKey) || []);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    try {
      this.isLoading = true;
      console.log(`🚀 Fetching fuel prices from Baserow table ${config.tables.fuelPrices.id}...`);

      const fuelPrices = await this.fetchFuelPricesDirect(config.tables.fuelPrices.id);

      console.log(`✅ Successfully fetched ${fuelPrices.length} fuel price records`);

      // Transform and normalize the data
      const normalizedPrices = fuelPrices.map(price => this.normalizePriceData(price));

      // Cache the data
      this.priceCache.set(cacheKey, normalizedPrices);
      this.lastFetchTime = Date.now();

      return normalizedPrices;

    } catch (error) {
      console.error('❌ Error fetching fuel prices:', error);

      // Return cached data if available
      if (this.priceCache.has(cacheKey)) {
        console.log('🔄 Returning cached data due to error');
        return this.priceCache.get(cacheKey);
      }

      // Return empty array as fallback
      return [];

    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Fetch fuel prices directly from Baserow API
   * @param {number} tableId - Baserow table ID
   * @returns {Promise<Array>} Array of raw price records
   */
  async fetchFuelPricesDirect(tableId) {
    let rows = [];
    const usePublicToken = config.baserow.publicToken && config.baserow.publicToken !== 'your_public_token_here';
    let nextUrl = usePublicToken
      ? `${config.baserow.apiUrl}/database/rows/table/${tableId}/?user_field_names=true&size=100&public_token=${config.baserow.publicToken}`
      : `${config.baserow.apiUrl}/database/rows/table/${tableId}/?user_field_names=true&size=100`;

    console.log(`🔄 Fetching fuel prices from: ${nextUrl.replace(config.baserow.publicToken, 'PUBLIC_TOKEN')}`);

    try {
      while (nextUrl) {
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };

        if (!usePublicToken) {
          headers['Authorization'] = `Token ${config.baserow.token}`;
        }

        const response = await baserowAPI.fetchWithRetry(nextUrl, {
          method: 'GET',
          headers,
          mode: 'cors',
          credentials: 'omit'
        }, 3);

        const data = await response.json();

        if (!Array.isArray(data.results)) {
          throw new Error('Unexpected API response structure');
        }

        rows.push(...data.results);
        nextUrl = data.next ? (usePublicToken ? `${data.next}&public_token=${config.baserow.publicToken}` : data.next) : null;

        console.log(`📊 Progress: ${rows.length} price records fetched so far...`);
      }

      return rows;
    } catch (error) {
      console.error('❌ Error fetching fuel prices from Baserow:', error);
      throw error;
    }
  }

  /**
   * Normalize price data from Baserow
   * @param {Object} priceRecord - Raw price record from Baserow
   * @returns {Object} Normalized price data
   */
  normalizePriceData(priceRecord) {
    return {
      id: priceRecord.id,
      stationId: priceRecord['Station ID'] || priceRecord.station_id || priceRecord.stationId,
      stationName: priceRecord['Station Name'] || priceRecord.station_name || priceRecord.stationName,
      fuelType: priceRecord['Fuel Type'] || priceRecord.fuel_type || priceRecord.fuelType || 'unleaded',
      price: parseFloat(priceRecord['Price'] || priceRecord.price || 0),
      lastUpdated: priceRecord['Last Updated'] || priceRecord.last_updated || priceRecord.lastUpdated || new Date().toISOString(),
      date: priceRecord['Date'] || priceRecord.date || new Date().toISOString().split('T')[0]
    };
  }

  /**
   * Merge fuel prices with station data
   * @param {Array} stations - Array of station objects
   * @param {Array} fuelPrices - Array of fuel price objects
   * @returns {Array} Stations with merged price data
   */
  mergeStationsWithPrices(stations, fuelPrices) {
    console.log(`🔄 Merging ${stations.length} stations with ${fuelPrices.length} price records...`);

    // Create a map of prices by station ID for quick lookup
    const pricesByStation = new Map();

    fuelPrices.forEach(price => {
      const stationId = price.stationId;
      if (!stationId) return;

      if (!pricesByStation.has(stationId)) {
        pricesByStation.set(stationId, []);
      }
      pricesByStation.get(stationId).push(price);
    });

    // Also try matching by station name as fallback
    const pricesByName = new Map();
    fuelPrices.forEach(price => {
      const stationName = price.stationName;
      if (!stationName) return;

      const normalizedName = stationName.toLowerCase().trim();
      if (!pricesByName.has(normalizedName)) {
        pricesByName.set(normalizedName, []);
      }
      pricesByName.get(normalizedName).push(price);
    });

    // Merge prices into stations
    const mergedStations = stations.map(station => {
      // Try to find prices by station ID first
      let prices = pricesByStation.get(station.id) || [];

      // If no prices found by ID, try matching by name
      if (prices.length === 0 && station.name) {
        const normalizedName = station.name.toLowerCase().trim();
        prices = pricesByName.get(normalizedName) || [];
      }

      // Convert prices array to both array format and object format for flexibility
      const pricesObject = {};
      prices.forEach(price => {
        const fuelType = price.fuelType.toLowerCase().replace(/\s+/g, '');
        pricesObject[fuelType] = price.price;
      });

      return {
        ...station,
        fuelPrices: prices,
        prices: pricesObject,
        hasPrices: prices.length > 0,
        priceCount: prices.length
      };
    });

    const stationsWithPrices = mergedStations.filter(s => s.hasPrices).length;
    console.log(`✅ Merged complete: ${stationsWithPrices}/${stations.length} stations have price data`);

    return mergedStations;
  }

  /**
   * Get average price for a fuel type across all stations
   * @param {Array} stations - Array of station objects with prices
   * @param {string} fuelType - Type of fuel (e.g., 'unleaded', 'diesel')
   * @returns {number} Average price
   */
  getAveragePrice(stations, fuelType) {
    const prices = stations
      .map(s => s.prices?.[fuelType])
      .filter(p => p && p > 0);

    if (prices.length === 0) return 0;

    const sum = prices.reduce((acc, price) => acc + price, 0);
    return Math.round((sum / prices.length) * 10) / 10;
  }

  /**
   * Get price range for a fuel type
   * @param {Array} stations - Array of station objects with prices
   * @param {string} fuelType - Type of fuel
   * @returns {Object} Min and max prices
   */
  getPriceRange(stations, fuelType) {
    const prices = stations
      .map(s => s.prices?.[fuelType])
      .filter(p => p && p > 0);

    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  /**
   * Get trend data for a fuel type over time
   * @param {string} fuelType - Type of fuel
   * @param {number} days - Number of days of history
   * @returns {Promise<Array>} Array of price data over time
   */
  async getTrendData(fuelType, days = 7) {
    try {
      // Fetch all price records
      const allPrices = await this.fetchFuelPrices();

      // Filter by fuel type
      const fuelPrices = allPrices.filter(
        p => p.fuelType.toLowerCase() === fuelType.toLowerCase()
      );

      // Group by date
      const pricesByDate = new Map();
      fuelPrices.forEach(price => {
        const date = price.date || new Date(price.lastUpdated).toISOString().split('T')[0];
        if (!pricesByDate.has(date)) {
          pricesByDate.set(date, []);
        }
        pricesByDate.get(date).push(price.price);
      });

      // Calculate average for each date
      const trendData = [];
      const endDate = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayPrices = pricesByDate.get(dateStr) || [];
        const avgPrice = dayPrices.length > 0
          ? dayPrices.reduce((a, b) => a + b, 0) / dayPrices.length
          : 0;

        trendData.push({
          date: dateStr,
          price: Math.round(avgPrice * 10) / 10,
          count: dayPrices.length
        });
      }

      return trendData;

    } catch (error) {
      console.error('❌ Error getting trend data:', error);
      return [];
    }
  }
}

// Create singleton instance
const fuelPriceService = new FuelPriceService();

export default fuelPriceService;

