/**
 * Station Directory Page - STANDARDIZED VERSION
 * Uses new component library with atomic design principles
 * Fully accessible with WCAG 2.1 AA compliance
 */

import { Search, Filter, MapPin, Star } from 'lucide-react';
import type { Metadata } from 'next';

import {
  Container,
  Section,
  ResponsiveGrid,
  GridItem,
  Flex,
} from '@/components/layout/ResponsiveGrid';
import { StructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/primitives/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/primitives/Card';
import { Input } from '@/components/ui/primitives/Input';
import metadataJson from '@/data/stations-metadata.json';
import { generateWebSiteSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: `Melbourne Petrol Stations Directory - ${metadataJson.totalStations}+ Stations | Find Cheapest Fuel`,
  description: `Browse our complete directory of ${metadataJson.totalStations}+ petrol stations across ${metadataJson.suburbs.length}+ Melbourne suburbs. Compare live fuel prices from BP, Shell, Caltex, 7-Eleven, and more.`,
};

export const revalidate = 86400;

export default function DirectoryPageStandardized() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const structuredDataSchemas = generateWebSiteSchema(baseUrl);

  return (
    <>
      <StructuredData data={structuredDataSchemas} />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <Section spacing="lg" background="white">
          <Container size="xl">
            <div className="mx-auto max-w-4xl text-center">
              {/* Title */}
              <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                Melbourne Petrol Stations
              </h1>

              {/* Description */}
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
                Browse {metadataJson.totalStations}+ stations across{' '}
                {metadataJson.suburbs.length}+ suburbs with live fuel prices
              </p>

              {/* Search Bar */}
              <div className="mx-auto mb-8 max-w-2xl">
                <Input
                  leftIcon={<Search className="h-5 w-5" />}
                  placeholder="Search by suburb, postcode, or station name..."
                  aria-label="Search stations"
                  fullWidth
                />
              </div>

              {/* Stats Bar */}
              <Flex justify="center" gap="md" wrap className="mb-8">
                <Card variant="ghost" className="min-w-[140px] px-6 py-4">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {metadataJson.totalStations}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Stations
                  </div>
                </Card>

                <Card variant="ghost" className="min-w-[140px] px-6 py-4">
                  <div className="text-green-600 dark:text-green-400 text-3xl font-bold">
                    {metadataJson.suburbs.length}+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Suburbs
                  </div>
                </Card>

                <Card variant="ghost" className="min-w-[140px] px-6 py-4">
                  <div className="text-blue-600 dark:text-blue-400 text-3xl font-bold">
                    {metadataJson.priceRange.unleaded.average}¢
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Price
                  </div>
                </Card>
              </Flex>

              {/* Action Buttons */}
              <Flex justify="center" gap="md" wrap>
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<MapPin />}
                  aria-label="Find stations near your location"
                >
                  Near Me
                </Button>
                <Button variant="outlined" size="lg" leftIcon={<Star />}>
                  Favorites
                </Button>
                <Button variant="outlined" size="lg" leftIcon={<Filter />}>
                  Filters
                </Button>
              </Flex>
            </div>
          </Container>
        </Section>

        {/* Main Content */}
        <Section spacing="xl">
          <Container size="xl">
            <ResponsiveGrid
              cols={{
                default: 1,
                lg: 12,
              }}
              gap="xl"
            >
              {/* Filters Sidebar */}
              <GridItem colSpan={{ default: 1, lg: 3 }}>
                <div className="space-y-6 lg:sticky lg:top-4">
                  {/* Filters Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Filters</CardTitle>
                      <CardDescription>Refine your search</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Fuel Type */}
                      <div>
                        <p className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Fuel Type
                        </p>
                        <div className="space-y-2">
                          {[
                            'Unleaded (ULP)',
                            'Premium 95',
                            'Premium 98',
                            'Diesel',
                            'E10',
                          ].map((fuel) => (
                            <label
                              key={fuel}
                              className="flex cursor-pointer items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                aria-label={`Filter by ${fuel}`}
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {fuel}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Brand */}
                      <div>
                        <p className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Brand
                        </p>
                        <div className="space-y-2">
                          {[
                            'Shell',
                            'BP',
                            'Caltex',
                            '7-Eleven',
                            'United',
                            'Ampol',
                          ].map((brand) => (
                            <label
                              key={brand}
                              className="flex cursor-pointer items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                aria-label={`Filter by ${brand}`}
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {brand}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Distance */}
                      <div>
                        <label
                          htmlFor="distance"
                          className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Max Distance
                        </label>
                        <select
                          id="distance"
                          className="input w-full"
                          aria-label="Select maximum distance"
                        >
                          <option>Any Distance</option>
                          <option>Within 5km</option>
                          <option>Within 10km</option>
                          <option>Within 20km</option>
                          <option>Within 50km</option>
                        </select>
                      </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-3">
                      <Button variant="primary" fullWidth>
                        Apply Filters
                      </Button>
                      <Button variant="ghost" fullWidth>
                        Reset All
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Quick Links */}
                  <Card variant="bordered">
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="ghost"
                        fullWidth
                        className="justify-start"
                      >
                        🔥 Cheapest Today
                      </Button>
                      <Button
                        variant="ghost"
                        fullWidth
                        className="justify-start"
                      >
                        📍 Near Me
                      </Button>
                      <Button
                        variant="ghost"
                        fullWidth
                        className="justify-start"
                      >
                        ⭐ My Favorites
                      </Button>
                      <Button
                        variant="ghost"
                        fullWidth
                        className="justify-start"
                      >
                        📊 Price Trends
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </GridItem>

              {/* Station Cards Grid */}
              <GridItem colSpan={{ default: 1, lg: 9 }}>
                <div className="space-y-6">
                  {/* Results Header */}
                  <Flex justify="between" align="center" gap="md">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        All Stations
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing 250+ results
                      </p>
                    </div>
                    <select
                      className="input w-auto min-w-[150px]"
                      aria-label="Sort stations"
                    >
                      <option>Nearest First</option>
                      <option>Cheapest First</option>
                      <option>Recently Updated</option>
                      <option>Brand A-Z</option>
                    </select>
                  </Flex>

                  {/* Station Cards */}
                  <ResponsiveGrid
                    cols={{
                      default: 1,
                      sm: 2,
                      xl: 3,
                    }}
                    gap="lg"
                  >
                    {/* Example Cards */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <GridItem key={i}>
                        <StationCard id={i} />
                      </GridItem>
                    ))}
                  </ResponsiveGrid>

                  {/* Load More */}
                  <div className="flex justify-center pt-8">
                    <Button variant="outlined" size="lg">
                      Load More Stations
                    </Button>
                  </div>
                </div>
              </GridItem>
            </ResponsiveGrid>
          </Container>
        </Section>
      </main>
    </>
  );
}

// ============================================================================
// STATION CARD COMPONENT
// ============================================================================

function StationCard({ id: _id }: { id: number }) {
  return (
    <Card hoverable clickable className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-xl">Shell Carlton</CardTitle>
            <CardDescription className="mt-1">
              123 Main Street, Carlton VIC 3053
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" aria-label="Add to favorites">
            <Star className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price */}
        <div>
          <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            189.9¢
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Unleaded (ULP)
          </p>
        </div>

        {/* Distance & Time */}
        <Flex justify="between" gap="sm" className="text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>2.3 km</span>
          </div>
          <div className="text-gray-500 dark:text-gray-500">Updated 5m ago</div>
        </Flex>

        {/* Amenities */}
        <Flex gap="xs" wrap>
          <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
            24/7
          </span>
          <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
            Car Wash
          </span>
          <span className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
            ATM
          </span>
        </Flex>
      </CardContent>

      <CardFooter>
        <Button variant="primary" fullWidth>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
