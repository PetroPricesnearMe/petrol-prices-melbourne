'use client';

import maplibregl, { type Map, type Marker, type Popup } from 'maplibre-gl';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Supercluster from 'supercluster';

import { getBrandColor } from '@/lib/utils/colors';
import { getBrandInitial, getMarkerIconUrl } from '@/lib/map/marker-utils';
import { generateStationSlug } from '@/lib/seo/station-seo';
import type { Coordinates } from '@/types/common';
import type { Station } from '@/types/station';

// MapLibre CSS
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapLibreMapCoreProps {
  stations: Station[];
  selectedStation?: Station | null;
  onStationSelect?: (station: Station) => void;
  userLocation?: Coordinates | null;
  defaultZoom?: number;
  defaultCenter?: Coordinates;
  enableClustering?: boolean;
}

// Protomaps vector tile URL (free, no API key needed)
// Alternative: Use OpenStreetMap raster tiles as fallback
const _PROTOMAPS_TILE_URL = 'https://api.protomaps.com/tiles/v3/{z}/{x}/{y}.mvt';
const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

// Cluster configuration
const CLUSTER_RADIUS = 50;
const CLUSTER_MAX_ZOOM = 14;
const CLUSTER_MIN_ZOOM = 0;

/**
 * Core MapLibre map component with Protomaps tiles and clustering
 * 
 * A full-featured map component using MapLibre GL JS for rendering interactive maps
 * with station markers, clustering, and popups.
 * 
 * Current behavior:
 * - Initializes map with OpenStreetMap raster tiles (fallback from Protomaps vector tiles)
 * - Uses Supercluster library for marker clustering when enableClustering is true
 * - Creates individual markers for each station with brand-colored circular icons
 * - Markers show station logo if available, otherwise display brand initial
 * - Markers have hover effects (scale + shadow) and touch feedback for mobile
 * - Clicking a marker centers map on station, shows popup with station details
 * - Cluster markers show point count and zoom in when clicked
 * - Popups are created as HTML strings with station info, prices, and action buttons
 * - Map updates markers based on current viewport bounds and zoom level
 * - Selected station is automatically centered and highlighted
 * - Includes navigation controls and optional geolocate control
 * - Hover tooltip shows station name above map
 * - Station count badge displayed in bottom-right corner
 * - All markers are cleaned up on unmount to prevent memory leaks
 */
