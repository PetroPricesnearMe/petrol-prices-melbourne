'use client';


import { Badge } from '@/components/atoms/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import type { PetrolStation } from '@/types/index';
import { formatDistance, formatPrice } from '@/utils/formatters';

export interface StationCardProps {
  station: PetrolStation;
  onClick?: () => void;
}

export function StationCard({ station, onClick }: StationCardProps) {
  const cheapestPrice = station.fuelPrices
    ? Math.min(...station.fuelPrices.map((fp) => fp.pricePerLiter))
    : null;

  return (
    <Card hover className="cursor-pointer touch-manipulation" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base sm:text-lg">{station.stationName}</CardTitle>
          {station.distance && (
            <Badge variant="info" size="sm" className="flex-shrink-0">
              {formatDistance(station.distance)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 sm:space-y-2">
          <p className="text-sm sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {station.address}, {station.city}
          </p>

          {cheapestPrice && (
            <div className="flex items-center justify-between rounded-lg bg-success-50 p-3 sm:p-2 dark:bg-success-900/20 min-h-[56px] sm:min-h-[auto]">
              <span className="text-sm sm:text-sm font-medium text-success-800 dark:text-success-300">
                From
              </span>
              <span className="text-xl sm:text-lg font-bold text-success-700 dark:text-success-400">
                {formatPrice(cheapestPrice)}
              </span>
            </div>
          )}

          {station.brand && station.brand.length > 0 && (
            <div className="flex flex-wrap gap-2 sm:gap-1">
              {station.brand.map((b, idx) => (
                <Badge key={idx} size="sm">
                  {b}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

