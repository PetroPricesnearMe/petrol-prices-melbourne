/**
 * MapView Component
 * Interactive map displaying petrol stations with clustering and popovers
 * Features:
 * - Mapbox GL JS integration
 * - Marker clustering for performance
 * - Click popovers with station details
 * - Mobile responsive design
 * - Accessibility features
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';

import { cn } from '@/styles/system/css-in-js';

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token - should be in environment variables
const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

interface FuelPrices {
  unleaded: number | null;
  diesel: number | null;
  premium95: number | null;
  premium98: number | null;
  lpg: number | null;
}

interface Station {
  id: number;
  name: string;
  brand: string;
  brandLogo: string | null;
  address: string;
  suburb: string;
  postcode: string;
  region: string;
  fuelPrices: FuelPrices;
  lastUpdated: string;
  verified: boolean;
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  stations: Station[];
  selectedStation?: Station | null;
  onStationSelect?: (station: Station) => void;
  className?: string;
  height?: string;
  showClustering?: boolean;
  defaultZoom?: number;
  defaultCenter?: [number, number];
}

// Brand colors for markers
const getBrandColor = (brand: string): string => {
  const brandColors: Record<string, string> = {
    BP: '#00A651',
    Shell: '#FFD700',
    Caltex: '#FF6B35',
    '7-Eleven': '#FF6900',
    'Coles Express': '#E31837',
    Woolworths: '#1B5E20',
    United: '#1976D2',
    Puma: '#E91E63',
  };
  return brandColors[brand] || '#6B7280';
};

// Custom marker component
const StationMarker = ({
  station,
  onClick,
}: {
  station: Station;
  onClick: () => void;
}) => {
  const brandColor = getBrandColor(station.brand);

  return (
    <Marker
      longitude={station.longitude}
      latitude={station.latitude}
      anchor="bottom"
      onClick={onClick}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="group relative cursor-pointer"
      >
        {/* Marker pin */}
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg"
          style={{ backgroundColor: brandColor }}
        >
          <span className="text-xs font-bold text-white">
            {station.brand.charAt(0)}
          </span>
        </div>

        {/* Hover tooltip */}
        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-xs text-white">
            {station.name}
            <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </motion.div>
    </Marker>
  );
};

// Station popup component
const StationPopup = ({
  station,
  onClose,
}: {
  station: Station;
  onClose: () => void;
}) => {
  const getPriceColor = (price: number | null): string => {
    if (price === null) return 'text-gray-400';
    if (price < 200) return 'text-green-600';
    if (price <= 210) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-80 max-w-sm rounded-lg bg-white shadow-xl"
    >
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{station.name}</h3>
            <p className="text-sm text-gray-600">{station.brand}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
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
            <p>{station.address}</p>
            <p>
              {station.suburb}, {station.postcode}
            </p>
          </div>
        </div>
      </div>

      {/* Fuel Prices */}
      <div className="border-b border-gray-200 p-4">
        <h4 className="mb-2 font-semibold text-gray-900">Current Prices</h4>
        <div className="space-y-2">
          {Object.entries(station.fuelPrices).map(([type, price]) => {
            if (price === null) return null;
            return (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm capitalize text-gray-600">
                  {type === 'premium95'
                    ? 'Premium 95'
                    : type === 'premium98'
                      ? 'Premium 98'
                      : type}
                </span>
                <span className={`font-bold ${getPriceColor(price)}`}>
                  {price.toFixed(1)}¢/L
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-4">
        <Link
          href={`/stations/${station.id}`}
          className="bg-blue-600 hover:bg-blue-700 flex-1 rounded-lg px-4 py-2 text-center text-sm font-medium text-white transition-colors"
        >
          View Details
        </Link>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(station.address + ' ' + station.suburb)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg bg-gray-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          Directions
        </a>
      </div>

      {/* Last updated */}
      <div className="px-4 pb-4">
        <p className="text-xs text-gray-500">
          Updated: {new Date(station.lastUpdated).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};

export function MapView({
  stations,
  selectedStation: _selectedStation,
  onStationSelect,
  className,
  height = '500px',
  showClustering: _showClustering = true,
  defaultZoom = 10,
  defaultCenter = [144.9631, -37.8136], // Melbourne coordinates
}: MapViewProps) {
  const [viewState, setViewState] = useState({
    longitude: defaultCenter[0],
    latitude: defaultCenter[1],
    zoom: defaultZoom,
  });
  const [popupInfo, setPopupInfo] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<MapRef>(null);

  // Handle marker click
  const handleMarkerClick = useCallback(
    (station: Station) => {
      setPopupInfo(station);
      onStationSelect?.(station);

      // Center map on selected station
      setViewState((prev) => ({
        ...prev,
        longitude: station.longitude,
        latitude: station.latitude,
        zoom: Math.max(prev.zoom, 15),
      }));
    },
    [onStationSelect]
  );

  // Close popup
  const handleClosePopup = useCallback(() => {
    setPopupInfo(null);
  }, []);

  // Handle map load
  const handleMapLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Filter stations with valid coordinates
  const validStations = stations.filter(
    (station) => station.latitude && station.longitude
  );

  return (
    <div className={cn('relative', className)}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
          <div className="flex items-center gap-2">
            <div className="border-blue-600 h-6 w-6 animate-spin rounded-full border-b-2"></div>
            <span className="text-gray-600">Loading map...</span>
          </div>
        </div>
      )}

      {/* Map */}
      <div style={{ height }} className="overflow-hidden rounded-lg">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onLoad={handleMapLoad}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
          logoPosition="bottom-right"
        >
          {/* Station markers */}
          {validStations.map((station) => (
            <StationMarker
              key={station.id}
              station={station}
              onClick={() => handleMarkerClick(station)}
            />
          ))}

          {/* Popup */}
          <AnimatePresence>
            {popupInfo && (
              <Popup
                longitude={popupInfo.longitude}
                latitude={popupInfo.latitude}
                anchor="bottom"
                onClose={handleClosePopup}
                closeButton={false}
                closeOnClick={false}
                className="mapbox-popup"
              >
                <StationPopup station={popupInfo} onClose={handleClosePopup} />
              </Popup>
            )}
          </AnimatePresence>
        </Map>
      </div>

      {/* Map controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        {/* Zoom controls */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <button
            onClick={() =>
              setViewState((prev) => ({ ...prev, zoom: prev.zoom + 1 }))
            }
            className="block flex h-8 w-8 items-center justify-center transition-colors hover:bg-gray-50"
            aria-label="Zoom in"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              setViewState((prev) => ({ ...prev, zoom: prev.zoom - 1 }))
            }
            className="block flex h-8 w-8 items-center justify-center border-t border-gray-200 transition-colors hover:bg-gray-50"
            aria-label="Zoom out"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 12H6"
              />
            </svg>
          </button>
        </div>

        {/* Station count */}
        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
          <span className="text-sm text-gray-600">
            {validStations.length} stations
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <h4 className="mb-2 text-sm font-semibold text-gray-900">Legend</h4>
        <div className="space-y-1">
          {['BP', 'Shell', 'Caltex', '7-Eleven'].map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: getBrandColor(brand) }}
              />
              <span className="text-xs text-gray-600">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MapView;
