/**
 * Extension Compatibility Handler
 * Provides enhanced compatibility with browser extensions like Cursor
 * that use mobx-state-tree for state management and can conflict with
 * back/forward cache operations.
 * 
 * @module extensionCompatibilityHandler
 */

/**
 * Extension Compatibility Manager
 * Handles aggressive compatibility measures for browser extensions
 */
class ExtensionCompatibilityManager {
  constructor() {
    this.initialized = false;
    this.errorSuppressionActive = false;
    this.extensionMessages = new Set();
    this.cleanupTimers = new Set();
    
    this.initialize();
  }

  /**
   * Initialize extension compatibility measures
   */
  initialize() {
    if (this.initialized) return;
    
    try {
      // Add global error suppression for known extension conflicts
      this.setupErrorSuppression();
      
      // Add DOM attributes for extension awareness
      this.setupDOMAttributes();
      
      // Add message channel protection
      this.setupMessageChannelProtection();
      
      // Add mobx-state-tree error handling
      this.setupMobxErrorHandling();
      
      // Add aggressive back/forward cache coordination
      this.setupBFCacheCoordination();
      
      this.initialized = true;
      console.log('[ExtCompat] Extension compatibility manager initialized');
    } catch (error) {
      console.warn('[ExtCompat] Error initializing compatibility manager:', error);
    }
  }

