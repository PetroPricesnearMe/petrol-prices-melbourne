/**
 * Infinite Scroll Hook with React Query
 * 
 * Provides infinite scrolling functionality with smooth transitions
 * and optimized performance for directory listings
 * 
 * @module hooks/useInfiniteStations
 */

'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getAllStations } from '@/lib/data/stations';
import type { Station } from '@/types/station.d';

// ============================================================================
// TYPES
// ============================================================================

export interface InfiniteStationsFilters {
  search?: string;
  fuelType?: keyof Station['fuelPrices'] | 'all';
  brand?: string;
  suburb?: string;
  sortBy?: 'price-low' | 'price-high' | 'name' | 'suburb';
  priceMax?: number;
}

export interface InfiniteStationsOptions {
  pageSize?: number;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export interface InfiniteStationsResult {
  data: Station[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
  totalCount: number;
  loadedPages: number;
}

// ============================================================================
// INFINITE SCROLL HOOK
// ============================================================================

/**
 * Custom hook for infinite scrolling stations with smooth transitions
 */
export function useInfiniteStations(
  filters: InfiniteStationsFilters = {},
  options: InfiniteStationsOptions = {}
): InfiniteStationsResult {
  const {
    pageSize = 24,
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 10 * 60 * 1000, // 10 minutes
  } = options;

  const [loadedPages, setLoadedPages] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Debounce search filter to avoid excessive filtering on rapid input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Use debounced search in filters
  const effectiveFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

  // Fetch stations with infinite query
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['stations', 'infinite', effectiveFilters],
    queryFn: async ({ pageParam = 0 }) => {
      const allStations = await getAllStations();
      
      // Apply filters
      let filteredStations = [...allStations];
      
      // Search filter (using debounced value)
      if (effectiveFilters.search) {
        const search = effectiveFilters.search.toLowerCase();
        filteredStations = filteredStations.filter(
          (s) =>
            s.name?.toLowerCase().includes(search) ||
            s.address?.toLowerCase().includes(search) ||
            s.suburb?.toLowerCase().includes(search) ||
            s.brand?.toLowerCase().includes(search)
        );
      }

      // Brand filter
      if (effectiveFilters.brand && effectiveFilters.brand !== 'all') {
        filteredStations = filteredStations.filter((s) => s.brand === effectiveFilters.brand);
      }

      // Suburb filter
      if (effectiveFilters.suburb && effectiveFilters.suburb !== 'all') {
        filteredStations = filteredStations.filter((s) => s.suburb === effectiveFilters.suburb);
      }

      // Fuel type filter (only show stations with selected fuel type)
      if (effectiveFilters.fuelType && effectiveFilters.fuelType !== 'all') {
        filteredStations = filteredStations.filter(
          (s) => s.fuelPrices?.[effectiveFilters.fuelType as keyof Station['fuelPrices']] !== null
        );
      }

      // Price filter
      if (effectiveFilters.priceMax) {
        // If fuelType is 'all', check if any fuel price is within the max price
        if (effectiveFilters.fuelType === 'all') {
          filteredStations = filteredStations.filter((s) => {
            const prices = Object.values(s.fuelPrices || {});
            return prices.some((price) => price !== null && price <= effectiveFilters.priceMax!);
          });
        } else {
          filteredStations = filteredStations.filter((s) => {
            const price = s.fuelPrices?.[effectiveFilters.fuelType as keyof Station['fuelPrices']];
            return price !== null && price <= effectiveFilters.priceMax!;
          });
        }
      }

      // Sort
      if (effectiveFilters.sortBy) {
        filteredStations.sort((a, b) => {
          switch (effectiveFilters.sortBy) {
            case 'price-low': {
              // If fuelType is 'all', use the minimum price across all fuel types
              if (effectiveFilters.fuelType === 'all') {
                const pricesA = Object.values(a.fuelPrices || {}).filter((p): p is number => p !== null);
                const pricesB = Object.values(b.fuelPrices || {}).filter((p): p is number => p !== null);
                const minPriceA = pricesA.length > 0 ? Math.min(...pricesA) : Infinity;
                const minPriceB = pricesB.length > 0 ? Math.min(...pricesB) : Infinity;
                return minPriceA - minPriceB;
              } else {
                const priceA = a.fuelPrices?.[effectiveFilters.fuelType as keyof Station['fuelPrices']] || Infinity;
                const priceB = b.fuelPrices?.[effectiveFilters.fuelType as keyof Station['fuelPrices']] || Infinity;
                return priceA - priceB;
              }
            }
            case 'price-high': {
              // If fuelType is 'all', use the maximum price across all fuel types
              if (effectiveFilters.fuelType === 'all') {
                const pricesA = Object.values(a.fuelPrices || {}).filter((p): p is number => p !== null);
                const pricesB = Object.values(b.fuelPrices || {}).filter((p): p is number => p !== null);
                const maxPriceA = pricesA.length > 0 ? Math.max(...pricesA) : 0;
                const maxPriceB = pricesB.length > 0 ? Math.max(...pricesB) : 0;
                return maxPriceB - maxPriceA;
              } else {
                const priceA = a.fuelPrices?.[effectiveFilters.fuelType as keyof Station['fuelPrices']] || 0;
                const priceB = b.fuelPrices?.[effectiveFilters.fuelType as keyof Station['fuelPrices']] || 0;
                return priceB - priceA;
              }
            }
            case 'suburb':
              return a.suburb?.localeCompare(b.suburb || '') || a.name.localeCompare(b.name);
            case 'name':
            default:
              return a.name.localeCompare(b.name);
          }
        });
      }

      // Pagination
      const startIndex = pageParam * pageSize;
      const endIndex = startIndex + pageSize;
      const pageData = filteredStations.slice(startIndex, endIndex);

      return {
        data: pageData,
        nextCursor: endIndex < filteredStations.length ? pageParam + 1 : undefined,
        totalCount: filteredStations.length,
        hasMore: endIndex < filteredStations.length,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Flatten all pages data
  const allStations = data?.pages.flatMap((page) => page.data) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  // Update loaded pages count
  useEffect(() => {
    if (data?.pages) {
      setLoadedPages(data.pages.length);
    }
  }, [data?.pages]);

  return {
    data: allStations,
    isLoading,
    isError,
    error,
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    totalCount,
    loadedPages,
  };
}

// ============================================================================
// INTERSECTION OBSERVER HOOK
// ============================================================================

/**
 * Hook for detecting when user scrolls near the bottom
 */
export function useInfiniteScroll(
  callback: () => void,
  options: {
    threshold?: number;
    rootMargin?: string;
    enabled?: boolean;
  } = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true,
  } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && enabled) {
        callback();
      }
    },
    [callback, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin, enabled]);

