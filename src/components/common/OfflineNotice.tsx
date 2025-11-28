/**
 * Offline Notice Component
 * 
 * Displays a banner when the user is offline
 * 
 * @module components/common/OfflineNotice
 */

'use client';

import { useEffect, useState } from 'react';

export interface OfflineNoticeProps {
  className?: string;
  onDismiss?: () => void;
}

/**
 * Offline Notice Component
 */
export function OfflineNotice({ className = '', onDismiss }: OfflineNoticeProps) {
  const [isOffline, setIsOffline] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOffline(false);
      // Hide after a short delay when coming back online
      setTimeout(() => setIsVisible(false), 2000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsVisible(true);
    };

    // Check initial state
    setIsOffline(!navigator.onLine);
    setIsVisible(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 px-4 py-3 shadow-lg transition-transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
          <div>
            <p className="font-semibold">You&apos;re currently offline</p>
            <p className="text-sm">Some features may not be available until you reconnect.</p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 rounded p-1 text-yellow-900 hover:bg-yellow-600 transition-colors"
            aria-label="Dismiss offline notice"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

