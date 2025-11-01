/**
 * React Hook for Chrome Extension Message Handling
 * Provides easy integration with the ExtensionMessageHandler
 */

import { useState, useEffect, useCallback, useRef } from 'react';

import extensionMessageHandler from '../utils/extensionMessageHandler';

/**
 * Hook for handling Chrome extension messages with bfcache support
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoConnect - Whether to automatically connect on mount
 * @param {number} options.reconnectDelay - Delay between reconnection attempts
 * @param {number} options.maxReconnectAttempts - Maximum number of reconnection attempts
 * @returns {Object} Hook state and methods
 */
export const useExtensionMessage = (options = {}) => {
  const {
    autoConnect = true,
    reconnectDelay = 1000,
    maxReconnectAttempts = 5
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [lastError, setLastError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [queuedMessages, setQueuedMessages] = useState(0);

  const messageHandlerRef = useRef(null);
  const listenersRef = useRef(new Set());

  // Update connection status
  const updateConnectionStatus = useCallback(() => {
    const status = extensionMessageHandler.getConnectionStatus();
    setIsConnected(status.isConnected);
    setReconnectAttempts(status.reconnectAttempts);
    setQueuedMessages(status.queuedMessages);
  }, []);

  // Handle incoming messages
  const handleMessage = useCallback((message) => {
    setLastMessage(message);
    setLastError(null);
  }, []);

  // Handle disconnection
  const handleDisconnection = useCallback((data) => {
    setIsConnected(false);
    if (data.reason === 'bfcache') {
      console.log('[useExtensionMessage] Disconnected due to bfcache');
    }
  }, []);

  // Handle errors
  const handleError = useCallback((data) => {
    setLastError(data.error);
    console.error('[useExtensionMessage] Error:', data.error);
  }, []);

  // Handle max reconnection attempts reached
  const handleMaxReconnectAttempts = useCallback(() => {
    setLastError('Max reconnection attempts reached');
    console.warn('[useExtensionMessage] Max reconnection attempts reached');
  }, []);

  // Send message to extension
  const sendMessage = useCallback((message) => {
    const success = extensionMessageHandler.sendMessage(message);
    if (!success) {
      setLastError('Failed to send message - not connected');
    }
    return success;
  }, []);

  // Force reconnection
  const reconnect = useCallback(() => {
    extensionMessageHandler.forceReconnect();
    setLastError(null);
  }, []);

  // Add custom event listener
  const addListener = useCallback((event, callback) => {
    extensionMessageHandler.addEventListener(event, callback);
    listenersRef.current.add({ event, callback });
  }, []);

  // Remove custom event listener
  const removeListener = useCallback((event, callback) => {
    extensionMessageHandler.removeEventListener(event, callback);
    listenersRef.current.delete({ event, callback });
  }, []);

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      listenersRef.current.forEach(({ event, callback }) => {
        extensionMessageHandler.removeEventListener(event, callback);
      });
      listenersRef.current.clear();
    };
  }, []);

  // Setup listeners and connection status updates
  useEffect(() => {
    if (!autoConnect) return;

    // Add listeners
    extensionMessageHandler.addEventListener('message', handleMessage);
    extensionMessageHandler.addEventListener('disconnected', handleDisconnection);
    extensionMessageHandler.addEventListener('error', handleError);
    extensionMessageHandler.addEventListener('maxReconnectAttemptsReached', handleMaxReconnectAttempts);

    // Store references for cleanup
    listenersRef.current.add({ event: 'message', callback: handleMessage });
    listenersRef.current.add({ event: 'disconnected', callback: handleDisconnection });
    listenersRef.current.add({ event: 'error', callback: handleError });
    listenersRef.current.add({ event: 'maxReconnectAttemptsReached', callback: handleMaxReconnectAttempts });

    // Initial connection status
    updateConnectionStatus();

    // Set up periodic status updates
    const statusInterval = setInterval(updateConnectionStatus, 1000);

    return () => {
      // Remove listeners
      extensionMessageHandler.removeEventListener('message', handleMessage);
      extensionMessageHandler.removeEventListener('disconnected', handleDisconnection);
      extensionMessageHandler.removeEventListener('error', handleError);
      extensionMessageHandler.removeEventListener('maxReconnectAttemptsReached', handleMaxReconnectAttempts);

      // Clear interval
      clearInterval(statusInterval);
    };
  }, [autoConnect, handleMessage, handleDisconnection, handleError, handleMaxReconnectAttempts, updateConnectionStatus]);

  return {
    // State
    isConnected,
    lastMessage,
    lastError,
    reconnectAttempts,
    queuedMessages,

    // Methods
    sendMessage,
    reconnect,
    addListener,
    removeListener,
    updateConnectionStatus
  };
};

/**
 * Hook for handling specific extension message types
 * @param {string} messageType - Type of message to listen for
 * @param {Function} onMessage - Callback when message is received
 * @param {Object} options - Additional options
 * @returns {Object} Hook state and methods
 */
export const useExtensionMessageType = (messageType, onMessage, options = {}) => {
  const { autoConnect = true } = options;

  const extensionHook = useExtensionMessage({ autoConnect });
  const { addListener, removeListener } = extensionHook;

  // Handle specific message type
  const handleTypedMessage = useCallback((message) => {
    if (message.type === messageType) {
      onMessage(message);
    }
  }, [messageType, onMessage]);

  // Setup listener for specific message type
  useEffect(() => {
    if (!autoConnect) return;

    addListener('message', handleTypedMessage);

    return () => {
      removeListener('message', handleTypedMessage);
    };
  }, [autoConnect, addListener, removeListener, handleTypedMessage]);

  return extensionHook;
};

/**
 * Hook for handling bfcache-specific events
 * @param {Object} options - Configuration options
 * @returns {Object} Hook state and methods
 */
export const useBfcacheHandler = (options = {}) => {
  const { onBfcacheEntry, onBfcacheRestore } = options;

  const [isInBfcache, setIsInBfcache] = useState(false);
  const [bfcacheEvents, setBfcacheEvents] = useState([]);

  // Handle page hide (bfcache entry)
  const handlePageHide = useCallback((event) => {
    if (event.persisted) {
      setIsInBfcache(true);
      const eventData = {
        type: 'bfcache_entry',
        timestamp: Date.now(),
        persisted: event.persisted
      };
      setBfcacheEvents(prev => [...prev, eventData]);
      onBfcacheEntry?.(eventData);
    }
  }, [onBfcacheEntry]);

  // Handle page show (bfcache restore)
  const handlePageShow = useCallback((event) => {
    if (event.persisted) {
      setIsInBfcache(false);
      const eventData = {
        type: 'bfcache_restore',
        timestamp: Date.now(),
        persisted: event.persisted
      };
      setBfcacheEvents(prev => [...prev, eventData]);
      onBfcacheRestore?.(eventData);
    }
  }, [onBfcacheRestore]);

  // Setup event listeners
  useEffect(() => {
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [handlePageHide, handlePageShow]);

  return {
    isInBfcache,
    bfcacheEvents,
    clearEvents: () => setBfcacheEvents([])
  };
};

export default useExtensionMessage;
