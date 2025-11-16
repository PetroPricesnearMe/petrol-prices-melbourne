/**
 * Cookie Consent Banner
 * GDPR-compliant consent management for analytics
 */

'use client';

import { useState, useEffect } from 'react';

import { updateConsent } from './GoogleAnalytics';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('analytics-consent');
    if (!consent) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
        // Trigger animation
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      }, 1000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, []);

  const handleAccept = () => {
    updateConsent('granted');
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const handleDecline = () => {
    updateConsent('denied');
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`
        ease-out fixed bottom-0 left-0 right-0
        z-[1000] border-t
        border-gray-200 bg-white shadow-2xl
        transition-transform
        duration-300 dark:border-gray-800 dark:bg-gray-900
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-consent-description"
    >
      <div className="container mx-auto px-4 py-6 sm:py-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              🍪 We value your privacy
            </h3>
            <p
              id="cookie-consent-description"
              className="max-w-2xl text-sm text-gray-600 dark:text-gray-400"
            >
              We use analytics cookies to improve your experience and understand
              how you use our site. We respect your privacy - no personal data
              is collected, and your IP is anonymized. Bots are automatically
              excluded.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 sm:flex-nowrap">
            <button
              onClick={handleDecline}
              className="
                whitespace-nowrap rounded-lg border
                border-gray-300 px-4
                py-2 text-sm font-medium
                text-gray-700 transition-colors
                duration-200 hover:bg-gray-50
                dark:border-gray-700 dark:text-gray-300
                dark:hover:bg-gray-800
              "
              aria-label="Decline analytics cookies"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="
                whitespace-nowrap rounded-lg bg-primary-500
                px-4 py-2
                text-sm
                font-medium text-white
                transition-colors duration-200
                hover:bg-primary-600
              "
              aria-label="Accept analytics cookies"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
