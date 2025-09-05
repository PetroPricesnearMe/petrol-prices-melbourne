import React, { useState, useEffect } from 'react';
import dataSourceManager from '../services/DataSourceManager';

/**
 * Data Source Debug Component
 * 
 * This component provides debugging information and controls for data sources.
 * It helps identify issues with data fetching and provides tools to test different sources.
 */
const DataSourceDebug = ({ isVisible = false }) => {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Update status when component mounts or when visibility changes
  useEffect(() => {
    if (isVisible) {
      setStatus(dataSourceManager.getStatus());
    }
  }, [isVisible]);

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await dataSourceManager.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ connected: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchSource = (source) => {
    dataSourceManager.setActiveSource(source);
    setStatus(dataSourceManager.getStatus());
    setTestResult(null);
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      await dataSourceManager.fetchStations(true); // Force refresh
      setStatus(dataSourceManager.getStatus());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '350px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      fontSize: '0.9rem'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>🔧 Data Source Debug</h3>
      
      {/* Current Status */}
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Current Status</h4>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '0.75rem', 
          borderRadius: '4px',
          fontSize: '0.8rem'
        }}>
          <div><strong>Active Source:</strong> {status?.activeSource || 'Unknown'}</div>
          <div><strong>Loading:</strong> {status?.isLoading ? '⏳ Yes' : '✅ No'}</div>
          <div><strong>Cache Valid:</strong> {status?.cacheValid ? '✅ Yes' : '❌ No'}</div>
          <div><strong>Cache Size:</strong> {status?.cacheSize || 0} items</div>
          <div><strong>Last Fetch:</strong> {status?.lastFetchTime ? new Date(status.lastFetchTime).toLocaleTimeString() : 'Never'}</div>
        </div>
      </div>

      {/* Source Selection */}
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Switch Data Source</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {status?.availableSources?.map(source => (
            <button
              key={source}
              onClick={() => handleSwitchSource(source)}
              disabled={isLoading}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: status?.activeSource === source ? '#007bff' : 'white',
                color: status?.activeSource === source ? 'white' : '#333',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem'
              }}
            >
              {source.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Actions</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleTestConnection}
            disabled={isLoading}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #28a745',
              borderRadius: '4px',
              backgroundColor: '#28a745',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.8rem'
            }}
          >
            {isLoading ? '⏳ Testing...' : '🔍 Test Connection'}
          </button>
          <button
            onClick={handleRefreshData}
            disabled={isLoading}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #17a2b8',
              borderRadius: '4px',
              backgroundColor: '#17a2b8',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.8rem'
            }}
          >
            {isLoading ? '⏳ Refreshing...' : '🔄 Refresh Data'}
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResult && (
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Test Results</h4>
          <div style={{ 
            backgroundColor: testResult.connected ? '#d4edda' : '#f8d7da',
            border: `1px solid ${testResult.connected ? '#c3e6cb' : '#f5c6cb'}`,
            color: testResult.connected ? '#155724' : '#721c24',
            padding: '0.75rem',
            borderRadius: '4px',
            fontSize: '0.8rem'
          }}>
            <div><strong>Status:</strong> {testResult.connected ? '✅ Connected' : '❌ Failed'}</div>
            {testResult.error && <div><strong>Error:</strong> {testResult.error}</div>}
            {testResult.source && <div><strong>Source:</strong> {testResult.source}</div>}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{ 
        backgroundColor: '#e9ecef', 
        padding: '0.75rem', 
        borderRadius: '4px',
        fontSize: '0.8rem',
        color: '#495057'
      }}>
        <strong>💡 Debug Tips:</strong>
        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
          <li>Switch sources to test different data providers</li>
          <li>Use "Test Connection" to verify API access</li>
          <li>Use "Refresh Data" to force reload from source</li>
          <li>Check browser console for detailed logs</li>
          <li>CORS issues: Try switching to mock data source</li>
          <li>Check network tab for failed requests</li>
        </ul>
      </div>
    </div>
  );
};

export default DataSourceDebug;
