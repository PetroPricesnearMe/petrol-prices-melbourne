'use client';

import Link from 'next/link';

import { Badge } from '@/components/atoms/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { getStationUrl } from '@/lib/seo/station-seo';
import type { PetrolStation } from '@/types/index';
import { formatDistance } from '@/lib/utils/distance';
import { formatPriceCentsPerLiter } from '@/lib/utils/price';

export interface StationCardProps {
  station: PetrolStation;
  onClick?: () => void;
}

/**
 * Station Card Component
 * 
 * A compact card component displaying essential station information for use in grids and lists.
 * 
 * Current behavior:
 * - Calculates cheapest price by finding minimum across all fuelPrices array items
 * - Displays distance badge in header if distance data is available
 * - Shows station name as card title with responsive text sizing (base on mobile, lg on desktop)
 * - Address and city are displayed together in a single line
 * - Cheapest price is prominently displayed in a success-colored box with "From" label
 * - Brand badges are rendered as a flex wrap container, allowing multiple brands per station
 * - Card has hover effect and touch-manipulation CSS for better mobile interaction
 * - Entire card is clickable via onClick handler
 * - Uses responsive spacing (space-y-3 on mobile, space-y-2 on desktop)
 * - Price box has minimum height on mobile (56px) for consistent touch targets
 */
export function StationCard({ station, onClick }: StationCardProps) {
  const cheapestPrice = station.fuelPrices
    ? Math.min(...station.fuelPrices.map((fp) => fp.pricePerLiter))
    : null;

  const handleClick = (_e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={getStationUrl(station)} className="block h-full" onClick={handleClick}>
      <Card hover className="cursor-pointer touch-manipulation h-full">
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
                {formatPriceCentsPerLiter(cheapestPrice)}
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
    </Link>
  );
}

