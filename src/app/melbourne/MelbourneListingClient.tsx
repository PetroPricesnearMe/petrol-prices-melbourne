/**
 * Melbourne Listing Client Component
 *
 * Client-side component for the Melbourne fuel station listing page
 * Handles interactivity, map, reviews, and user interactions
 */

'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';

import { StationFilters } from '@/components/listings/StationFilters';
import { StationList } from '@/components/listings/StationList';
import { StationListingHeader } from '@/components/listings/StationListingHeader';
import { StationMap } from '@/components/listings/StationMap';
import type { Station } from '@/types/station';

const SocialShareButtons = dynamic(
  () =>
    import('@/components/listings/SocialShareButtons').then((mod) => ({
      default: mod.SocialShareButtons,
    })),
  { ssr: false }
);

interface MelbourneListingClientProps {
  stations: Station[];
}

type ViewMode = 'list' | 'map';

export function MelbourneListingClient({
  stations: initialStations,
}: MelbourneListingClientProps) {
  const [stations, setStations] = useState<Station[]>(initialStations);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    fuelType: 'all' as
      | 'all'
      | 'unleaded'
      | 'diesel'
      | 'premium95'
      | 'premium98',
    brand: 'all' as string,
    suburb: 'all' as string,
    sortBy: 'nearest' as 'nearest' | 'price-low' | 'price-high' | 'name',
  });

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Fallback to Melbourne CBD if geolocation fails
          setUserLocation({ lat: -37.8136, lng: 144.9631 });
        }
      );
    } else {
      // Fallback to Melbourne CBD
      setUserLocation({ lat: -37.8136, lng: 144.9631 });
    }
  }, []);

  // Filter and sort stations
  useEffect(() => {
    let filtered = [...initialStations];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (station) =>
          station.name.toLowerCase().includes(searchLower) ||
          station.address.toLowerCase().includes(searchLower) ||
          station.suburb.toLowerCase().includes(searchLower) ||
          station.brand.toLowerCase().includes(searchLower)
      );
    }

    // Apply fuel type filter
    if (filters.fuelType !== 'all') {
      filtered = filtered.filter((station) => {
        const prices = station.fuelPrices;
        switch (filters.fuelType) {
          case 'unleaded':
            return prices.unleaded !== null;
          case 'diesel':
            return prices.diesel !== null;
          case 'premium95':
            return prices.premium95 !== null;
          case 'premium98':
            return prices.premium98 !== null;
          default:
            return true;
        }
      });
    }

    // Apply brand filter
    if (filters.brand !== 'all') {
      filtered = filtered.filter((station) => station.brand === filters.brand);
    }

    // Apply suburb filter
    if (filters.suburb !== 'all') {
      filtered = filtered.filter(
        (station) => station.suburb === filters.suburb
      );
    }

    // Calculate distances if user location is available
    if (userLocation) {
      filtered = filtered.map((station) => {
        if (station.latitude && station.longitude) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            station.latitude,
            station.longitude
          );
          return { ...station, distance };
        }
        return station;
      });
    }

    // Sort stations
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'nearest':
          if (
            userLocation &&
            a.distance !== undefined &&
            b.distance !== undefined
          ) {
            return a.distance - b.distance;
          }
          return 0;
        case 'price-low': {
          const minPriceA = getMinPrice(a);
          const minPriceB = getMinPrice(b);
          return (minPriceA || Infinity) - (minPriceB || Infinity);
        }
        case 'price-high': {
          const maxPriceA = getMaxPrice(a);
          const maxPriceB = getMaxPrice(b);
          return (maxPriceB || 0) - (maxPriceA || 0);
        }
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setStations(filtered);
  }, [initialStations, filters, userLocation]);

  const handleStationClick = useCallback(
    (station: Station) => {
      setSelectedStation(station);
      if (viewMode === 'list') {
        // Scroll to station details
        const element = document.getElementById(`station-${station.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
    [viewMode]
  );

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'list' ? 'map' : 'list'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sticky Header */}
      <StationListingHeader
        totalStations={stations.length}
        viewMode={viewMode}
        onToggleView={toggleViewMode}
      />

      {/* Filters */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <StationFilters
            filters={filters}
            onFiltersChange={setFilters}
            stations={initialStations}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {viewMode === 'list' ? (
          <StationList
            stations={stations}
            userLocation={userLocation}
            onStationClick={handleStationClick}
            selectedStation={selectedStation}
          />
        ) : (
          <StationMap
            stations={stations}
            userLocation={userLocation}
            selectedStation={selectedStation}
            onStationSelect={setSelectedStation}
          />
        )}
      </div>

      {/* Social Share Buttons - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-30">
        <SocialShareButtons
          url={typeof window !== 'undefined' ? window.location.href : ''}
          title="Find the Cheapest Petrol Prices in Melbourne"
          description="Compare real-time fuel prices from stations across Melbourne"
        />
      </div>
    </div>
  );
}

// Helper functions
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function getMinPrice(station: Station): number | null {
  const prices = [
    station.fuelPrices.unleaded,
    station.fuelPrices.diesel,
    station.fuelPrices.premium95,
    station.fuelPrices.premium98,
  ].filter((p): p is number => p !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
}

function getMaxPrice(station: Station): number | null {
  const prices = [
    station.fuelPrices.unleaded,
    station.fuelPrices.diesel,
    station.fuelPrices.premium95,
    station.fuelPrices.premium98,
  ].filter((p): p is number => p !== null);
  return prices.length > 0 ? Math.max(...prices) : null;
}
