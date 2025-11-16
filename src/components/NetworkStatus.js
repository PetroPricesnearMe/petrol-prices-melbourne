/**
 * NetworkStatus Component
 *
 * Displays network connection status to the user
 * Shows warnings when offline and notifications when reconnecting
 */

import React from 'react';

import { useNetworkStatus } from '../hooks/useNetworkStatus';
// CSS imported in pages/_app.js

const NetworkStatus = () => {
  const { isOnline, wasOffline } = useNetworkStatus();

  // Don't show anything when online and was never offline
  if (isOnline && !wasOffline) {
    return null;
  }

  return (
    <div className={`network-status ${isOnline ? 'online' : 'offline'}`}>
      <div className="network-status-content">
        {!isOnline ? (
          <>
            <span className="network-icon">📡</span>
            <span className="network-message">
              You&apos;re offline. Some features may not work.
            </span>
          </>
        ) : (
          <>
            <span className="network-icon">✅</span>
            <span className="network-message">Back online!</span>
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkStatus;
