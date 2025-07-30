// Test script to verify API endpoints are returning all records
const axios = require('axios');
const config = require('./config');

const API_BASE = 'http://localhost:3001';

async function testAPIEndpoints() {
  console.log('🧪 Testing Petrol Station API Endpoints...\n');
  
  try {
    // Test 1: Direct Baserow Connection
    console.log('1️⃣ Testing Baserow Connection...');
    const testResponse = await axios.get(`${API_BASE}/api/baserow/test`);
    console.log('✅ Baserow connection:', testResponse.data);
    console.log('');
    
    // Test 2: Fetch All Stations
    console.log('2️⃣ Testing /api/stations/all endpoint...');
    const startTime = Date.now();
    const allStationsResponse = await axios.get(`${API_BASE}/api/stations/all`);
    const endTime = Date.now();
    
    console.log(`✅ Response received in ${endTime - startTime}ms`);
    console.log(`📊 Total stations returned: ${allStationsResponse.data.count || allStationsResponse.data.data.length}`);
    console.log(`📋 Success status: ${allStationsResponse.data.success}`);
    
    if (allStationsResponse.data.data && allStationsResponse.data.data.length > 0) {
      console.log(`\n📍 Sample station data:`);
      const sampleStation = allStationsResponse.data.data[0];
      console.log({
        id: sampleStation.id,
        name: sampleStation.field_5072130 || sampleStation['Station Name'],
        address: sampleStation.field_5072131 || sampleStation.Address,
        city: sampleStation.field_5072132 || sampleStation.City,
        latitude: sampleStation.field_5072136 || sampleStation.Latitude,
        longitude: sampleStation.field_5072137 || sampleStation.Longitude
      });
    }
    
    // Test 3: Paginated Endpoint
    console.log('\n3️⃣ Testing /api/stations paginated endpoint...');
    const paginatedResponse = await axios.get(`${API_BASE}/api/stations?size=10`);
    console.log(`✅ Paginated response received`);
    console.log(`📊 Records in this page: ${paginatedResponse.data.data?.length || 0}`);
    console.log(`➡️  Has next page: ${!!paginatedResponse.data.next}`);
    
    // Test 4: Check for issues
    console.log('\n🔍 Checking for potential issues...');
    
    const totalStations = allStationsResponse.data.data.length;
    if (totalStations === 0) {
      console.error('❌ ERROR: No stations returned! Check Baserow connection and table ID.');
    } else if (totalStations < 100) {
      console.warn(`⚠️  WARNING: Only ${totalStations} stations returned. Expected around 650.`);
      console.warn('   Possible causes:');
      console.warn('   - Baserow API pagination not working correctly');
      console.warn('   - API token permissions issue');
      console.warn('   - Wrong table ID configured');
    } else if (totalStations < 650) {
      console.warn(`⚠️  WARNING: ${totalStations} stations returned, but expected 650.`);
      console.warn('   Some records might be missing or filtered out.');
    } else {
      console.log(`✅ All ${totalStations} stations successfully fetched!`);
    }
    
    // Test 5: Direct Baserow API call (bypass backend)
    console.log('\n4️⃣ Testing direct Baserow API call...');
    try {
      const directResponse = await axios.get(
        `${config.baserow.apiUrl}/database/rows/table/${config.baserow.tables.petrolStations.id}/`,
        {
          headers: {
            'Authorization': `Token ${config.baserow.token}`,
            'Content-Type': 'application/json'
          },
          params: {
            user_field_names: true,
            size: 5
          }
        }
      );
      console.log(`✅ Direct Baserow API call successful`);
      console.log(`📊 Count in first page: ${directResponse.data.results.length}`);
      console.log(`📄 Total count available: ${directResponse.data.count || 'Not provided'}`);
    } catch (directError) {
      console.error('❌ Direct Baserow API call failed:', directError.message);
      if (directError.response) {
        console.error('   Status:', directError.response.status);
        console.error('   Data:', directError.response.data);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
console.log('🚀 Starting API tests...');
console.log(`📍 Testing against: ${API_BASE}`);
console.log(`🔑 Using Baserow table ID: ${config.baserow.tables.petrolStations.id}`);
console.log('========================================\n');

testAPIEndpoints().then(() => {
  console.log('\n✅ Tests completed!');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Tests failed:', err);
  process.exit(1);
});