/**
 * Map Clustering Utilities
 *
 * Supercluster-based clustering for MapLibre GL
 * Optimized for performance with large datasets
 */

import Supercluster from 'supercluster';
import type { Station } from '@/types';

export interface ClusterFeature {
  type: 'Feature';
  properties: {
    cluster: boolean;
    cluster_id?: number;
    point_count?: number;
    point_count_abbreviated?: string;
    id?: string | number;
    name?: string;
    brand?: string;
    address?: string;
    suburb?: string;
    postcode?: string;
    unleaded?: number | null;
    diesel?: number | null;
    premium95?: number | null;
    color?: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

/**
 * Get color based on fuel price
 */
export function getPriceColor(price: number | null | undefined): string {
  if (price == null) return '#9CA3AF';
  if (price < 180) return '#10B981'; // Green - cheap
  if (price < 200) return '#F59E0B'; // Yellow - moderate
  return '#EF4444'; // Red - expensive
}

/**
 * Create cluster index from stations
 */
export function createClusterIndex(stations: Station[]) {
  const index = new Supercluster<Station>({
    radius: 60,
    maxZoom: 16,
    minZoom: 0,
  });

  const points = stations
    .filter((s) => s.latitude && s.longitude)
    .map((station) => ({
      type: 'Feature' as const,
      properties: station,
      geometry: {
        type: 'Point' as const,
        coordinates: [station.longitude!, station.latitude!] as [
          number,
          number,
        ],
      },
    }));

  index.load(points);
  return index;
}

/**
 * Get cluster size category
 */
export function getClusterSize(count: number): 'small' | 'medium' | 'large' {
  if (count > 50) return 'large';
  if (count > 10) return 'medium';
  return 'small';
}

/**
 * Get cluster color
 */
export function getClusterColor(count: number): string {
  if (count > 50) return '#EF4444'; // Red
  if (count > 10) return '#F59E0B'; // Yellow
  return '#3B82F6'; // Blue
}

/**
 * Get cluster size in pixels
 */
export function getClusterSizePx(size: 'small' | 'medium' | 'large'): number {
  switch (size) {
    case 'large':
      return 56;
    case 'medium':
      return 44;
    case 'small':
      return 36;
  }
}
