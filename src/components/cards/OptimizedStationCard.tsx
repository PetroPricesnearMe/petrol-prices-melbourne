/**
 * Optimized Station Card Component
 *
 * SEO-optimized, performance-enhanced station card with badges and certifications
 *
 * @module components/cards/OptimizedStationCard
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

import { ScaleTransition } from '@/components/transitions/SmoothTransitions';
import { getStationUrl } from '@/lib/seo/station-seo';
import type { Station } from '@/types/station';
import { cn } from '@/utils/cn';
import { getBrandInfo, getBrandClass } from '@/utils/brandImages';
import {
  determineStationBadges,
  limitBadges,
  getBadgeStyle,
  type StationAttributes,
  type Badge,
} from '@/utils/brandBadges';
import {
  getOptimizedImageProps,
  handleImageError,
} from '@/utils/imageOptimization';

// ============================================================================
// TYPES
// ============================================================================

export interface OptimizedStationCardProps {
  station: Station;
  index?: number;
  showTransition?: boolean;
  transitionDelay?: number;
  className?: string;
  onCardClick?: (station: Station) => void;
  maxBadges?: number;
  verified?: boolean;
  cheapestInArea?: boolean;
  viewCount?: number;
}

interface BrandHeaderProps {
  brand: string;
  brandLogo?: string | null;
  verified?: boolean;
  className?: string;
}

interface FuelPriceDisplayProps {
  fuelPrices: Station['fuelPrices'];
  selectedFuelType?: keyof Station['fuelPrices'];
  className?: string;
}

interface BadgeDisplayProps {
  badges: Badge[];
  className?: string;
}

interface SchemaDataProps {
  station: Station;
  brandInfo: ReturnType<typeof getBrandInfo>;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get price color based on value
 */
function getPriceColor(price: number | null): string {
  if (price === null) return 'text-gray-400 dark:text-gray-500';
  if (price < 200) return 'text-success-600 dark:text-success-400';
  if (price <= 210) return 'text-warning-600 dark:text-warning-400';
  return 'text-error-600 dark:text-error-400';
}

/**
 * Convert station amenities to badge attributes
 */
