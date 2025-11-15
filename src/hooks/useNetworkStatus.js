/**
 * useNetworkStatus Hook
 *
 * Custom React hook to monitor network connection status
 * Provides real-time updates when user goes online/offline
 */

import { useState, useEffect } from 'react';

/**
 * Hook to monitor network connection status
 * @returns {{isOnline: boolean, wasOffline: boolean}}
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Handler for when connection is restored
    const handleOnline = () => {
      console.log('🌐 Network connection restored');
      setIsOnline(true);

      // Keep wasOffline true for a few seconds to show reconnection message
      setTimeout(() => {
        setWasOffline(false);
      }, 3000);
    };

    // Handler for when connection is lost
    const handleOffline = () => {
      console.log('📡 Network connection lost');
      setIsOnline(false);
      setWasOffline(true);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}

/**
 * Hook to periodically check network connectivity with actual ping
 * More accurate than just navigator.onLine
 * @param {number} interval - Check interval in milliseconds (default: 30000 = 30s)
 * @returns {{isOnline: boolean, lastChecked: Date|null, checking: boolean}}
 */
export function useNetworkPing(interval = 30000) {
  const [isOnline, setIsOnline] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkConnectivity = async () => {
      if (!mounted || checking) return;

      setChecking(true);
      try {
        // Try to fetch a small resource with no-cache
        const response = await fetch('/favicon.ico', {
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(5000),
        });

        if (mounted) {
          const newStatus = response.ok;
          if (newStatus !== isOnline) {
            console.log(
              `🌐 Connectivity check: ${newStatus ? 'Online' : 'Offline'}`
            );
          }
          setIsOnline(newStatus);
          setLastChecked(new Date());
        }
      } catch (error) {
        if (mounted) {
          console.log('📡 Connectivity check failed:', error.message);
          setIsOnline(false);
          setLastChecked(new Date());
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    };

    // Check immediately
    checkConnectivity();

    // Then check periodically
    const intervalId = setInterval(checkConnectivity, interval);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [interval, checking, isOnline]);

  return { isOnline, lastChecked, checking };
}

export default useNetworkStatus;