export default function MapLibreMapCore({
  stations,
  selectedStation,
  onStationSelect,
  userLocation,
  defaultZoom = 10,
  defaultCenter = { latitude: -37.8136, longitude: 144.9631 },
  enableClustering = true,
}: MapLibreMapCoreProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const popupRef = useRef<Popup | null>(null);
  const clusterRef = useRef<Supercluster | null>(null);
  const [_selectedPopupStation, _setSelectedPopupStation] = useState<Station | null>(null);
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);

  // Initialize Supercluster for marker clustering
  const cluster = useMemo(() => {
    if (!enableClustering) return null;

    const points = stations.map((station) => ({
      type: 'Feature' as const,
      properties: {
        cluster: false,
        stationId: station.id,
        station: station,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [station.longitude, station.latitude],
      },
    }));

    const sc = new Supercluster({
      radius: CLUSTER_RADIUS,
      maxZoom: CLUSTER_MAX_ZOOM,
      minZoom: CLUSTER_MIN_ZOOM,
    });

    sc.load(points);
    return sc;
  }, [stations, enableClustering]);

  clusterRef.current = cluster;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Use a simple, lightweight style with OpenStreetMap tiles
    // For production, consider using Protomaps PMTiles or a vector tile service
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [OSM_TILE_URL],
            tileSize: 256,
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [defaultCenter.longitude, defaultCenter.latitude],
      zoom: defaultZoom,
      attributionControl: true,
    });

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add geolocate control if user location is available
    if (userLocation) {
      const geolocate = new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      });
      map.addControl(geolocate, 'top-right');
    }

    mapRef.current = map;

    // Handle map load
    map.on('load', () => {
      updateMarkers();
    });

    // Update markers on zoom/move
    map.on('moveend', updateMarkers);
    map.on('zoomend', updateMarkers);

    // Cleanup
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
      if (popupRef.current) {
        popupRef.current.remove();
      }
      map.remove();
    };
  }, []);

  // Update markers based on current viewport
  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !clusterRef.current) {
      // If clustering is disabled, show all markers
      if (!enableClustering) {
        stations.forEach((station) => {
          if (!markersRef.current.has(String(station.id))) {
            createMarker(station);
          }
        });
      }
      return;
    }

    const map = mapRef.current;
    const bounds = map.getBounds();
    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    const zoom = Math.floor(map.getZoom());
    const clusters = clusterRef.current.getClusters(bbox, zoom);

    // Remove all existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Create markers for clusters and individual stations
    clusters.forEach((cluster) => {
      if (cluster.properties.cluster) {
        createClusterMarker(cluster);
      } else {
        const station = cluster.properties.station as Station;
        createMarker(station);
      }
    });
  }, [stations, enableClustering]);

  // Create a marker for a single station
  const createMarker = useCallback(
    (station: Station) => {
      if (!mapRef.current) return;

      const markerId = String(station.id);
      if (markersRef.current.has(markerId)) return;

      // Create marker element with consistent sizing
      const el = document.createElement('div');
      el.className = 'station-marker';
      el.style.cursor = 'pointer';
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.position = 'relative';
      // Improve mobile tap accuracy with larger touch target
      el.style.minWidth = '44px';
      el.style.minHeight = '44px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      // Create marker icon with logo or brand initial - consistent 36px size
      const markerContent = document.createElement('div');
      markerContent.className = 'station-marker-content';
      markerContent.style.width = '36px';
      markerContent.style.height = '36px';
      markerContent.style.borderRadius = '50%';
      markerContent.style.border = '3px solid white';
      markerContent.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      markerContent.style.display = 'flex';
      markerContent.style.alignItems = 'center';
      markerContent.style.justifyContent = 'center';
      markerContent.style.backgroundColor = getBrandColor(station.brand);
      markerContent.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      markerContent.style.flexShrink = '0';

      // Add logo if available, otherwise use brand initial
      const iconUrl = getMarkerIconUrl(station);
      if (iconUrl) {
        const img = document.createElement('img');
        img.src = iconUrl;
        img.alt = station.brand || station.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';
        img.onerror = () => {
          // Fallback to initial if image fails
          markerContent.textContent = getBrandInitial(station);
          markerContent.style.color = 'white';
          markerContent.style.fontWeight = 'bold';
          markerContent.style.fontSize = '16px';
          markerContent.style.lineHeight = '1';
        };
        markerContent.appendChild(img);
      } else {
        markerContent.textContent = getBrandInitial(station);
        markerContent.style.color = 'white';
        markerContent.style.fontWeight = 'bold';
        markerContent.style.fontSize = '16px';
        markerContent.style.lineHeight = '1';
      }

      // Hover effect with smooth animation
      markerContent.addEventListener('mouseenter', () => {
        markerContent.style.transform = 'scale(1.15)';
        markerContent.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        setHoveredStation(station);
      });
      markerContent.addEventListener('mouseleave', () => {
        markerContent.style.transform = 'scale(1)';
        markerContent.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        setHoveredStation(null);
      });
      
      // Touch events for mobile
      markerContent.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        markerContent.style.transform = 'scale(1.1)';
      });
      markerContent.addEventListener('touchend', () => {
        markerContent.style.transform = 'scale(1)';
      });

      el.appendChild(markerContent);

      // Create MapLibre marker
      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat([station.longitude, station.latitude])
        .addTo(mapRef.current!);

      // Click handler
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        handleMarkerClick(station);
      });

      markersRef.current.set(markerId, marker);
    },
    []
  );

  // Create a cluster marker
  const createClusterMarker = useCallback((cluster: any) => {
    if (!mapRef.current) return;

    const clusterId = `cluster-${cluster.id}`;
    if (markersRef.current.has(clusterId)) return;

    const pointCount = cluster.properties.point_count;
    const el = document.createElement('div');
    el.className = 'cluster-marker';
    el.style.cursor = 'pointer';
    // Consistent cluster size - 44px for better mobile tap accuracy
    el.style.width = '44px';
    el.style.height = '44px';
    el.style.minWidth = '44px';
    el.style.minHeight = '44px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#3b82f6';
    el.style.border = '3px solid white';
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.color = 'white';
    el.style.fontWeight = 'bold';
    el.style.fontSize = pointCount > 99 ? '12px' : '14px';
    el.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    el.textContent = pointCount.toString();
    
    // Hover effect for clusters
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.1)';
      el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    });

    const marker = new maplibregl.Marker({
      element: el,
      anchor: 'center',
    })
      .setLngLat([cluster.geometry.coordinates[0], cluster.geometry.coordinates[1]])
      .addTo(mapRef.current!);

    // Click handler - zoom into cluster
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const expansionZoom = Math.min(
        clusterRef.current!.getClusterExpansionZoom(cluster.id),
        18
      );
      mapRef.current!.easeTo({
        center: [cluster.geometry.coordinates[0], cluster.geometry.coordinates[1]],
        zoom: expansionZoom,
        duration: 500,
      });
    });

    markersRef.current.set(clusterId, marker);
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback(
    (station: Station) => {
      setSelectedPopupStation(station);
      onStationSelect?.(station);

      // Center map on station
      if (mapRef.current) {
        mapRef.current.easeTo({
          center: [station.longitude, station.latitude],
          zoom: Math.max(mapRef.current.getZoom(), 15),
          duration: 500,
        });
      }

      // Show popup
      if (mapRef.current && popupRef.current) {
        popupRef.current.remove();
      }

      const popup = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: false,
        anchor: 'bottom',
        offset: [0, -10],
        className: 'station-popup-container',
      })
        .setLngLat([station.longitude, station.latitude])
        .setHTML(createPopupHTML(station))
        .addTo(mapRef.current!);
      
      // Add animation class for popup
      const popupElement = popup.getElement();
      if (popupElement) {
        popupElement.classList.add('popup-enter');
        // Trigger animation
        setTimeout(() => {
          popupElement.classList.add('popup-enter-active');
        }, 10);
      }

      popupRef.current = popup;

      popup.on('close', () => {
        // Add exit animation
        const popupElement = popup.getElement();
        if (popupElement) {
          popupElement.classList.remove('popup-enter-active');
          popupElement.classList.add('popup-exit');
          setTimeout(() => {
            setSelectedPopupStation(null);
          }, 200);
        } else {
          setSelectedPopupStation(null);
        }
      });
    },
    [onStationSelect]
  );


  // Create popup HTML with fuel price previews
  const createPopupHTML = (station: Station): string => {
    const fuelPrices = station.fuelPrices || {};
    const priceEntries = Object.entries(fuelPrices)
      .filter(([_, price]) => typeof price === 'number' && price > 0)
      .sort(([_, a], [__, b]) => (a as number) - (b as number))
      .slice(0, 4); // Show up to 4 fuel types

    const cheapestPrice = priceEntries.length > 0 
      ? (priceEntries[0][1] as number)
      : null;

    // Format fuel type names
    const formatFuelType = (type: string): string => {
      const fuelNames: Record<string, string> = {
        'unleaded': 'Unleaded',
        'premium': 'Premium',
        'diesel': 'Diesel',
        'e10': 'E10',
        'lpg': 'LPG',
        '98': 'Premium 98',
        '95': 'Premium 95',
        '91': 'Unleaded 91',
      };
      return fuelNames[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
    };

    // Get price color
    const getPriceColor = (price: number): string => {
      if (price < 200) return '#059669'; // green
      if (price <= 210) return '#d97706'; // yellow
      return '#dc2626'; // red
    };

    return `
      <div class="station-popup" style="min-width: 280px; max-width: 320px;">
        <div style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: start; justify-content: space-between;">
            <div style="flex: 1;">
              <h3 style="font-weight: 700; font-size: 18px; color: #111827; margin: 0 0 4px 0;">${station.name}</h3>
              <p style="font-size: 14px; color: #6b7280; margin: 0;">${station.brand || 'Station'}</p>
            </div>
            <button class="popup-close" style="background: none; border: none; color: #9ca3af; cursor: pointer; padding: 8px; min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='transparent'">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        ${station.address || station.suburb ? `
        <div style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: start; gap: 8px;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #9ca3af; margin-top: 2px; flex-shrink: 0;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div style="font-size: 14px; color: #6b7280;">
              <p style="margin: 0;">${station.address || ''}</p>
              <p style="margin: 4px 0 0 0;">${station.suburb || ''}${station.postcode ? ` ${station.postcode}` : ''}</p>
            </div>
          </div>
        </div>
        ` : ''}
        ${priceEntries.length > 0 ? `
        <div style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
          <h4 style="font-weight: 600; font-size: 14px; color: #111827; margin: 0 0 12px 0;">Fuel Prices</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${priceEntries.map(([type, price]) => {
              const priceNum = price as number;
              const isCheapest = priceNum === cheapestPrice;
              return `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: ${isCheapest ? '#f0fdf4' : '#f9fafb'}; border-radius: 6px; border: ${isCheapest ? '1px solid #86efac' : '1px solid transparent'};">
                <span style="font-size: 13px; font-weight: 500; color: #374151;">${formatFuelType(type)}</span>
                <span style="font-size: 15px; font-weight: 700; color: ${getPriceColor(priceNum)};">
                  ${priceNum.toFixed(1)}¢/L
                </span>
              </div>
            `;
            }).join('')}
          </div>
          ${priceEntries.length > 4 ? `
          <p style="font-size: 12px; color: #6b7280; margin: 8px 0 0 0; text-align: center;">
            +${Object.keys(fuelPrices).length - 4} more fuel types
          </p>
          ` : ''}
        </div>
        ` : cheapestPrice ? `
        <div style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
          <h4 style="font-weight: 600; font-size: 14px; color: #111827; margin: 0 0 12px 0;">Current Price</h4>
          <div style="font-size: 18px; font-weight: 700; color: ${getPriceColor(cheapestPrice)};">
            From ${cheapestPrice.toFixed(1)}¢/L
          </div>
        </div>
        ` : ''}
        <div style="padding: 16px; display: flex; gap: 8px;">
          <a href="/stations/${generateStationSlug(station)}" style="flex: 1; background: #3b82f6; color: white; text-align: center; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; transition: background 0.2s; min-height: 44px; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
            View Details
          </a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}" target="_blank" rel="noopener noreferrer" style="flex: 1; background: #6b7280; color: white; text-align: center; padding: 12px 16px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; transition: background 0.2s; min-height: 44px; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">
            Directions
          </a>
        </div>
      </div>
    `;
  };

  // Update markers when stations change
  useEffect(() => {
    if (mapRef.current?.loaded()) {
      updateMarkers();
    }
  }, [stations, updateMarkers]);

  // Center on selected station
  useEffect(() => {
    if (selectedStation && mapRef.current) {
      mapRef.current.easeTo({
        center: [selectedStation.longitude, selectedStation.latitude],
        zoom: Math.max(mapRef.current.getZoom(), 15),
        duration: 500,
      });
      handleMarkerClick(selectedStation);
    }
  }, [selectedStation, handleMarkerClick]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      
      {/* Hover tooltip */}
      {hoveredStation && (
        <div
          className="pointer-events-none absolute z-50 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white shadow-lg"
          style={{
            left: '50%',
            top: '10px',
            transform: 'translateX(-50%)',
          }}
        >
          {hoveredStation.name}
          <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}

      {/* Station count badge */}
      <div className="absolute bottom-4 right-4 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-lg dark:bg-gray-800 dark:text-gray-200">
        {stations.length} stations
      </div>
    </div>
  );
}

