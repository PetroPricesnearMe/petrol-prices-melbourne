/**
 * Lazy Load Component
 * 
 * Lazy loads components when they enter the viewport
 */

import React, { Suspense, ComponentType } from 'react';
import { useIntersectionObserver } from '@/hooks/usePerformance';

export interface LazyLoadProps {
  /** Component to lazy load */
  children: React.ReactNode;
  /** Fallback to show while loading */
  fallback?: React.ReactNode;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection observer */
  threshold?: number;
  /** Once loaded, keep it mounted */
  keepMounted?: boolean;
  /** Custom placeholder height */
  height?: string | number;
  /** Custom class name */
  className?: string;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  fallback = <div>Loading...</div>,
  rootMargin = '50px',
  threshold = 0.01,
  keepMounted = true,
  height = 'auto',
  className = '',
}) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    rootMargin,
    threshold,
  });

  const [hasLoaded, setHasLoaded] = React.useState(false);

  React.useEffect(() => {
    if (isIntersecting && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isIntersecting, hasLoaded]);

  const shouldRender = keepMounted ? hasLoaded : isIntersecting;

  return (
    <div ref={ref} className={className} style={{ minHeight: height }}>
      {shouldRender ? children : fallback}
    </div>
  );
};

/**
 * HOC to lazy load a component
 */
export function withLazyLoad<P extends object>(
  Component: ComponentType<P>,
  options?: Omit<LazyLoadProps, 'children'>
): React.FC<P> {
  return (props: P) => (
    <LazyLoad {...options}>
      <Component {...props} />
    </LazyLoad>
  );
}

/**
 * Image lazy loading component
 */
export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  rootMargin?: string;
  threshold?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  rootMargin = '50px',
  threshold = 0.01,
  className = '',
  style,
  ...imgProps
}) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    rootMargin,
    threshold,
  });

  const [imageSrc, setImageSrc] = React.useState(placeholderSrc || '');
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (isIntersecting && !isLoaded) {
      setImageSrc(src);
    }
  }, [isIntersecting, src, isLoaded]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <img
      ref={ref}
      src={imageSrc}
      alt={alt}
      onLoad={handleLoad}
      className={className}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0.5,
        transition: 'opacity 0.3s ease-in-out',
      }}
      loading="lazy"
      {...imgProps}
    />
  );
};

