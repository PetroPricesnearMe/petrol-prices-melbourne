/**
 * Test Google Places API Integration
 * Simple test to verify the API is working correctly
 */

import googlePlacesService from '../services/GooglePlacesService';

export const testGooglePlacesAPI = async () => {
  console.log('🧪 Testing Google Places API integration...');
  
  try {
    // Test 1: Search for petrol stations in Melbourne
    console.log('📍 Test 1: Searching for petrol stations in Melbourne...');
    const melbourneResults = await googlePlacesService.searchPlaces({
      query: 'petrol stations Melbourne Australia',
      pageSize: 5
    });
    
    console.log(`✅ Found ${melbourneResults.places?.length || 0} stations in Melbourne`);
    
    if (melbourneResults.places && melbourneResults.places.length > 0) {
      const firstStation = googlePlacesService.formatPlaceToStation(melbourneResults.places[0]);
      console.log('📋 Sample station:', {
        name: firstStation.name,
        address: firstStation.address,
        brand: firstStation.brand,
        rating: firstStation.rating
      });
    }

    // Test 2: Search by brand
    console.log('🏪 Test 2: Searching for Shell stations...');
    const shellResults = await googlePlacesService.searchPetrolStationsByBrand('Shell');
    console.log(`✅ Found ${shellResults.length} Shell stations`);

    // Test 3: Test brand extraction
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
      console.log(`"${name}" -> "${brand}"`);
    });

    console.log('🎉 All Google Places API tests completed successfully!');
    return true;
    
  } catch (error) {
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
