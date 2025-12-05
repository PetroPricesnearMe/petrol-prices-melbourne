/**
 * Suburb Fuel Prices Landing Page Template
 * 
 * SEO-optimized template for suburb-specific fuel price pages
 * Includes: SEO metadata, H1, live price feed, FAQ section, and nearby suburb links
 * 
 * @module components/templates/SuburbFuelPricesPage
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { StructuredData } from '@/components/StructuredData';
import { generateSuburbMetadata } from '@/lib/seo/metadata';
import { generateDirectoryPageSchemas } from '@/lib/schema';
import { getStationUrl } from '@/lib/seo/station-seo';

import type { Station } from '@/types/station';

// ============================================================================
// TYPES
// ============================================================================

interface SuburbFuelPricesPageProps {
  suburb: string;
  stations: Station[];
  nearbySuburbs: Array<{
    name: string;
    stationCount: number;
    url: string;
  }>;
  averagePrice?: number;
  lowestPrice?: number;
  highestPrice?: number;
}

// ============================================================================
// METADATA GENERATOR
// ============================================================================

/**
 * Generate SEO-optimized metadata for suburb fuel prices page
 * Uses enhanced metadata generator with comprehensive SEO optimization
 */
export function generateSuburbFuelPricesMetadata(
  suburb: string,
  stationCount: number,
  averagePrice?: number,
  lowestPrice?: number
): Metadata {
  const suburbFormatted = suburb
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return generateSuburbMetadata(suburbFormatted, stationCount, averagePrice, lowestPrice);
}

// ============================================================================
// LIVE FUEL PRICE FEED COMPONENT
// ============================================================================

interface LivePriceFeedProps {
  stations: Station[];
  suburb: string;
}