function getStationAttributes(
  station: Station,
  verified?: boolean,
  cheapestInArea?: boolean,
  viewCount?: number
): StationAttributes {
  const amenities = station.amenities || {};

  return {
    verified: verified !== undefined ? verified : false,
    isOpen24Hours: amenities.isOpen24Hours,
    hasElectricCharging: amenities.hasElectricCharging,
    hasCarWash: amenities.hasCarWash,
    hasCafe: amenities.hasCafe,
    hasATM: amenities.hasATM,
    hasRestroom: amenities.hasRestroom,
    rating: station.rating,
    cheapestInArea,
    viewCount,
    ecoFriendly: false, // Can be determined by fuel types or other criteria
    hasAward: false, // Can be set based on external data
  };
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Brand header with optimized logo
 */
const BrandHeader = memo<BrandHeaderProps>(
  ({ brand, brandLogo, verified, className }) => {
    const brandInfo = getBrandInfo(brand);
    const brandClass = getBrandClass(brand);
    const imageProps = getOptimizedImageProps(
      brandLogo || brandInfo.logo,
      `${brandInfo.name} logo`,
      { width: 300, height: 120 }
    );

    return (
      <div
        className={cn(
          'relative flex h-24 flex-shrink-0 items-center justify-center overflow-hidden sm:h-28 lg:h-32',
          'bg-gradient-to-br from-gray-50 via-white to-gray-100',
          'dark:from-gray-800 dark:via-gray-900 dark:to-gray-800',
          'border-b-2',
          brandClass,
          className
        )}
        style={{
          background: `linear-gradient(135deg, ${brandInfo.color}15 0%, ${brandInfo.fallback}05 50%, transparent 100%)`,
          borderColor: `${brandInfo.color}30`,
        }}
        data-brand={brandInfo.name}
      >
        <div className="relative h-16 w-32 sm:h-20 sm:w-40 lg:h-24 lg:w-48">
          <Image
            {...imageProps}
            alt={imageProps.alt}
            fill
            className="object-contain p-2 transition-transform duration-300 hover:scale-110"
            onError={(e) => handleImageError(e, brandInfo.logo)}
            priority={false}
          />
        </div>

        {/* Verified Badge Overlay */}
        {verified && (
          <div
            className="absolute right-2 top-2 rounded-full border-2 bg-white p-1.5 shadow-lg dark:bg-gray-800 sm:right-3 sm:top-3 sm:p-2"
            style={{ borderColor: brandInfo.color }}
            title="Verified by Service Victoria"
          >
            <span
              className="text-base text-success-600 sm:text-lg"
              aria-label="Verified"
            >
              ✓
            </span>
          </div>
        )}
      </div>
    );
  }
);

BrandHeader.displayName = 'BrandHeader';

/**
 * Badge display component
 */
const BadgeDisplay = memo<BadgeDisplayProps>(({ badges, className }) => {
  if (badges.length === 0) return null;

  return (
    <div
      className={cn('flex flex-wrap gap-2', className)}
      role="list"
      aria-label="Station badges"
    >
      {badges.map((badge) => (
        <span
          key={badge.type}
          className="badge badge-sm"
          style={getBadgeStyle(badge)}
          title={badge.description}
          role="listitem"
        >
          <span aria-hidden="true">{badge.icon}</span>
          <span className="sr-only sm:not-sr-only">{badge.label}</span>
        </span>
      ))}
    </div>
  );
});

BadgeDisplay.displayName = 'BadgeDisplay';

/**
 * Fuel price display component
 */
const FuelPriceDisplay = memo<FuelPriceDisplayProps>(
  ({ fuelPrices, selectedFuelType, className }) => {
    if (!fuelPrices) return null;

    return (
      <div
        className={cn('space-y-2', className)}
        role="table"
        aria-label="Fuel prices"
      >
        {Array.isArray(fuelPrices)
          ? fuelPrices.map((price) => (
              <div
                key={price.fuelType}
                className="flex items-center justify-between"
                role="row"
              >
                <span
                  className="text-sm capitalize text-gray-600 dark:text-gray-400"
                  role="cell"
                >
                  {price.fuelType}
                </span>
                <span
                  className={cn(
                    'text-lg font-bold',
                    getPriceColor(price.pricePerLiter)
                  )}
                  role="cell"
                >
                  {price.pricePerLiter.toFixed(1)}¢
                </span>
              </div>
            ))
          : Object.entries(fuelPrices).map(([type, price]) => {
              if (price === null || typeof price !== 'number') return null;
              const isSelected = type === selectedFuelType;

              return (
                <div
                  key={type}
                  className={cn(
                    'flex items-center justify-between',
                    isSelected && 'font-semibold'
                  )}
                  role="row"
                >
                  <span
                    className="text-sm capitalize text-gray-600 dark:text-gray-400"
                    role="cell"
                  >
                    {type === 'premium95'
                      ? 'Premium 95'
                      : type === 'premium98'
                        ? 'Premium 98'
                        : type}
                  </span>
                  <span
                    className={cn(
                      'text-lg font-bold',
                      getPriceColor(price as number)
                    )}
                    role="cell"
                  >
                    {(price as number).toFixed(1)}¢
                  </span>
                </div>
              );
            })}
      </div>
    );
  }
);

FuelPriceDisplay.displayName = 'FuelPriceDisplay';

/**
 * JSON-LD Schema for SEO
 */
const SchemaData = memo<SchemaDataProps>(({ station, brandInfo }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'GasStation',
    '@id': `https://petrol-prices-melbourne.com/stations/${station.id}`,
    name: station.name || station.stationName,
    brand: {
      '@type': 'Brand',
      name: brandInfo.name,
      logo: brandInfo.logo,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: station.address,
      addressLocality: station.suburb,
      addressRegion: station.region,
      postalCode: station.postcode,
      addressCountry: 'AU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: station.latitude,
      longitude: station.longitude,
    },
    telephone: station.phoneNumber,
    url: station.website,
    ...(station.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: station.rating,
        reviewCount: station.reviewCount || 0,
      },
    }),
    ...(station.amenities && {
      amenityFeature: Object.entries(station.amenities)
        .filter(([_, value]) => value === true)
        .map(([key]) => ({
          '@type': 'LocationFeatureSpecification',
          name: key
            .replace(/^has/, '')
            .replace(/([A-Z])/g, ' $1')
            .trim(),
        })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
});

SchemaData.displayName = 'SchemaData';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Optimized Station Card Component
 */
export const OptimizedStationCard = memo<OptimizedStationCardProps>(
  ({
    station,
    index = 0,
    showTransition = true,
    transitionDelay = 0,
    className,
    onCardClick,
    maxBadges = 3,
    verified,
    cheapestInArea,
    viewCount,
  }) => {
    const brandInfo = getBrandInfo(station.brand);
    const brandClass = getBrandClass(station.brand);

    // Determine badges
    const attributes = getStationAttributes(
      station,
      verified,
      cheapestInArea,
      viewCount
    );
    const allBadges = determineStationBadges(attributes);
    const displayBadges = limitBadges(allBadges, maxBadges);

    const handleCardClick = (_e: React.MouseEvent) => {
      if (onCardClick) {
        onCardClick(station);
      }
    };

    const cardContent = (
      <Link
        href={getStationUrl(station)}
        className={cn('block h-full', className)}
        onClick={handleCardClick}
        aria-label={`View details for ${station.name || station.stationName}`}
      >
        <article
          className={cn(
            'overflow-hidden rounded-2xl bg-white dark:bg-gray-900',
            'border border-gray-200 shadow-sm dark:border-gray-800',
            'hover:-translate-y-1 hover:shadow-2xl',
            'cursor-pointer transition-all duration-300',
            'print-avoid-break flex h-full flex-col'
          )}
          itemScope
          itemType="https://schema.org/GasStation"
        >
          {/* Schema.org JSON-LD for SEO */}
          <SchemaData station={station} brandInfo={brandInfo} />

          {/* Brand Header */}
          <BrandHeader
            brand={station.brand || ''}
            brandLogo={station.logoUrl}
            verified={verified}
          />

          {/* Station Info */}
          <div className="flex-shrink-0 border-b border-gray-200 p-5 dark:border-gray-800 lg:p-6">
            <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
              <h3
                className="min-w-0 flex-1 truncate text-lg font-bold leading-tight text-gray-900 dark:text-white"
                itemProp="name"
              >
                {station.name || station.stationName}
              </h3>
            </div>

            {/* Badges */}
            <BadgeDisplay badges={displayBadges} className="mb-3" />

            {/* Brand Badge */}
            <span
              className={cn('badge text-xs', brandClass)}
              style={{
                backgroundColor: `${brandInfo.color}20`,
                color: brandInfo.color,
              }}
            >
              {brandInfo.name}
            </span>
          </div>

          {/* Content */}
          <div className="flex-grow space-y-4 p-5 lg:p-6">
            {/* Address */}
            <address
              className="text-sm not-italic text-gray-600 dark:text-gray-400"
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <p itemProp="streetAddress" className="line-clamp-2">
                📍 {station.address}
              </p>
              <p className="mt-1">
                <span itemProp="addressLocality">{station.suburb}</span>
                {station.postcode && (
                  <span itemProp="postalCode"> {station.postcode}</span>
                )}
              </p>
            </address>

            {/* Fuel Prices */}
            {station.fuelPrices && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Current Prices
                </h4>
                <FuelPriceDisplay fuelPrices={station.fuelPrices} />
              </div>
            )}

            {/* Last Updated */}
            {station.lastUpdated && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Updated:{' '}
                {new Date(station.lastUpdated).toLocaleDateString('en-AU', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="print-hidden flex-shrink-0 border-t border-gray-200 p-5 dark:border-gray-800 lg:p-6">
            <div className="btn-primary btn-sm btn pointer-events-none w-full">
              View Details →
            </div>
          </div>
        </article>
      </Link>
    );

    if (showTransition) {
      return (
        <ScaleTransition
          delay={transitionDelay + index * 0.05}
          duration={0.3}
          className="h-full"
        >
          {cardContent}
        </ScaleTransition>
      );
    }

    return cardContent;
  }
);

OptimizedStationCard.displayName = 'OptimizedStationCard';

// ============================================================================
// EXPORT
// ============================================================================

export default OptimizedStationCard;
