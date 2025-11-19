/**
 * ModernHero Component - Usage Examples
 *
 * This file demonstrates various ways to use the ModernHero component
 * in your Next.js application.
 */

import { ModernHero } from './ModernHero';

// ============================================================================
// Example 1: Basic Usage (Default Props)
// ============================================================================

export function Example1() {
  return <ModernHero />;
}

// ============================================================================
// Example 2: Custom Heading and Subtitle
// ============================================================================

export function Example2() {
  return (
    <ModernHero
      heading="Discover Amazing Petrol Stations"
      subtitle="Find the best fuel prices in your area with our comprehensive directory of petrol stations across Australia."
    />
  );
}

// ============================================================================
// Example 3: Custom CTA Button
// ============================================================================

export function Example3() {
  return (
    <ModernHero
      ctaText="Start Searching"
      ctaLink="/search"
    />
  );
}

// ============================================================================
// Example 4: Fully Customized
// ============================================================================

export function Example4() {
  return (
    <ModernHero
      heading="Save Money on Every Fill-Up"
      subtitle="Compare prices from hundreds of stations. Get real-time updates and never overpay for fuel again."
      ctaText="Find Cheap Fuel Now"
      ctaLink="/directory"
      className="custom-hero-class"
    />
  );
}

// ============================================================================
// Example 5: In a Page Component
// ============================================================================

export default function HomePage() {
  return (
    <div>
      <ModernHero />
      {/* Rest of your page content */}
    </div>
  );
}


