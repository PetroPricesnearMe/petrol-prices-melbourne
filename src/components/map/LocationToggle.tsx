/**
 * Location Toggle Component
 *
 * Toggle for "Use My Location" and "Search Suburb or Postcode"
 */

'use client';

import { useState, useCallback } from 'react';

import { cn } from '@/styles/system/css-in-js';

interface Props {
  onUseLocation: () => void;
  onSearchSuburb: (query: string) => void;
  isLocationLoading?: boolean;
}

export function LocationToggle({
  onUseLocation,
  onSearchSuburb,
  isLocationLoading,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleUseLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          onUseLocation();
        },
        (error) => {
          alert(
            'Unable to get your location. Please enable location services.'
          );
          console.error('Geolocation error:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, [onUseLocation]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        onSearchSuburb(searchQuery.trim());
      }
    },
    [searchQuery, onSearchSuburb]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={handleUseLocation}
        disabled={isLocationLoading}
        className={cn('btn-primary btn-sm btn', isLocationLoading && 'loading')}
      >
        {isLocationLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Getting Location...
          </>
        ) : (
          <>
            <span aria-hidden="true">📍</span> Use My Location
          </>
        )}
      </button>

      <div className="flex flex-1 gap-2">
        {showSearch ? (
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <label htmlFor="suburb-search" className="sr-only">
              Search suburb or postcode
            </label>
            <input
              id="suburb-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search suburb or postcode..."
              className="input input-sm flex-1"
              aria-label="Search suburb or postcode"
              autoFocus
            />
            <button type="submit" className="btn-primary btn-sm btn">
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
              }}
              className="btn-ghost btn-sm btn"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="btn-outline btn-sm btn flex-1"
            aria-label="Search suburb or postcode"
          >
            <span aria-hidden="true">🔍</span> Search Suburb or Postcode
          </button>
        )}
      </div>
    </div>
  );
}
