/**
 * useCancelOnUnmount Hook
 * 
 * Custom React hook to automatically cancel fetch requests when component unmounts
 * or when navigating away from a page. Prevents memory leaks and unnecessary API calls.
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to get an AbortController that automatically aborts on unmount or route change
 * @returns {React.MutableRefObject<AbortController>} Ref to AbortController
 */
export function useCancelOnUnmount() {
  const controllerRef = useRef(new AbortController());
  const location = useLocation();
  const previousLocation = useRef(location.pathname);

  useEffect(() => {
    // Create new controller on mount or route change
    if (previousLocation.current !== location.pathname) {
      console.log(`🔄 Route changed from ${previousLocation.current} to ${location.pathname}`);
      
      // Abort previous controller
      if (controllerRef.current) {
        controllerRef.current.abort();
        console.log('❌ Aborted previous route\'s requests');
      }
      
      // Create new controller
      controllerRef.current = new AbortController();
      previousLocation.current = location.pathname;
    }

    // Cleanup on unmount
    return () => {
      if (controllerRef.current) {
        console.log('🧹 Component unmounting, aborting requests...');
        controllerRef.current.abort();
      }
    };
  }, [location.pathname]);

  return controllerRef;
}

/**
 * Hook to create a fetch wrapper that automatically includes abort signal
 * @returns {(url: string, options?: RequestInit) => Promise<Response>}
 */
export function useFetchWithCancel() {
  const controllerRef = useCancelOnUnmount();

  const fetchWithCancel = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        signal: controllerRef.current.signal
      });
      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('🚫 Request cancelled:', url);
        throw new Error('Request cancelled');
      }
      throw error;
    }
  };

  return fetchWithCancel;
}

/**
 * Hook to create multiple AbortControllers for managing multiple concurrent requests
 * @param {number} count - Number of controllers to create
 * @returns {Array<AbortController>} Array of AbortControllers
 */
export function useMultipleAbortControllers(count = 1) {
  const controllersRef = useRef([]);
  const location = useLocation();

  useEffect(() => {
    // Initialize controllers
    controllersRef.current = Array.from({ length: count }, () => new AbortController());

    // Cleanup on route change or unmount
    return () => {
      controllersRef.current.forEach((controller, index) => {
        if (controller) {
          console.log(`🧹 Aborting request ${index + 1}/${count}...`);
          controller.abort();
        }
      });
      controllersRef.current = [];
    };
  }, [count, location.pathname]);

  return controllersRef.current;
}

/**
 * Hook to track pending requests and cancel them on unmount
 * @returns {{
 *   addRequest: (name: string, controller: AbortController) => void,
 *   removeRequest: (name: string) => void,
 *   abortAll: () => void,
 *   getPendingCount: () => number
 * }}
 */
export function useRequestTracker() {
  const requestsRef = useRef(new Map());
  const location = useLocation();

  useEffect(() => {
    // Abort all requests on route change
    return () => {
      console.log(`🧹 Route changing, aborting ${requestsRef.current.size} pending requests...`);
      requestsRef.current.forEach((controller, name) => {
        console.log(`  - Aborting: ${name}`);
        controller.abort();
      });
      requestsRef.current.clear();
    };
  }, [location.pathname]);

  const addRequest = (name, controller) => {
    console.log(`📝 Tracking request: ${name}`);
    requestsRef.current.set(name, controller);
  };

  const removeRequest = (name) => {
    console.log(`✅ Request completed: ${name}`);
    requestsRef.current.delete(name);
  };

  const abortAll = () => {
    console.log(`❌ Manually aborting ${requestsRef.current.size} requests...`);
    requestsRef.current.forEach((controller, name) => {
      console.log(`  - Aborting: ${name}`);
      controller.abort();
    });
    requestsRef.current.clear();
  };

  const getPendingCount = () => requestsRef.current.size;

  return { addRequest, removeRequest, abortAll, getPendingCount };
}

export default useCancelOnUnmount;

