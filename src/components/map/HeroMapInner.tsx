/**
 * Hero Map Inner Component
 * 
 * The actual Leaflet map implementation
 * Separated for code splitting and lazy loading
 */

'use client';

import L from 'leaflet';
import { useCallback, useMemo, useState, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import Link from 'next/link';
import type { Station } from '@/types';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina.src,
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
  });
}

interface HeroMapInnerProps {
  stations: Station[];
  onStationClick?: (station: Station) => void;
  onError?: () => void;
}

// Brand colors for consistent styling
const BRAND_COLORS: Record<string, string> = {
  'BP': '#00A651',
  'Shell': '#FFD700',
  'Caltex': '#FF6B35',
  '7-Eleven': '#FF6900',
  'Coles Express': '#E31837',
  'Woolworths': '#1B5E20',
  'United': '#1976D2',
  'Puma': '#E91E63',
};

/**
 * Get brand color or default
 */
function getBrandColor(_brand?: string): string {
  // Simplified to use price color only for now
  return '#6B7280';
}

/**
 * Get color based on fuel price
 */
function getPriceColor(price: number | null | undefined): string {
  if (price == null) return '#9CA3AF';
  if (price < 180) return '#10B981'; // Green - cheap
  if (price < 200) return '#F59E0B'; // Yellow - moderate
  return '#EF4444'; // Red - expensive
}

/**
 * Create custom marker icon
 */
function createCustomMarkerIcon(station: Station): L.DivIcon {
  const cheapestPrice = station.fuelPrices?.unleaded;
  const priceColor = getPriceColor(cheapestPrice);

  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
      ">
        <div style="
          width: 32px;
          height: 32px;
          background: ${priceColor};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            transform: rotate(45deg);
            font-size: 16px;
          ">⛽</span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

/**
 * Station Marker Component
 */
const StationMarker = memo(({ 
  station, 
  onClick 
}: { 
  station: Station;
  onClick: (station: Station) => void;
}) => {
  const icon = useMemo(() => createCustomMarkerIcon(station), [station]);
  
  const handleClick = useCallback(() => {
    onClick(station);
  }, [onClick, station]);

  // Format fuel prices
  const fuelPrices = station.fuelPrices || {};
  const hasAnyPrice = Object.values(fuelPrices).some(price => price != null);

  return (
    <Marker
      position={[station.latitude!, station.longitude!]}
      icon={icon}
      eventHandlers={{ click: handleClick }}
    >
      <Popup className="custom-station-popup" maxWidth={300}>
        <div className="p-2">
          {/* Station Header */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {station.name}
            </h3>
            {station.brand && (
              <p className="text-sm font-medium" style={{ color: getBrandColor(station.brand) }}>
                {station.brand}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="mb-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p>{station.address}</p>
                <p>{station.suburb} {station.postcode}</p>
              </div>
            </div>
          </div>

          {/* Fuel Prices */}
          {hasAnyPrice && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Current Prices
              </h4>
              <div className="space-y-1">
                {fuelPrices.unleaded != null && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Unleaded</span>
                    <span className="font-bold" style={{ color: getPriceColor(fuelPrices.unleaded) }}>
                      {fuelPrices.unleaded.toFixed(1)}¢
                    </span>
                  </div>
                )}
                {fuelPrices.diesel != null && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Diesel</span>
                    <span className="font-bold" style={{ color: getPriceColor(fuelPrices.diesel) }}>
                      {fuelPrices.diesel.toFixed(1)}¢
                    </span>
                  </div>
                )}
                {fuelPrices.premium95 != null && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Premium 95</span>
                    <span className="font-bold" style={{ color: getPriceColor(fuelPrices.premium95) }}>
                      {fuelPrices.premium95.toFixed(1)}¢
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/stations/${station.id}`}
              className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Details
            </Link>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Directions
            </a>
          </div>
        </div>
      </Popup>
    </Marker>
  );
});

StationMarker.displayName = 'StationMarker';

/**
 * Map resize handler to fix display issues
 */
function MapResizeHandler() {
  const map = useMap();

  useState(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  });

  return null;
}

/**
 * Hero Map Inner Component
 */
export function HeroMapInner({ 
  stations, 
  onStationClick,
  onError 
}: HeroMapInnerProps) {

  // Melbourne center coordinates
  const center: [number, number] = useMemo(() => {
    if (stations.length > 0) {
      const validStations = stations.filter(s => s.latitude && s.longitude);
      if (validStations.length > 0) {
        const avgLat = validStations.reduce((sum, s) => sum + s.latitude!, 0) / validStations.length;
        const avgLng = validStations.reduce((sum, s) => sum + s.longitude!, 0) / validStations.length;
        return [avgLat, avgLng];
      }
    }
    return [-37.8136, 144.9631]; // Melbourne default
  }, [stations]);

  const handleStationClick = useCallback((station: Station) => {
    onStationClick?.(station);
  }, [onStationClick]);

  try {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
        <MapContainer
          center={center}
          zoom={11}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ zIndex: 1 }}
        >
          {/* OpenStreetMap tiles - free and fast */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <MapResizeHandler />

          {/* Clustered markers for performance */}
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={50}
            spiderfyOnMaxZoom
            showCoverageOnHover
            zoomToBoundsOnClick
            removeOutsideVisibleBounds
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              let size = 'small';
              let color = '#3B82F6';
              
              if (count > 50) {
                size = 'large';
                color = '#EF4444';
              } else if (count > 10) {
                size = 'medium';
                color = '#F59E0B';
              }

              return L.divIcon({
                html: `
                  <div style="
                    background: ${color};
                    color: white;
                    border-radius: 50%;
                    width: ${size === 'large' ? '50px' : size === 'medium' ? '40px' : '32px'};
                    height: ${size === 'large' ? '50px' : size === 'medium' ? '40px' : '32px'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${size === 'large' ? '16px' : '14px'};
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    border: 3px solid white;
                  ">${count}</div>
                `,
                className: 'custom-cluster-icon',
                iconSize: L.point(
                  size === 'large' ? 50 : size === 'medium' ? 40 : 32,
                  size === 'large' ? 50 : size === 'medium' ? 40 : 32
                ),
              });
            }}
          >
            {stations.map((station) => (
              <StationMarker
                key={station.id}
                station={station}
                onClick={handleStationClick}
              />
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        {/* Overlay controls */}
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-2">
          <div className="text-sm font-medium text-gray-700">
            {stations.length} Stations
          </div>
        </div>

        {/* Price legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
          <div className="text-xs font-semibold text-gray-900 mb-2">
            Price Range
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-600">&lt; 180¢</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-gray-600">180-200¢</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-600">&gt; 200¢</span>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Map rendering error:', error);
    onError?.();
    return null;
  }
}

export default HeroMapInner;

