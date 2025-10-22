/**
 * StationCard Component (Organism)
 * 
 * Domain-specific card for displaying petrol station information
 */

import React from 'react';
import { Card, CardBody, CardFooter } from '../../molecules/Card';
import { Text } from '../../atoms/Text';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import type { PetrolStation } from '@/types';
import type { BaseProps } from '@/types';
import { cn } from '@/design-system/utils/styled';
import './StationCard.css';

export interface StationCardProps extends BaseProps {
  /** Station data */
  station: PetrolStation;
  /** Click handler */
  onClick?: () => void;
  /** View details handler */
  onViewDetails?: () => void;
  /** Get directions handler */
  onGetDirections?: () => void;
  /** Show compact version */
  compact?: boolean;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  onClick,
  onViewDetails,
  onGetDirections,
  compact = false,
  className,
  style,
  testId,
}) => {
  const {
    name,
    brand,
    address,
    distance,
    fuelPrices,
    isOpen,
    rating,
    amenities,
  } = station;

  // Find cheapest fuel price
  const cheapestPrice = fuelPrices.length > 0
    ? Math.min(...fuelPrices.map(fp => fp.price))
    : null;

  const classNames = cn(
    'station-card',
    compact && 'station-card--compact',
    className
  );

  return (
    <Card
      className={classNames}
      style={style}
      onClick={onClick}
      hoverable={!!onClick}
      elevation="sm"
      padding="none"
      testId={testId}
    >
      <CardBody className="station-card__body">
        {/* Header */}
        <div className="station-card__header">
          <div className="station-card__title-section">
            <Text as="h3" variant="h6" className="station-card__name">
              {name}
            </Text>
            {brand && (
              <Text variant="bodySmall" color="secondary" className="station-card__brand">
                {brand}
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

        {/* Status badges */}
        <div className="station-card__badges">
          {isOpen !== undefined && (
            <Badge
              variant={isOpen ? 'success' : 'error'}
              size="xs"
              dot
            >
              {isOpen ? 'Open' : 'Closed'}
            </Badge>
          )}
          {rating !== undefined && (
            <Badge variant="neutral" size="xs">
              ⭐ {rating.toFixed(1)}
            </Badge>
          )}
        </div>

        {/* Address */}
        <Text variant="bodySmall" color="secondary" className="station-card__address">
          {address.formatted || `${address.street}, ${address.city}, ${address.region}`}
        </Text>

        {/* Fuel Prices */}
        {!compact && fuelPrices.length > 0 && (
          <div className="station-card__prices">
            <Text variant="label" className="station-card__prices-title">
              Fuel Prices
            </Text>
            <div className="station-card__price-list">
              {fuelPrices.slice(0, 3).map((fuelPrice) => (
                <div key={fuelPrice.id} className="station-card__price-item">
                  <Text variant="bodySmall" color="secondary">
                    {fuelPrice.fuelType}
                  </Text>
                  <Text variant="body" weight="semibold">
                    ${fuelPrice.price.toFixed(2)}
                  </Text>
                </div>
              ))}
            </div>
            {fuelPrices.length > 3 && (
              <Text variant="caption" color="secondary">
                +{fuelPrices.length - 3} more
              </Text>
            )}
          </div>
        )}

        {/* Compact view: Show cheapest price */}
        {compact && cheapestPrice !== null && (
          <div className="station-card__cheap-price">
            <Text variant="caption" color="secondary">
              From
            </Text>
            <Text variant="h5" weight="bold" color="success">
              ${cheapestPrice.toFixed(2)}
            </Text>
          </div>
        )}

        {/* Amenities */}
        {!compact && amenities && (
          <div className="station-card__amenities">
            {amenities.hasCarWash && <span className="station-card__amenity" title="Car Wash">🚿</span>}
            {amenities.hasShop && <span className="station-card__amenity" title="Shop">🏪</span>}
            {amenities.hasRestrooms && <span className="station-card__amenity" title="Restrooms">🚻</span>}
            {amenities.hasEVCharging && <span className="station-card__amenity" title="EV Charging">⚡</span>}
            {amenities.has24Hours && <span className="station-card__amenity" title="24 Hours">🕐</span>}
            {amenities.hasCafe && <span className="station-card__amenity" title="Café">☕</span>}
          </div>
        )}
      </CardBody>

      {/* Actions */}
      {(onViewDetails || onGetDirections) && !compact && (
        <CardFooter className="station-card__footer">
          <div className="station-card__actions">
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
              >
                View Details
              </Button>
            )}
            {onGetDirections && (
              <Button
                variant="outlined"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onGetDirections();
                }}
              >
                Directions
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

