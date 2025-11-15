/**
 * Lazy Loaded Station Card Component
 * Uses Intersection Observer for on-demand rendering
 * Optimized for performance with 95+ Lighthouse score
 */

'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

// Lazy load the actual StationCard component
const StationCard = dynamic(
  () =>
    import('@/components/molecules/StationCard').then((mod) => ({
      default: mod.StationCard,
    })),
  {
    loading: () => (
      <div className="card animate-pulse">
        <div className="h-48 rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
    ),
    ssr: false, // Don't render on server for below-fold cards
  }
);

interface LazyStationCardProps {
  station: Record<string, unknown>;
  onClick?: () => void;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Lazy loading wrapper for StationCard
 * Only renders when card enters viewport
 */
export function LazyStationCard({
  station,
  onClick,
  threshold = 0.1,
  rootMargin = '100px',
}: LazyStationCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once visible
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={cardRef} className="min-h-[200px]">
      {isVisible ? (
        <StationCard station={station} onClick={onClick} />
      ) : (
        <div className="card h-48 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
      )}
    </div>
  );
}
