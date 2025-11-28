/**
 * Pages - Re-export all page components
 * 
 * This index file provides a clean import path for all page components.
 * 
 * @example
 * import { PerformanceOptimizedLandingPage } from '@/components/pages';
 */

export { PerformanceOptimizedLandingPage } from './PerformanceOptimizedLandingPage';
export { LandingPage } from './LandingPage';
export { EnhancedLandingPage } from './EnhancedLandingPage';
export { DetailedListingPage } from './DetailedListingPage';

// Type exports
export type { PerformanceOptimizedLandingPageProps } from './PerformanceOptimizedLandingPage';
export type {
  LandingPageProps,
  HeroSectionProps,
  DirectoryHighlightProps,
  FeatureCardProps,
  StatsSectionProps,
} from './LandingPage';
export type {
  EnhancedLandingPageProps,
  TestimonialProps,
  PricingPlanProps,
  FeatureProps,
} from './EnhancedLandingPage';
export type {
  DetailedListingPageProps,
  HeroSectionProps as DetailedListingHeroSectionProps,
} from './DetailedListingPage';

