/**
 * Virtualized Station List Component
 *
 * Efficiently renders large lists of stations using virtualization
 */

import React, { memo, useCallback, useMemo } from 'react';
import { VirtualList } from '../../common/VirtualList';
import { StationCardOptimized } from '../StationCard/StationCard.optimized';
import type { PetrolStation } from '@/types';

export interface StationListVirtualizedProps {
  /** Array of stations */
  stations: PetrolStation[];
  /** Height of container */
  height: number;
  /** Height of each station card */
  itemHeight?: number;
  /** Loading state */
  loading?: boolean;
  /** Click handler */
  onStationClick?: (stationId: number) => void;
  /** View details handler */
  onViewDetails?: (stationId: number) => void;
  /** Get directions handler */
  onGetDirections?: (stationId: number) => void;
  /** Compact mode */
  compact?: boolean;
  /** Empty message */
  emptyMessage?: React.ReactNode;
}

const StationListVirtualizedComponent: React.FC<StationListVirtualizedProps> = ({
  stations,
  height,
  itemHeight = 200,
  loading = false,
  onStationClick,
  onViewDetails,
  onGetDirections,
  compact = false,
  emptyMessage = 'No stations found',
}) => {
  // Memoize render function
  const renderStation = useCallback(
    (station: PetrolStation, index: number) => (
      <StationCardOptimized
        station={station}
        onClick={onStationClick}
        onViewDetails={onViewDetails}
        onGetDirections={onGetDirections}
        compact={compact}
      />
    ),
    [onStationClick, onViewDetails, onGetDirections, compact]
  );

  // Memoize key extractor
  const getItemKey = useCallback(
    (station: PetrolStation, index: number) => station.id,
    []
  );

  return (
    <VirtualList
      items={stations}
      itemHeight={itemHeight}
      height={height}
      renderItem={renderStation}
      getItemKey={getItemKey}
      loading={loading}
      emptyMessage={emptyMessage}
      overscan={2}
    />
  );
};

export const StationListVirtualized = memo(StationListVirtualizedComponent);
