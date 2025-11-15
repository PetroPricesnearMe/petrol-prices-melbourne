import React from 'react';
// CSS imported in pages/_app.js for Next.js compatibility

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and external services
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // TODO: Log to error reporting service (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h1>Oops! Something went wrong</h1>
            <p className="error-message">
              We encountered an unexpected error. Don&apos;t worry, we&apos;re working to
              fix it!
            </p>

            <div className="error-actions">
              <button
                className="retry-button"
                onClick={this.handleRetry}
                disabled={this.state.retryCount >= 3}
              >
                {this.state.retryCount >= 3
                  ? 'Please refresh page'
                  : 'Try Again'}
              </button>

              <button
                className="home-button"
                onClick={() => (window.location.href = '/')}
              >
                Go to Homepage
              </button>
            </div>

            <details className="error-details">
              <summary>Technical Details (for developers)</summary>
              <pre className="error-stack">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack ||
                  'No component stack available'}
              </pre>
            </details>

            <div className="error-help">
              <h3>Common Solutions:</h3>
              <ul>
                <li>Check your internet connection</li>
                <li>Refresh the page (Ctrl+F5 or Cmd+Shift+R)</li>
                <li>Clear your browser cache</li>
                <li>Try using a different browser</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
