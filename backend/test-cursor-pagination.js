/**
 * Test script for cursor-based pagination
 * Run this to verify the Baserow API pagination is working correctly
 */

const BaserowClient = require('./baserowClient');

async function testCursorPagination() {
  console.log('🧪 Testing Cursor-Based Pagination Implementation\n');
  
  const client = new BaserowClient();
  
  try {
    // Test 1: Test connection
    console.log('📡 Test 1: Testing Baserow connection...');
    const connectionTest = await client.testConnection();
    console.log('✅ Connection test:', connectionTest.connected ? 'PASSED' : 'FAILED');
    console.log(`   - API URL: ${connectionTest.config.apiUrl}`);
    console.log(`   - Has Token: ${connectionTest.config.hasToken}`);
    console.log('');
    
    // Test 2: Fetch single page
    console.log('📄 Test 2: Fetching single page of stations...');
    const singlePage = await client.getPetrolStations({ size: 10 });
    console.log(`✅ Single page fetch: ${singlePage.results ? 'PASSED' : 'FAILED'}`);
    console.log(`   - Results: ${singlePage.results?.length || 0} stations`);
    console.log(`   - Has next URL: ${singlePage.next ? 'Yes' : 'No'}`);
    if (singlePage.next) {
      console.log(`   - Next URL format: ${singlePage.next.includes('offset=') ? 'Contains offset (cursor)' : 'Unknown format'}`);
    }
    console.log('');
    
    // Test 3: Fetch all stations with pagination
    console.log('📚 Test 3: Fetching all stations with cursor pagination...');
    const startTime = Date.now();
    const allStations = await client.getAllPetrolStations();
    const endTime = Date.now();
    
    console.log(`✅ Pagination test: ${allStations.length > 0 ? 'PASSED' : 'FAILED'}`);
    console.log(`   - Total stations: ${allStations.length}`);
    console.log(`   - Time taken: ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
    console.log(`   - Average time per station: ${((endTime - startTime) / allStations.length).toFixed(2)} ms`);
    console.log('');
    
    // Test 4: Verify data structure
    if (allStations.length > 0) {
      console.log('🔍 Test 4: Verifying data structure...');
      const sampleStation = allStations[0];
      const hasRequiredFields = [
        'id',
        'Station Name',
        'Latitude', 
        'Longitude',
        'Address'
      ].every(field => {
        const hasField = sampleStation.hasOwnProperty(field) || 
                        sampleStation.hasOwnProperty(field.toLowerCase().replace(' ', '_'));
        if (!hasField) {
          console.log(`   ❌ Missing field: ${field}`);
        }
        return hasField;
      });
      
      console.log(`✅ Data structure test: ${hasRequiredFields ? 'PASSED' : 'FAILED'}`);
      console.log(`   - Sample station ID: ${sampleStation.id}`);
      console.log(`   - Sample station name: ${sampleStation['Station Name'] || sampleStation.station_name || 'N/A'}`);
      console.log('');
    }
    
    // Summary
    console.log('📊 SUMMARY');
    console.log('═'.repeat(50));
    console.log(`Total stations fetched: ${allStations.length}`);
    console.log(`Implementation: Cursor-based pagination`);
    console.log(`Status: ${allStations.length > 0 ? '✅ Working correctly' : '❌ Issues detected'}`);
    
    if (allStations.length < 100) {
      console.log('\n⚠️  WARNING: Expected more stations (e.g., 650+)');
      console.log('   This might indicate pagination is not fetching all pages.');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testCursorPagination()
    .then(() => {
      console.log('\n✅ All tests completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Test script error:', error);
      process.exit(1);
    });
}