/**
 * Map View Demo Page
 *
 * Comprehensive demonstration of all map features:
 * - Interactive Leaflet map with clustering
 * - View toggle (list, grid, map)
 * - Responsive full-screen mode
 * - Color-coded pins based on fuel prices
 * - Pin interactivity and popups
 * - User location tracking
 */

import type { Metadata } from 'next';

import { MapDemoClient } from './MapDemoClient';

export const metadata: Metadata = {
  title: 'Interactive Map Demo | Petrol Price Near Me',
  description: 'Explore our interactive map with clustering, real-time location tracking, and color-coded fuel price markers.',
  robots: 'noindex, nofollow', // Demo page shouldn't be indexed
};

export default function MapDemoPage() {
  return <MapDemoClient />;
}
