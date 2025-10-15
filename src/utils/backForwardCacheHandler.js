/**
 * Back/Forward Cache Handler
 * Provides utilities to handle back/forward cache events and coordinate
 * with service workers to prevent conflicts with browser extensions.
 * 
 * @module backForwardCacheHandler
 */

/**
 * Back/Forward Cache Manager
 * Handles proper cleanup and restoration when pages enter/exit back/forward cache
 */
class BackForwardCacheManager {
  constructor() {
    this.isInBFCache = false;
    this.cleanupCallbacks = new Set();
    this.restoreCallbacks = new Set();
    this.initialized = false;
    
    this.initialize();
  }

  /**
   * Initialize back/forward cache event handlers
   */
  initialize() {
    if (this.initialized) return;
    
    try {
      // Handle page entering back/forward cache
      window.addEventListener('pagehide', (event) => {
        if (event.persisted) {
          this.enterBFCache();
        }
      }, { passive: true });

      // Handle page exiting back/forward cache
      window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
          this.exitBFCache();
        }
      }, { passive: true });

      // Modern freeze/resume events
      if ('onfreeze' in document) {
        document.addEventListener('freeze', () => {
          this.enterBFCache();
        }, { passive: true });
      }

      if ('onresume' in document) {
        document.addEventListener('resume', () => {
          this.exitBFCache();
        }, { passive: true });
      }

      this.initialized = true;
    } catch (error) {
      console.warn('[BFCache] Error initializing:', error);
    }
  }

  /**
   * Handle page entering back/forward cache
   */
  enterBFCache() {
    try {
      this.isInBFCache = true;
      
      // Notify service worker
      this.notifyServiceWorker('page-entering-bfcache');
      
      // Run cleanup callbacks
      this.cleanupCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.warn('[BFCache] Cleanup callback error:', error);
        }
      });
      
      console.log('[BFCache] Page entered back/forward cache');
    } catch (error) {
      console.warn('[BFCache] Error entering back/forward cache:', error);
    }
  }

  /**
   * Handle page exiting back/forward cache
   */
  exitBFCache() {
    try {
      this.isInBFCache = false;
      
      // Notify service worker
      this.notifyServiceWorker('page-restored-from-bfcache');
      
      // Run restore callbacks
      this.restoreCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.warn('[BFCache] Restore callback error:', error);
        }
      });
      
      console.log('[BFCache] Page restored from back/forward cache');
    } catch (error) {
      console.warn('[BFCache] Error exiting back/forward cache:', error);
    }
  }

  /**
   * Register cleanup callback for when page enters back/forward cache
   */
  onEnterBFCache(callback) {
    if (typeof callback === 'function') {
      this.cleanupCallbacks.add(callback);
      
      // Return unsubscribe function
      return () => {
        this.cleanupCallbacks.delete(callback);
      };
    }
  }

  /**
   * Register restore callback for when page exits back/forward cache
   */
  onExitBFCache(callback) {
    if (typeof callback === 'function') {
      this.restoreCallbacks.add(callback);
      
      // Return unsubscribe function
      return () => {
        this.restoreCallbacks.delete(callback);
      };
    }
  }

  /**
   * Check if page is currently in back/forward cache
   */
  isPageInBFCache() {
    return this.isInBFCache;
  }

  /**
   * Notify service worker about back/forward cache events
   */
  notifyServiceWorker(message) {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message);
      }
    } catch (error) {
      console.warn('[BFCache] Error notifying service worker:', error);
    }
  }

  /**
   * Clean up all event listeners and callbacks
   */
  destroy() {
    try {
      this.cleanupCallbacks.clear();
      this.restoreCallbacks.clear();
      this.initialized = false;
    } catch (error) {
      console.warn('[BFCache] Error during destroy:', error);
    }
  }
}

// Create singleton instance
const bfCacheManager = new BackForwardCacheManager();

/**
 * Register a function to be called when page enters back/forward cache
 * @param {Function} callback - Function to call on cleanup
 * @returns {Function} Unsubscribe function
 */
export const onEnterBFCache = (callback) => {
  return bfCacheManager.onEnterBFCache(callback);
};

/**
 * Register a function to be called when page exits back/forward cache
 * @param {Function} callback - Function to call on restore
 * @returns {Function} Unsubscribe function
 */
export const onExitBFCache = (callback) => {
  return bfCacheManager.onExitBFCache(callback);
};

/**
 * Check if page is currently in back/forward cache
 * @returns {boolean}
 */
export const isPageInBFCache = () => {
  return bfCacheManager.isPageInBFCache();
};

/**
 * Destroy the BFCache manager (call on app unmount)
 */
export const destroyBFCacheManager = () => {
  bfCacheManager.destroy();
};

export default bfCacheManager;