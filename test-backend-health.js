#!/usr/bin/env node

/**
 * Backend Health Check Script
 * Tests all backend endpoints and reports status
 */

const http = require('http');

const BASE_URL = process.env.API_URL || 'http://localhost:3001';
const TESTS = [
  { name: 'Root Endpoint', path: '/', method: 'GET' },
  { name: 'Spatial Data', path: '/api/stations/spatial', method: 'GET' },
  { name: 'All Stations', path: '/api/stations/all', method: 'GET' },
  { name: 'Paginated Stations', path: '/api/stations', method: 'GET' },
  { name: 'Baserow Test', path: '/api/baserow/test', method: 'GET' }
];

console.log('🔬 Backend Health Check');
console.log('='.repeat(50));
console.log(`Testing: ${BASE_URL}`);
console.log('='.repeat(50));
console.log('');

let passed = 0;
let failed = 0;

async function testEndpoint(test) {
  return new Promise((resolve) => {
    const url = new URL(test.path, BASE_URL);
    const startTime = Date.now();

    const req = http.get(url, (res) => {
      const responseTime = Date.now() - startTime;
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            success: res.statusCode === 200,
            statusCode: res.statusCode,
            responseTime,
            dataSize: data.length,
            data: json
          });
        } catch (error) {
          resolve({
            success: false,
            statusCode: res.statusCode,
            responseTime,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message,
        code: error.code
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Timeout (10s)'
      });
    });
  });
}

async function runTests() {
  for (const test of TESTS) {
    process.stdout.write(`Testing: ${test.name}... `);
    
    const result = await testEndpoint(test);
    
    if (result.success) {
      console.log(`✅ PASS (${result.responseTime}ms)`);
      
      if (result.data) {
        if (result.data.success !== undefined) {
          console.log(`   └─ API Success: ${result.data.success}`);
        }
        if (result.data.count !== undefined) {
          console.log(`   └─ Data Count: ${result.data.count}`);
        }
        if (result.data.message) {
          console.log(`   └─ Message: ${result.data.message}`);
        }
      }
      
      passed++;
    } else {
      console.log(`❌ FAIL`);
      console.log(`   └─ Error: ${result.error || 'Unknown error'}`);
      
      if (result.code) {
        console.log(`   └─ Code: ${result.code}`);
        
        if (result.code === 'ECONNREFUSED') {
          console.log(`   └─ 💡 Backend server is not running`);
          console.log(`   └─ 🔧 Fix: cd backend && npm start`);
        }
      }
      
      if (result.statusCode) {
        console.log(`   └─ Status: ${result.statusCode}`);
      }
      
      failed++;
    }
    
    console.log('');
  }

  console.log('='.repeat(50));
  console.log('Summary:');
  console.log(`✅ Passed: ${passed}/${TESTS.length}`);
  console.log(`❌ Failed: ${failed}/${TESTS.length}`);
  console.log('='.repeat(50));
  
  if (failed === TESTS.length) {
    console.log('');
    console.log('🚨 ALL TESTS FAILED - Backend server is likely not running');
    console.log('');
    console.log('Quick Fix:');
    console.log('  1. Open a new terminal');
    console.log('  2. Run: cd backend');
    console.log('  3. Run: npm start');
    console.log('  4. Wait for: "🚀 Server running on port 3001"');
    console.log('  5. Rerun this test: node test-backend-health.js');
    console.log('');
    process.exit(1);
  } else if (failed > 0) {
    console.log('');
    console.log('⚠️  Some tests failed - Backend may have configuration issues');
    console.log('');
    process.exit(1);
  } else {
    console.log('');
    console.log('🎉 All tests passed! Backend is healthy.');
    console.log('');
    process.exit(0);
  }
}

runTests();

