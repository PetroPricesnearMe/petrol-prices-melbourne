/**
 * Hero Section Example
 * Complete example showing all Hero variants and features
 */

'use client';

import { Hero } from './Hero';

export function HeroExample() {
  return (
    <div className="space-y-0">
      {/* Default Gradient Hero */}
      <Hero
        title="Find the Cheapest Petrol Near You"
        subtitle="Compare prices from 250+ stations"
        description="Save money on every fill-up with real-time fuel prices across Melbourne"
        ctaText="Search Stations"
        ctaHref="/directory"
        secondaryCtaText="View Map"
        secondaryCtaHref="/map"
        variant="gradient"
        showSearch
      />

      {/* Minimal Hero */}
      <Hero
        title="Simple & Clean"
        subtitle="Minimal design"
        description="Perfect for content-focused pages"
        ctaText="Get Started"
        variant="minimal"
      />
    </div>
  );
}

export default HeroExample;
