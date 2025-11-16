/**
 * Enhanced Station Card Component
 *
 * Optimized station card with smooth transitions and infinite scroll support
 *
 * @module components/cards/StationCard
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

import { ScaleTransition } from '@/components/transitions/SmoothTransitions';
import type { Station } from '@/types/station';
import { cn } from '@/utils/cn';

// ============================================================================
// TYPES
// ============================================================================

interface StationCardProps {
  station: Station;
  index?: number;
  showTransition?: boolean;
  transitionDelay?: number;
  className?: string;
  onCardClick?: (station: Station) => void;
}

interface FuelPriceDisplayProps {
  fuelPrices: Station['fuelPrices'];
  selectedFuelType?: keyof Station['fuelPrices'];
  className?: string;
}

interface BrandHeaderProps {
  brand: string;
  brandLogo?: string | null;
  verified?: boolean;
  className?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get brand information and styling
 */
function getBrandInfo(brand: string) {
  const brandMap: Record<
    string,
    { name: string; logo: string; color: string; fallback: string }
  > = {
    BP: {
      name: 'BP',
      logo: '/images/brands/bp.png',
      color: '#00A651',
      fallback: '#00A651',
    },
    Shell: {
      name: 'Shell',
      logo: '/images/brands/shell.png',
      color: '#FFD700',
      fallback: '#FFD700',
    },
    Caltex: {
      name: 'Caltex',
      logo: '/images/brands/caltex.png',
      color: '#FF6B35',
      fallback: '#FF6B35',
    },
    '7-Eleven': {
      name: '7-Eleven',
      logo: '/images/brands/7eleven.png',
      color: '#FF6900',
      fallback: '#FF6900',
    },
    'Coles Express': {
      name: 'Coles Express',
      logo: '/images/brands/coles.png',
      color: '#E31837',
      fallback: '#E31837',
    },
    Woolworths: {
      name: 'Woolworths',
      logo: '/images/brands/woolworths.png',
      color: '#1B5E20',
      fallback: '#1B5E20',
    },
    United: {
      name: 'United',
      logo: '/images/brands/united.png',
      color: '#1976D2',
      fallback: '#1976D2',
    },
    Puma: {
      name: 'Puma',
      logo: '/images/brands/puma.png',
      color: '#E91E63',
      fallback: '#E91E63',
    },
  };
  return (
    brandMap[brand] || {
      name: brand,
      logo: '/images/brands/default-logo.svg',
      color: '#6B7280',
      fallback: '#6B7280',
    }
  );
}

/**
 * Get brand CSS class
 */
function getBrandClass(brand: string) {
  const brandClassMap: Record<string, string> = {
    BP: 'badge-success',
    Shell: 'badge-warning',
    Caltex: 'badge-error',
    '7-Eleven': 'badge-primary',
    'Coles Express': 'badge-error',
    Woolworths: 'badge-success',
    United: 'badge-primary',
    Puma: 'badge-secondary',
  };
  return brandClassMap[brand] || 'badge-secondary';
}

/**
 * Get price color based on value
 *
 * Accepts optional/unknown values to match fuel price typing and
 * safely falls back when the value is not a valid number.
 */
