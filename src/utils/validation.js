/**
 * API Response Validation Utilities
 * 
 * This module provides validation functions for API responses to ensure data integrity
 * and prevent runtime errors from malformed data.
 */

/**
 * Validate station data structure
 * @param {*} station - Station data to validate
 * @param {number} index - Station index for error messages
 * @returns {{valid: boolean, errors: string[], data: object|null}}
 */
export function validateStation(station, index = 0) {
  const errors = [];

  // Check if station exists and is an object
  if (!station || typeof station !== 'object') {
    return {
      valid: false,
      errors: [`Station at index ${index} is not an object`],
      data: null
    };
  }

  // Extract and validate ID
  const id = station.id || station.Id;
  if (!id) {
    errors.push(`Station at index ${index} missing id`);
  }

  // Extract and validate name - support multiple field name formats
  const name = station['Station Name'] || station.station_name || station.field_5072130 || station.name;
  if (!name || typeof name !== 'string') {
    errors.push(`Station at index ${index} missing or invalid name`);
  }

  // Extract and validate coordinates - support CSV (X, Y) and Baserow formats
  const lat = parseFloat(station.Latitude || station.Y || station.lat || station.latitude || station.field_5072136);
  const lng = parseFloat(station.Longitude || station.X || station.lng || station.longitude || station.field_5072137);

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    errors.push(`Station at index ${index} has invalid coordinates: lat=${lat}, lng=${lng}`);
  } else {
    // Validate coordinate ranges
    if (lat < -90 || lat > 90) {
      errors.push(`Station at index ${index} has invalid latitude: ${lat} (must be between -90 and 90)`);
    }
    if (lng < -180 || lng > 180) {
      errors.push(`Station at index ${index} has invalid longitude: ${lng} (must be between -180 and 180)`);
    }
  }

  // Extract and normalize fuelPrices
  let fuelPrices = station['Fuel Prices'] || station.field_5072139 || station.fuelPrices;

  // Ensure fuelPrices is an array of objects, not IDs
  if (!Array.isArray(fuelPrices)) {
    fuelPrices = [];
  } else {
    // Filter out non-object items (like Baserow link IDs)
    fuelPrices = fuelPrices.filter(item => item && typeof item === 'object' && item.type);
  }

  // If no valid fuel prices, provide default empty array
  if (fuelPrices.length === 0) {
    fuelPrices = [];
  }

  // Return validation result
  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? {
      id,
      name,
      lat,
      lng,
      address: station.Address || station.station_address || station.field_5072131 || station.address,
      city: station.City || station.station_suburb || station.field_5072132 || station.city,
      region: station.Region || station.station_state || station.field_5072134 || station.region,
      postalCode: station['Postal Code'] || station.station_postcode || station.field_5072133 || station.postalCode,
      country: station.Country || station.field_5072135 || station.country || 'AUSTRALIA',
      category: station.Category || station.feature_type || station.field_5072138 || station.category,
      locationDetails: station['Location Details'] || station.station_description || station.field_5072140 || station.locationDetails,
      fuelPrices: fuelPrices,
      brand: station.brand || station.station_owner || station.Brand
    } : null
  };
}

/**
 * Validate array of stations
 * @param {Array} stations - Array of station data
 * @returns {{valid: boolean, errors: string[], validStations: Array, invalidCount: number}}
 */
export function validateStations(stations) {
  if (!Array.isArray(stations)) {
    return {
      valid: false,
      errors: ['Expected an array of stations'],
      validStations: [],
      invalidCount: 0
    };
  }

  const allErrors = [];
  const validStations = [];
  let invalidCount = 0;

  stations.forEach((station, index) => {
    const validation = validateStation(station, index);
    if (validation.valid) {
      validStations.push(validation.data);
    } else {
      invalidCount++;
      allErrors.push(...validation.errors);
    }
  });

  return {
    valid: invalidCount === 0,
    errors: allErrors,
    validStations,
    invalidCount,
    totalCount: stations.length,
    validCount: validStations.length
  };
}

