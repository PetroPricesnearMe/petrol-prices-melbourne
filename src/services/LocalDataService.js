/**
 * Local Data Service
 * Handles loading and parsing station data from local GeoJSON and CSV files
 */

class LocalDataService {
  constructor() {
    this.cache = null;
    this.cacheTimestamp = null;
    this.CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
  }

  /**
   * Fetch stations from local GeoJSON file
   * @returns {Promise<Array>} Array of station objects
   */
  async fetchStations() {
    // Check cache first
    if (this.cache && this.cacheTimestamp) {
      const now = Date.now();
      if (now - this.cacheTimestamp < this.CACHE_DURATION) {
        console.log('📦 Returning cached local data');
        return this.cache;
      }
    }

    try {
      console.log('🗺️ Loading stations from local GeoJSON...');

      // Try GeoJSON first (most complete data with coordinates)
      const geojsonData = await this.loadGeoJSON();
      if (geojsonData && geojsonData.length > 0) {
        console.log(`✅ Loaded ${geojsonData.length} stations from GeoJSON`);
        this.cache = geojsonData;
        this.cacheTimestamp = Date.now();
        return geojsonData;
      }

      // Fallback to CSV
      console.log('📄 Falling back to CSV data...');
      const csvData = await this.loadCSV();
      if (csvData && csvData.length > 0) {
        console.log(`✅ Loaded ${csvData.length} stations from CSV`);
        this.cache = csvData;
        this.cacheTimestamp = Date.now();
        return csvData;
      }

      throw new Error('No local data files available');
    } catch (error) {
      console.error('❌ Error loading local data:', error);
      throw error;
    }
  }

