/**
 * Specialized Error Boundaries
 *
 * Domain-specific error boundaries with custom fallback UIs
 * @module components/common/ErrorBoundary/SpecializedBoundaries
 */

import React from 'react';
import type { ReactNode } from 'react';

import { ErrorBoundary, withErrorBoundary } from './ErrorBoundary';

// ============================================================================
// API Error Boundary
// ============================================================================

interface ApiErrorFallbackProps {
  error: Error;
  onRetry?: () => void;
}

const ApiErrorFallback: React.FC<ApiErrorFallbackProps> = ({ error, onRetry }) => (
  <div className="api-error-boundary" role="alert" aria-live="assertive">
    <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Unable to Load Data
          </h3>
          <p className="text-sm text-red-700 mb-4">
            We're having trouble connecting to our servers. This might be a temporary issue.
          </p>
          <p className="text-xs text-red-600 mb-4 font-mono bg-red-100 p-2 rounded">
            {error.message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Retry loading data"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const ApiErrorBoundary: React.FC<{ children: ReactNode; onRetry?: () => void }> = ({
  children,
  onRetry,
}) => (
  <ErrorBoundary
    fallback={(error) => <ApiErrorFallback error={error} onRetry={onRetry} />}
  >
    {children}
  </ErrorBoundary>
);

// ============================================================================
// Map Error Boundary
// ============================================================================

interface MapErrorFallbackProps {
  error: Error;
}

const MapErrorFallback: React.FC<MapErrorFallbackProps> = ({ error }) => (
  <div className="map-error-boundary" role="alert">
    <div className="flex items-center justify-center h-96 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="text-center p-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Map Unavailable
        </h3>
        <p className="text-sm text-gray-600 max-w-sm">
          We couldn't load the map at this time. You can still view station listings below.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-gray-500 mt-4 font-mono">{error.message}</p>
        )}
      </div>
    </div>
  </div>
);

export const MapErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary fallback={(error) => <MapErrorFallback error={error} />}>
    {children}
  </ErrorBoundary>
);

// ============================================================================
// Chart Error Boundary
// ============================================================================

interface ChartErrorFallbackProps {
  error: Error;
}

const ChartErrorFallback: React.FC<ChartErrorFallbackProps> = ({ error }) => (
  <div className="chart-error-boundary" role="alert">
    <div className="flex items-center justify-center h-64 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="text-center p-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          Chart Data Unavailable
        </h3>
        <p className="text-sm text-gray-600">
          Unable to display chart at this time
        </p>
      </div>
    </div>
  </div>
);

export const ChartErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary fallback={(error) => <ChartErrorFallback error={error} />}>
    {children}
  </ErrorBoundary>
);

// ============================================================================
// Form Error Boundary
// ============================================================================

interface FormErrorFallbackProps {
  error: Error;
  onReset?: () => void;
}

const FormErrorFallback: React.FC<FormErrorFallbackProps> = ({ error, onReset }) => (
  <div className="form-error-boundary" role="alert">
    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-orange-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-orange-800 mb-1">
            Form Submission Error
          </h3>
          <p className="text-sm text-orange-700">
            An error occurred while processing your request. Please try again.
          </p>
          {onReset && (
            <button
              onClick={onReset}
              className="mt-3 text-sm font-medium text-orange-800 hover:text-orange-900 underline focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Reset Form
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const FormErrorBoundary: React.FC<{ children: ReactNode; onReset?: () => void }> = ({
  children,
  onReset,
}) => (
  <ErrorBoundary
    fallback={(error) => <FormErrorFallback error={error} onReset={onReset} />}
    onReset={onReset}
  >
    {children}
  </ErrorBoundary>
);

// ============================================================================
// Page Error Boundary
// ============================================================================

interface PageErrorFallbackProps {
  error: Error;
}

const PageErrorFallback: React.FC<PageErrorFallbackProps> = ({ error }) => (
  <div className="page-error-boundary min-h-screen flex items-center justify-center bg-gray-50" role="alert">
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
        <svg
          className="w-10 h-10 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
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
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Oops! Something Went Wrong
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        We encountered an unexpected error while loading this page.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Reload Page
        </button>
        <a
          href="/"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Go to Homepage
        </a>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 text-left">
          <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
            Error Details (Development Only)
          </summary>
          <pre className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg overflow-auto text-sm text-left">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  </div>
);

export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary fallback={(error) => <PageErrorFallback error={error} />}>
    {children}
  </ErrorBoundary>
);

// ============================================================================
// HOC for adding error boundaries to components
// ============================================================================

/** Add API error boundary to component */
export const withApiErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
) => withErrorBoundary(Component, {
  fallback: (error) => <ApiErrorFallback error={error} />,
});

/** Add map error boundary to component */
export const withMapErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
) => withErrorBoundary(Component, {
  fallback: (error) => <MapErrorFallback error={error} />,
});

/** Add chart error boundary to component */
export const withChartErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
) => withErrorBoundary(Component, {
  fallback: (error) => <ChartErrorFallback error={error} />,
});

/** Add form error boundary to component */
export const withFormErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  onReset?: () => void
) => withErrorBoundary(Component, {
  fallback: (error) => <FormErrorFallback error={error} onReset={onReset} />,
  onReset,
});
