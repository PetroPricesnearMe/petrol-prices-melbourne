/**
 * CMS Error Boundary
 *
 * React Error Boundary specifically designed for CMS content
 * with fallback UI and error reporting
 */

'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class CMSErrorBoundary extends Component<Props, State> {
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error
    console.error('CMS Error Boundary caught error:', error, errorInfo);

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          className="border-red-200 bg-red-50 rounded-lg border-2 p-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg
                className="text-red-600 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-red-800 text-lg font-semibold">
                Content Loading Error
              </h3>
              <p className="text-red-700 mt-2 text-sm">
                We encountered an issue loading this content. Please try again
                later.
              </p>

              {this.props.showDetails && this.state.error && (
                <details className="mt-4">
                  <summary className="text-red-800 cursor-pointer text-sm font-medium">
                    Technical Details
                  </summary>
                  <pre className="bg-red-100 text-red-900 mt-2 overflow-auto rounded p-3 text-xs">
                    {this.state.error.toString()}
                    {this.state.errorInfo && (
                      <>
                        {'\n\n'}
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </details>
              )}

              <button
                onClick={this.handleReset}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-500 mt-4 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                type="button"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional wrapper for simple use cases
 */
export function withCMSErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WithErrorBoundary(props: P) {
    return (
      <CMSErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </CMSErrorBoundary>
    );
  };
}
