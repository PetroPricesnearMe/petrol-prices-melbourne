/**
 * MapView Component - MapLibre GL Edition
 * Interactive map displaying petrol stations with clustering and popovers
 * Features:
 * - MapLibre GL integration (GPU-accelerated)
 * - Marker clustering for performance
 * - Click popovers with station details
 * - Mobile responsive design
 * - Accessibility features
 * - No API key required
 */

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/styles/system/css-in-js';
import {
  createClusterIndex,
  getPriceColor,
  getClusterSize,
  getClusterColor,
  getClusterSizePx,
  type ClusterFeature,
} from '@/components/map/clustering';

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

export function MapView({
  stations,
  onStationSelect,
  className,
  height = '500px',
  defaultZoom = 10,
  defaultCenter = [144.9631, -37.8136], // Melbourne coordinates
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const clusterIndexRef = useRef<ReturnType<typeof createClusterIndex> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(defaultZoom);

  // Filter stations with valid coordinates
  const validStations = useMemo(
    () => stations.filter((station) => station.latitude && station.longitude),
    [stations]
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
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
        center: defaultCenter,
        zoom: defaultZoom,
        attributionControl: true,
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setIsLoading(false);
        clusterIndexRef.current = createClusterIndex(validStations);
      });

      map.current.on('zoom', () => {
        if (map.current) {
          setCurrentZoom(map.current.getZoom());
        }
      });
    } catch (error) {
      console.error('Map initialization error:', error);
      setIsLoading(false);
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [defaultCenter, defaultZoom, validStations]);

  // Add markers
  useEffect(() => {
    if (!map.current || isLoading || !clusterIndexRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds = map.current.getBounds();
    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    const clusters = clusterIndexRef.current.getClusters(
      bbox,
      Math.floor(currentZoom)
    );

    clusters.forEach((feature: ClusterFeature) => {
      if (!map.current) return;

      const [lng, lat] = feature.geometry.coordinates;
      const { cluster, point_count } = feature.properties;

      if (cluster) {
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
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            cursor: pointer;
          ">${point_count}</div>
        `;

        el.addEventListener('click', () => {
          if (map.current && feature.properties.cluster_id != null) {
            const expansionZoom =
              clusterIndexRef.current?.getClusterExpansionZoom(
                feature.properties.cluster_id
              );
            if (expansionZoom != null) {
              map.current.flyTo({ center: [lng, lat], zoom: expansionZoom });
            }
          }
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map.current);

        markersRef.current.push(marker);
      } else {
        const station = validStations.find(
          (s) => s.id === feature.properties.id
        );
        if (!station) return;

        const priceColor = getPriceColor(station.fuelPrices?.unleaded);
        const el = document.createElement('div');
        el.innerHTML = `
          <div style="
            width: 32px;
            height: 32px;
            background: ${priceColor};
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            <span style="transform: rotate(45deg); font-size: 16px;">⛽</span>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 35, maxWidth: '300px' })
          .setHTML(`
            <div style="padding: 12px;">
              <h3 style="font-weight: bold; margin-bottom: 8px;">${station.name}</h3>
              <p style="font-size: 13px; color: #666; margin-bottom: 8px;">
                ${station.address}, ${station.suburb}
              </p>
              ${
                station.fuelPrices.unleaded
                  ? `
                <div style="margin-bottom: 8px;">
                  <strong>Unleaded:</strong> ${station.fuelPrices.unleaded.toFixed(1)}¢
                </div>
              `
                  : ''
              }
              <div style="display: flex; gap: 8px;">
                <a href="/stations/${station.id}" style="flex: 1; background: #2563eb; color: white; padding: 6px 12px; border-radius: 6px; text-align: center; text-decoration: none; font-size: 13px;">
                  View Details
                </a>
              </div>
            </div>
          `);

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([station.longitude, station.latitude])
          .setPopup(popup)
          .addTo(map.current);

        el.addEventListener('click', () => onStationSelect?.(station));
        markersRef.current.push(marker);
      }
    });
  }, [validStations, isLoading, currentZoom, onStationSelect]);

  return (
    <div className={cn('relative', className)}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
          <div className="flex items-center gap-2">
            <div className="border-blue-600 h-6 w-6 animate-spin rounded-full border-b-2"></div>
            <span className="text-gray-600">Loading map...</span>
          </div>
        </div>
      )}

      <div style={{ height }} className="overflow-hidden rounded-lg">
        <div ref={mapContainer} className="h-full w-full" />
      </div>

      <div className="absolute bottom-4 left-4 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <h4 className="mb-2 text-sm font-semibold text-gray-900">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 h-3 w-3 rounded-full" />
            <span className="text-xs text-gray-600">&lt; 180¢</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 h-3 w-3 rounded-full" />
            <span className="text-xs text-gray-600">180-200¢</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-red-500 h-3 w-3 rounded-full" />
            <span className="text-xs text-gray-600">&gt; 200¢</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapView;
