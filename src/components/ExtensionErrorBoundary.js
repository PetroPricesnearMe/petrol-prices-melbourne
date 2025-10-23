/**
 * Extension Error Boundary Component
 * Handles Chrome extension errors, particularly bfcache-related message channel closures
 */

import React, { Component } from 'react';
import extensionMessageHandler from '../utils/extensionMessageHandler';

class ExtensionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isBfcacheError: false,
      reconnectAttempts: 0
    };
    
    this.handleExtensionError = this.handleExtensionError.bind(this);
    this.handleReconnection = this.handleReconnection.bind(this);
  }

  componentDidMount() {
    // Listen for extension errors
    extensionMessageHandler.addEventListener('error', this.handleExtensionError);
    extensionMessageHandler.addEventListener('maxReconnectAttemptsReached', this.handleMaxReconnectAttempts);
    
    // Listen for successful reconnections
    extensionMessageHandler.addEventListener('message', this.handleReconnection);
  }

  componentWillUnmount() {
    extensionMessageHandler.removeEventListener('error', this.handleExtensionError);
    extensionMessageHandler.removeEventListener('maxReconnectAttemptsReached', this.handleMaxReconnectAttempts);
    extensionMessageHandler.removeEventListener('message', this.handleReconnection);
  }

  static getDerivedStateFromError(error) {
    // Check if this is a bfcache-related error
    const isBfcacheError = error.message && (
      error.message.includes('back/forward cache') ||
      error.message.includes('message channel is closed') ||
      error.message.includes('runtime.lastError')
    );

    return {
      hasError: true,
      error,
      isBfcacheError
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ExtensionErrorBoundary] Caught error:', error);
    console.error('[ExtensionErrorBoundary] Error info:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // If it's a bfcache error, attempt to handle it gracefully
    if (this.isBfcacheError(error)) {
      this.handleBfcacheError(error);
    }
  }

  isBfcacheError(error) {
    return error.message && (
      error.message.includes('back/forward cache') ||
      error.message.includes('message channel is closed') ||
      error.message.includes('runtime.lastError')
    );
  }

  handleExtensionError(data) {
    console.error('[ExtensionErrorBoundary] Extension error:', data.error);
    
    if (this.isBfcacheError({ message: data.error })) {
      this.handleBfcacheError({ message: data.error });
    } else {
      this.setState({
        hasError: true,
        error: new Error(data.error),
        isBfcacheError: false
      });
    }
  }

  handleBfcacheError(error) {
    console.log('[ExtensionErrorBoundary] Handling bfcache error:', error.message);
    
    this.setState({
      hasError: true,
      error,
      isBfcacheError: true
    });

    // Attempt to reconnect
    this.attemptReconnection();
  }

  handleMaxReconnectAttempts() {
    this.setState(prevState => ({
      reconnectAttempts: prevState.reconnectAttempts + 1
    }));
  }

  handleReconnection() {
    // If we receive a message, the connection is restored
    if (this.state.hasError && this.state.isBfcacheError) {
      console.log('[ExtensionErrorBoundary] Connection restored');
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isBfcacheError: false,
        reconnectAttempts: 0
      });
    }
  }

  attemptReconnection() {
    console.log('[ExtensionErrorBoundary] Attempting to reconnect...');
    extensionMessageHandler.forceReconnect();
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isBfcacheError: false,
      reconnectAttempts: 0
    });
    
    // Force reconnection
    this.attemptReconnection();
  };

  handleIgnore = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isBfcacheError: false
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom UI for bfcache errors
      if (this.state.isBfcacheError) {
        return (
          <div className="extension-error-boundary bfcache-error">
            <div className="error-content">
              <div className="error-icon">⚠️</div>
              <h3>Extension Connection Issue</h3>
              <p>
                The page was moved to the back/forward cache, which closed the extension's message channel. 
                This is a normal browser behavior and doesn't affect the app's functionality.
              </p>
              
              <div className="error-actions">
                <button 
                  onClick={this.handleRetry}
                  className="retry-button"
                  disabled={this.state.reconnectAttempts > 0}
                >
                  {this.state.reconnectAttempts > 0 ? 'Reconnecting...' : 'Reconnect Extension'}
                </button>
                
                <button 
                  onClick={this.handleIgnore}
                  className="ignore-button"
                >
                  Continue Without Extension
                </button>
              </div>
              
              {this.state.reconnectAttempts > 0 && (
                <div className="reconnect-info">
                  <p>Attempting to reconnect... ({this.state.reconnectAttempts} attempts)</p>
                </div>
              )}
            </div>
            
            <style jsx>{`
              .extension-error-boundary {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
              
              .error-content {
                background: white;
                border-radius: 8px;
                padding: 2rem;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
              }
              
              .error-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
              }
              
              .error-content h3 {
                color: #333;
                margin: 0 0 1rem 0;
                font-size: 1.5rem;
              }
              
              .error-content p {
                color: #666;
                margin: 0 0 2rem 0;
                line-height: 1.5;
              }
              
              .error-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
              }
              
              .retry-button, .ignore-button {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 4px;
                font-size: 1rem;
                cursor: pointer;
                transition: background-color 0.2s;
              }
              
              .retry-button {
                background: #007bff;
                color: white;
              }
              
              .retry-button:hover:not(:disabled) {
                background: #0056b3;
              }
              
              .retry-button:disabled {
                background: #ccc;
                cursor: not-allowed;
              }
              
              .ignore-button {
                background: #6c757d;
                color: white;
              }
              
              .ignore-button:hover {
                background: #545b62;
              }
              
              .reconnect-info {
                margin-top: 1rem;
                color: #007bff;
                font-size: 0.9rem;
              }
            `}</style>
          </div>
        );
      }

      // Generic error UI for non-bfcache errors
      return (
        <div className="extension-error-boundary generic-error">
          <div className="error-content">
            <div className="error-icon">❌</div>
            <h3>Extension Error</h3>
            <p>An error occurred with the Chrome extension:</p>
            <pre className="error-details">
              {this.state.error && this.state.error.message}
            </pre>
            
            <div className="error-actions">
              <button onClick={this.handleRetry} className="retry-button">
                Retry
              </button>
              <button onClick={this.handleIgnore} className="ignore-button">
                Continue
              </button>
            </div>
          </div>
          
          <style jsx>{`
            .extension-error-boundary {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.8);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .error-content {
              background: white;
              border-radius: 8px;
              padding: 2rem;
              max-width: 500px;
              text-align: center;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            
            .error-icon {
              font-size: 3rem;
              margin-bottom: 1rem;
            }
            
            .error-content h3 {
              color: #333;
              margin: 0 0 1rem 0;
              font-size: 1.5rem;
            }
            
            .error-content p {
              color: #666;
              margin: 0 0 1rem 0;
            }
            
            .error-details {
              background: #f8f9fa;
              border: 1px solid #dee2e6;
              border-radius: 4px;
              padding: 1rem;
              margin: 1rem 0;
              text-align: left;
              font-size: 0.9rem;
              color: #dc3545;
              overflow-x: auto;
            }
            
            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
            }
            
            .retry-button, .ignore-button {
              padding: 0.75rem 1.5rem;
              border: none;
              border-radius: 4px;
              font-size: 1rem;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            
            .retry-button {
              background: #007bff;
              color: white;
            }
            
            .retry-button:hover {
              background: #0056b3;
            }
            
            .ignore-button {
              background: #6c757d;
              color: white;
            }
            
            .ignore-button:hover {
              background: #545b62;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ExtensionErrorBoundary;