function getPriceColor(price: number | null | undefined): string {
  if (price == null) return 'text-gray-400';
  if (price < 200) return 'text-success-600 dark:text-success-400';
  if (price <= 210) return 'text-warning-600 dark:text-warning-400';
  return 'text-error-600 dark:text-error-400';
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Brand header component
 */
const BrandHeader = memo<BrandHeaderProps>(
  ({ brand, brandLogo, verified, className }) => {
    const brandInfo = getBrandInfo(brand);
    const brandClass = getBrandClass(brand);

    return (
      <div
        className={cn(
          'relative flex h-20 flex-shrink-0 items-center justify-center sm:h-24',
          'bg-gradient-to-br from-gray-50 to-gray-100',
          'dark:from-gray-800 dark:to-gray-900',
          brandClass,
          className
        )}
        data-brand-color={brandInfo.color}
        data-brand-fallback={brandInfo.fallback}
      >
        <div className="relative h-12 w-24 sm:h-16 sm:w-32">
          <Image
            src={brandLogo || brandInfo.logo}
            alt={`${brandInfo.name} logo`}
            fill
            className="object-contain"
            onError={(e) => {
              e.currentTarget.src = '/images/brands/default-logo.svg';
            }}
          />
        </div>
        {verified && (
          <div className="absolute right-1.5 top-1.5 rounded-full bg-white p-0.5 shadow-sm dark:bg-gray-800 sm:right-2 sm:top-2 sm:p-1">
            <span
              className="text-sm text-success-600 sm:text-lg"
              title="Verified"
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
 * Fuel price display component
 */
const FuelPriceDisplay = memo<FuelPriceDisplayProps>(
  ({ fuelPrices, selectedFuelType, className }) => {
    if (!fuelPrices) return null;

    return (
      <div className={cn('space-y-1.5 sm:space-y-2', className)}>
        {Object.entries(fuelPrices).map(([type, rawPrice]) => {
          // Safely narrow to a numeric price; ignore non-numeric/empty values
          const price =
            typeof rawPrice === 'number'
              ? rawPrice
              : rawPrice && typeof (rawPrice as { value?: unknown }).value === 'number'
                ? ((rawPrice as { value: number }).value as number)
                : null;

          if (price === null) return null;
          const isSelected = type === selectedFuelType;

          return (
            <div
              key={type}
              className={cn(
                'flex items-center justify-between',
                isSelected && 'font-semibold'
              )}
            >
              <span className="text-xs capitalize text-gray-600 dark:text-gray-400 sm:text-sm">
                {type === 'premium95'
                  ? 'Premium 95'
                  : type === 'premium98'
                    ? 'Premium 98'
                    : type}
              </span>
              <span
                className={cn(
                  'text-sm font-bold sm:text-lg',
                  getPriceColor(price)
                )}
              >
                {price.toFixed(1)}¢
              </span>
            </div>
          );
        })}
      </div>
    );
  }
);

FuelPriceDisplay.displayName = 'FuelPriceDisplay';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Enhanced Station Card Component
 */
export const StationCard = memo<StationCardProps>(
  ({
    station,
    index = 0,
    showTransition = true,
    transitionDelay = 0,
    className,
    onCardClick,
  }) => {
    const brandClass = getBrandClass(station.brand);

    const handleCardClick = () => {
      if (onCardClick) {
        onCardClick(station);
      }
    };

    const cardContent = (
      <div
        className={cn(
          'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm',
          'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
          'print-avoid-break flex h-full flex-col',
          className
        )}
        itemScope
        itemType="https://schema.org/GasStation"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`View details for ${station.name} in ${station.suburb}`}
      >
        {/* Brand Header */}
        <BrandHeader
          brand={station.brand}
          brandLogo={station.brandLogo}
          verified={station.verified}
        />

        {/* Station Info */}
        <div className="flex-shrink-0 border-b border-gray-200 p-4 dark:border-gray-700 sm:p-5 lg:p-6">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h3
              className="text-base font-bold leading-tight text-gray-900 dark:text-white sm:text-lg"
              itemProp="name"
            >
              {station.name}
            </h3>
          </div>
          <span className={cn('badge text-xs', brandClass)}>
            {station.brand}
          </span>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-3 p-4 sm:space-y-4 sm:p-5 lg:p-6">
          {/* Address */}
          <div
            className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm"
            itemProp="address"
            itemScope
            itemType="https://schema.org/PostalAddress"
          >
            <p itemProp="streetAddress">📍 {station.address}</p>
            <p className="mt-1">
              <span itemProp="addressLocality">{station.suburb}</span>{' '}
              <span itemProp="postalCode">{station.postcode}</span>
            </p>
          </div>

          {/* Fuel Prices */}
          <div>
            <h4 className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300 sm:text-sm">
              Current Prices
            </h4>
            <FuelPriceDisplay fuelPrices={station.fuelPrices} />
          </div>

          {/* Last Updated */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Updated: {new Date(station.lastUpdated).toLocaleDateString()}
          </div>
        </div>

        {/* Footer */}
        <div className="print-hidden flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700 sm:p-5 lg:p-6">
          <Link
            href={`/stations/${station.id}`}
            className="btn-primary btn-sm btn w-full text-xs sm:text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            View Details →
          </Link>
        </div>
      </div>
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

StationCard.displayName = 'StationCard';

// ============================================================================
// GRID COMPONENT
// ============================================================================

interface StationGridProps {
  stations: Station[];
  showTransitions?: boolean;
  className?: string;
  onCardClick?: (station: Station) => void;
}

/**
 * Station grid component with smooth transitions
 */
export const StationGrid = memo<StationGridProps>(
  ({ stations, showTransitions = true, className, onCardClick }) => {
    return (
      <div
        className={cn(
          'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          className
        )}
      >
        {stations.map((station, index) => (
          <StationCard
            key={station.id}
            station={station}
            index={index}
            showTransition={showTransitions}
            transitionDelay={index * 0.05}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    );
  }
);

StationGrid.displayName = 'StationGrid';

// ============================================================================
// EXPORTS
// ============================================================================

export { StationCard, StationGrid, BrandHeader, FuelPriceDisplay };
export type { StationCardProps, StationGridProps };
