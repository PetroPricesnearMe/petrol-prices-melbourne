/**
 * Test Google Places API Integration
 * Simple test to verify the API is working correctly
 */

import googlePlacesService from '../services/GooglePlacesService';


export const testGooglePlacesAPI = async () => {
  /* eslint-disable-next-line no-console */
  console.log('🧪 Testing Google Places API integration...');

  try {
    // Test 1: Search for petrol stations in Melbourne
    /* eslint-disable-next-line no-console */
    console.log('📍 Test 1: Searching for petrol stations in Melbourne...');
    const melbourneResults = await googlePlacesService.searchPlaces({
      query: 'petrol stations Melbourne Australia',
      pageSize: 5
    });

    /* eslint-disable-next-line no-console */
    console.log(`✅ Found ${melbourneResults.places?.length || 0} stations in Melbourne`);

    if (melbourneResults.places && melbourneResults.places.length > 0) {
      const firstStation = googlePlacesService.formatPlaceToStation(melbourneResults.places[0]);
      /* eslint-disable-next-line no-console */
      console.log('📋 Sample station:', {
        name: firstStation.name,
        address: firstStation.address,
        brand: firstStation.brand,
        rating: firstStation.rating
      });
    }

    // Test 2: Search by brand
    /* eslint-disable-next-line no-console */
    console.log('🏪 Test 2: Searching for Shell stations...');
    const shellResults = await googlePlacesService.searchPetrolStationsByBrand('Shell');
    /* eslint-disable-next-line no-console */
    console.log(`✅ Found ${shellResults.length} Shell stations`);

    // Test 3: Test brand extraction
    /* eslint-disable-next-line no-console */
    console.log('🔍 Test 3: Testing brand extraction...');
    const testNames = [
      'Shell Service Station',
      'BP Express',
      '7-Eleven Fuel',
      'Mobil Service Center',
      'Independent Fuel Stop'
    ];

    testNames.forEach(name => {
      const brand = googlePlacesService.extractBrandFromName(name);
      /* eslint-disable-next-line no-console */
      console.log(`"${name}" -> "${brand}"`);
    });

    /* eslint-disable-next-line no-console */
    console.log('🎉 All Google Places API tests completed successfully!');
    return true;

  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error('❌ Google Places API test failed:', error);
    return false;
  }
};

// Run test if this file is executed directly
if (typeof window !== 'undefined' && window.location.pathname.includes('google-places')) {
  // Only run in browser and on the google-places page
  setTimeout(() => {
    testGooglePlacesAPI();
  }, 2000);
}
