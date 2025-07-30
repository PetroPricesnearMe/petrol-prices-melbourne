import React, { useState, useEffect } from 'react';
import { baserowAPI } from '../config';

const BaserowStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  const fetchStations = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo({});

    try {
      console.log('🔄 Starting station fetch...');
      const startTime = Date.now();
      
      const data = await baserowAPI.fetchAllStations();
      
      const endTime = Date.now();
      const fetchTime = endTime - startTime;
      
      setStations(data);
      setDebugInfo({
        totalStations: data.length,
        fetchTime: `${fetchTime}ms`,
        timestamp: new Date().toISOString(),
        sampleStation: data[0] || null
      });
      
      console.log(`✅ Fetched ${data.length} stations in ${fetchTime}ms`);
    } catch (err) {
      console.error('❌ Error fetching stations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      console.log('🧪 Testing Baserow connection...');
      const result = await baserowAPI.testConnection();
      console.log('✅ Connection test result:', result);
      setDebugInfo(prev => ({ ...prev, connectionTest: result }));
    } catch (err) {
      console.error('❌ Connection test failed:', err);
      setError(`Connection test failed: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Baserow Stations Debug</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={fetchStations}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Refresh Stations'}
        </button>
        
        <button 
          onClick={testConnection}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Connection
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          padding: '15px',
          marginBottom: '20px',
          color: '#721c24'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {Object.keys(debugInfo).length > 0 && (
        <div style={{
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '5px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <h3>Debug Information</h3>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      <div>
        <h3>Stations ({stations.length})</h3>
        {stations.length > 0 ? (
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>
            {stations.slice(0, 10).map((station, index) => (
              <div key={station.id || index} style={{
                border: '1px solid #ddd',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
                backgroundColor: '#f9f9f9'
              }}>
                <strong>Station {index + 1}:</strong> {station.field_5072130 || station['Station Name'] || 'Unknown'}
                <br />
                <small>
                  ID: {station.id} | 
                  Lat: {station.field_5072136 || station.Latitude} | 
                  Lng: {station.field_5072137 || station.Longitude} |
                  Address: {station.field_5072131 || station.Address || 'N/A'}
                </small>
              </div>
            ))}
            {stations.length > 10 && (
              <div style={{ textAlign: 'center', padding: '10px', color: '#666' }}>
                ... and {stations.length - 10} more stations
              </div>
            )}
          </div>
        ) : (
          <p>No stations found</p>
        )}
      </div>
    </div>
  );
};

export default BaserowStations; 