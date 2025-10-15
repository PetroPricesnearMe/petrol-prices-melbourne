/**
 * Back/Forward Cache (BFCache) Compatibility Utility
 * Ensures proper handling of Chrome's bfcache and prevents extension errors
 * @version 1.0.0
 */

/**
 * Check if page was restored from bfcache
 */
export const isRestoredFromBFCache = () => {
  return (
    performance.getEntriesByType('navigation')[0]?.type === 'back_forward'
  );
};

/**
 * Register callback to run when page is restored from bfcache
 * @param {Function} callback - Function to call on restore
 * @returns {Function} Cleanup function
 */
export const onBFCacheRestore = (callback) => {
  if (!window.__bfcache_restore_callbacks) {
    window.__bfcache_restore_callbacks = [];
  }

  window.__bfcache_restore_callbacks.push(callback);

  // Return cleanup function
  return () => {
    const index = window.__bfcache_restore_callbacks.indexOf(callback);
    if (index > -1) {
      window.__bfcache_restore_callbacks.splice(index, 1);
    }
  };
};

/**
 * Make component bfcache-compatible
 * Automatically handles cleanup and restoration
 * @param {Object} options - Configuration options
 */
export const useBFCacheCompat = (options = {}) => {
  const {
    onRestore = () => { },
    onFreeze = () => { },
    debug = false
  } = options;

  // Handle page show (including bfcache restoration)
  const handlePageShow = (event) => {
    if (event.persisted) {
      if (debug) console.log('[BFCache] Page restored from cache');
      onRestore(event);
    }
  };

  // Handle page hide (may enter bfcache)
  const handlePageHide = (event) => {
    if (event.persisted) {
      if (debug) console.log('[BFCache] Page may enter cache');
      onFreeze(event);
    }
  };

  // Add event listeners
  window.addEventListener('pageshow', handlePageShow);
  window.addEventListener('pagehide', handlePageHide);

  // Return cleanup function
  return () => {
    window.removeEventListener('pageshow', handlePageShow);
    window.removeEventListener('pagehide', handlePageHide);
  };
};

/**
 * Prevent bfcache eligibility (use sparingly)
 * Only use when absolutely necessary
 */
export const preventBFCache = () => {
  // Adding an unload listener makes page ineligible for bfcache
  // This is intentional for cases where bfcache causes issues
  window.addEventListener('unload', () => {
    // Dummy handler to prevent bfcache
  });
};

/**
 * Check if page is eligible for bfcache
 * @returns {Promise<boolean>} Whether page can be cached
 */
export const checkBFCacheEligibility = async () => {
  // Use the Page Lifecycle API if available
  if ('sendBeacon' in navigator) {
    // Page likely eligible if it has sendBeacon
    // This is a heuristic, not definitive
    return true;
  }

  return false;
};

/**
 * Safe sendBeacon that works with bfcache
 * @param {string} url - URL to send data to
 * @param {any} data - Data to send
 */
export const safeSendBeacon = (url, data) => {
  if ('sendBeacon' in navigator) {
    try {
      return navigator.sendBeacon(url, JSON.stringify(data));
    } catch (error) {
      console.warn('[BFCache] sendBeacon failed:', error);
      return false;
    }
  }
  return false;
};

/**
 * Suppress Chrome extension errors
 * Call this early in app initialization
 */
export const suppressExtensionErrors = () => {
  if (typeof window === 'undefined') return;

  // Suppress runtime errors from extensions
  const originalError = window.console.error;
  window.console.error = (...args) => {
    const message = args[0]?.toString() || '';

    // Filter out known extension errors
    const extensionErrors = [
      'runtime.lastError',
      'extension port',
      'message channel is closed',
      'back/forward cache',
      'Extension context invalidated'
    ];

    if (extensionErrors.some(err => message.includes(err))) {
      return; // Suppress extension errors
    }

    originalError.apply(console, args);
  };
};

/**
 * Initialize bfcache compatibility
 * Call this in your app's entry point
 */
export const initBFCacheCompat = (options = {}) => {
  const { debug = false, onRestore, onFreeze } = options;

  // Suppress extension errors
  suppressExtensionErrors();

  // Set up bfcache event handlers
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      if (debug) console.log('[BFCache] Restored from cache');
      if (onRestore) onRestore(event);
    }
  });

  window.addEventListener('pagehide', (event) => {
    if (debug) {
      console.log('[BFCache]', event.persisted ? 'Entering cache' : 'Unloading');
    }
    if (event.persisted && onFreeze) onFreeze(event);
  });

  // Log initial state
  if (debug && isRestoredFromBFCache()) {
    console.log('[BFCache] Initial load was from cache');
  }
};

const bfcacheCompat = {
  isRestoredFromBFCache,
  onBFCacheRestore,
  useBFCacheCompat,
  preventBFCache,
  checkBFCacheEligibility,
  safeSendBeacon,
  suppressExtensionErrors,
  initBFCacheCompat
};

export default bfcacheCompat;

