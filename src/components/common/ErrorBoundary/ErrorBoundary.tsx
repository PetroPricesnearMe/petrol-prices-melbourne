/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in child components and displays fallback UI
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Report to error tracking service (e.g., Sentry)
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(_error: Error, _errorInfo: ErrorInfo): void {
    // TODO: Integrate with error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    this.props.onReset?.();
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error && errorInfo) {
      // Custom fallback
      if (typeof fallback === 'function') {
        return fallback(error, errorInfo);
      }

      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div
          style={{
            padding: '2rem',
            margin: '2rem',
            border: '2px solid #F44336',
            borderRadius: '0.5rem',
            backgroundColor: '#FFEBEE',
          }}
        >
          <h2 style={{ color: '#C62828', marginTop: 0 }}>Something went wrong</h2>
          <p style={{ color: '#424242' }}>
            An error occurred while rendering this component. Please try refreshing the page.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                Error Details (Development Only)
              </summary>
              <pre
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#FFF',
                  border: '1px solid #E0E0E0',
                  borderRadius: '0.25rem',
                  overflow: 'auto',
                  fontSize: '0.875rem',
                }}
              >
                {error.toString()}
                {'\n\n'}
                {errorInfo.componentStack}
              </pre>
            </details>
          )}

          <button
            onClick={this.handleReset}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#2196F3',
              color: '#FFF',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return children;
  }
}

/**
 * Hook-based error boundary wrapper
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
