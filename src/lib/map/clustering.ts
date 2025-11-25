/**
 * Marker clustering utilities for map performance
 * Uses Supercluster for efficient clustering of ~720 stations
 */

import Supercluster from 'supercluster';
import type { Station } from '@/types/station';

export interface ClusterPoint {
  type: 'Feature';
  properties: {
    cluster: boolean;
    stationId: string | number;
    station: Station;
    point_count?: number;
    cluster_id?: number;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}

export interface ClusterFeature extends ClusterPoint {
  properties: {
    cluster: true;
    point_count: number;
    cluster_id: number;
  };
}

export interface StationFeature extends ClusterPoint {
  properties: {
    cluster: false;
    stationId: string | number;
    station: Station;
  };
}

/**
 * Cluster configuration
 */
export const CLUSTER_CONFIG = {
  radius: 50, // Cluster radius in pixels
  maxZoom: 14, // Max zoom to cluster points on
  minZoom: 0, // Min zoom to generate clusters on
  minPoints: 2, // Minimum points to form a cluster
} as const;

/**
 * Convert stations to GeoJSON features for clustering
 */
export function stationsToFeatures(stations: Station[]): ClusterPoint[] {
  return stations
    .filter(
      (station) =>
        typeof station.latitude === 'number' &&
        typeof station.longitude === 'number' &&
        !isNaN(station.latitude) &&
        !isNaN(station.longitude)
    )
    .map((station) => ({
      type: 'Feature' as const,
      properties: {
        cluster: false,
        stationId: station.id,
        station,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [station.longitude, station.latitude],
      },
    }));
}

/**
 * Create a Supercluster instance
 */
export function createCluster(features: ClusterPoint[]): Supercluster {
  return new Supercluster({
    radius: CLUSTER_CONFIG.radius,
    maxZoom: CLUSTER_CONFIG.maxZoom,
    minZoom: CLUSTER_CONFIG.minZoom,
    minPoints: CLUSTER_CONFIG.minPoints,
  });
}

/**
 * Get clusters for a given bounding box and zoom level
 */
export function getClusters(
  cluster: Supercluster,
  bbox: [number, number, number, number], // [west, south, east, north]
  zoom: number
): (ClusterFeature | StationFeature)[] {
  return cluster.getClusters(bbox, zoom) as (ClusterFeature | StationFeature)[];
}

/**
 * Get expansion zoom for a cluster
 */
export function getClusterExpansionZoom(
  cluster: Supercluster,
  clusterId: number
): number {
  return cluster.getClusterExpansionZoom(clusterId);
}

/**
 * Get all points in a cluster
 */
export function getClusterPoints(
  cluster: Supercluster,
  clusterId: number,
  zoom: number
): StationFeature[] {
  return cluster.getLeaves(clusterId, Infinity) as StationFeature[];
}

