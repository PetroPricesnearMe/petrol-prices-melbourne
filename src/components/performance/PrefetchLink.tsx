/**
 * PrefetchLink Component
 * Enhanced Next.js Link with intelligent prefetching
 *
 * Automatically prefetches pages on hover/touch for faster navigation
 * Optimized for Vercel deployment with edge caching
 *
 * @example
 * ```tsx
 * <PrefetchLink href="/directory" prefetch="hover">
 *   Directory
 * </PrefetchLink>
 * ```
 */

'use client';

import Link from 'next/link';
import type { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface PrefetchLinkProps extends Omit<LinkProps, 'prefetch'> {
  /** Prefetch strategy */
  prefetch?: 'hover' | 'visible' | 'always' | 'never';
  /** Children */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Priority prefetch (for critical links) */
  priority?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Enhanced Link with intelligent prefetching
 */
export function PrefetchLink({
  href,
  prefetch = 'hover',
  priority = false,
  className,
  children,
  ...props
}: PrefetchLinkProps) {
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const prefetchedRef = useRef(false);

  // Prefetch on mount if strategy is 'always' or 'visible'
  useEffect(() => {
    if (prefetch === 'always' && !prefetchedRef.current) {
      router.prefetch(href.toString());
      prefetchedRef.current = true;
      return;
    }

    if (prefetch === 'visible' && typeof window !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !prefetchedRef.current) {
              router.prefetch(href.toString());
              prefetchedRef.current = true;
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // Start prefetching 50px before link is visible
        }
      );

      if (linkRef.current) {
        observer.observe(linkRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }

    return undefined;
  }, [href, prefetch, router]);

  // Handle hover prefetch
  const handleMouseEnter = () => {
    if (prefetch === 'hover' && !prefetchedRef.current) {
      router.prefetch(href.toString());
      prefetchedRef.current = true;
    }
  };

  // Handle touch start (mobile)
  const handleTouchStart = () => {
    if (prefetch === 'hover' && !prefetchedRef.current) {
      router.prefetch(href.toString());
      prefetchedRef.current = true;
    }
  };

  // Determine Next.js prefetch prop
  const nextPrefetch =
    prefetch === 'never' ? false : priority ? true : undefined;

  return (
    <Link
      ref={linkRef}
      href={href}
      prefetch={nextPrefetch}
      className={className}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleTouchStart}
      {...props}
    >
      {children}
    </Link>
  );
}

export default PrefetchLink;
