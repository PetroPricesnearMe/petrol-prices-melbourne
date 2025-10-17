/**
 * Real-Time Price Monitor Component
 * Displays connection status and recent price updates from MCP
 */

import React, { useState, useEffect } from 'react';
import { useFuelPriceUpdates } from '../hooks/useMCPUpdates';
import './RealTimePriceMonitor.css';

export default function RealTimePriceMonitor({ showUpdates = true }) {
  const [recentUpdates, setRecentUpdates] = useState([]);
  const maxUpdates = 5;

  // Subscribe to real-time price updates
  const { connected, latestUpdate, error } = useFuelPriceUpdates((update) => {
    console.log('💰 [Price Monitor] New price update:', update);
    
    // Add to recent updates
    setRecentUpdates(prev => {
      const newUpdates = [
        {
          ...update,
          timestamp: new Date().toISOString()
        },
        ...prev
      ].slice(0, maxUpdates);
      
      return newUpdates;
    });
  });

  // Clear old updates after 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      setRecentUpdates(prev => 
        prev.filter(update => new Date(update.timestamp).getTime() > fiveMinutesAgo)
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Don't show if user doesn't want updates
  if (!showUpdates) {
    return null;
  }

  return (
    <div className="real-time-monitor">
      <div className="monitor-header">
        <div className="monitor-status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></span>
          <span className="status-text">
            {connected ? 'Live Updates' : 'Connecting...'}
          </span>
        </div>
        
        {error && (
          <div className="monitor-error">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}
      </div>

      {connected && recentUpdates.length > 0 && (
        <div className="monitor-updates">
          <h4>Recent Price Updates</h4>
          <ul className="updates-list">
            {recentUpdates.map((update, index) => (
              <li key={`${update.rowId}-${update.timestamp}`} className="update-item">
                <span className="update-badge">NEW</span>
                <span className="update-time">
                  {new Date(update.timestamp).toLocaleTimeString()}
                </span>
                <span className="update-detail">
                  Station #{update.rowId} updated
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

