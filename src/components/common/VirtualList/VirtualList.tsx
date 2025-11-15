/**
 * Virtual List Component
 *
 * Efficiently renders large lists using virtualization
 */

import React, { memo } from 'react';

import { useVirtualization } from '@/hooks/useVirtualization';

export interface VirtualListProps<T> {
  /** Array of items to render */
  items: T[];
  /** Height of each item in pixels */
  itemHeight: number;
  /** Height of the container in pixels */
  height: number;
  /** Width of the container */
  width?: string | number;
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Number of items to render outside visible area */
  overscan?: number;
  /** CSS class for container */
  className?: string;
  /** Loading state */
  loading?: boolean;
  /** Empty state */
  emptyMessage?: React.ReactNode;
  /** Unique key extractor */
  getItemKey: (item: T, index: number) => string | number;
}

function VirtualListComponent<T>({
  items,
  itemHeight,
  height,
  width = '100%',
  renderItem,
  overscan = 3,
  className = '',
  loading = false,
  emptyMessage = 'No items to display',
  getItemKey,
}: VirtualListProps<T>) {
  const {
    virtualItems,
    totalHeight: _totalHeight,
    containerRef,
    contentStyle,
  } = useVirtualization({
    itemCount: items.length,
    itemHeight,
    containerHeight: height,
    overscan,
  });

  if (loading) {
    return (
      <div
        style={{
          height,
          width,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          height,
          width,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#757575',
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height,
        width,
        overflow: 'auto',
        position: 'relative',
        willChange: 'transform',
      }}
    >
      <div style={contentStyle}>
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          const key = getItemKey(item, virtualItem.index);

          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${itemHeight}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderItem(item, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export const VirtualList = memo(
  VirtualListComponent
) as typeof VirtualListComponent;
