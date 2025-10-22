/**
 * Optimized StationCard Component
 * 
 * Performance-optimized version with React.memo and proper memoization
 */

import React, { memo, useCallback, useMemo } from 'react';
import { Card, CardBody, CardFooter } from '../../molecules/Card';
import { Text } from '../../atoms/Text';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import type { PetrolStation } from '@/types';
import { cn } from '@/design-system/utils/styled';
import './StationCard.css';

export interface StationCardOptimizedProps {
  /** Station data */
  station: PetrolStation;
  /** Click handler */
  onClick?: (stationId: number) => void;
  /** View details handler */
  onViewDetails?: (stationId: number) => void;
  /** Get directions handler */
  onGetDirections?: (stationId: number) => void;
  /** Show compact version */
  compact?: boolean;
  /** Custom class name */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

// Memoized price display component
const PriceDisplay = memo<{ prices: any[]; compact: boolean }>(({ prices, compact }) => {
  const cheapestPrice = useMemo(() => {
    if (prices.length === 0) return null;
    return Math.min(...prices.map(fp => fp.pricePerLiter));
  }, [prices]);

  if (compact && cheapestPrice !== null) {
    return (
      <div className="station-card__cheap-price">
        <Text variant="caption" color="secondary">
          From
        </Text>
        <Text variant="h5" weight="bold" color="success">
          ${cheapestPrice.toFixed(2)}
        </Text>
      </div>
    );
  }

  if (!compact && prices.length > 0) {
    return (
      <div className="station-card__prices">
        <Text variant="label" className="station-card__prices-title">
          Fuel Prices
        </Text>
        <div className="station-card__price-list">
          {prices.slice(0, 3).map((fuelPrice) => (
            <div key={fuelPrice.id} className="station-card__price-item">
              <Text variant="bodySmall" color="secondary">
                {fuelPrice.fuelType}
              </Text>
              <Text variant="body" weight="semibold">
                ${fuelPrice.pricePerLiter.toFixed(2)}
              </Text>
            </div>
          ))}
        </div>
        {prices.length > 3 && (
          <Text variant="caption" color="secondary">
            +{prices.length - 3} more
          </Text>
        )}
      </div>
    );
  }

  return null;
});

PriceDisplay.displayName = 'PriceDisplay';

// Memoized station header component
const StationHeader = memo<{
  stationName: string;
  brand?: string[];
  distance?: number;
}>(({ stationName, brand, distance }) => (
  <div className="station-card__header">
    <div className="station-card__title-section">
      <Text as="h3" variant="h6" className="station-card__name">
        {stationName}
      </Text>
      {brand && brand.length > 0 && (
        <Text variant="bodySmall" color="secondary" className="station-card__brand">
          {brand.join(', ')}
        </Text>
      )}
    </div>

    {distance !== undefined && (
      <div className="station-card__distance">
        <Text variant="bodySmall" weight="semibold" color="primary">
          {distance.toFixed(1)} km
        </Text>
      </div>
    )}
  </div>
));

StationHeader.displayName = 'StationHeader';

// Main component
const StationCardOptimizedComponent: React.FC<StationCardOptimizedProps> = ({
  station,
  onClick,
  onViewDetails,
  onGetDirections,
  compact = false,
  className,
  style,
}) => {
  const {
    id,
    stationName,
    brand,
    address,
    city,
    region,
    distance,
    fuelPrices = [],
  } = station;

  // Memoize formatted address
  const formattedAddress = useMemo(
    () => `${address}, ${city}, ${region}`,
    [address, city, region]
  );

  // Memoize click handlers with useCallback
  const handleClick = useCallback(() => {
    onClick?.(id);
  }, [onClick, id]);

  const handleViewDetails = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onViewDetails?.(id);
    },
    [onViewDetails, id]
  );

  const handleGetDirections = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onGetDirections?.(id);
    },
    [onGetDirections, id]
  );

  const classNames = useMemo(
    () => cn('station-card', compact && 'station-card--compact', className),
    [compact, className]
  );

  return (
    <Card
      className={classNames}
      style={style}
      onClick={onClick ? handleClick : undefined}
      hoverable={!!onClick}
      elevation="sm"
      padding="none"
    >
      <CardBody className="station-card__body">
        <StationHeader stationName={stationName} brand={brand} distance={distance} />

        {/* Address */}
        <Text variant="bodySmall" color="secondary" className="station-card__address">
          {formattedAddress}
        </Text>

        {/* Fuel Prices */}
        <PriceDisplay prices={fuelPrices} compact={compact} />
      </CardBody>

      {/* Actions */}
      {(onViewDetails || onGetDirections) && !compact && (
        <CardFooter className="station-card__footer">
          <div className="station-card__actions">
            {onViewDetails && (
              <Button variant="ghost" size="sm" onClick={handleViewDetails}>
                View Details
              </Button>
            )}
            {onGetDirections && (
              <Button variant="outlined" size="sm" onClick={handleGetDirections}>
                Directions
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

// Custom comparison function for memo
const areEqual = (
  prevProps: StationCardOptimizedProps,
  nextProps: StationCardOptimizedProps
): boolean => {
  // Compare primitive props
  if (
    prevProps.compact !== nextProps.compact ||
    prevProps.className !== nextProps.className ||
    prevProps.onClick !== nextProps.onClick ||
    prevProps.onViewDetails !== nextProps.onViewDetails ||
    prevProps.onGetDirections !== nextProps.onGetDirections
  ) {
    return false;
  }

  // Compare station object (shallow comparison of relevant fields)
  const prevStation = prevProps.station;
  const nextStation = nextProps.station;

  return (
    prevStation.id === nextStation.id &&
    prevStation.stationName === nextStation.stationName &&
    prevStation.address === nextStation.address &&
    prevStation.distance === nextStation.distance &&
    prevStation.fuelPrices?.length === nextStation.fuelPrices?.length
  );
};

export const StationCardOptimized = memo(StationCardOptimizedComponent, areEqual);

