/**
 * Interactive Station Map Component
 *
 * Features:
 * - Interactive Leaflet map with clustering
 * - Responsive full-screen mode for mobile
 * - Color-coded markers based on fuel prices
 * - Interactive popups with station details
 * - User location tracking
 * - Smooth animations
 */

import L from 'leaflet';
import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

import 'leaflet/dist/leaflet.css';
import './InteractiveStationMap.css';
import { useFocusTrap } from '@/components/accessibility/FocusTrap';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

interface FuelPrice {
  fuelType: string;
  price: number;
}

interface Station {
  id: string | number;
  name: string;
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  brand?: string;
  fuelPrices?: FuelPrice[];
}

interface InteractiveStationMapProps {
  stations: Station[];
  onStationClick?: (station: Station) => void;
  selectedStation?: Station | null;
  height?: number | string;
  center?: [number, number];
  zoom?: number;
  fullScreen?: boolean;
  onFullScreenToggle?: () => void;
  showUserLocation?: boolean;
  className?: string;
}

/**
 * Map controller component for handling map updates
 */
const MapController: React.FC<{
  center: [number, number];
  zoom: number;
  selectedStation?: Station | null;
}> = ({ center, zoom, selectedStation }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedStation?.latitude && selectedStation?.longitude) {
      map.flyTo([selectedStation.latitude, selectedStation.longitude], 15, {
        duration: 1.5,
      });
    }
  }, [selectedStation, map]);

  return null;
};

/**
 * Get marker color based on average fuel price
 */
const getMarkerColor = (station: Station): string => {
  if (!station.fuelPrices || station.fuelPrices.length === 0) {
    return '#6B7280'; // Gray - no price data
  }

  const avgPrice =
    station.fuelPrices.reduce((sum, fp) => sum + (fp.price || 0), 0) /
    station.fuelPrices.length;

  if (avgPrice < 1.8) return '#10B981'; // Green - cheap
  if (avgPrice < 2.0) return '#F59E0B'; // Orange - moderate
  return '#EF4444'; // Red - expensive
};

/**
 * Create custom marker icon based on price
 */
