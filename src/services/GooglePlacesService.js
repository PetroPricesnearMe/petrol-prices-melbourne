/**
 * Google Places API Service
 * Handles all Google Places API interactions for petrol stations
 */

import config from '../config';

class GooglePlacesService {
  constructor() {
    this.apiKey = config.google.placesApiKey;
    this.apiUrl = config.google.placesApiUrl;
  }

  /**
   * Search for petrol stations using Google Places API
   * @param {Object} options - Search options
   * @param {string} options.query - Search query (e.g., "petrol stations near Melbourne")
   * @param {Object} options.location - Location bias (optional)
   * @param {number} options.location.latitude - Latitude
   * @param {number} options.location.longitude - Longitude
   * @param {number} options.radius - Search radius in meters (optional)
   * @param {number} options.pageSize - Number of results per page (1-20)
   * @param {string} options.pageToken - Token for pagination (optional)
   * @returns {Promise<Object>} API response with places data
   */
  async searchPlaces({
    query,
    location = null,
    radius = 5000,
    pageSize = 20,
    pageToken = null,
    includedType = 'gas_station',
  }) {
    try {
      const requestBody = {
        textQuery: query,
        pageSize: Math.min(Math.max(pageSize, 1), 20),
        includedType: includedType,
      };

      // Add location bias if provided
      if (location && location.latitude && location.longitude) {
        if (radius) {
          requestBody.locationBias = {
            circle: {
              center: {
                latitude: location.latitude,
                longitude: location.longitude,
              },
              radius: radius,
            },
          };
        } else {
          requestBody.locationBias = {
            rectangle: {
              low: {
                latitude: location.latitude - 0.01,
                longitude: location.longitude - 0.01,
              },
              high: {
                latitude: location.latitude + 0.01,
                longitude: location.longitude + 0.01,
              },
            },
          };
        }
      }

      // Add pagination token if provided
      if (pageToken) {
        requestBody.pageToken = pageToken;
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask':
            'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.userRatingCount,places.priceLevel,places.businessStatus,places.currentOpeningHours,places.websiteUri,places.nationalPhoneNumber,places.photos,nextPageToken',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Google Places API error: ${response.status} - ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching Google Places:', error);
      throw error;
    }
  }

  /**
   * Search for petrol stations near a specific location
   * @param {Object} location - Location coordinates
   * @param {number} location.latitude - Latitude
   * @param {number} location.longitude - Longitude
   * @param {number} radius - Search radius in meters (default: 5000)
   * @param {number} pageSize - Number of results (default: 20)
   * @returns {Promise<Array>} Array of petrol stations
   */
  async searchPetrolStationsNearLocation(
    location,
    radius = 5000,
    pageSize = 20
  ) {
    try {
      const response = await this.searchPlaces({
        query: 'petrol stations gas stations fuel',
        location: location,
        radius: radius,
        pageSize: pageSize,
        includedType: 'gas_station',
      });

      return response.places || [];
    } catch (error) {
      console.error('Error searching petrol stations near location:', error);
      throw error;
    }
  }

  /**
   * Search for petrol stations by brand
   * @param {string} brand - Brand name (e.g., "Shell", "BP", "7-Eleven")
   * @param {Object} location - Location coordinates (optional)
   * @param {number} radius - Search radius in meters (optional)
   * @returns {Promise<Array>} Array of petrol stations
   */
  async searchPetrolStationsByBrand(brand, location = null, radius = 10000) {
    try {
      const query = `${brand} petrol station gas station fuel`;
      const response = await this.searchPlaces({
        query: query,
        location: location,
        radius: radius,
        includedType: 'gas_station',
      });

      return response.places || [];
    } catch (error) {
      console.error(`Error searching ${brand} petrol stations:`, error);
      throw error;
    }
  }

  /**
   * Get place details by place ID
   * @param {string} placeId - Google Places place ID
   * @returns {Promise<Object>} Place details
   */
  async getPlaceDetails(placeId) {
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask':
              'id,displayName,formattedAddress,location,types,rating,userRatingCount,priceLevel,businessStatus,currentOpeningHours,websiteUri,nationalPhoneNumber,photos,reviews',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Google Places API error: ${response.status} - ${errorData.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting place details:', error);
      throw error;
    }
  }

  /**
   * Search for petrol stations with specific amenities
   * @param {Array} amenities - Array of amenity types
   * @param {Object} location - Location coordinates (optional)
   * @param {number} radius - Search radius in meters (optional)
   * @returns {Promise<Array>} Array of petrol stations
   */
  async searchPetrolStationsWithAmenities(
    amenities = [],
    location = null,
    radius = 10000
  ) {
    try {
      const amenityQuery =
        amenities.length > 0 ? ` ${amenities.join(' ')}` : '';
      const query = `petrol station gas station fuel${amenityQuery}`;

      const response = await this.searchPlaces({
        query: query,
        location: location,
        radius: radius,
        includedType: 'gas_station',
      });

      return response.places || [];
    } catch (error) {
      console.error('Error searching petrol stations with amenities:', error);
      throw error;
    }
  }

  /**
   * Convert Google Places result to our station format
   * @param {Object} place - Google Places place object
   * @returns {Object} Formatted station object
   */
  formatPlaceToStation(place) {
    return {
      id:
        place.id ||
        `google_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: place.displayName?.text || 'Unknown Station',
      address: place.formattedAddress || '',
      latitude: place.location?.latitude || 0,
      longitude: place.location?.longitude || 0,
      brand: this.extractBrandFromName(place.displayName?.text || ''),
      rating: place.rating || 0,
      userRatingCount: place.userRatingCount || 0,
      priceLevel: place.priceLevel || 'PRICE_LEVEL_UNSPECIFIED',
      businessStatus: place.businessStatus || 'BUSINESS_STATUS_UNSPECIFIED',
      openingHours: place.currentOpeningHours || null,
      phone: place.nationalPhoneNumber || '',
      website: place.websiteUri || '',
      photos: place.photos || [],
      types: place.types || [],
      isGooglePlaces: true,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Extract brand name from station name
   * @param {string} name - Station name
   * @returns {string} Brand name
   */
  extractBrandFromName(name) {
    const brandPatterns = [
      { pattern: /shell/i, brand: 'Shell' },
      { pattern: /bp\b/i, brand: 'BP' },
      { pattern: /7-eleven|seven\s*eleven/i, brand: '7-Eleven' },
      { pattern: /mobil/i, brand: 'Mobil' },
      { pattern: /coles\s*express/i, brand: 'Coles Express' },
      { pattern: /caltex/i, brand: 'Caltex' },
      { pattern: /ampol/i, brand: 'Ampol' },
      { pattern: /united/i, brand: 'United' },
      { pattern: /liberty/i, brand: 'Liberty' },
      { pattern: /apco/i, brand: 'APCO' },
      { pattern: /metro/i, brand: 'Metro' },
      { pattern: /puma/i, brand: 'Puma' },
      { pattern: /vibe/i, brand: 'Vibe' },
    ];

    for (const { pattern, brand } of brandPatterns) {
      if (pattern.test(name)) {
        return brand;
      }
    }

    return 'Independent';
  }

  /**
   * Get photo URL from Google Places photo reference
   * @param {Object} photo - Photo object from Google Places
   * @param {number} maxWidth - Maximum width (default: 400)
   * @param {number} maxHeight - Maximum height (default: 400)
   * @returns {string} Photo URL
   */
  getPhotoUrl(photo, maxWidth = 400, maxHeight = 400) {
    if (!photo || !photo.name) return null;

    return `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}&key=${this.apiKey}`;
  }
}

// Create and export a singleton instance
const googlePlacesService = new GooglePlacesService();
export default googlePlacesService;
