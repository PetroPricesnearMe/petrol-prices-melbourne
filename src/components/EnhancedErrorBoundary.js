import React from 'react';
import './ErrorBoundary.css';

class EnhancedErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastErrorTime: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const currentTime = Date.now();
    const { lastErrorTime, retryCount } = this.state;
    
    // Prevent error loops - if same error occurs within 5 seconds, increase retry count
    const isRecentError = lastErrorTime && (currentTime - lastErrorTime) < 5000;
    const newRetryCount = isRecentError ? retryCount + 1 : 1;
    const errorId = `err_${currentTime.toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      retryCount: newRetryCount,
      lastErrorTime: currentTime,
      errorId: errorId
    });
    
    // Enhanced error logging with context
    const errorDetails = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      props: this.props,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      retryCount: newRetryCount,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    };
    
    console.error('🚨 Enhanced Error Boundary:', errorDetails);
    
    // Production error reporting
    if (process.env.NODE_ENV === 'production') {
      this.reportError(errorDetails);
    }
    
    // Auto-retry for transient errors (max 2 retries)
    if (newRetryCount <= 2 && this.isTransientError(error)) {
      setTimeout(() => {
        this.setState({ hasError: false, error: null, errorInfo: null });
      }, 1000 * newRetryCount); // Exponential backoff
    }
  }
  
  isTransientError(error) {
    const transientPatterns = [
      /network/i,
      /fetch/i,
      /timeout/i,
      /connection/i,
      /ChunkLoadError/i,
      /Loading chunk \d+ failed/i,
      /Loading CSS chunk/i
    ];
    return transientPatterns.some(pattern => pattern.test(error.message));
  }
  
  reportError = async (errorDetails) => {
    try {
      // Multiple error reporting strategies
      const reporting = [
        // 1. Custom backend endpoint
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorDetails)
        }),
        
        // 2. Browser beacon API (more reliable)
        navigator.sendBeacon && navigator.sendBeacon(
          '/api/errors/beacon', 
          JSON.stringify(errorDetails)
        ),
        
        // 3. Local storage for retry later if offline
        this.storeErrorForRetry(errorDetails)
      ];
      
      await Promise.allSettled(reporting.filter(Boolean));
    } catch (e) {
      console.warn('Error reporting failed:', e);
    }
  }
  
  storeErrorForRetry = (errorDetails) => {
    try {
      const errors = JSON.parse(localStorage.getItem('pendingErrors') || '[]');
      errors.push(errorDetails);
      localStorage.setItem('pendingErrors', JSON.stringify(errors.slice(-10))); // Keep last 10 errors
    } catch (e) {
      console.warn('Failed to store error for retry:', e);
    }
  }
  
  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  }
  
  handleRefresh = () => {
    // Clear any cached data before refresh
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      const { error, retryCount, errorId } = this.state;
      const isRepeatedError = retryCount > 2;
      const isTransient = this.isTransientError(error);
      
      return (
        <div className="error-boundary enhanced">
          <div className="error-container">
            <div className="error-icon">{isTransient ? '🔄' : '⚠️'}</div>
            
            <h1>{isTransient ? 'Connection Issue' : 'Something went wrong!'}</h1>
            
            {isRepeatedError ? (
              <div className="error-content">
                <p>This error keeps occurring. The issue has been reported automatically.</p>
                <p className="error-subtitle">Error ID: <code>{errorId}</code></p>
                <p className="error-subtitle">Occurred {retryCount} times</p>
              </div>
            ) : isTransient ? (
              <div className="error-content">
                <p>We're having trouble connecting. This usually resolves automatically.</p>
                <p className="error-subtitle">If it persists, check your internet connection.</p>
              </div>
            ) : (
              <div className="error-content">
                <p>We encountered an unexpected error. Our team has been automatically notified.</p>
                <p className="error-subtitle">Error ID: <code>{errorId}</code></p>
              </div>
            )}
            
            <div className="error-actions">
              {!isRepeatedError && (
                <button 
                  className="retry-button btn-primary"
                  onClick={this.handleRetry}
                >
                  🔄 Try Again
                </button>
              )}
              <button 
                className="refresh-button btn-secondary"
                onClick={this.handleRefresh}
              >
                🔃 Refresh Page
              </button>
              <a 
                href="/"
                className="home-button btn-secondary"
              >
                🏠 Go Home
              </a>
            </div>
            
            <div className="error-help">
              <details>
                <summary>Need help? Here are some solutions:</summary>
                <ul>
                  <li><strong>Check your connection:</strong> Ensure you have a stable internet connection</li>
                  <li><strong>Clear cache:</strong> Press Ctrl+F5 (or Cmd+Shift+R on Mac) to hard refresh</li>
                  <li><strong>Try incognito:</strong> Open the site in a private/incognito window</li>
                  <li><strong>Disable extensions:</strong> Browser extensions can sometimes interfere</li>
                  <li><strong>Update browser:</strong> Make sure you're using a recent browser version</li>
                  <li><strong>Contact support:</strong> If the problem persists, contact us with error ID: <code>{errorId}</code></li>
                </ul>
              </details>
            </div>
            
            {process.env.NODE_ENV === 'development' && error && (
              <details className="error-details dev-only">
                <summary>🔧 Developer Information</summary>
                <div className="error-info">
                  <h4>Error Message:</h4>
                  <pre>{error.toString()}</pre>
                  
                  <h4>Component Stack:</h4>
                  <pre>{this.state.errorInfo?.componentStack}</pre>
                  
                  <h4>Error Stack:</h4>
                  <pre>{error.stack}</pre>
                  
                  <h4>Additional Context:</h4>
                  <pre>{JSON.stringify({
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                    viewport: `${window.innerWidth}x${window.innerHeight}`,
                    timestamp: new Date().toISOString()
                  }, null, 2)}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
