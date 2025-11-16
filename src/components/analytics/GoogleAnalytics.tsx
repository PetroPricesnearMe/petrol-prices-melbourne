/**
 * Google Analytics 4 Integration
 * Privacy-focused analytics with consent management
 * Excludes bots and respects user privacy preferences
 */

'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  const GA_MEASUREMENT_ID =
    measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Check if this is a bot (respect privacy)
  useEffect(() => {
    const isBot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);
    if (isBot) {
      setConsentGiven(false);
      return;
    }

    // Check for stored consent
    const storedConsent = localStorage.getItem('analytics-consent');
    if (storedConsent === 'accepted') {
      setConsentGiven(true);
    } else if (storedConsent === 'declined') {
      setConsentGiven(false);
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (
      consentGiven &&
      GA_MEASUREMENT_ID &&
      typeof window.gtag !== 'undefined'
    ) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : '');

      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
        anonymize_ip: true, // Anonymize IP addresses
        cookie_flags: 'SameSite=None;Secure',
      });
    }
  }, [pathname, searchParams, consentGiven, GA_MEASUREMENT_ID]);

  // Don't load if no measurement ID or consent not given
  if (!GA_MEASUREMENT_ID || consentGiven === false) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
              ${
                consentGiven === null
                  ? `
              'allow_google_signals': false,
              'allow_ad_personalization_signals': false,
              `
                  : ''
              }
            });

            // Set default consent mode
            gtag('consent', 'default', {
              'analytics_storage': ${consentGiven ? "'granted'" : "'denied'"},
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `,
        }}
      />
    </>
  );
}

// TypeScript declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'consent' | 'js' | 'set' | string,
      targetId?: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Helper function to track custom events
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * Helper function to update consent
 */
export function updateConsent(consent: 'granted' | 'denied') {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('consent', 'update', {
      analytics_storage: consent,
    });

    // Store consent preference
    localStorage.setItem(
      'analytics-consent',
      consent === 'granted' ? 'accepted' : 'declined'
    );
  }
}
