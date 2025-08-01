/**
 * Example: Cursor-based pagination for Baserow API
 * This demonstrates how to fetch all rows using the "next" cursor
 */

const axios = require('axios');

// Configuration
const BASEROW_API_URL = 'https://api.baserow.io';
const TABLE_ID = '623329'; // Your petrol stations table ID
const TOKEN = 'YOUR_TOKEN_HERE'; // Replace with your actual token

/**
 * Fetch all rows from a Baserow table using cursor-based pagination
 * @param {Function} processRowCallback - Function to process each row
 * @returns {Promise<Array>} All rows from the table
 */
async function fetchAllRowsWithCursor(processRowCallback) {
  let allRows = [];
  let nextUrl = `${BASEROW_API_URL}/api/database/rows/table/${TABLE_ID}/?user_field_names=true&size=50`;
  let pageCount = 0;

  console.log('🔄 Starting to fetch all rows from Baserow...');

  while (nextUrl) {
    try {
      const response = await axios.get(nextUrl, {
        headers: {
          'Authorization': `Token ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      pageCount++;

      // Process each row
      if (data.results && Array.isArray(data.results)) {
        data.results.forEach(row => {
          if (processRowCallback) {
            processRowCallback(row);
          }
          allRows.push(row);
        });

        console.log(`📥 Page ${pageCount}: Fetched ${data.results.length} rows, total: ${allRows.length}`);
      }

      // Update to the next cursor/page URL or break the loop if done
      nextUrl = data.next;

    } catch (error) {
      console.error('❌ Error fetching data:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  console.log(`✅ Successfully fetched all ${allRows.length} rows in ${pageCount} pages`);
  return allRows;
}

/**
 * Example usage for frontend implementation
 */
async function exampleUsage() {
  try {
    // Example 1: Fetch all rows and process each one
    const allStations = await fetchAllRowsWithCursor(row => {
      // Process each station/row as needed
      console.log(`Processing station: ${row.stationName || row.station_name}`);
      
      // Example: Add marker to map
      // addMarkerToMap({
      //   lat: row.latitude,
      //   lng: row.longitude,
      //   name: row.stationName
      // });
    });

    console.log(`Total stations loaded: ${allStations.length}`);

    // Example 2: Fetch all and then filter
    const melbourneStations = allStations.filter(station => 
      station.city === 'Melbourne' || station.region === 'Victoria'
    );
    console.log(`Melbourne stations: ${melbourneStations.length}`);

  } catch (error) {
    console.error('Failed to fetch stations:', error);
  }
}

/**
 * Browser/Frontend version using fetch API
 */
async function fetchAllRowsInBrowser() {
  let allRows = [];
  let nextUrl = `https://api.baserow.io/api/database/rows/table/623329/?user_field_names=true&size=50`;
  const token = 'YOUR_TOKEN_HERE';

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Add results to our collection
    if (data.results) {
      allRows = allRows.concat(data.results);
    }

    // Use the next URL for cursor-based pagination
    nextUrl = data.next;
  }

  return allRows;
}

// Export for use in other modules
module.exports = {
  fetchAllRowsWithCursor,
  fetchAllRowsInBrowser
};

// Run example if called directly
if (require.main === module) {
  exampleUsage();
}