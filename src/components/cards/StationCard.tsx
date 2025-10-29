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
import { cn } from '@/utils/cn';
import type { Station } from '@/types/station';

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
  const brandMap: Record<string, { name: string; logo: string; color: string; fallback: string }> = {
    'BP': { name: 'BP', logo: '/images/brands/bp.png', color: '#00A651', fallback: '#00A651' },
    'Shell': { name: 'Shell', logo: '/images/brands/shell.png', color: '#FFD700', fallback: '#FFD700' },
    'Caltex': { name: 'Caltex', logo: '/images/brands/caltex.png', color: '#FF6B35', fallback: '#FF6B35' },
    '7-Eleven': { name: '7-Eleven', logo: '/images/brands/7eleven.png', color: '#FF6900', fallback: '#FF6900' },
    'Coles Express': { name: 'Coles Express', logo: '/images/brands/coles.png', color: '#E31837', fallback: '#E31837' },
    'Woolworths': { name: 'Woolworths', logo: '/images/brands/woolworths.png', color: '#1B5E20', fallback: '#1B5E20' },
    'United': { name: 'United', logo: '/images/brands/united.png', color: '#1976D2', fallback: '#1976D2' },
    'Puma': { name: 'Puma', logo: '/images/brands/puma.png', color: '#E91E63', fallback: '#E91E63' },
  };
  return brandMap[brand] || { name: brand, logo: '/images/brands/default-logo.svg', color: '#6B7280', fallback: '#6B7280' };
}

/**
 * Get brand CSS class
 */
function getBrandClass(brand: string) {
  const brandClassMap: Record<string, string> = {
    'BP': 'badge-success',
    'Shell': 'badge-warning',
    'Caltex': 'badge-error',
    '7-Eleven': 'badge-primary',
    'Coles Express': 'badge-error',
    'Woolworths': 'badge-success',
    'United': 'badge-primary',
    'Puma': 'badge-secondary',
  };
  return brandClassMap[brand] || 'badge-secondary';
}

/**
 * Get price color based on value
 */
function getPriceColor(price: number | null): string {
  if (price === null) return 'text-gray-400';
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
const BrandHeader = memo<BrandHeaderProps>(({ brand, brandLogo, verified, className }) => {
  const brandInfo = getBrandInfo(brand);
  const brandClass = getBrandClass(brand);

  return (
    <div
      className={cn(
        'relative h-20 sm:h-24 flex items-center justify-center flex-shrink-0',
        'bg-gradient-to-br from-gray-50 to-gray-100',
        'dark:from-gray-800 dark:to-gray-900',
        brandClass,
        className
      )}
      data-brand-color={brandInfo.color}
      data-brand-fallback={brandInfo.fallback}
    >
      <div className="relative w-24 sm:w-32 h-12 sm:h-16">
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
        <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-white dark:bg-gray-800 rounded-full p-0.5 sm:p-1 shadow-sm">
          <span className="text-success-600 text-sm sm:text-lg" title="Verified">✓</span>
        </div>
      )}
    </div>
  );
});

BrandHeader.displayName = 'BrandHeader';

/**
 * Fuel price display component
 */
const FuelPriceDisplay = memo<FuelPriceDisplayProps>(({ fuelPrices, selectedFuelType, className }) => {
  if (!fuelPrices) return null;

  return (
    <div className={cn('space-y-1.5 sm:space-y-2', className)}>
      {Object.entries(fuelPrices).map(([type, price]) => {
        if (price === null) return null;
        const isSelected = type === selectedFuelType;

        return (
          <div
            key={type}
            className={cn(
              'flex justify-between items-center',
              isSelected && 'font-semibold'
            )}
          >
            <span className="text-gray-600 dark:text-gray-400 capitalize text-xs sm:text-sm">
              {type === 'premium95' ? 'Premium 95' :
               type === 'premium98' ? 'Premium 98' :
               type}
            </span>
            <span className={cn('text-sm sm:text-lg font-bold', getPriceColor(price))}>
              {price.toFixed(1)}¢
            </span>
          </div>
        );
      })}
    </div>
  );
});

FuelPriceDisplay.displayName = 'FuelPriceDisplay';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Enhanced Station Card Component
 */
export const StationCard = memo<StationCardProps>(({
  station,
  index = 0,
  showTransition = true,
  transitionDelay = 0,
  className,
  onCardClick,
}) => {
  const brandInfo = getBrandInfo(station.brand);
  const brandClass = getBrandClass(station.brand);

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(station);
    }
  };

  const cardContent = (
    <article
      className={cn(
        'bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200',
        'hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300',
        'print-avoid-break h-full flex flex-col',
        className
      )}
      itemScope
      itemType="https://schema.org/GasStation"
      onClick={handleCardClick}
    >
      {/* Brand Header */}
      <BrandHeader
        brand={station.brand}
        brandLogo={station.brandLogo}
        verified={station.verified}
      />

      {/* Station Info */}
      <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight"
            itemProp="name"
          >
            {station.name}
          </h3>
        </div>
        <span className={cn("badge text-xs", brandClass)}>
          {station.brand}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4 flex-grow">
        {/* Address */}
        <div
          className="text-xs sm:text-sm text-gray-600 dark:text-gray-400"
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
          <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
      <div className="p-4 sm:p-5 lg:p-6 border-t border-gray-200 dark:border-gray-700 print-hidden flex-shrink-0">
        <Link
          href={`/stations/${station.id}`}
          className="btn btn-primary w-full btn-sm text-xs sm:text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          View Details →
        </Link>
      </div>
    </article>
  );

  if (showTransition) {
    return (
      <ScaleTransition
        delay={transitionDelay + (index * 0.05)}
        duration={0.3}
        className="h-full"
      >
        {cardContent}
      </ScaleTransition>
    );
  }

  return cardContent;
});

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
export const StationGrid = memo<StationGridProps>(({
  stations,
  showTransitions = true,
  className,
  onCardClick,
}) => {
  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
      className
    )}>
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
});

StationGrid.displayName = 'StationGrid';

// ============================================================================
// EXPORTS
// ============================================================================

export { StationCard, StationGrid, BrandHeader, FuelPriceDisplay };
export type { StationCardProps, StationGridProps };