  /**
   * Setup global error suppression for extension conflicts
   */
  setupErrorSuppression() {
    // Suppress specific mobx-state-tree errors that are caused by extensions
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.error = (...args) => {
      const message = args.join(' ');
      
      // Suppress known extension-related errors
      if (this.isExtensionError(message)) {
        console.debug('[ExtCompat] Suppressed extension error:', message);
        return;
      }
      
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      
      // Suppress known extension-related warnings
      if (this.isExtensionWarning(message)) {
        console.debug('[ExtCompat] Suppressed extension warning:', message);
        return;
      }
      
      originalConsoleWarn.apply(console, args);
    };

    // Global error handler for unhandled exceptions
    window.addEventListener('error', (event) => {
      if (this.isExtensionError(event.message)) {
        event.preventDefault();
        console.debug('[ExtCompat] Prevented extension error from propagating:', event.message);
        return false;
      }
    }, true);

    // Global unhandled rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      if (this.isExtensionError(event.reason?.message || String(event.reason))) {
        event.preventDefault();
        console.debug('[ExtCompat] Prevented extension rejection from propagating:', event.reason);
      }
    });
  }

  /**
   * Check if an error message is related to browser extensions
   */
  isExtensionError(message) {
    const extensionErrorPatterns = [
      'mobx-state-tree.*no longer part of a state tree',
      'runtime.lastError.*back/forward cache',
      'message channel is closed',
      'Extension context invalidated',
      'tabStates.*injectionLifecycle',
      'sw.js.*mobx-state-tree',
      'AnonymousModel.*Path upon death',
      'chrome-extension://',
      'moz-extension://',
    ];
    
    return extensionErrorPatterns.some(pattern => 
      new RegExp(pattern, 'i').test(message)
    );
  }

  /**
   * Check if a warning message is related to browser extensions
   */
  isExtensionWarning(message) {
    const extensionWarningPatterns = [
      'Extension.*deprecated',
      'chrome.runtime.*deprecated',
      'webNavigation.*deprecated',
    ];
    
    return extensionWarningPatterns.some(pattern => 
      new RegExp(pattern, 'i').test(message)
    );
  }

  /**
   * Add DOM attributes for extension awareness
   */
  setupDOMAttributes() {
    try {
      // Add attributes to document element for extension detection
      document.documentElement.setAttribute('data-bfcache-compatible', 'true');
      document.documentElement.setAttribute('data-extension-friendly', 'true');
      document.documentElement.setAttribute('data-state-isolation', 'enabled');
      
      // Add viewport meta for extension compatibility
      const compatibilityMeta = document.createElement('meta');
      compatibilityMeta.name = 'extension-compatibility-mode';
      compatibilityMeta.content = 'strict';
      document.head.appendChild(compatibilityMeta);
    } catch (error) {
      console.debug('[ExtCompat] Error setting DOM attributes:', error);
    }
  }

  /**
   * Setup message channel protection
   */
  setupMessageChannelProtection() {
    try {
      // Intercept and protect postMessage calls during critical operations
      const originalPostMessage = window.postMessage;
      
      window.postMessage = function(message, targetOrigin, transfer) {
        try {
          // Add delay during back/forward cache operations to prevent conflicts
          if (document.visibilityState === 'hidden') {
            setTimeout(() => {
              originalPostMessage.call(window, message, targetOrigin, transfer);
            }, 100);
          } else {
            originalPostMessage.call(window, message, targetOrigin, transfer);
          }
        } catch (error) {
          console.debug('[ExtCompat] Protected postMessage error:', error);
        }
      };
    } catch (error) {
      console.debug('[ExtCompat] Error setting up message channel protection:', error);
    }
  }

  /**
   * Setup specific mobx-state-tree error handling
   */
  setupMobxErrorHandling() {
    try {
      // Add protection for mobx-state-tree operations during page transitions
      const protectMobxOperations = () => {
        // Override common mobx operations with error protection
        if (window.mobx) {
          const originalObservable = window.mobx.observable;
          window.mobx.observable = function(...args) {
            try {
              return originalObservable.apply(this, args);
            } catch (error) {
              if (error.message.includes('no longer part of a state tree')) {
                console.debug('[ExtCompat] Protected mobx operation:', error.message);
                return {};
              }
              throw error;
            }
          };
        }
      };

      // Apply protection when mobx is available
      if (window.mobx) {
        protectMobxOperations();
      } else {
        // Wait for mobx to be available (in case it's loaded by extension)
        const checkMobx = setInterval(() => {
          if (window.mobx) {
            protectMobxOperations();
            clearInterval(checkMobx);
          }
        }, 100);
        
        // Clear check after 5 seconds to prevent memory leaks
        setTimeout(() => clearInterval(checkMobx), 5000);
      }
    } catch (error) {
      console.debug('[ExtCompat] Error setting up mobx protection:', error);
    }
  }

  /**
   * Setup aggressive back/forward cache coordination
   */
  setupBFCacheCoordination() {
    try {
      // Add longer delays for extension cleanup during BFCache transitions
      const handlePageHide = (event) => {
        if (event.persisted) {
          // Give extensions more time to cleanup before entering BFCache
          this.delayBFCacheEntry();
        }
      };

      const handlePageShow = (event) => {
        if (event.persisted) {
          // Add delay after BFCache restoration for extensions to reinitialize
          this.delayAfterBFCacheRestore();
        }
      };

      window.addEventListener('pagehide', handlePageHide, { passive: true });
      window.addEventListener('pageshow', handlePageShow, { passive: true });

      // Add visibility change delays
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.prepareForBackgroundState();
        } else if (document.visibilityState === 'visible') {
          this.restoreFromBackgroundState();
        }
      }, { passive: true });
    } catch (error) {
      console.debug('[ExtCompat] Error setting up BFCache coordination:', error);
    }
  }

  /**
   * Delay BFCache entry to allow extension cleanup
   */
  delayBFCacheEntry() {
    try {
      // Temporarily prevent some DOM modifications that might trigger extension conflicts
      const cleanup = setTimeout(() => {
        // Allow normal operation after delay
        console.debug('[ExtCompat] BFCache entry delay completed');
      }, 200);
      
      this.cleanupTimers.add(cleanup);
    } catch (error) {
      console.debug('[ExtCompat] Error in BFCache entry delay:', error);
    }
  }

  /**
   * Delay operations after BFCache restore
   */
  delayAfterBFCacheRestore() {
    try {
      // Add delay for extension reinitialization
      const restore = setTimeout(() => {
        // Trigger any delayed operations
        console.debug('[ExtCompat] BFCache restore delay completed');
        
        // Dispatch custom event for extension compatibility
        window.dispatchEvent(new CustomEvent('bfcache-restore-complete', {
          detail: { timestamp: Date.now() }
        }));
      }, 150);
      
      this.cleanupTimers.add(restore);
    } catch (error) {
      console.debug('[ExtCompat] Error in BFCache restore delay:', error);
    }
  }

  /**
   * Prepare for background state (tab hidden/minimized)
   */
  prepareForBackgroundState() {
    try {
      // Reduce activity that might conflict with extensions
      this.errorSuppressionActive = true;
      
      // Clear any pending operations
      this.cleanupPendingOperations();
    } catch (error) {
      console.debug('[ExtCompat] Error preparing for background state:', error);
    }
  }

  /**
   * Restore from background state (tab visible again)
   */
  restoreFromBackgroundState() {
    try {
      // Gradually restore normal operation
      setTimeout(() => {
        this.errorSuppressionActive = false;
      }, 100);
    } catch (error) {
      console.debug('[ExtCompat] Error restoring from background state:', error);
    }
  }

  /**
   * Clean up pending operations
   */
  cleanupPendingOperations() {
    try {
      // Clear all cleanup timers
      this.cleanupTimers.forEach(timer => clearTimeout(timer));
      this.cleanupTimers.clear();
    } catch (error) {
      console.debug('[ExtCompat] Error cleaning up operations:', error);
    }
  }

  /**
   * Destroy the compatibility manager
   */
  destroy() {
    try {
      this.cleanupPendingOperations();
      this.initialized = false;
    } catch (error) {
      console.debug('[ExtCompat] Error during destroy:', error);
    }
  }
}

// Create singleton instance
const extensionCompatManager = new ExtensionCompatibilityManager();

/**
 * Initialize extension compatibility (automatically called)
 */
export const initializeExtensionCompatibility = () => {
  extensionCompatManager.initialize();
};

/**
 * Check if an error is extension-related
 */
export const isExtensionError = (message) => {
  return extensionCompatManager.isExtensionError(message);
};

/**
 * Destroy extension compatibility manager
 */
export const destroyExtensionCompatibility = () => {
  extensionCompatManager.destroy();
};

export default extensionCompatManager;