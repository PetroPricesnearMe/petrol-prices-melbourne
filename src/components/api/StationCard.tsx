/**
 * StationCard Component
 *
 * Individual station card component with accessibility features
 *
 * @component
 */

import React from 'react';
import Link from 'next/link';

import type { Station } from './StationList';

// ============================================================================
// Types
// ============================================================================

export interface StationCardProps {
  /** Station data */
  station: Station;
  /** Click handler */
  onClick?: () => void;
  /** Custom className */
  className?: string;
  /** Show as link (default: true) */
  asLink?: boolean;
  /** Link href (auto-generated if not provided) */
  href?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * StationCard - Individual station display card
 *
 * Features:
 * - WCAG 2.1 AA compliant
 * - Keyboard accessible
 * - Focus indicators
 * - Touch-friendly (min 44x44px)
 * - Semantic HTML
 */
export function StationCard({
  station,
  onClick,
  className = '',
  asLink = true,
  href,
}: StationCardProps) {
  // Generate link href
  const cardHref = href || `/stations/${station.id}`;

  // Station name - prioritize name field
  const stationName = station.name || 'Unknown Station';

  // Address components
  const address = station.address || '';
  const suburb = station.suburb || '';
  const fullAddress = [address, suburb].filter(Boolean).join(', ');

  // Brand badge
  const brand = station.brand || undefined;

  // Base card classes
  const cardClasses = `
    group
    relative
    bg-white dark:bg-gray-800
    rounded-lg
    border border-gray-200 dark:border-gray-700
    shadow-sm hover:shadow-md
    transition-all duration-200
    overflow-hidden
    min-h-[200px]
    focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  // Card content
  const cardContent = (
    <>
      {/* Header */}
      <div className="p-4 pb-3">
        {/* Brand badge */}
        {brand && (
          <div className="mb-2">
            <span
              className="
                inline-block
                rounded bg-primary-50
                px-2 py-1
                text-xs font-semibold
                text-primary-700 dark:bg-primary-900/30
                dark:text-primary-300
              "
              aria-label={`Brand: ${brand}`}
            >
              {brand}
            </span>
          </div>
        )}

        {/* Station name */}
        <h3
          className="
            mb-2 line-clamp-2
            text-lg font-semibold
            text-gray-900
            dark:text-white
          "
        >
          {stationName}
        </h3>

        {/* Address */}
        {fullAddress && (
          <p
            className="
              line-clamp-2 flex items-start
              gap-1.5
              text-sm text-gray-600 dark:text-gray-300
            "
            aria-label={`Address: ${fullAddress}`}
          >
            <span className="sr-only">Location: </span>
            <svg
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{fullAddress}</span>
          </p>
        )}
      </div>

      {/* Footer with action */}
      <div
        className="
          flex items-center
          justify-between border-t border-gray-100
          bg-gray-50 px-4
          py-3 dark:border-gray-700 dark:bg-gray-900/50
        "
      >
        <span
          className="
            text-sm font-medium
            text-primary-600 group-hover:text-primary-700
            dark:text-primary-400 dark:group-hover:text-primary-300
          "
        >
          View Details
          <span className="sr-only"> for {stationName}</span>
        </span>
        <svg
          className="
            h-5 w-5
            transform text-primary-600
            transition-transform duration-200
            group-hover:translate-x-1 dark:text-primary-400
          "
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </>
  );

  // Render as link or button
  if (asLink && onClick === undefined) {
    return (
      <Link
        href={cardHref}
        className={cardClasses}
        aria-label={`View details for ${stationName}`}
      >
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${cardClasses} w-full text-left`}
        aria-label={`Select ${stationName}`}
      >
        {cardContent}
      </button>
    );
  }

  return <article className={cardClasses}>{cardContent}</article>;
}

/**
 * Display name for React DevTools
 */
StationCard.displayName = 'StationCard';
