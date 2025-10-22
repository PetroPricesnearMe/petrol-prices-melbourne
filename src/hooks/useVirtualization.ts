/**
 * Virtualization Hook
 * 
 * Efficient rendering of large lists using virtual scrolling
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

export interface VirtualizationOptions {
  /** Total number of items */
  itemCount: number;
  /** Height of each item in pixels */
  itemHeight: number;
  /** Number of items to render outside visible area (buffer) */
  overscan?: number;
  /** Container height in pixels */
  containerHeight: number;
  /** Enable smooth scrolling */
  smoothScrolling?: boolean;
}

export interface VirtualizationResult {
  /** Items to render */
  virtualItems: Array<{
    index: number;
    start: number;
    size: number;
  }>;
  /** Total height of the list */
  totalHeight: number;
  /** Scroll to index */
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end') => void;
  /** Container ref */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Content style */
  contentStyle: React.CSSProperties;
}

export function useVirtualization({
  itemCount,
  itemHeight,
  overscan = 3,
  containerHeight,
  smoothScrolling = true,
}: VirtualizationOptions): VirtualizationResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate total height
  const totalHeight = useMemo(() => itemCount * itemHeight, [itemCount, itemHeight]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight);

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(itemCount - 1, endIndex + overscan),
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, itemCount]);

  // Generate virtual items
  const virtualItems = useMemo(() => {
    const items = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      items.push({
        index: i,
        start: i * itemHeight,
        size: itemHeight,
      });
    }
    return items;
  }, [visibleRange, itemHeight]);

  // Handle scroll
  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  // Scroll to index
  const scrollToIndex = useCallback(
    (index: number, align: 'start' | 'center' | 'end' = 'start') => {
      if (!containerRef.current) return;

      let scrollTop = index * itemHeight;

      if (align === 'center') {
        scrollTop -= containerHeight / 2 - itemHeight / 2;
      } else if (align === 'end') {
        scrollTop -= containerHeight - itemHeight;
      }

      containerRef.current.scrollTo({
        top: Math.max(0, Math.min(scrollTop, totalHeight - containerHeight)),
        behavior: smoothScrolling ? 'smooth' : 'auto',
      });
    },
    [itemHeight, containerHeight, totalHeight, smoothScrolling]
  );

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return {
    virtualItems,
    totalHeight,
    scrollToIndex,
    containerRef,
    contentStyle: {
      height: `${totalHeight}px`,
      position: 'relative',
    },
  };
}

/**
 * Dynamic virtualization for variable height items
 */
export interface DynamicVirtualizationOptions {
  itemCount: number;
  estimatedItemHeight: number;
  containerHeight: number;
  overscan?: number;
  getItemHeight: (index: number) => number;
}

export function useDynamicVirtualization({
  itemCount,
  estimatedItemHeight,
  containerHeight,
  overscan = 3,
  getItemHeight,
}: DynamicVirtualizationOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const measurementsCache = useRef<Map<number, number>>(new Map());

  // Calculate item offsets
  const itemOffsets = useMemo(() => {
    const offsets = [0];
    for (let i = 0; i < itemCount; i++) {
      const height = measurementsCache.current.get(i) || estimatedItemHeight;
      offsets.push(offsets[i] + height);
    }
    return offsets;
  }, [itemCount, estimatedItemHeight]);

  const totalHeight = itemOffsets[itemOffsets.length - 1];

  // Find visible range using binary search
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(
      0,
      itemOffsets.findIndex((offset) => offset >= scrollTop) - 1 - overscan
    );

    const endIndex = Math.min(
      itemCount - 1,
      itemOffsets.findIndex((offset) => offset >= scrollTop + containerHeight) + overscan
    );

    return { start: startIndex, end: endIndex };
  }, [scrollTop, itemOffsets, containerHeight, overscan, itemCount]);

  // Generate virtual items
  const virtualItems = useMemo(() => {
    const items = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      items.push({
        index: i,
        start: itemOffsets[i],
        size: getItemHeight(i),
      });
    }
    return items;
  }, [visibleRange, itemOffsets, getItemHeight]);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    virtualItems,
    totalHeight,
    containerRef,
    contentStyle: {
      height: `${totalHeight}px`,
      position: 'relative',
    },
    measureItem: (index: number, height: number) => {
      measurementsCache.current.set(index, height);
    },
  };
}

