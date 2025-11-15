/**
 * StationList Component
 *
 * Dynamic React component for displaying stations from API
 * Features:
 * - Loading, error, and empty states
 * - Accessible design (WCAG 2.1 AA)
 * - Responsive grid layout
 * - Server Component compatible
 *
 * @component
 */

import React from 'react';

import { StationCard } from './StationCard';
import { StationListEmpty } from './StationListEmpty';
import { StationListError } from './StationListError';
import { StationListLoading } from './StationListLoading';

// ============================================================================
// Types
// ============================================================================

export interface Station {
  id: string | number;
  name: string;
  brand?: string;
  address: string;
  suburb?: string;
  latitude?: number;
  longitude?: number;
  [key: string]: unknown;
}

export interface StationListProps {
  /** Array of station data */
  stations: Station[];
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: Error | string | null;
  /** Empty state message */
  emptyMessage?: string;
  /** Callback when station is clicked */
  onStationClick?: (station: Station) => void;
  /** Custom className */
  className?: string;
  /** Grid columns - responsive */
  columns?: {
    mobile?: 1 | 2;
    tablet?: 2 | 3;
    desktop?: 3 | 4 | 5;
  };
}

// ============================================================================
// Component
// ============================================================================

/**
 * StationList - Displays list of petrol stations
 *
 * Automatically handles loading, error, and empty states
 */
export function StationList({
  stations,
  isLoading = false,
  error = null,
  emptyMessage = 'No stations found',
  onStationClick,
  className = '',
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  },
}: StationListProps) {
  // Loading state
  if (isLoading) {
    return <StationListLoading columns={columns} />;
  }

  // Error state
  if (error) {
    return <StationListError error={error} />;
  }

  // Empty state
  if (!stations || stations.length === 0) {
    return <StationListEmpty message={emptyMessage} />;
  }

  // Success state - render stations
  const gridCols = {
    mobile: `grid-cols-${columns.mobile || 1}`,
    tablet: `sm:grid-cols-${columns.tablet || 2}`,
    desktop: `lg:grid-cols-${columns.desktop || 3}`,
  };

  return (
    <div
      className={`station-list ${className}`}
      role="region"
      aria-label="Petrol stations list"
    >
      {/* Status info for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Found {stations.length} {stations.length === 1 ? 'station' : 'stations'}
      </div>

      {/* Station grid */}
      <ul
        className={`
          grid gap-6
          ${gridCols.mobile}
          ${gridCols.tablet}
          ${gridCols.desktop}
        `}
      >
        {stations.map((station) => (
          <li key={station.id}>
            <StationCard
              station={station}
              onClick={() => onStationClick?.(station)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Display name for React DevTools
 */
StationList.displayName = 'StationList';
