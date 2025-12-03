/**
 * Map Components
 *
 * Barrel export for map-related components
 */

// MapLibre GL version (recommended for best performance)
export { HeroMapLibre } from './HeroMapLibre';
export { HeroMapLibreInner } from './HeroMapLibreInner';

// Leaflet version (legacy, but still supported)
export { HeroMap } from './HeroMap';
export { HeroMapInner } from './HeroMapInner';

// Clustering utilities
export * from './clustering';

// Re-export MapView for compatibility
export { MapView } from '../molecules/MapView/MapView';
