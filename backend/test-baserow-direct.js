// Direct test of Baserow API to verify data exists
const axios = require('axios');
const config = require('./config');

async function testBaserowDirect() {
  console.log('🧪 Testing Direct Baserow API...');
  console.log(`📍 API URL: ${config.baserow.apiUrl}`);
  console.log(`🔑 Table ID: ${config.baserow.tables.petrolStations.id}`);
  console.log(`🔐 Has Token: ${!!config.baserow.token}`);
  console.log('=====================================\n');
  
  try {
    // Test 1: First page to verify connection
    console.log('1️⃣ Testing first page (5 records)...');
    const response = await axios.get(
      `${config.baserow.apiUrl}/database/rows/table/${config.baserow.tables.petrolStations.id}/`,
      {
        headers: {
          'Authorization': `Token ${config.baserow.token}`,
          'Content-Type': 'application/json'
        },
        params: {
          user_field_names: true,
          size: 5
        },
        timeout: 10000
      }
    );
    
    console.log(`✅ Success! Response received`);
    console.log(`📊 Records in this page: ${response.data.results.length}`);
    console.log(`📄 Total count: ${response.data.count}`);
    console.log(`➡️  Has next page: ${!!response.data.next}`);
    
    if (response.data.results.length > 0) {
      console.log('\n📋 Sample record:');
      const sample = response.data.results[0];
      console.log(JSON.stringify(sample, null, 2));
    }
    
    // Test 2: Get total count
    if (response.data.count) {
      console.log(`\n🎯 FOUND ${response.data.count} TOTAL RECORDS IN BASEROW!`);
      
      if (response.data.count >= 650) {
        console.log('✅ This matches your expected 650+ records!');
      } else if (response.data.count < 100) {
        console.warn(`⚠️  Only ${response.data.count} records found - much less than 650 expected`);
      } else {
        console.log(`📝 ${response.data.count} records found - less than 650 but reasonable amount`);
      }
    }
    
    // Test 3: Try to get larger page
    console.log('\n2️⃣ Testing larger page (50 records)...');
    const largerResponse = await axios.get(
      `${config.baserow.apiUrl}/database/rows/table/${config.baserow.tables.petrolStations.id}/`,
      {
        headers: {
          'Authorization': `Token ${config.baserow.token}`,
          'Content-Type': 'application/json'
        },
        params: {
          user_field_names: true,
          size: 50
        },
        timeout: 15000
      }
    );
    
    console.log(`✅ Larger page retrieved: ${largerResponse.data.results.length} records`);
    
  } catch (error) {
    console.error('\n❌ Direct Baserow API test failed:');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status text:', error.response.statusText);
      console.error('Response data:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('\n🔑 AUTHENTICATION ERROR: Invalid or expired token');
      } else if (error.response.status === 404) {
        console.error('\n📋 TABLE NOT FOUND: Check table ID 623329');
      }
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n🌐 NETWORK ERROR: Cannot reach api.baserow.io');
    }
  }
}

testBaserowDirect().then(() => {
  console.log('\n✅ Direct test completed!');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Test crashed:', err);
  process.exit(1);
});