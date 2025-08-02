const axios = require('axios');

// Test configuration with new details
const config = {
  token: 'WXGOdiCeNmvdj5NszzAdvIug3InwQQXP',
  apiUrl: 'https://api.baserow.io/api',
  databaseId: 265358,
  tables: {
    petrolStations: {
      id: 623329,
      name: 'Petrol Stations'
    },
    fuelPrices: {
      id: 623330,
      name: 'Fuel Prices'
    },
    airtableImport: {
      id: 623331,
      name: 'Airtable import report'
    }
  }
};

async function testBaserowAPI() {
  console.log('🧪 Testing Baserow API with new configuration...');
  console.log(`📊 Database ID: ${config.databaseId}`);
  console.log(`🔑 Token: ${config.token.substring(0, 8)}...`);
  
  try {
    // Test 1: Get all tables
    console.log('\n📋 Test 1: Getting all tables...');
    const tablesResponse = await axios.get(`${config.apiUrl}/database/tables/all-tables/`, {
      headers: {
        'Authorization': `Token ${config.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Found ${tablesResponse.data.length} tables`);
    tablesResponse.data.forEach(table => {
      console.log(`  - ${table.name} (ID: ${table.id})`);
    });
    
    // Test 2: Get Petrol Stations table fields
    console.log('\n🏪 Test 2: Getting Petrol Stations table fields...');
    const fieldsResponse = await axios.get(`${config.apiUrl}/database/fields/table/${config.tables.petrolStations.id}/`, {
      headers: {
        'Authorization': `Token ${config.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Found ${fieldsResponse.data.length} fields in Petrol Stations table`);
    fieldsResponse.data.forEach(field => {
      console.log(`  - ${field.name} (ID: ${field.id}, Type: ${field.type})`);
    });
    
    // Test 3: Get some petrol stations data
    console.log('\n⛽ Test 3: Getting petrol stations data...');
    const stationsResponse = await axios.get(`${config.apiUrl}/database/rows/table/${config.tables.petrolStations.id}/?user_field_names=true&size=5`, {
      headers: {
        'Authorization': `Token ${config.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ Found ${stationsResponse.data.results.length} stations (showing first 5)`);
    stationsResponse.data.results.forEach((station, index) => {
      console.log(`  ${index + 1}. ${station['Station Name'] || station.field_5072130 || 'Unknown'} - ${station['City'] || station.field_5072132 || 'Unknown'}`);
    });
    
    console.log('\n🎉 All tests passed! API configuration is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testBaserowAPI(); 