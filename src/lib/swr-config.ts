/**
 * SWR Configuration
 * Global configuration for SWR data fetching with error handling and revalidation
 */

import type { SWRConfiguration } from 'swr';

// Custom fetcher function
export const fetcher = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    (error as any).info = await res.json();
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
};

// Global SWR configuration
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshInterval: 30000, // 30 seconds
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  dedupingInterval: 2000,
  focusThrottleInterval: 5000,
  loadingTimeout: 3000,
  onError: (error, key) => {
    console.error('SWR Error:', error, 'Key:', key);
    // You can add error reporting here
  },
  onSuccess: (_data, _key) => {
    // Success logging disabled for production
    // Uncomment for debugging: console.debug('SWR Success:', key, data);
  },
  onLoadingSlow: (key) => {
    console.warn('SWR Loading Slow:', key);
  },
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    // Only retry on 408, 429, 500-599 errors
    if (error.status === 404) return;

    // Only retry up to 3 times
    if (retryCount >= 3) return;

    // Retry after 5 seconds
    setTimeout(() => revalidate({ retryCount }), 5000);
  },
};

// Custom hooks for different data types
export const useStationsConfig = {
  ...swrConfig,
  refreshInterval: 60000, // 1 minute for stations
  revalidateOnFocus: true,
};

export const usePricesConfig = {
  ...swrConfig,
  refreshInterval: 30000, // 30 seconds for prices
  revalidateOnFocus: true,
};

export const useMetadataConfig = {
  ...swrConfig,
  refreshInterval: 300000, // 5 minutes for metadata
  revalidateOnFocus: false,
};

export default swrConfig;
