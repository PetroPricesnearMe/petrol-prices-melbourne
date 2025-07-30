const fetch = require('node-fetch');

// Test configuration
const config = {
  baserow: {
    token: 'WXGOdiCeNmvdj5NszzAdvIug3InwQQXP',
    apiUrl: 'https://api.baserow.io/api',
    tables: {
      petrolStations: {
        id: 623329
      }
    }
  },
  api: {
    baseUrl: 'http://localhost:3001'
  }
};

async function testBackendAPI() {
  console.log('🧪 Testing Backend API...');
  
  try {
    const response = await fetch(`${config.api.baseUrl}/api/stations/all`);
    const data = await response.json();
    
    console.log(`✅ Backend API Response:`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${data.success}`);
    console.log(`   Count: ${data.count}`);
    console.log(`   Data length: ${data.data?.length || 0}`);
    
    if (data.data && data.data.length > 0) {
      console.log(`   Sample station:`, data.data[0]);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Backend API test failed:', error.message);
    return null;
  }
}

async function testDirectBaserowAPI() {
  console.log('\n🧪 Testing Direct Baserow API...');
  
  try {
    let allRows = [];
    let next = null;
    let pageCount = 0;
    const maxPages = 10;
    
    do {
      pageCount++;
      if (pageCount > maxPages) {
        console.warn(`⚠️ Reached maximum page limit (${maxPages})`);
        break;
      }
      
      const url = new URL(`${config.baserow.apiUrl}/database/table/${config.baserow.tables.petrolStations.id}/row/`);
      url.searchParams.set('user_field_names', 'true');
      url.searchParams.set('size', '100');
      if (next) {
        url.searchParams.set('offset', next);
      }
      
      console.log(`📄 Fetching page ${pageCount}...`);
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Token ${config.baserow.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid response format from Baserow API');
      }
      
      allRows = allRows.concat(data.results);
      
      if (data.next) {
        const nextUrl = new URL(data.next);
        next = nextUrl.searchParams.get('offset');
      } else {
        next = null;
      }
      
      console.log(`📥 Fetched ${data.results.length} rows from page ${pageCount}, total: ${allRows.length}`);
      
      if (next) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } while (next);
    
    console.log(`✅ Direct API test successful:`);
    console.log(`   Total stations: ${allRows.length}`);
    console.log(`   Pages fetched: ${pageCount}`);
    
    if (allRows.length > 0) {
      console.log(`   Sample station:`, allRows[0]);
    }
    
    return allRows;
  } catch (error) {
    console.error('❌ Direct Baserow API test failed:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // Test backend API
  const backendResult = await testBackendAPI();
  
  // Test direct API
  const directResult = await testDirectBaserowAPI();
  
  console.log('\n📊 Test Summary:');
  console.log(`   Backend API: ${backendResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Direct API: ${directResult ? '✅ PASS' : '❌ FAIL'}`);
  
  if (backendResult && backendResult.data) {
    console.log(`   Backend stations: ${backendResult.data.length}`);
  }
  
  if (directResult) {
    console.log(`   Direct stations: ${directResult.length}`);
  }
  
  if (backendResult && directResult) {
    const backendCount = backendResult.data?.length || 0;
    const directCount = directResult.length;
    
    if (backendCount !== directCount) {
      console.log(`⚠️  Mismatch: Backend has ${backendCount} stations, Direct has ${directCount} stations`);
    } else {
      console.log(`✅ Counts match: ${backendCount} stations`);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testBackendAPI, testDirectBaserowAPI, runTests }; 