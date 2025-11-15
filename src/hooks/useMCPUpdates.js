/**
 * useMCPUpdates Hook
 * React hook for subscribing to real-time Baserow updates via MCP
 *
 * Usage:
 * const { connected, updates } = useMCPUpdates('price.updated');
 */

import { useState, useEffect, useCallback } from 'react';

import mcpService from '../services/MCPService';

/**
 * Subscribe to MCP real-time updates
 * @param {string|string[]} events - Event name(s) to subscribe to
 * @param {Function} onUpdate - Callback when update received
 * @returns {Object} Connection status and latest update
 */
export function useMCPUpdates(events, onUpdate) {
  const [connected, setConnected] = useState(mcpService.getStatus().connected);
  const [latestUpdate, setLatestUpdate] = useState(null);
  const [error, setError] = useState(null);

  // Convert single event to array
  const eventArray = Array.isArray(events) ? events : [events];

  // Handle update
  const handleUpdate = useCallback(
    (data) => {
      console.log('🔔 [useMCPUpdates] Received update:', data);
      setLatestUpdate(data);
      setError(null);

      if (onUpdate) {
        onUpdate(data);
      }
    },
    [onUpdate]
  );

  // Handle connection status changes
  useEffect(() => {
    const handleConnect = () => {
      console.log('✅ [useMCPUpdates] Connected');
      setConnected(true);
      setError(null);
    };

    const handleDisconnect = () => {
      console.log('⚠️ [useMCPUpdates] Disconnected');
      setConnected(false);
    };

    const handleMaxAttempts = () => {
      console.error('❌ [useMCPUpdates] Max reconnection attempts reached');
      setConnected(false);
      setError('Failed to connect to real-time updates');
    };

    // Subscribe to connection events
    const unsubConnect = mcpService.on('connected', handleConnect);
    const unsubDisconnect = mcpService.on('disconnected', handleDisconnect);
    const unsubMaxAttempts = mcpService.on(
      'max-reconnect-attempts',
      handleMaxAttempts
    );

    // Cleanup
    return () => {
      unsubConnect();
      unsubDisconnect();
      unsubMaxAttempts();
    };
  }, []);

  // Subscribe to specified events
  useEffect(() => {
    const unsubscribers = eventArray.map((event) => {
      console.log(`📡 [useMCPUpdates] Subscribing to '${event}'`);
      return mcpService.on(event, handleUpdate);
    });

    // Cleanup subscriptions
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [eventArray.join(','), handleUpdate]);

  return {
    connected,
    latestUpdate,
    error,
    status: mcpService.getStatus(),
  };
}

/**
 * Hook specifically for fuel price updates
 */
export function useFuelPriceUpdates(onPriceUpdate) {
  return useMCPUpdates('price.updated', onPriceUpdate);
}

/**
 * Hook specifically for station updates
 */
export function useStationUpdates(onStationUpdate) {
  return useMCPUpdates('station.updated', onStationUpdate);
}

/**
 * Hook for all updates
 */
export function useAllMCPUpdates(onUpdate) {
  return useMCPUpdates(
    [
      'price.updated',
      'station.updated',
      'row.created',
      'row.updated',
      'row.deleted',
    ],
    onUpdate
  );
}

export default useMCPUpdates;
