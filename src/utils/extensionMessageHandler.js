/**
 * Chrome Extension Message Handler
 * Handles message channel disconnection due to back/forward cache (bfcache)
 *
 * This utility provides robust error handling for Chrome extension message ports
 * that may be closed when pages are moved into bfcache.
 */

/* global chrome */

class ExtensionMessageHandler {
  constructor() {
    this.port = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.isConnected = false;
    this.messageQueue = [];
    this.listeners = new Map();

    // Only initialize if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  /**
   * Initialize the message handler
   */
  initialize() {
    // Check if we're running in a Chrome extension context
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
      this.setupMessagePort();
      this.setupPageVisibilityHandlers();
      this.setupBfcacheHandlers();
    }
  }

  /**
   * Setup Chrome extension message port
   */
  setupMessagePort() {
    try {
      // Connect to the extension background script
      this.port = chrome.runtime.connect({ name: 'ppnm-extension' });

      // Handle port disconnection
      this.port.onDisconnect.addListener(() => {
        this.handlePortDisconnection();
      });

      // Handle incoming messages
      this.port.onMessage.addListener((message) => {
        this.handleIncomingMessage(message);
      });

      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Process any queued messages
      this.processMessageQueue();

      console.log('[ExtensionMessageHandler] Connected to extension');
    } catch (error) {
      console.warn('[ExtensionMessageHandler] Failed to connect to extension:', error);
      this.handleConnectionError(error);
    }
  }

  /**
   * Handle port disconnection
   */
  handlePortDisconnection() {
    this.isConnected = false;
    console.log('[ExtensionMessageHandler] Port disconnected');

    // Check for runtime.lastError
    if (chrome.runtime.lastError) {
      console.warn('[ExtensionMessageHandler] Runtime error:', chrome.runtime.lastError.message);

      // Handle specific bfcache error
      if (chrome.runtime.lastError.message.includes('back/forward cache') ||
          chrome.runtime.lastError.message.includes('message channel is closed')) {
        this.handleBfcacheDisconnection();
      } else {
        this.handleConnectionError(chrome.runtime.lastError);
      }
    }

    // Attempt to reconnect
    this.attemptReconnection();
  }

  /**
   * Handle bfcache-specific disconnection
   */
  handleBfcacheDisconnection() {
    console.log('[ExtensionMessageHandler] Page moved to bfcache, message channel closed');

    // Clear the error to prevent it from persisting
    if (chrome.runtime.lastError) {
      // Note: We can't clear lastError directly, but we can handle it gracefully
      console.log('[ExtensionMessageHandler] Handled bfcache disconnection gracefully');
    }

    // Notify listeners about the disconnection
    this.notifyListeners('disconnected', { reason: 'bfcache' });
  }

  /**
   * Handle general connection errors
   */
  handleConnectionError(error) {
    console.error('[ExtensionMessageHandler] Connection error:', error);
    this.notifyListeners('error', { error: error.message || 'Unknown connection error' });
  }

  /**
   * Attempt to reconnect to the extension
   */
  attemptReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[ExtensionMessageHandler] Max reconnection attempts reached');
      this.notifyListeners('maxReconnectAttemptsReached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff

    console.log(`[ExtensionMessageHandler] Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);

    setTimeout(() => {
      this.setupMessagePort();
    }, delay);
  }

  /**
   * Setup page visibility change handlers
   */
  setupPageVisibilityHandlers() {
    // Handle page becoming visible again (potential bfcache restoration)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !this.isConnected) {
        console.log('[ExtensionMessageHandler] Page became visible, attempting reconnection');
        this.attemptReconnection();
      }
    });

    // Handle page show event (bfcache restoration)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        console.log('[ExtensionMessageHandler] Page restored from bfcache');
        // Small delay to ensure the page is fully restored
        setTimeout(() => {
          if (!this.isConnected) {
            this.attemptReconnection();
          }
        }, 100);
      }
    });

    // Handle page hide event (potential bfcache entry)
    window.addEventListener('pagehide', (event) => {
      if (event.persisted) {
        console.log('[ExtensionMessageHandler] Page entering bfcache');
        // Don't attempt reconnection here as the page is being cached
      }
    });
  }

  /**
   * Setup bfcache-specific event handlers
   */
  setupBfcacheHandlers() {
    // Listen for the beforeunload event to detect navigation
    window.addEventListener('beforeunload', () => {
      if (this.isConnected) {
        console.log('[ExtensionMessageHandler] Page unloading, preparing for potential bfcache');
      }
    });

    // Listen for the unload event as a fallback
    window.addEventListener('unload', () => {
      if (this.isConnected) {
        console.log('[ExtensionMessageHandler] Page unloaded');
      }
    });
  }

  /**
   * Send message to extension
   */
  sendMessage(message) {
    if (!this.isConnected || !this.port) {
      console.warn('[ExtensionMessageHandler] Not connected, queuing message');
      this.messageQueue.push(message);
      return false;
    }

    try {
      this.port.postMessage(message);
      return true;
    } catch (error) {
      console.error('[ExtensionMessageHandler] Failed to send message:', error);
      this.messageQueue.push(message);
      return false;
    }
  }

  /**
   * Process queued messages
   */
  processMessageQueue() {
    if (this.messageQueue.length === 0) return;

    console.log(`[ExtensionMessageHandler] Processing ${this.messageQueue.length} queued messages`);

    const messages = [...this.messageQueue];
    this.messageQueue = [];

    messages.forEach(message => {
      this.sendMessage(message);
    });
  }

  /**
   * Handle incoming messages from extension
   */
  handleIncomingMessage(message) {
    console.log('[ExtensionMessageHandler] Received message:', message);
    this.notifyListeners('message', message);
  }

  /**
   * Add event listener
   */
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event, callback) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of an event
   */
  notifyListeners(event, data) {
    if (!this.listeners.has(event)) return;

    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('[ExtensionMessageHandler] Listener error:', error);
      }
    });
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length
    };
  }

  /**
   * Force reconnection
   */
  forceReconnect() {
    this.reconnectAttempts = 0;
    this.isConnected = false;
    if (this.port) {
      this.port.disconnect();
    }
    this.setupMessagePort();
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.port) {
      this.port.disconnect();
    }
    this.isConnected = false;
    this.messageQueue = [];
    this.listeners.clear();
  }
}

// Create singleton instance
const extensionMessageHandler = new ExtensionMessageHandler();

// Export for use in other modules
export default extensionMessageHandler;

// Export utility functions
export const sendExtensionMessage = (message) => {
  return extensionMessageHandler.sendMessage(message);
};

export const addExtensionListener = (event, callback) => {
  extensionMessageHandler.addEventListener(event, callback);
};

export const removeExtensionListener = (event, callback) => {
  extensionMessageHandler.removeEventListener(event, callback);
};

export const getExtensionStatus = () => {
  return extensionMessageHandler.getConnectionStatus();
};

export const reconnectExtension = () => {
  extensionMessageHandler.forceReconnect();
};
