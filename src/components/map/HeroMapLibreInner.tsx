/**
 * Hero Map Inner Component - MapLibre GL Edition
 *
 * High-performance vector map implementation
 * Uses MapLibre GL for GPU-accelerated rendering
 */

'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Station } from '@/types';
import {
  createClusterIndex,
  getPriceColor,
  getClusterSize,
  getClusterColor,
  getClusterSizePx,
  type ClusterFeature,
} from './clustering';
import { generateStationSlug } from '@/lib/seo/station-seo';

interface HeroMapLibreInnerProps {
  stations: Station[];
  onStationClick?: (station: Station) => void;
  onError?: () => void;
}

/**
 * Hero MapLibre Inner Component
 */
export function HeroMapLibreInner({
  stations,
  onStationClick,
  onError,
}: HeroMapLibreInnerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const clusterIndexRef = useRef<ReturnType<typeof createClusterIndex> | null>(
    null
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(10.5);

  // Calculate center from stations
  const center = useCallback((): [number, number] => {
    if (stations.length > 0) {
      const validStations = stations.filter((s) => s.latitude && s.longitude);
      if (validStations.length > 0) {
        const avgLng =
          validStations.reduce((sum, s) => sum + s.longitude!, 0) /
          validStations.length;
        const avgLat =
          validStations.reduce((sum, s) => sum + s.latitude!, 0) /
          validStations.length;
        return [avgLng, avgLat];
      }
    }
    return [144.9631, -37.8136]; // Melbourne default
  }, [stations]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      // Initialize MapLibre map
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        // Free vector tiles from Maptiler (no API key required for basic usage)
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: center(),
        zoom: 10.5,
        attributionControl: true,
        logoPosition: 'bottom-right',
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      // Map loaded event
      map.current.on('load', () => {
        setMapLoaded(true);
        // Create cluster index
        clusterIndexRef.current = createClusterIndex(stations);
      });

      // Update zoom level
      map.current.on('zoom', () => {
        if (map.current) {
          setCurrentZoom(map.current.getZoom());
        }
      });

      // Error handling
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        onError?.();
      });
    } catch (error) {
      console.error('Failed to initialize map:', error);
      onError?.();
    }

    // Cleanup
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [center, onError]);

  // Add markers when map is loaded or zoom changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !clusterIndexRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Get bounds
    const bounds = map.current.getBounds();
    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    // Get clusters and points for current view
    const clusters = clusterIndexRef.current.getClusters(
      bbox,
      Math.floor(currentZoom)
    );

    clusters.forEach((feature: ClusterFeature) => {
      if (!map.current) return;

      const [lng, lat] = feature.geometry.coordinates;
      const { cluster, point_count } = feature.properties;

      if (cluster) {
        // Create cluster marker
        const size = getClusterSize(point_count || 0);
        const color = getClusterColor(point_count || 0);
        const sizePx = getClusterSizePx(size);

        const el = document.createElement('div');
        el.innerHTML = `
          <div style="
            width: ${sizePx}px;
            height: ${sizePx}px;
            background: ${color};
            color: white;
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: ${size === 'large' ? '16px' : size === 'medium' ? '14px' : '12px'};
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
          ">${point_count}</div>
        `;

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.1)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });

        // Click to expand cluster
        el.addEventListener('click', () => {
          if (map.current && feature.properties.cluster_id != null) {
            const expansionZoom =
              clusterIndexRef.current?.getClusterExpansionZoom(
                feature.properties.cluster_id
              );
            if (expansionZoom != null) {
              map.current.flyTo({
                center: [lng, lat],
                zoom: expansionZoom,
              });
            }
          }
        });

        const marker = new maplibregl.Marker({
          element: el,
        })
          .setLngLat([lng, lat])
          .addTo(map.current);

        markersRef.current.push(marker);
      } else {
        // Create individual station marker
        const station = stations.find((s) => s.id === feature.properties.id);
        if (!station || !station.latitude || !station.longitude) return;

        const priceColor = getPriceColor(station.fuelPrices?.unleaded);

        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-maplibre-marker';
        el.innerHTML = `
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
            cursor: pointer;
            transition: transform 0.2s;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 16px;
            ">⛽</span>
          </div>
        `;

        // Hover effect
        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.2)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });

        // Create popup content
        const popupContent = createPopupHTML(station);

        // Create popup
        const popup = new maplibregl.Popup({
          offset: 35,
          closeButton: true,
          closeOnClick: true,
          maxWidth: '300px',
        }).setHTML(popupContent);

        // Create marker
        const marker = new maplibregl.Marker({
          element: el,
          anchor: 'bottom',
        })
          .setLngLat([station.longitude, station.latitude])
          .setPopup(popup)
          .addTo(map.current);

        // Click handler
        el.addEventListener('click', () => {
          onStationClick?.(station);
        });

        markersRef.current.push(marker);
      }
    });
  }, [stations, mapLoaded, onStationClick, currentZoom]);

  // Create popup HTML
  function createPopupHTML(station: Station): string {
    const fuelPrices = station.fuelPrices || {};
    const hasAnyPrice = Object.values(fuelPrices).some(
      (price) => price != null
    );

    return `
      <div style="padding: 12px; min-width: 250px;">
        <!-- Station Header -->
        <div style="margin-bottom: 12px;">
          <h3 style="font-size: 16px; font-weight: bold; color: #111827; margin: 0 0 4px 0;">
            ${station.name}
          </h3>
          ${
            station.brand
              ? `
            <p style="font-size: 13px; font-weight: 500; color: #6B7280; margin: 0;">
              ${station.brand}
            </p>
          `
              : ''
          }
        </div>

        <!-- Address -->
        <div style="margin-bottom: 12px; font-size: 13px; color: #6B7280;">
          <div style="display: flex; gap: 8px;">
            <svg style="width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p style="margin: 0;">${station.address}</p>
              <p style="margin: 0;">${station.suburb} ${station.postcode}</p>
            </div>
          </div>
        </div>

        ${
          hasAnyPrice
            ? `
          <!-- Fuel Prices -->
          <div style="margin-bottom: 12px;">
            <h4 style="font-size: 13px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">
              Current Prices
            </h4>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${
                fuelPrices.unleaded != null
                  ? `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                  <span style="color: #6B7280;">Unleaded</span>
                  <span style="font-weight: bold; color: ${getPriceColor(fuelPrices.unleaded)};">
                    ${fuelPrices.unleaded.toFixed(1)}¢
                  </span>
                </div>
              `
                  : ''
              }
              ${
                fuelPrices.diesel != null
                  ? `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                  <span style="color: #6B7280;">Diesel</span>
                  <span style="font-weight: bold; color: ${getPriceColor(fuelPrices.diesel)};">
                    ${fuelPrices.diesel.toFixed(1)}¢
                  </span>
                </div>
              `
                  : ''
              }
              ${
                fuelPrices.premium95 != null
                  ? `
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                  <span style="color: #6B7280;">Premium 95</span>
                  <span style="font-weight: bold; color: ${getPriceColor(fuelPrices.premium95)};">
                    ${fuelPrices.premium95.toFixed(1)}¢
                  </span>
                </div>
              `
                  : ''
              }
            </div>
          </div>
        `
            : ''
        }

        <!-- Actions -->
        <div style="display: flex; gap: 8px; margin-top: 12px;">
          <a
            href="/stations/${generateStationSlug(station)}"
            style="flex: 1; text-align: center; background: #2563eb; color: white; padding: 8px 12px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; transition: background 0.2s;"
            onmouseover="this.style.background='#1d4ed8'"
            onmouseout="this.style.background='#2563eb'"
          >
            View Details
          </a>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}"
            target="_blank"
            rel="noopener noreferrer"
            style="flex: 1; text-align: center; background: #4B5563; color: white; padding: 8px 12px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; transition: background 0.2s;"
            onmouseover="this.style.background='#374151'"
            onmouseout="this.style.background='#4B5563'"
          >
            Directions
          </a>
        </div>
      </div>
    `;
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
      {/* Map container */}
      <div ref={mapContainer} className="h-full w-full" />

      {/* Station count overlay */}
      {mapLoaded && (
        <div className="absolute right-4 top-4 z-10 rounded-lg bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
          <div className="text-sm font-semibold text-gray-900">
            {stations.length} Stations
          </div>
          <div className="text-xs text-gray-600">Vector Map</div>
        </div>
      )}

      {/* Price legend */}
      {mapLoaded && (
        <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-white/95 p-3 shadow-lg backdrop-blur-sm">
          <div className="mb-2 text-xs font-semibold text-gray-900">
            Price Range
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="bg-green-500 h-3 w-3 rounded-full" />
              <span className="text-gray-600">&lt; 180¢</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="bg-yellow-500 h-3 w-3 rounded-full" />
              <span className="text-gray-600">180-200¢</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="bg-red-500 h-3 w-3 rounded-full" />
              <span className="text-gray-600">&gt; 200¢</span>
            </div>
          </div>
        </div>
      )}

      {/* Performance badge */}
      {mapLoaded && (
        <div className="from-green-500 to-emerald-500 absolute left-4 top-4 z-10 rounded-lg bg-gradient-to-r px-3 py-1.5 text-white shadow-lg">
          <div className="flex items-center gap-2">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-xs font-bold">GPU Accelerated</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroMapLibreInner;
