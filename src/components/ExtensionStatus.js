/**
 * Extension Status Component
 * Demonstrates how to use the extension message handler
 */

import React from 'react';
import { useExtensionMessage, useBfcacheHandler } from '../hooks/useExtensionMessage';

const ExtensionStatus = () => {
  const {
    isConnected,
    lastMessage,
    lastError,
    reconnectAttempts,
    queuedMessages,
    sendMessage,
    reconnect
  } = useExtensionMessage();

  const { isInBfcache, bfcacheEvents } = useBfcacheHandler({
    onBfcacheEntry: (event) => {
      console.log('Page entering bfcache:', event);
    },
    onBfcacheRestore: (event) => {
      console.log('Page restored from bfcache:', event);
    }
  });

  const handleSendTestMessage = () => {
    sendMessage({
      type: 'test',
      data: {
        timestamp: Date.now(),
        message: 'Hello from the web page!'
      }
    });
  };

  const handleReconnect = () => {
    reconnect();
  };

  return (
    <div className="extension-status">
      <h3>Chrome Extension Status</h3>
      
      <div className="status-grid">
        <div className="status-item">
          <span className="label">Connection:</span>
          <span className={`value ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '✅ Connected' : '❌ Disconnected'}
          </span>
        </div>
        
        <div className="status-item">
          <span className="label">BFCache:</span>
          <span className={`value ${isInBfcache ? 'cached' : 'active'}`}>
            {isInBfcache ? '📦 In Cache' : '🔄 Active'}
          </span>
        </div>
        
        <div className="status-item">
          <span className="label">Reconnect Attempts:</span>
          <span className="value">{reconnectAttempts}</span>
        </div>
        
        <div className="status-item">
          <span className="label">Queued Messages:</span>
          <span className="value">{queuedMessages}</span>
        </div>
        
        <div className="status-item">
          <span className="label">BFCache Events:</span>
          <span className="value">{bfcacheEvents.length}</span>
        </div>
      </div>

      {lastError && (
        <div className="error-message">
          <strong>Error:</strong> {lastError}
        </div>
      )}

      {lastMessage && (
        <div className="last-message">
          <strong>Last Message:</strong>
          <pre>{JSON.stringify(lastMessage, null, 2)}</pre>
        </div>
      )}

      <div className="actions">
        <button 
          onClick={handleSendTestMessage}
          disabled={!isConnected}
          className="test-button"
        >
          Send Test Message
        </button>
        
        <button 
          onClick={handleReconnect}
          className="reconnect-button"
        >
          Reconnect
        </button>
      </div>

      <style jsx>{`
        .extension-status {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1rem 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .extension-status h3 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1.25rem;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: white;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }

        .label {
          font-weight: 500;
          color: #666;
        }

        .value {
          font-weight: 600;
        }

        .value.connected {
          color: #28a745;
        }

        .value.disconnected {
          color: #dc3545;
        }

        .value.cached {
          color: #ffc107;
        }

        .value.active {
          color: #28a745;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 0.75rem;
          border-radius: 4px;
          margin: 1rem 0;
          border: 1px solid #f5c6cb;
        }

        .last-message {
          background: #d1ecf1;
          color: #0c5460;
          padding: 0.75rem;
          border-radius: 4px;
          margin: 1rem 0;
          border: 1px solid #bee5eb;
        }

        .last-message pre {
          margin: 0.5rem 0 0 0;
          font-size: 0.875rem;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .test-button, .reconnect-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .test-button {
          background: #007bff;
          color: white;
        }

        .test-button:hover:not(:disabled) {
          background: #0056b3;
        }

        .test-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .reconnect-button {
          background: #28a745;
          color: white;
        }

        .reconnect-button:hover {
          background: #1e7e34;
        }
      `}</style>
    </div>
  );
};

export default ExtensionStatus;