  return elementRef;
}

// ============================================================================
// SMOOTH TRANSITIONS HOOK
// ============================================================================

/**
 * Hook for managing smooth transitions between content blocks
 */
export function useSmoothTransitions() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'up' | 'down'>('down');

  const startTransition = useCallback((direction: 'up' | 'down' = 'down') => {
    setTransitionDirection(direction);
    setIsTransitioning(true);
    
    // Reset transition state after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return {
    isTransitioning,
    transitionDirection,
    startTransition,
  };
}

// ============================================================================
// PERFORMANCE OPTIMIZATION HOOK
// ============================================================================

/**
 * Hook for optimizing performance with virtual scrolling concepts
 */
export function useVirtualizedInfiniteScroll(
  itemHeight: number = 200,
  containerHeight: number = 600,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const getVisibleRange = useCallback(
    (totalItems: number) => {
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      const endIndex = Math.min(
        totalItems - 1,
        Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
      );
      
      return { startIndex, endIndex };
    },
    [scrollTop, itemHeight, containerHeight, overscan]
  );

  return {
    containerRef,
    handleScroll,
    getVisibleRange,
    scrollTop,
  };
}

// ============================================================================
// LOADING STATES HOOK
// ============================================================================

/**
 * Hook for managing loading states and skeleton screens
 */
export function useLoadingStates() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const startInitialLoading = useCallback(() => {
    setIsInitialLoading(true);
    setLoadingProgress(0);
  }, []);

  const finishInitialLoading = useCallback(() => {
    setIsInitialLoading(false);
    setLoadingProgress(100);
  }, []);

  const startLoadingMore = useCallback(() => {
    setIsLoadingMore(true);
  }, []);

  const finishLoadingMore = useCallback(() => {
    setIsLoadingMore(false);
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setLoadingProgress(Math.min(100, Math.max(0, progress)));
  }, []);

  return {
    isInitialLoading,
    isLoadingMore,
    loadingProgress,
    startInitialLoading,
    finishInitialLoading,
    startLoadingMore,
    finishLoadingMore,
    updateProgress,
  };
}

// ============================================================================
// COMBINED INFINITE SCROLL HOOK
// ============================================================================

/**
 * Main hook that combines all infinite scroll functionality
 */
export function useAdvancedInfiniteStations(
  filters: InfiniteStationsFilters = {},
  options: InfiniteStationsOptions = {}
) {
  const infiniteQuery = useInfiniteStations(filters, options);
  const smoothTransitions = useSmoothTransitions();
  const loadingStates = useLoadingStates();
  const virtualizedScroll = useVirtualizedInfiniteScroll();

  const triggerRef = useInfiniteScroll(
    () => {
      if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
        smoothTransitions.startTransition('down');
        loadingStates.startLoadingMore();
        infiniteQuery.fetchNextPage();
      }
    },
    {
      threshold: 0.1,
      rootMargin: '200px',
      enabled: infiniteQuery.hasNextPage,
    }
  );

  // Update loading states based on query state
  useEffect(() => {
    if (infiniteQuery.isLoading) {
      loadingStates.startInitialLoading();
    } else {
      loadingStates.finishInitialLoading();
    }
  }, [infiniteQuery.isLoading, loadingStates]);

  useEffect(() => {
    if (infiniteQuery.isFetchingNextPage) {
      loadingStates.startLoadingMore();
    } else {
      loadingStates.finishLoadingMore();
    }
  }, [infiniteQuery.isFetchingNextPage, loadingStates]);

  return {
    ...infiniteQuery,
    ...smoothTransitions,
    ...loadingStates,
    ...virtualizedScroll,
    triggerRef,
  };
}
