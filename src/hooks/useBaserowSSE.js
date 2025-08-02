import { useEffect, useRef, useState } from 'react';
import { baserowSSE } from '../config';

/**
 * React hook for managing Baserow SSE connection
 * @param {Function} onMessage - Callback for handling SSE messages
 * @param {Function} onError - Callback for handling SSE errors
 * @returns {Object} Connection state and controls
 */
export const useBaserowSSE = (onMessage, onError) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  const connect = () => {
    if (eventSourceRef.current) {
      // Already connected
      return;
    }

    try {
      eventSourceRef.current = baserowSSE.connect(
        (data) => {
          setLastMessage(data);
          setError(null);
          if (onMessage) {
            onMessage(data);
          }
        },
        (err) => {
          setError(err);
          setIsConnected(false);
          if (onError) {
            onError(err);
          }
        }
      );

      eventSourceRef.current.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      eventSourceRef.current.onclose = () => {
        setIsConnected(false);
      };

    } catch (err) {
      setError(err);
      setIsConnected(false);
      if (onError) {
        onError(err);
      }
    }
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      baserowSSE.disconnect(eventSourceRef.current);
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  };

  // Auto-connect on mount
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    lastMessage,
    error,
    connect,
    disconnect
  };
};

export default useBaserowSSE; 