  /**
   * Load and parse GeoJSON file
   * @returns {Promise<Array>} Parsed station array
   */
  async loadGeoJSON() {
    try {
      const response = await fetch('/data/stations.geojson');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.features || !Array.isArray(data.features)) {
        throw new Error('Invalid GeoJSON format');
      }

      return data.features.map((feature, index) =>
        this.parseGeoJSONFeature(feature, index)
      );
    } catch (error) {
      console.warn('Could not load GeoJSON:', error.message);
      return null;
    }
  }

  /**
   * Parse individual GeoJSON feature into station object
   * @param {Object} feature GeoJSON feature
   * @param {number} index Feature index
   * @returns {Object} Normalized station object
   */
  parseGeoJSONFeature(feature, index) {
    const props = feature.properties || {};
    const coords = feature.geometry?.coordinates || [0, 0];

    // Extract brand from station owner
    const owner = props.station_owner || '';
    let brand = owner;

    // Normalize brand names
    if (owner.includes('7-ELEVEN') || owner.includes('7 ELEVEN')) {
      brand = '7-Eleven';
    } else if (owner.includes('BP')) {
      brand = 'BP';
    } else if (owner.includes('SHELL')) {
      brand = 'Shell';
    } else if (owner.includes('CALTEX')) {
      brand = 'Caltex';
    } else if (owner.includes('AMPOL')) {
      brand = 'Ampol';
    } else if (owner.includes('MOBIL')) {
      brand = 'Mobil';
    } else if (owner.includes('UNITED')) {
      brand = 'United';
    }

    // Determine region based on suburb (basic mapping)
    const region = this.getRegionFromSuburb(props.station_suburb || '');

    return {
      id: props.objectid || index + 1,
      name: props.station_name || 'Unknown Station',
      address: props.station_address || props.gnaf_formatted_address || '',
      city: props.station_suburb || props.gnaf_suburb || '',
      postalCode: props.station_postcode || props.gnaf_postcode || '',
      region: region,
      state: props.station_state || 'VIC',
      brand: brand,
      category: props.feature_type || 'PETROL STATION',
      // Use capitalized field names to match validation.js expectations
      Latitude: coords[1], // GeoJSON is [lng, lat]
      Longitude: coords[0],
      lat: coords[1], // Also provide lowercase for compatibility
      lng: coords[0],
      operationalStatus: props.operational_status || 'OPERATIONAL',
      description: props.station_description || '',
      lastUpdated: props.station_revised_date || new Date().toISOString(),
      spatialConfidence: props.spatial_confidence,
      industryId: props.industry_id,
      // Add mock fuel prices for display
      fuelPrices: this.generateMockPrices(brand),
    };
  }

  /**
   * Generate mock fuel prices for display
   * @param {string} brand Station brand
   * @returns {Object} Mock price data
   */
  generateMockPrices(brand) {
    // Base prices with slight variation by brand
    const brandPricing = {
      BP: { base: 1.95, variance: 0.05 },
      Shell: { base: 1.93, variance: 0.05 },
      Caltex: { base: 1.94, variance: 0.05 },
      Ampol: { base: 1.92, variance: 0.05 },
      '7-Eleven': { base: 1.89, variance: 0.05 },
      Mobil: { base: 1.96, variance: 0.05 },
      United: { base: 1.88, variance: 0.05 },
      default: { base: 1.94, variance: 0.08 },
    };

    const pricing = brandPricing[brand] || brandPricing.default;
    const basePrice =
      pricing.base + (Math.random() - 0.5) * pricing.variance * 2;

    return {
      unleaded: basePrice.toFixed(2),
      premium: (basePrice + 0.15).toFixed(2),
      diesel: (basePrice - 0.03).toFixed(2),
      e10: (basePrice - 0.05).toFixed(2),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Map suburb to region
   * @param {string} suburb Suburb name
   * @returns {string} Region identifier
   */
  getRegionFromSuburb(suburb) {
    if (!suburb) return 'VIC';

    const suburbUpper = suburb.toUpperCase();

    // Northern suburbs
    const north = [
      'PRESTON',
      'COBURG',
      'ESSENDON',
      'TULLAMARINE',
      'EPPING',
      'THOMASTOWN',
      'WOLLERT',
      'CRAIGIEBURN',
      'BROADMEADOWS',
      'GREENSBOROUGH',
      'ELTHAM',
    ];
    if (north.some((s) => suburbUpper.includes(s))) return 'Northern Suburbs';

    // Western suburbs
    const west = [
      'FOOTSCRAY',
      'SUNSHINE',
      'WERRIBEE',
      'POINT COOK',
      'BROOKLYN',
      'DEER PARK',
      'HOPPERS CROSSING',
      'ALTONA',
      'WILLIAMSTOWN',
      'MARIBYRNONG',
    ];
    if (west.some((s) => suburbUpper.includes(s))) return 'Western Suburbs';

    // Eastern suburbs
    const east = [
      'DONCASTER',
      'BOX HILL',
      'RINGWOOD',
      'GLEN WAVERLEY',
      'BURWOOD',
      'MITCHAM',
      'BLACKBURN',
      'NUNAWADING',
      'CROYDON',
      'BAYSWATER',
    ];
    if (east.some((s) => suburbUpper.includes(s)))
      return 'Inner East Melbourne';

    // Inner CBD
    const cbd = [
      'MELBOURNE',
      'CARLTON',
      'FITZROY',
      'SOUTH YARRA',
      'RICHMOND',
      'COLLINGWOOD',
      'NORTHCOTE',
      'BRUNSWICK',
      'PARKVILLE',
      'KENSINGTON',
      'ABBOTSFORD',
    ];
    if (cbd.some((s) => suburbUpper.includes(s))) return 'Melbourne CBD';

    // South Eastern suburbs
    const southeast = [
      'FRANKSTON',
      'DANDENONG',
      'CRANBOURNE',
      'CLAYTON',
      'SPRINGVALE',
      'NOBLE PARK',
      'CHELTENHAM',
      'MOORABBIN',
      'MORDIALLOC',
      'BENTLEIGH',
    ];
    if (southeast.some((s) => suburbUpper.includes(s)))
      return 'South Eastern Suburbs';

    // Default to VIC (regional)
    return 'VIC';
  }

  /**
   * Load and parse CSV file
   * @returns {Promise<Array>} Parsed station array
   */
  async loadCSV() {
    try {
      const response = await fetch('/data/stations.csv');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      return this.parseCSV(text);
    } catch (error) {
      console.warn('Could not load CSV:', error.message);
      return null;
    }
  }

  /**
   * Parse CSV text into station array
   * @param {string} text CSV text
   * @returns {Array} Parsed station array
   */
  parseCSV(text) {
    const lines = text.split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split('|').map((h) => h.trim());

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line, index) => {
        const values = line.split('|');
        const station = {};

        headers.forEach((header, i) => {
          station[header] = values[i] ? values[i].trim() : '';
        });

        return {
          id: station.id || index + 1,
          name: station['Station Name'] || 'Unknown Station',
          address: station['Address'] || '',
          city: station['City'] || '',
          postalCode: station['Postal Code'] || '',
          region: station['Region'] || 'VIC',
          category: station['Category'] || 'PETROL STATION',
          brand: this.extractBrandFromCSV(station.brand),
          // Use capitalized field names to match validation.js expectations
          Latitude: 0, // CSV doesn't have coordinates
          Longitude: 0,
          lat: 0, // Also provide lowercase for compatibility
          lng: 0,
          operationalStatus: 'OPERATIONAL',
          locationDetails: station['Location Details'] || '',
          lastUpdated: new Date().toISOString(),
          fuelPrices: this.generateMockPrices(
            this.extractBrandFromCSV(station.brand)
          ),
        };
      });
  }

  /**
   * Extract brand name from CSV brand field
   * @param {string} brandField Brand field from CSV
   * @returns {string} Cleaned brand name
   */
  extractBrandFromCSV(brandField) {
    if (!brandField) return 'Independent';

    // Brand field might contain image URL, extract text before it
    const brandText = brandField.split('(')[0].trim();

    // If there's an actual image name, use it
    if (brandText && brandText !== 'Untitled.png') {
      return brandText;
    }

    return 'Independent';
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = null;
    this.cacheTimestamp = null;
  }
}

// Export singleton instance
const localDataService = new LocalDataService();
export default localDataService;