/**
 * Validate API response structure
 * @param {*} response - API response to validate
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateAPIResponse(response) {
  const errors = [];

  if (!response || typeof response !== 'object') {
    errors.push('Response is not an object');
    return { valid: false, errors };
  }

  // Check for success field
  if (response.hasOwnProperty('success') && !response.success) {
    errors.push(`API returned success=false: ${response.error || 'Unknown error'}`);
  }

  // Check for data field
  if (!response.data && !response.results) {
    errors.push('Response missing data or results field');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Create user-friendly error message from technical error
 * @param {Error|string} error - Error object or message
 * @param {string} context - Context of the error (e.g., 'fetching stations')
 * @returns {string} User-friendly error message
 */
export function getUserFriendlyError(error, context = 'processing request') {
  const errorMessage = typeof error === 'string' ? error : error.message || 'Unknown error';

  // Network errors
  if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
    return `Unable to connect to the server. Please check your internet connection and try again.`;
  }

  // Timeout errors
  if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
    return `The request is taking longer than expected. Please check your connection and try again.`;
  }

  // CORS errors
  if (errorMessage.includes('CORS')) {
    return `There's a connection issue with our servers. Please try again in a few moments.`;
  }

  // Authentication errors
  if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
    return `Authentication failed. Please refresh the page and try again.`;
  }

  // Not found errors
  if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
    return `The requested information could not be found. Please try again later.`;
  }

  // Rate limit errors
  if (errorMessage.includes('429') || errorMessage.includes('Too Many Requests')) {
    return `Too many requests. Please wait a moment and try again.`;
  }

  // Server errors
  if (errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
    return `Our servers are experiencing issues. Please try again in a few moments.`;
  }

  // Validation errors
  if (errorMessage.includes('invalid') || errorMessage.includes('validation')) {
    return `The data format is incorrect. Please refresh the page and try again.`;
  }

  // Generic error with context
  return `An error occurred while ${context}. Please try again. If the problem persists, contact support.`;
}

/**
 * Validate and transform station data with comprehensive error handling
 * @param {*} rawStation - Raw station data from API
 * @param {number} index - Station index
 * @returns {{valid: boolean, station: object|null, errors: string[]}}
 */
export function validateAndTransformStation(rawStation, index) {
  const validation = validateStation(rawStation, index);

  if (!validation.valid) {
    console.warn(`⚠️ Invalid station at index ${index}:`, validation.errors);
    return {
      valid: false,
      station: null,
      errors: validation.errors
    };
  }

  // Transform validated data
  const transformed = {
    id: validation.data.id,
    name: validation.data.name,
    lat: validation.data.lat,
    lng: validation.data.lng,
    address: validation.data.address || `${validation.data.city || 'Melbourne'}, VIC`,
    city: validation.data.city || 'Melbourne',
    region: validation.data.region,
    postalCode: validation.data.postalCode,
    country: validation.data.country,
    category: validation.data.category,
    locationDetails: validation.data.locationDetails,
    fuelPrices: validation.data.fuelPrices,
    brand: validation.data.brand || 'Unknown',
    // Generate realistic prices for demo - TODO: Get from linked Fuel Prices table
    prices: {
      unleaded: 180 + Math.random() * 20,
      premium: 190 + Math.random() * 20,
      premium98: 200 + Math.random() * 25,
      diesel: 175 + Math.random() * 20,
      gas: 85 + Math.random() * 15
    },
    source: 'baserow',
    lastUpdated: new Date().toISOString()
  };

  return {
    valid: true,
    station: transformed,
    errors: []
  };
}

const validationUtils = {
  validateStation,
  validateStations,
  validateAPIResponse,
  getUserFriendlyError,
  validateAndTransformStation
};

export default validationUtils;

