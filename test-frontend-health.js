// Frontend Health Check Script
// Run with: node test-frontend-health.js

const fetch = require('node-fetch');

const tests = [
  {
    name: 'Backend Health Check',
    url: 'http://localhost:3001/health',
    expect: { success: true },
    critical: true
  },
  {
    name: 'Stations API (All)',
    url: 'http://localhost:3001/api/stations/all',
    expect: { success: true },
    critical: true
  },
  {
    name: 'Baserow Connection Test',
    url: 'http://localhost:3001/api/baserow/test',
    expect: { success: true },
    critical: true
  },
  {
    name: 'Stations API (Paginated)',
    url: 'http://localhost:3001/api/stations?size=10',
    expect: { success: true },
    critical: false
  },
  {
    name: 'Fuel Prices API',
    url: 'http://localhost:3001/api/fuel-prices',
    expect: { success: true },
    critical: false
  }
];

async function runTests() {
  console.log('🧪 Running Frontend Health Checks...\n');
  console.log('='.repeat(60));
  
  let passCount = 0;
  let failCount = 0;
  let criticalFailures = [];
  
  for (const test of tests) {
    try {
      console.log(`\n📋 Testing: ${test.name}`);
      console.log(`   URL: ${test.url}`);
      
      const startTime = Date.now();
      const response = await fetch(test.url, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      const duration = Date.now() - startTime;
      
      const data = await response.json();
      
      const passed = response.ok && data.success === test.expect.success;
      
      if (passed) {
        passCount++;
        console.log(`   ✅ PASS (${duration}ms)`);
        
        // Show data count if available
        if (data.count !== undefined) {
          console.log(`   📊 Data Count: ${data.count}`);
        }
        if (data.data && Array.isArray(data.data)) {
          console.log(`   📊 Records: ${data.data.length}`);
        }
      } else {
        failCount++;
        console.log(`   ❌ FAIL (${duration}ms)`);
        console.log(`   Expected: success=${test.expect.success}`);
        console.log(`   Got: success=${data.success}, status=${response.status}`);
        
        if (data.error) {
          console.log(`   Error: ${data.error}`);
        }
        
        if (test.critical) {
          criticalFailures.push(test.name);
        }
      }
      
    } catch (error) {
      failCount++;
      console.log(`   ❌ FAIL - ${error.message}`);
      
      if (error.message.includes('ECONNREFUSED')) {
        console.log(`   🔧 Fix: Make sure backend is running (cd backend && npm start)`);
      } else if (error.message.includes('timeout')) {
        console.log(`   🔧 Fix: Server is slow or unresponsive`);
      }
      
      if (test.critical) {
        criticalFailures.push(test.name);
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${passCount}/${tests.length}`);
  console.log(`   ❌ Failed: ${failCount}/${tests.length}`);
  
  if (criticalFailures.length > 0) {
    console.log('\n🚨 CRITICAL FAILURES:');
    criticalFailures.forEach(name => {
      console.log(`   • ${name}`);
    });
    console.log('\n⚠️  Fix critical failures before deploying!');
  } else {
    console.log('\n✅ All critical tests passed!');
  }
  
  // Additional checks
  console.log('\n🔍 Additional Checks:');
  
  // Check environment variables
  console.log('\n📝 Environment Variables:');
  const envVars = [
    'REACT_APP_MAPBOX_ACCESS_TOKEN',
    'REACT_APP_BASEROW_TOKEN',
    'REACT_APP_API_URL'
  ];
  
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      const preview = value.length > 20 ? value.substring(0, 20) + '...' : value;
      console.log(`   ✅ ${varName}: ${preview}`);
    } else {
      console.log(`   ⚠️  ${varName}: Not set`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  
  process.exit(failCount > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});

