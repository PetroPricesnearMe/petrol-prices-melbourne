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

export function LocationToggle({ onUseLocation, onSearchSuburb, isLocationLoading }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const handleUseLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          onUseLocation();
        },
        (error) => {
          alert('Unable to get your location. Please enable location services.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }, [onUseLocation]);
  
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSuburb(searchQuery.trim());
    }
  }, [searchQuery, onSearchSuburb]);
  
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleUseLocation}
        disabled={isLocationLoading}
        className={cn(
          'btn btn-primary btn-sm',
          isLocationLoading && 'loading'
        )}
      >
        {isLocationLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Getting Location...
          </>
        ) : (
          <>
            📍 Use My Location
          </>
        )}
      </button>
      
      <div className="flex gap-2 flex-1">
        {showSearch ? (
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search suburb or postcode..."
              className="input input-sm flex-1"
              autoFocus
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
              }}
              className="btn btn-ghost btn-sm"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="btn btn-outline btn-sm flex-1"
          >
            🔍 Search Suburb or Postcode
          </button>
        )}
      </div>
    </div>
  );
}

