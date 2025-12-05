'use client';

import Link from 'next/link';

import { formatPriceCentsPerLiter } from '@/lib/utils/price';
import { getCheapestPrice } from '@/lib/map/marker-utils';
import { getStationUrl } from '@/lib/seo/station-seo';
import type { Station } from '@/types/station';

interface StationPopupProps {
  station: Station;
  onClose: () => void;
}

/**
 * Station popup component for map markers
 * 
 * Displays a detailed popup when a user clicks on a station marker on the map.
 * Shows station name, brand, address, cheapest fuel price, and action buttons.
 * 
 * Current behavior:
 * - Automatically calculates and displays the cheapest price from all available fuel types
 * - Conditionally renders address section only if address or suburb data exists
 * - Provides "View Details" link to station detail page and "Directions" link to Google Maps
 * - Shows last updated timestamp if available, formatted in Australian date format
 * - Includes close button that calls onClose callback when clicked
 * - Uses fixed width constraints (min 280px, max 320px) for consistent sizing
 */
export function StationPopup({ station, onClose }: StationPopupProps) {
  const cheapestPrice = getCheapestPrice(station);

  return (
    <div className="station-popup min-w-[280px] max-w-[320px]">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold text-gray-900">{station.name}</h3>
            <p className="text-sm text-gray-600">{station.brand || 'Station'}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Close popup"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Address */}
      {(station.address || station.suburb) && (
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
            <div className="text-sm text-gray-600">
              {station.address && <p className="m-0">{station.address}</p>}
              <p className="mt-1">
                {station.suburb}
                {station.postcode && ` ${station.postcode}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Price */}
      {cheapestPrice && (
        <div className="border-b border-gray-200 p-4">
          <h4 className="mb-3 text-sm font-semibold text-gray-900">
            Current Prices
          </h4>
          <div className="text-lg font-bold text-green-600">
            From {formatPriceCentsPerLiter(cheapestPrice)}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 p-4">
        <Link
          href={getStationUrl(station)}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          View Details
        </Link>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg bg-gray-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          Directions
        </a>
      </div>

      {/* Last updated */}
      {station.lastUpdated && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500">
            Updated:{' '}
            {new Date(station.lastUpdated).toLocaleDateString('en-AU', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
}

