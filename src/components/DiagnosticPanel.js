import React, { useState, useEffect } from 'react';
import spatialDataService from '../services/SpatialDataService';
import dataSourceManager from '../services/DataSourceManager';

/**
 * Diagnostic Panel Component
 * Runs comprehensive system checks to identify issues
 */
const DiagnosticPanel = () => {
  const [diagnostics, setDiagnostics] = useState({
    backendConnection: { status: 'testing', message: '', details: null },
    apiConfiguration: { status: 'testing', message: '', details: null },
    corsCheck: { status: 'testing', message: '', details: null },
    baserowConnection: { status: 'testing', message: '', details: null },
    spatialDataFetch: { status: 'testing', message: '', details: null },
    environmentVariables: { status: 'testing', message: '', details: null },
    mapboxToken: { status: 'testing', message: '', details: null }
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    console.log('🔬 Starting comprehensive diagnostics...');
    
    // Test 1: Environment Variables
    await testEnvironmentVariables();
    
    // Test 2: API Configuration
    await testApiConfiguration();
    
    // Test 3: Backend Connection
    await testBackendConnection();
    
    // Test 4: CORS Check
    await testCORS();
    
    // Test 5: Baserow Connection
    await testBaserowConnection();
    
    // Test 6: Spatial Data Fetch
    await testSpatialDataFetch();
    
    // Test 7: Mapbox Token
    await testMapboxToken();
    
    console.log('🔬 Diagnostics complete!');
  };

  const testEnvironmentVariables = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const mapboxToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
      
      const details = {
        REACT_APP_API_URL: apiUrl || 'NOT SET',
        REACT_APP_MAPBOX_ACCESS_TOKEN: mapboxToken ? `${mapboxToken.slice(0, 10)}...` : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV,
        hostname: window.location.hostname
      };

      console.log('📋 Environment Variables:', details);

      if (!apiUrl) {
        updateDiagnostic('environmentVariables', 'warning', 
          'REACT_APP_API_URL not set, using default', details);
      } else {
        updateDiagnostic('environmentVariables', 'success', 
          'Environment variables configured', details);
      }
    } catch (error) {
      updateDiagnostic('environmentVariables', 'error', 
        `Error: ${error.message}`, null);
    }
  };

  const testApiConfiguration = async () => {
    try {
      const status = spatialDataService.getStatus();
      
      console.log('⚙️ API Configuration:', status);

      updateDiagnostic('apiConfiguration', 'success', 
        `Base URL: ${status.endpoint}`, status);
    } catch (error) {
      updateDiagnostic('apiConfiguration', 'error', 
        `Configuration error: ${error.message}`, null);
    }
  };

  const testBackendConnection = async () => {
    try {
      console.log('🔌 Testing backend connection...');
      
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const startTime = Date.now();
      const response = await fetch(`${baseUrl}/`, {
        method: 'GET',
        signal: controller.signal
      });
      const responseTime = Date.now() - startTime;
      clearTimeout(timeoutId);

      const data = await response.json();

      console.log('✅ Backend responded:', data);

      updateDiagnostic('backendConnection', 'success', 
        `Backend is running (${responseTime}ms)`, {
          status: response.status,
          responseTime: `${responseTime}ms`,
          message: data.message,
          version: data.version
        });
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      
      if (error.name === 'AbortError') {
        updateDiagnostic('backendConnection', 'error', 
          'Backend not responding (timeout after 5s)', {
            error: 'Timeout',
            suggestion: 'Start backend server: cd backend && npm start'
          });
      } else {
        updateDiagnostic('backendConnection', 'error', 
          `Backend not running: ${error.message}`, {
            error: error.message,
            suggestion: 'Start backend server: cd backend && npm start'
          });
      }
    }
  };

  const testCORS = async () => {
    try {
      console.log('🌐 Testing CORS...');
      
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods')
      };

      console.log('✅ CORS headers:', corsHeaders);

      updateDiagnostic('corsCheck', 'success', 
        'CORS properly configured', corsHeaders);
    } catch (error) {
      console.error('❌ CORS check failed:', error);
      
      if (error.message.includes('CORS')) {
        updateDiagnostic('corsCheck', 'error', 
          'CORS policy blocking requests', {
            error: error.message,
            suggestion: 'Check backend CORS configuration'
          });
      } else {
        updateDiagnostic('corsCheck', 'warning', 
          'Unable to test CORS (backend not running)', null);
      }
    }
  };

  const testBaserowConnection = async () => {
    try {
      console.log('🗄️ Testing Baserow connection...');
      
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/baserow/test`, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });

      const data = await response.json();
      
      console.log('✅ Baserow test:', data);

      if (data.success) {
        updateDiagnostic('baserowConnection', 'success', 
          'Baserow connected', data);
      } else {
        updateDiagnostic('baserowConnection', 'error', 
          `Baserow error: ${data.error}`, data);
      }
    } catch (error) {
      console.error('❌ Baserow test failed:', error);
      
      updateDiagnostic('baserowConnection', 'warning', 
        'Cannot test Baserow (backend not available)', {
          error: error.message
        });
    }
  };

  const testSpatialDataFetch = async () => {
    try {
      console.log('🗺️ Testing spatial data fetch...');
      
      const startTime = Date.now();
      const data = await spatialDataService.fetchSpatialData(true);
      const fetchTime = Date.now() - startTime;

      console.log(`✅ Spatial data fetched: ${data.length} points in ${fetchTime}ms`);

      if (data.length === 0) {
        updateDiagnostic('spatialDataFetch', 'error', 
          'No spatial data returned', { 
            count: 0,
            fetchTime: `${fetchTime}ms`
          });
      } else if (data.length <= 5) {
        updateDiagnostic('spatialDataFetch', 'warning', 
          'Using fallback data (backend unavailable)', {
            count: data.length,
            fetchTime: `${fetchTime}ms`,
            note: 'Fallback data being used'
          });
      } else {
        updateDiagnostic('spatialDataFetch', 'success', 
          `Fetched ${data.length} spatial points`, {
            count: data.length,
            fetchTime: `${fetchTime}ms`
          });
      }
    } catch (error) {
      console.error('❌ Spatial data fetch failed:', error);
      
      updateDiagnostic('spatialDataFetch', 'error', 
        `Fetch failed: ${error.message}`, {
          error: error.message
        });
    }
  };

  const testMapboxToken = async () => {
    try {
      const token = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
      
      if (!token || token === 'pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV0ZXN0In0.test') {
        updateDiagnostic('mapboxToken', 'warning', 
          'Mapbox token not configured', {
            token: token ? 'Invalid placeholder token' : 'Not set',
            suggestion: 'Set REACT_APP_MAPBOX_ACCESS_TOKEN in .env'
          });
      } else if (token.length < 50) {
        updateDiagnostic('mapboxToken', 'error', 
          'Mapbox token appears invalid', {
            tokenLength: token.length,
            suggestion: 'Get a valid token from mapbox.com'
          });
      } else {
        updateDiagnostic('mapboxToken', 'success', 
          'Mapbox token configured', {
            tokenPreview: `${token.slice(0, 15)}...`
          });
      }
    } catch (error) {
      updateDiagnostic('mapboxToken', 'error', 
        `Token check failed: ${error.message}`, null);
    }
  };

  const updateDiagnostic = (key, status, message, details) => {
    setDiagnostics(prev => ({
      ...prev,
      [key]: { status, message, details }
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'testing': return '🔄';
      default: return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'testing': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const allTestsPassed = Object.values(diagnostics).every(d => d.status === 'success');
  const hasErrors = Object.values(diagnostics).some(d => d.status === 'error');

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      maxWidth: '500px',
      maxHeight: '80vh',
      overflow: 'auto',
      zIndex: 9999,
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
          🔬 System Diagnostics
        </h3>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
          Comprehensive system health check
        </p>
      </div>

      {hasErrors && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <p style={{ margin: 0, color: '#dc2626', fontWeight: 600 }}>
            ⚠️ Issues detected. Check details below.
          </p>
        </div>
      )}

      {allTestsPassed && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <p style={{ margin: 0, color: '#16a34a', fontWeight: 600 }}>
            ✅ All systems operational!
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {Object.entries(diagnostics).map(([key, diagnostic]) => (
          <div key={key} style={{
            padding: '0.75rem',
            background: '#f9fafb',
            borderRadius: '8px',
            borderLeft: `4px solid ${getStatusColor(diagnostic.status)}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>{getStatusIcon(diagnostic.status)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', textTransform: 'capitalize' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {diagnostic.message}
                </div>
                {diagnostic.details && showDetails && (
                  <pre style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    background: '#ffffff',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    overflow: 'auto',
                    maxHeight: '150px'
                  }}>
                    {JSON.stringify(diagnostic.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={runDiagnostics}
          style={{
            padding: '0.5rem 1rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          🔄 Rerun Tests
        </button>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            padding: '0.5rem 1rem',
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          {showDetails ? '👁️ Hide Details' : '👁️ Show Details'}
        </button>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#eff6ff', borderRadius: '6px' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#1e40af' }}>
          💡 <strong>Quick Fix:</strong> If backend connection fails, run: <code style={{
            background: '#dbeafe',
            padding: '0.125rem 0.25rem',
            borderRadius: '3px',
            fontFamily: 'monospace'
          }}>cd backend && npm start</code>
        </p>
      </div>
    </div>
  );
};

export default DiagnosticPanel;

