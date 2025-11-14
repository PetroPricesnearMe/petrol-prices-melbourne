/**
 * LoadingSpinner - Production-Ready Loading Component
 * 
 * A fully accessible, performant loading spinner with timeout handling,
 * progress indication, and error states.
 * 
 * @component
 * @example
 * ```tsx
 * <LoadingSpinner 
 *   message="Loading stations..."
 *   size="large"
 *   showTips
 *   timeout={15000}
 *   onTimeout={handleTimeout}
 * />
 * ```
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, AlertCircle, RefreshCw, Home } from 'lucide-react';

import { cn } from '@/design-system/utils';
import type { ComponentBaseProps } from '@/types';

/**
 * Loading spinner variants
 */
const spinnerVariants = cva(
  [
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'gap-4',
    'p-8',
  ],
  {
    variants: {
      size: {
        sm: 'p-4 gap-2',
        md: 'p-6 gap-3',
        lg: 'p-8 gap-4',
      },
      fullScreen: {
        true: [
          'fixed',
          'inset-0',
          'z-50',
          'bg-white/80',
          'dark:bg-gray-900/80',
          'backdrop-blur-sm',
        ],
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      fullScreen: false,
    },
  }
);

/**
 * Loading tips for better UX
 */
const LOADING_TIPS = [
  '💡 Compare prices across 250+ petrol stations',
  '🗺️ Use our interactive map to find nearby stations',
  '⛽ Check real-time fuel prices before you drive',
  '📱 Our site works great on mobile devices',
  '🔄 Prices update automatically throughout the day',
] as const;

/**
 * LoadingSpinner Props
 */
export interface LoadingSpinnerProps
  extends ComponentBaseProps,
    VariantProps<typeof spinnerVariants> {
  /**
   * Loading message to display
   * @default "Loading..."
   */
  message?: string;

  /**
   * Show helpful tips while loading
   * @default false
   */
  showTips?: boolean;

  /**
   * Timeout in milliseconds
   * @default 10000
   */
  timeout?: number;

  /**
   * Callback when timeout is reached
   */
  onTimeout?: () => void;

  /**
   * Show full screen overlay
   * @default false
   */
  fullScreen?: boolean;
}

/**
 * LoadingSpinner Component
 * 
 * Displays a loading spinner with optional timeout handling,
 * progress indication, and error states.
 */
export const LoadingSpinner = React.memo<LoadingSpinnerProps>(
  ({
    message = 'Loading...',
    size = 'md',
    showTips = false,
    fullScreen = false,
    timeout = 10000,
    onTimeout,
    className,
    ...props
  }) => {
    const [timedOut, setTimedOut] = React.useState(false);
    const [elapsedTime, setElapsedTime] = React.useState(0);
    const [currentTip] = React.useState(
      () => LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)]
    );

    // Track elapsed time and handle timeout
    React.useEffect(() => {
      const startTime = Date.now();
      let intervalId: NodeJS.Timeout;
      let timeoutId: NodeJS.Timeout;

      // Update elapsed time every 100ms
      intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setElapsedTime(elapsed);
      }, 100);

      // Set timeout
      timeoutId = setTimeout(() => {
        setTimedOut(true);
        onTimeout?.();
      }, timeout);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }, [timeout, onTimeout]);

    // Calculate progress percentage
    const progressPercent = Math.min((elapsedTime / timeout) * 100, 100);

    // Timeout state
    if (timedOut) {
      return (
        <div
          className={cn(spinnerVariants({ size, fullScreen }), className)}
          role="alert"
          aria-live="assertive"
          {...props}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 max-w-md text-center"
          >
            <div className="p-4 rounded-full bg-error-50 dark:bg-error-900/20">
              <AlertCircle
                className="w-12 h-12 text-error-500 dark:text-error-400"
                aria-hidden="true"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Loading is taking longer than expected
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This might be due to a slow network connection or server issues.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Timed out after {(timeout / 1000).toFixed(0)} seconds
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="
                  flex items-center justify-center gap-2
                  px-4 py-2
                  bg-primary-600 text-white
                  rounded-lg
                  hover:bg-primary-700
                  active:bg-primary-800
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  transition-colors
                  font-medium
                "
                aria-label="Refresh page"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Refresh Page
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/';
                }}
                className="
                  flex items-center justify-center gap-2
                  px-4 py-2
                  bg-gray-100 text-gray-900
                  dark:bg-gray-800 dark:text-white
                  rounded-lg
                  hover:bg-gray-200 dark:hover:bg-gray-700
                  active:bg-gray-300 dark:active:bg-gray-600
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                  transition-colors
                  font-medium
                "
                aria-label="Go to homepage"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                Go to Homepage
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    // Loading state
    return (
      <div
        className={cn(spinnerVariants({ size, fullScreen }), className)}
        role="status"
        aria-live="polite"
        aria-label={message}
        {...props}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Spinner */}
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-16 h-16"
            >
              <Loader2
                className="w-full h-full text-primary-600 dark:text-primary-400"
                aria-hidden="true"
              />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl" aria-hidden="true">
                ⛽
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {message}
            </h3>

            <AnimatePresence mode="wait">
              {showTips && (
                <motion.p
                  key={currentTip}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  {currentTip}
                </motion.p>
              )}
            </AnimatePresence>

            <p className="text-xs text-gray-500 dark:text-gray-500">
              {(elapsedTime / 1000).toFixed(1)}s
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs">
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary-600 dark:bg-primary-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

