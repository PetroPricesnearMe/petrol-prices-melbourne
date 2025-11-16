/**
 * Specialized Error Boundaries
 *
 * Domain-specific error boundaries with custom fallback UIs
 * @module components/common/ErrorBoundary/SpecializedBoundaries
 */

import Link from 'next/link';
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

const ApiErrorFallback: React.FC<ApiErrorFallbackProps> = ({
  error,
  onRetry,
}) => (
  <div className="api-error-boundary" role="alert" aria-live="assertive">
    <div className="bg-red-50 border-red-200 mx-auto max-w-md rounded-lg border p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg
            className="text-red-600 h-6 w-6"
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
          <h3 className="text-red-800 mb-2 text-lg font-semibold">
            Unable to Load Data
          </h3>
          <p className="text-red-700 mb-4 text-sm">
            We&apos;re having trouble connecting to our servers. This might be a
            temporary issue.
          </p>
          <p className="text-red-600 bg-red-100 mb-4 rounded p-2 font-mono text-xs">
            {error.message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500 rounded-md px-4 py-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
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

export const ApiErrorBoundary: React.FC<{
  children: ReactNode;
  onRetry?: () => void;
}> = ({ children, onRetry }) => (
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
    <div className="flex h-96 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
      <div className="p-6 text-center">
        <div className="bg-yellow-100 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
          <svg
            className="text-yellow-600 h-8 w-8"
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
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Map Unavailable
        </h3>
        <p className="max-w-sm text-sm text-gray-600">
          We couldn&apos;t load the map at this time. You can still view station
          listings below.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <p className="mt-4 font-mono text-xs text-gray-500">
            {error.message}
          </p>
        )}
      </div>
    </div>
  </div>
);

export const MapErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
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

const ChartErrorFallback: React.FC<ChartErrorFallbackProps> = ({ error: _error }) => (
  <div className="chart-error-boundary" role="alert">
    <div className="bg-blue-50 border-blue-200 flex h-64 items-center justify-center rounded-lg border">
      <div className="p-6 text-center">
        <div className="bg-blue-100 mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full">
          <svg
            className="text-blue-600 h-6 w-6"
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
        <h3 className="mb-1 text-base font-semibold text-gray-900">
          Chart Data Unavailable
        </h3>
        <p className="text-sm text-gray-600">
          Unable to display chart at this time
        </p>
      </div>
    </div>
  </div>
);

export const ChartErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
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

const FormErrorFallback: React.FC<FormErrorFallbackProps> = ({
  error: _error,
  onReset,
}) => (
  <div className="form-error-boundary" role="alert">
    <div className="bg-orange-50 border-orange-200 rounded-lg border p-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <svg
            className="text-orange-600 h-5 w-5"
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
          <h3 className="text-orange-800 mb-1 text-sm font-semibold">
            Form Submission Error
          </h3>
          <p className="text-orange-700 text-sm">
            An error occurred while processing your request. Please try again.
          </p>
          {onReset && (
            <button
              onClick={onReset}
              className="text-orange-800 hover:text-orange-900 focus:ring-orange-500 mt-3 text-sm font-medium underline focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Reset Form
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const FormErrorBoundary: React.FC<{
  children: ReactNode;
  onReset?: () => void;
}> = ({ children, onReset }) => (
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
  <div
    className="page-error-boundary flex min-h-screen items-center justify-center bg-gray-50"
    role="alert"
  >
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="bg-red-100 mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full">
        <svg
          className="text-red-600 h-10 w-10"
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
      <h1 className="mb-4 text-4xl font-bold text-gray-900">
        Oops! Something Went Wrong
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        We encountered an unexpected error while loading this page.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 rounded-md px-6 py-3 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          Reload Page
        </button>
        <Link
          href="/"
          className="rounded-md bg-gray-200 px-6 py-3 text-gray-800 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Go to Homepage
        </Link>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 text-left">
          <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
            Error Details (Development Only)
          </summary>
          <pre className="mt-4 overflow-auto rounded-lg border border-gray-300 bg-gray-100 p-4 text-left text-sm">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  </div>
);

export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
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
) =>
  withErrorBoundary(Component, {
    fallback: (error) => <ApiErrorFallback error={error} />,
  });

/** Add map error boundary to component */
export const withMapErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
) =>
  withErrorBoundary(Component, {
    fallback: (error) => <MapErrorFallback error={error} />,
  });

/** Add chart error boundary to component */
export const withChartErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
) =>
  withErrorBoundary(Component, {
    fallback: (error) => <ChartErrorFallback error={error} />,
  });

/** Add form error boundary to component */
export const withFormErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  onReset?: () => void
) =>
  withErrorBoundary(Component, {
    fallback: (error) => <FormErrorFallback error={error} onReset={onReset} />,
    onReset,
  });
