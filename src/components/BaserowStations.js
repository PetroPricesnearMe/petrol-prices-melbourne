import React, { useState, useEffect } from 'react';
import { baserowAPI } from '../config';

const BaserowStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [tableId, setTableId] = useState(''); // You'll need to set your actual table ID

  // Test Baserow connection
  const testConnection = async () => {
    try {
      setLoading(true);
      const result = await baserowAPI.testConnection();
      setConnectionStatus(result);
      console.log('Connection test result:', result);
    } catch (err) {
      setError(`Connection test failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all stations using backend pagination
  const fetchAllStations = async () => {
    if (!tableId) {
      setError('Please enter a table ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const allStations = await baserowAPI.fetchAllStations(tableId);
      setStations(allStations);
      console.log(`Fetched ${allStations.length} stations:`, allStations);
    } catch (err) {
      setError(`Failed to fetch stations: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all stations using direct API call
  const fetchAllStationsDirect = async () => {
    if (!tableId) {
      setError('Please enter a table ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const allStations = await baserowAPI.fetchAllStationsDirect(tableId);
      setStations(allStations);
      console.log(`Fetched ${allStations.length} stations directly:`, allStations);
    } catch (err) {
      setError(`Failed to fetch stations directly: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Baserow Stations with Pagination</h2>
      
      {/* Connection Test Section */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Connection Test</h3>
        <button onClick={testConnection} disabled={loading}>
          {loading ? 'Testing...' : 'Test Baserow Connection'}
        </button>
        
        {connectionStatus && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '3px' }}>
            <p><strong>Status:</strong> {connectionStatus.connected ? '✅ Connected' : '❌ Not Connected'}</p>
            <p><strong>API URL:</strong> {connectionStatus.config?.apiUrl}</p>
            <p><strong>Has Token:</strong> {connectionStatus.config?.hasToken ? 'Yes' : 'No'}</p>
            <p><strong>MCP Server:</strong> {connectionStatus.mcpServerUrl}</p>
          </div>
        )}
      </div>

      {/* Fetch Stations Section */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Fetch All Stations</h3>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="tableId">Table ID: </label>
          <input
            id="tableId"
            type="text"
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            placeholder="Enter your Baserow table ID"
            style={{ padding: '5px', marginLeft: '10px', minWidth: '200px' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchAllStations} disabled={loading || !tableId}>
            {loading ? 'Fetching...' : 'Fetch via Backend'}
          </button>
          <button onClick={fetchAllStationsDirect} disabled={loading || !tableId}>
            {loading ? 'Fetching...' : 'Fetch Direct API'}
          </button>
        </div>
        
        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Backend method uses your server's API, Direct method calls Baserow API directly from the browser.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffe6e6', 
          border: '1px solid #ff9999', 
          borderRadius: '3px',
          marginBottom: '20px',
          color: '#cc0000'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results Display */}
      {stations.length > 0 && (
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Fetched Stations ({stations.length} total)</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {stations.map((station, index) => (
              <div 
                key={station.id || index} 
                style={{ 
                  padding: '10px', 
                  margin: '5px 0', 
                  backgroundColor: '#f9f9f9', 
                  borderRadius: '3px',
                  fontSize: '14px'
                }}
              >
                <strong>Row {index + 1}:</strong>
                <pre style={{ margin: '5px 0', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(station, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ 
            display: 'inline-block', 
            width: '20px', 
            height: '20px', 
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Loading...</p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BaserowStations; 