const createCustomIcon = (
  station: Station,
  isSelected: boolean = false
): L.DivIcon => {
  const color = getMarkerColor(station);
  const size = isSelected ? 40 : 32;
  const zIndex = isSelected ? 1000 : 'auto';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin ${isSelected ? 'selected' : ''}" style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        z-index: ${zIndex};
      ">
        <div style="
          transform: rotate(45deg);
          font-size: ${size * 0.5}px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        ">⛽</div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

/**
 * Interactive Station Map Component
 */
export const InteractiveStationMap: React.FC<InteractiveStationMapProps> = ({
  stations = [],
  onStationClick,
  selectedStation,
  height = 600,
  center: initialCenter,
  zoom: initialZoom = 11,
  fullScreen = false,
  onFullScreenToggle,
  showUserLocation = true,
  className = '',
}) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialCenter || [-37.8136, 144.9631]
  );
  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const mapRef = useRef<L.Map | null>(null);

  // Focus trap for fullscreen mode
  const mapContainerRef = useFocusTrap(fullScreen, onFullScreenToggle);

  // Get user's current location
  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(location);
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }
  }, [showUserLocation]);

  // Calculate map center from stations
  useEffect(() => {
    if (!initialCenter && stations.length > 0) {
      const validStations = stations.filter((s) => s.latitude && s.longitude);
      if (validStations.length > 0) {
        const avgLat =
          validStations.reduce((sum, s) => sum + s.latitude, 0) /
          validStations.length;
        const avgLng =
          validStations.reduce((sum, s) => sum + s.longitude, 0) /
          validStations.length;
        setMapCenter([avgLat, avgLng]);
      }
    }
  }, [stations, initialCenter]);

  const handleMarkerClick = (station: Station) => {
    if (onStationClick) {
      onStationClick(station);
    }
  };

  const handleRecenter = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo(userLocation, 13, {
        duration: 1.5,
      });
    }
  };

  const validStations = stations.filter((s) => s.latitude && s.longitude);

  const mapContainerClass = `
    interactive-station-map
    ${fullScreen ? 'fullscreen' : ''}
    ${className}
  `.trim();

  return (
    <div
      ref={mapContainerRef as React.RefObject<HTMLDivElement>}
      className={mapContainerClass}
      style={{ height: fullScreen ? '100vh' : height }}
      role="application"
      aria-label="Interactive map showing petrol station locations"
      aria-roledescription="map"
    >
      <MapContainer
        center={mapCenter}
        zoom={currentZoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-map-container"
        ref={mapRef as any}
      >
        {/* OpenStreetMap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Map Controller */}
        <MapController
          center={mapCenter}
          zoom={currentZoom}
          selectedStation={selectedStation}
        />

        {/* User Location */}
        {userLocation && (
          <>
            <Marker
              position={userLocation}
              icon={L.icon({
                iconUrl:
                  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjM0I4MkY2Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjM0I4MkY2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiLz48L3N2Zz4=',
                iconSize: [24, 24],
                iconAnchor: [12, 12],
              })}
            >
              <Popup>
                <div className="user-location-popup">
                  <strong>📍 Your Location</strong>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={userLocation}
              radius={1000}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          </>
        )}

        {/* Station Markers with Clustering */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={true}
          zoomToBoundsOnClick={true}
          iconCreateFunction={(cluster) => {
            const count = cluster.getChildCount();
            let size = 'small';
            if (count > 50) size = 'large';
            else if (count > 10) size = 'medium';

            return L.divIcon({
              html: `<div class="cluster-marker cluster-${size}">${count}</div>`,
              className: 'custom-cluster-icon',
              iconSize: L.point(40, 40, true),
            });
          }}
        >
          {validStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={createCustomIcon(
                station,
                selectedStation?.id === station.id
              )}
              eventHandlers={{
                click: () => handleMarkerClick(station),
              }}
            >
              <Popup>
                <div className="station-popup">
                  <h3 className="popup-title">{station.name}</h3>
                  {station.brand && (
                    <p className="popup-brand">{station.brand}</p>
                  )}
                  <p className="popup-address">
                    📍 {station.address}
                    {station.city && <>, {station.city}</>}
                  </p>

                  {station.fuelPrices && station.fuelPrices.length > 0 && (
                    <div className="popup-prices">
                      <strong>💰 Current Prices:</strong>
                      <ul>
                        {station.fuelPrices.slice(0, 3).map((fp, idx) => (
                          <li key={idx}>
                            <span>{fp.fuelType}</span>
                            <span className="price">
                              ${fp.price.toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    className="popup-directions-btn"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`,
                        '_blank'
                      );
                    }}
                  >
                    🧭 Get Directions
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Map Controls */}
      <div className="map-controls">
        {/* Recenter Button */}
        {userLocation && (
          <button
            className="map-control-btn recenter-btn"
            onClick={handleRecenter}
            aria-label="Recenter map to your location"
            title="Recenter to your location"
          >
            <span>📍</span>
          </button>
        )}

        {/* Fullscreen Toggle */}
        {onFullScreenToggle && (
          <button
            className="map-control-btn fullscreen-btn"
            onClick={onFullScreenToggle}
            aria-label={fullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={fullScreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            <span>{fullScreen ? '⊗' : '⛶'}</span>
          </button>
        )}
      </div>

      {/* Map Legend */}
      <div className="map-legend-overlay">
        <div className="legend-title">Fuel Prices</div>
        <div className="legend-items">
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ background: '#10B981' }}
            ></span>
            <span>Low (&lt; $1.80)</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ background: '#F59E0B' }}
            ></span>
            <span>Medium ($1.80-$2.00)</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ background: '#EF4444' }}
            ></span>
            <span>High (&gt; $2.00)</span>
          </div>
        </div>
      </div>

      {/* Station Count Badge */}
      <div className="station-count-badge">
        {validStations.length} station{validStations.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default InteractiveStationMap;
