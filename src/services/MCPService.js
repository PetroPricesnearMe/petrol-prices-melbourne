/**
 * MCP (Model Context Protocol) Service
 * Real-time updates from Baserow via Server-Sent Events (SSE)
 * 
 * MCP Server: https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse
 */

class MCPService {
  constructor() {
    this.sseUrl = process.env.REACT_APP_BASEROW_SSE_URL || 
                  'https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse';
    this.eventSource = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.isConnected = false;
    this.reconnectTimeout = null;
  }

  /**
   * Connect to MCP SSE stream
   */
  connect() {
    if (this.eventSource) {
      console.log('📡 [MCP] Already connected');
      return;
    }

    try {
      console.log('🔌 [MCP] Connecting to SSE stream...');
      console.log(`📍 [MCP] URL: ${this.sseUrl}`);

      this.eventSource = new EventSource(this.sseUrl);

      // Connection opened
      this.eventSource.onopen = () => {
        console.log('✅ [MCP] Connected to real-time updates');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.emit('connected');
      };

      // Handle messages
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 [MCP] Received update:', data);
          this.handleUpdate(data);
        } catch (error) {
          console.error('❌ [MCP] Error parsing message:', error);
        }
      };

      // Handle errors
      this.eventSource.onerror = (error) => {
        console.error('❌ [MCP] Connection error:', error);
        this.isConnected = false;
        this.emit('disconnected');
        
        // Close and attempt reconnect
        this.eventSource.close();
        this.eventSource = null;
        this.attemptReconnect();
      };

      // Listen for specific Baserow events
      this.setupBaserowEventListeners();

    } catch (error) {
      console.error('❌ [MCP] Failed to connect:', error);
      this.attemptReconnect();
    }
  }

  /**
   * Set up Baserow-specific event listeners
   */
  setupBaserowEventListeners() {
    if (!this.eventSource) return;

    // Row created
    this.eventSource.addEventListener('row.created', (event) => {
      const data = JSON.parse(event.data);
      console.log('➕ [MCP] Row created:', data);
      this.emit('row.created', data);
    });

    // Row updated
    this.eventSource.addEventListener('row.updated', (event) => {
      const data = JSON.parse(event.data);
      console.log('🔄 [MCP] Row updated:', data);
      this.emit('row.updated', data);
    });

    // Row deleted
    this.eventSource.addEventListener('row.deleted', (event) => {
      const data = JSON.parse(event.data);
      console.log('➖ [MCP] Row deleted:', data);
      this.emit('row.deleted', data);
    });

    // Table events
    this.eventSource.addEventListener('table.updated', (event) => {
      const data = JSON.parse(event.data);
      console.log('🗃️ [MCP] Table updated:', data);
      this.emit('table.updated', data);
    });
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`❌ [MCP] Max reconnection attempts (${this.maxReconnectAttempts}) reached`);
      this.emit('max-reconnect-attempts');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 [MCP] Reconnecting in ${delay / 1000}s (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Disconnect from SSE stream
   */
  disconnect() {
    console.log('🔌 [MCP] Disconnecting...');
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.emit('disconnected');
    
    console.log('✅ [MCP] Disconnected');
  }

  /**
   * Handle incoming updates
   */
  handleUpdate(data) {
    const { type, table_id, row_id, payload } = data;

    // Emit specific events based on table
    if (table_id === 623329) { // Petrol Stations
      this.emit('station.updated', { rowId: row_id, data: payload });
    } else if (table_id === 623330) { // Fuel Prices
      this.emit('price.updated', { rowId: row_id, data: payload });
    }

    // Emit general update event
    this.emit('update', data);
  }

  /**
   * Subscribe to events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event).add(callback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from events
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  /**
   * Emit event to all listeners
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ [MCP] Error in event listener for '${event}':`, error);
        }
      });
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      url: this.sseUrl
    };
  }

  /**
   * Reset reconnection attempts
   */
  resetReconnectAttempts() {
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000;
  }
}

// Export singleton instance
const mcpService = new MCPService();

// Auto-connect if in browser environment
if (typeof window !== 'undefined') {
  // Connect after page load
  window.addEventListener('load', () => {
    console.log('🚀 [MCP] Auto-connecting to real-time updates...');
    mcpService.connect();
  });

  // Disconnect before page unload
  window.addEventListener('beforeunload', () => {
    mcpService.disconnect();
  });
}

export default mcpService;