function LivePriceFeed({ stations, suburb }: LivePriceFeedProps) {
  // Get stations with current prices, sorted by unleaded price
  const stationsWithPrices = stations
    .filter((s) => s.fuelPrices?.unleaded)
    .sort((a, b) => (a.fuelPrices?.unleaded || 0) - (b.fuelPrices?.unleaded || 0))
    .slice(0, 5); // Top 5 cheapest

  if (stationsWithPrices.length === 0) {
    return (
      <section 
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
        aria-label="Live fuel price feed"
      >
        <p className="text-blue-800 dark:text-blue-200">
          Live fuel prices are being updated. Please check back shortly.
        </p>
      </section>
    );
  }

  return (
    <section 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
      aria-label={`Live fuel prices in ${suburb}`}
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Live Fuel Prices in {suburb}
        </h2>
        <span 
          className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
          aria-label="Live price updates active"
        >
          <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
          Live Updates
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Real-time fuel prices from petrol stations in {suburb}. Prices updated every 24 hours from
        official Service Victoria data.
      </p>

      <ol className="space-y-3" itemScope itemType="https://schema.org/ItemList">
        {stationsWithPrices.map((station, index) => {
          const unleadedPrice = station.fuelPrices?.unleaded;
          const dieselPrice = station.fuelPrices?.diesel;
          const premiumPrice = station.fuelPrices?.premium95 || station.fuelPrices?.premium98;

          return (
            <li 
              key={station.id}
              itemScope
              itemType="https://schema.org/GasStation"
              itemProp="itemListElement"
            >
              <Link
                href={getStationUrl(station)}
                className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-primary-300 dark:hover:border-primary-700"
                itemProp="url"
              >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white" itemProp="name">
                      {station.name}
                    </h3>
                    {index === 0 && (
                      <span 
                        className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-medium rounded"
                        aria-label="Cheapest fuel price in this suburb"
                      >
                        Cheapest
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2" itemProp="address">
                    {station.address}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {unleadedPrice && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Unleaded: </span>
                        <span className="font-bold text-primary-600 dark:text-primary-400">
                          {unleadedPrice.toFixed(1)}¢/L
                        </span>
                      </div>
                    )}
                    {dieselPrice && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Diesel: </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {dieselPrice.toFixed(1)}¢/L
                        </span>
                      </div>
                    )}
                    {premiumPrice && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Premium: </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {premiumPrice.toFixed(1)}¢/L
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href={`/directory/${suburb.toLowerCase().replace(/\s+/g, '-')}`}
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          View all {stations.length} stations in {suburb}
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}

// ============================================================================
// FAQ SECTION COMPONENT
// ============================================================================

interface FAQSectionProps {
  suburb: string;
  stationCount: number;
  averagePrice?: number;
}

function FAQSection({ suburb, stationCount, averagePrice }: FAQSectionProps) {
  const suburbFormatted = suburb
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // SEO-optimized FAQs targeting common fuel price questions
  const faqs = [
    {
      question: `What are the current fuel prices in ${suburbFormatted}?`,
      answer: `The average unleaded price in ${suburbFormatted} is currently ${averagePrice?.toFixed(1) || 'varies'} cents per liter. We track ${stationCount} petrol stations in ${suburbFormatted} and update prices every 24 hours from official Service Victoria data. Prices can vary significantly between stations, so we recommend comparing prices before filling up.`,
    },
    {
      question: `Where can I find the cheapest petrol in ${suburbFormatted}?`,
      answer: `Use our live fuel price feed above to see the cheapest stations in ${suburbFormatted}. Prices are sorted from lowest to highest, and we highlight the cheapest option. You can also browse our complete directory of ${stationCount} stations in ${suburbFormatted} to compare all available options.`,
    },
    {
      question: `How often are fuel prices updated in ${suburbFormatted}?`,
      answer: `Fuel prices in ${suburbFormatted} are updated every 24 hours from the official Service Victoria Fair Fuel Open Data API. This ensures you have access to the most current pricing information available. However, prices can change throughout the day, so we recommend checking prices on the day you plan to fill up.`,
    },
    {
      question: `Which fuel brands are available in ${suburbFormatted}?`,
      answer: `${suburbFormatted} has petrol stations from major brands including BP, Shell, Caltex, Ampol, and 7-Eleven, as well as independent operators. Our directory shows all available brands and their current prices so you can compare and choose the best option for your needs.`,
    },
    {
      question: `What fuel types are available in ${suburbFormatted}?`,
      answer: `Most stations in ${suburbFormatted} offer unleaded (91), premium unleaded (95/98), diesel, and E10. Some stations also offer LPG and alternative fuels. Our price listings show all available fuel types and their current prices at each station.`,
    },
    {
      question: `How can I save money on fuel in ${suburbFormatted}?`,
      answer: `To save money on fuel in ${suburbFormatted}, compare prices before filling up using our live price feed, fill up on Sunday or Monday when prices are typically lowest, consider joining fuel rewards programs, and maintain your vehicle for optimal fuel efficiency. Our platform helps you save up to 20 cents per liter by finding the cheapest prices.`,
    },
    {
      question: `Are fuel prices in ${suburbFormatted} higher than other Melbourne suburbs?`,
      answer: `Fuel prices in ${suburbFormatted} vary based on location, competition, and local market conditions. Our platform allows you to compare prices with nearby suburbs to find the best deals. Generally, prices are competitive across Melbourne, but using our comparison tools can help you identify savings opportunities.`,
    },
    {
      question: `Can I get directions to petrol stations in ${suburbFormatted}?`,
      answer: `Yes, each station listing in ${suburbFormatted} includes the full address and links to get directions via Google Maps. Simply click on any station from our live price feed or directory to view detailed information including maps and directions.`,
    },
  ];

  // Generate FAQ structured data for SEO
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
      aria-label={`Frequently asked questions about fuel prices in ${suburbFormatted}`}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Frequently Asked Questions About Fuel Prices in {suburbFormatted}
      </h2>

      <div className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
        {faqs.map((faq, index) => (
          <article
            key={index}
            className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0"
            itemScope
            itemType="https://schema.org/Question"
          >
            <h3 
              className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              itemProp="name"
            >
              {faq.question}
            </h3>
            <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed" itemProp="text">
                {faq.answer}
              </p>
            </div>
          </article>
        ))}
      </div>

      <StructuredData data={[faqStructuredData]} />
    </section>
  );
}

// ============================================================================
// NEARBY SUBURBS COMPONENT
// ============================================================================

interface NearbySuburbsProps {
  nearbySuburbs: Array<{
    name: string;
    stationCount: number;
    url: string;
  }>;
  currentSuburb: string;
}

function NearbySuburbs({ nearbySuburbs, currentSuburb }: NearbySuburbsProps) {
  if (nearbySuburbs.length === 0) {
    return null;
  }

  return (
    <nav 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
      aria-label={`Nearby suburbs to ${currentSuburb} for fuel price comparison`}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Compare Fuel Prices in Nearby Suburbs
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Check fuel prices in nearby suburbs to find the best deals. Prices can vary significantly
        between areas, so comparing nearby suburbs can help you save money.
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
        {nearbySuburbs.map((suburb) => (
          <li key={suburb.name}>
            <Link
              href={suburb.url}
              className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all hover:border-primary-300 dark:hover:border-primary-700"
              aria-label={`View fuel prices in ${suburb.name} - ${suburb.stationCount} stations`}
            >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {suburb.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {suburb.stationCount} station{suburb.stationCount !== 1 ? 's' : ''}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
                </svg>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/directory"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        >
          Browse all Melbourne suburbs
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </nav>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Suburb Fuel Prices Landing Page Template
 * 
 * SEO-optimized template with:
 * - Enhanced metadata
 * - H1 with suburb name
 * - Live fuel price feed
 * - FAQ section
 * - Nearby suburb links
 */
export function SuburbFuelPricesPage({
  suburb,
  stations,
  nearbySuburbs,
  averagePrice,
  lowestPrice,
  highestPrice,
}: SuburbFuelPricesPageProps) {
  const suburbFormatted = suburb
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  // Generate structured data
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://petrolpricenearme.com.au';
  const suburbSlug = suburb.toLowerCase().replace(/\s+/g, '-');
  const structuredDataSchemas = generateDirectoryPageSchemas(
    suburbFormatted,
    stations.length,
    baseUrl
  );

  // Generate breadcrumb structured data for SEO
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${baseUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Directory',
        item: `${baseUrl}/directory`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: suburbFormatted,
        item: `${baseUrl}/suburbs/${suburbSlug}`,
      },
    ],
  };

  return (
    <>
      {/* Structured Data - Includes Directory, FAQ, and Breadcrumb schemas */}
      <StructuredData data={[...structuredDataSchemas, breadcrumbSchema]} />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Header */}
        <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
          <div className="container mx-auto px-4">
            <nav 
              className="mb-6" 
              aria-label="Breadcrumb"
              itemScope
              itemType="https://schema.org/BreadcrumbList"
            >
              <ol className="flex items-center gap-2 text-sm" role="list">
                <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
                  <Link
                    href="/"
                    className="text-white/80 hover:text-white transition-colors"
                    itemProp="item"
                  >
                    <span itemProp="name">Home</span>
                  </Link>
                  <meta itemProp="position" content="1" />
                </li>
                <li aria-hidden="true" className="text-white/60">/</li>
                <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
                  <Link
                    href="/directory"
                    className="text-white/80 hover:text-white transition-colors"
                    itemProp="item"
                  >
                    <span itemProp="name">Directory</span>
                  </Link>
                  <meta itemProp="position" content="2" />
                </li>
                <li aria-hidden="true" className="text-white/60">/</li>
                <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
                  <span className="text-white" itemProp="name" aria-current="page">
                    {suburbFormatted}
                  </span>
                  <meta itemProp="position" content="3" />
                </li>
              </ol>
            </nav>

            {/* H1 - Critical for SEO - Contains suburb name and key terms */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {suburbFormatted} Fuel Prices - Petrol Stations & Live Prices
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mb-6">
              Compare real-time fuel prices from {stations.length} petrol stations in{' '}
              {suburbFormatted}, Melbourne. Find the cheapest unleaded, diesel, and premium fuel
              prices and save up to 20c/L on every fill-up.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <strong>{stations.length}</strong> Station{stations.length !== 1 ? 's' : ''}
              </div>
              {averagePrice && (
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  Average: <strong>{averagePrice.toFixed(1)}¢/L</strong>
                </div>
              )}
              {lowestPrice && (
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  Lowest: <strong>{lowestPrice.toFixed(1)}¢/L</strong>
                </div>
              )}
              {highestPrice && (
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  Highest: <strong>{highestPrice.toFixed(1)}¢/L</strong>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Live Fuel Price Feed */}
          <LivePriceFeed stations={stations} suburb={suburbFormatted} />

          {/* FAQ Section */}
          <FAQSection
            suburb={suburbFormatted}
            stationCount={stations.length}
            averagePrice={averagePrice}
          />

          {/* Nearby Suburbs */}
          <NearbySuburbs nearbySuburbs={nearbySuburbs} currentSuburb={suburbFormatted} />

          {/* SEO Content Section */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About Fuel Prices in {suburbFormatted}, Melbourne
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {suburbFormatted} is home to {stations.length} petrol stations offering competitive
              fuel prices across Melbourne. Our platform provides real-time price comparisons to
              help you find the cheapest fuel in {suburbFormatted} and save money on every
              fill-up.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Whether you&apos;re looking for unleaded, diesel, premium, or alternative fuels, our
              comprehensive directory covers all major brands including BP, Shell, Caltex, Ampol,
              and 7-Eleven, as well as independent operators in {suburbFormatted}.
            </p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
              Finding the Best Fuel Prices in {suburbFormatted}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Prices in {suburbFormatted} are updated every 24 hours from official Service
              Victoria data. Use our live price feed above to compare current prices and find the
              cheapest station near you. Remember that prices can vary throughout the day, so
              checking prices on the day you plan to fill up can help you maximize your savings.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

export type { SuburbFuelPricesPageProps };
