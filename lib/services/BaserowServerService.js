/**
 * BaserowServerService - Server-side Baserow API integration
 * For use in Next.js API routes and getStaticProps
 *
 * Tables:
 * - Petrol Stations: 623329
 * - Fuel Prices: 623330
 */

// Server-side fetch
const fetch = require('node-fetch');

const config = {
  baserow: {
    apiUrl:
      process.env.REACT_APP_BASEROW_API_URL || 'https://api.baserow.io/api',
    token:
      process.env.REACT_APP_BASEROW_TOKEN || 'G2bhijqxqtg0O05dc176fwDpaUPDSIgj',
    publicToken:
      process.env.REACT_APP_BASEROW_PUBLIC_TOKEN ||
      'MIhg-ye0C_K99qvwTzoH6MCvTMAHLbwHR0C4aZKP674',
  },
  tables: {
    petrolStations: { id: 623329 },
    fuelPrices: { id: 623330 },
  },
};

class BaserowServerService {
  constructor() {
    this.baseUrl = config.baserow.apiUrl;
    this.token = config.baserow.token;
    this.publicToken = config.baserow.publicToken;
    this.stationsTableId = config.tables.petrolStations.id;
    this.pricesTableId = config.tables.fuelPrices.id;
  }

  /**
   * Fetch with retry logic
   */
  async fetchWithRetry(url, options = {}, maxRetries = 3) {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          timeout: 15000,
        });

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter
            ? parseInt(retryAfter) * 1000
            : Math.pow(2, attempt) * 1000;
          console.warn(
            `⚠️ [Baserow] Rate limited. Waiting ${waitTime / 1000}s...`
          );
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
            `❌ [Baserow] Request failed after ${maxRetries} attempts:`,
            error.message
          );
          throw lastError;
        }

        const backoffTime = Math.pow(2, attempt) * 1000;
        console.log(
          `⏳ [Baserow] Retrying in ${backoffTime / 1000}s... (attempt ${attempt + 1}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }

    throw lastError;
  }

  /**
   * Fetch all rows from a table with pagination
   */
  async fetchAllRows(tableId, usePublicToken = true) {
    let allRows = [];
    let page = 1;
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
        console.log(
          `📡 [Baserow] Fetching page ${page} from table ${tableId}...`
        );

        const data = await this.fetchWithRetry(nextUrl, {
          method: 'GET',
          headers,
        });

        if (!data.results || !Array.isArray(data.results)) {
          throw new Error('Invalid API response structure');
        }

        allRows.push(...data.results);
        console.log(
          `✓ Page ${page}: ${data.results.length} rows (total: ${allRows.length})`
        );

        // Handle pagination
        nextUrl = data.next;
        if (nextUrl && usePublicToken && !nextUrl.includes('public_token')) {
          nextUrl += `&public_token=${this.publicToken}`;
        }

        page++;
      }

      console.log(
        `✅ [Baserow] Fetched ${allRows.length} total rows from table ${tableId}`
      );
      return allRows;
    } catch (error) {
      console.error(
        `❌ [Baserow] Error fetching rows from table ${tableId}:`,
        error.message
      );
      throw error;
    }
  }

  /**
   * Fetch all petrol stations
   */
  async fetchStations() {
    try {
      console.log('🏢 [Baserow] Fetching petrol stations...');
      const rows = await this.fetchAllRows(this.stationsTableId, true);
      const stations = rows.map((row) => this.normalizeStation(row));
      console.log(`✅ [Baserow] Normalized ${stations.length} stations`);
      return stations;
    } catch (error) {
      console.error('❌ [Baserow] Error fetching stations:', error.message);
      throw error;
    }
  }

  /**
   * Fetch fuel prices
   */
  async fetchFuelPrices() {
    try {
      console.log('⛽ [Baserow] Fetching fuel prices...');
      const rows = await this.fetchAllRows(this.pricesTableId, true);
      const prices = rows.map((row) => this.normalizeFuelPrice(row));
      console.log(`✅ [Baserow] Normalized ${prices.length} fuel prices`);
      return prices;
    } catch (error) {
      console.error('❌ [Baserow] Error fetching fuel prices:', error.message);
      throw error;
    }
  }

  /**
   * Fetch stations with their current fuel prices
   */
  async fetchStationsWithPrices() {
    try {
      console.log('🔄 [Baserow] Fetching stations with prices...');

      const [stations, prices] = await Promise.all([
        this.fetchStations(),
        this.fetchFuelPrices(),
      ]);

      // Create a map of station ID to prices
      const pricesByStation = this.groupPricesByStation(prices);

      // Merge stations with their prices
      const stationsWithPrices = stations.map((station) => ({
        ...station,
        fuelPrices: pricesByStation[station.id] || [],
        prices: this.formatPricesObject(pricesByStation[station.id] || []),
      }));

      console.log(
        `✅ [Baserow] Merged ${stationsWithPrices.length} stations with prices`
      );
      return stationsWithPrices;
    } catch (error) {
      console.error(
        '❌ [Baserow] Error fetching stations with prices:',
        error.message
      );
      throw error;
    }
  }

  /**
   * Normalize station data
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
      fuelPriceIds: Array.isArray(row['Fuel Prices']) ? row['Fuel Prices'] : [],
    };
  }

  /**
   * Normalize fuel price data
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
   * Format prices as an object
   */
  formatPricesObject(priceArray) {
    const pricesObj = {};

    priceArray.forEach((price) => {
      pricesObj[price.fuelType] = price.price;
    });

    return pricesObj;
  }
}

// Export singleton
const baserowServerService = new BaserowServerService();
module.exports = { baserowServerService, BaserowServerService };
