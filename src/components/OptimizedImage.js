import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Lazy loading with IntersectionObserver
 * - Responsive images with srcset
 * - Loading placeholder
 * - Error handling
 * - Blur-up effect
 * - AVIF/WebP support with fallbacks
 * 
 * @example
 * <OptimizedImage
 *   src="/images/fuel-nozzles.jpg"
 *   alt="Fuel nozzles"
 *   width={800}
 *   height={600}
 *   priority={true}
 * />
 */
const OptimizedImage = ({
  src,
  alt = '',
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  objectFit = 'cover',
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Lazy loading with IntersectionObserver
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority]);

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc) return '';
    
    // Check if it's an SVG (no srcset needed)
    if (baseSrc.endsWith('.svg')) return '';
    
    const ext = baseSrc.split('.').pop();
    const baseUrl = baseSrc.replace(`.${ext}`, '');
    
    // Generate multiple sizes
    const sizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    return sizes
      .map((size) => `${baseUrl}-${size}w.${ext} ${size}w`)
      .join(', ');
  };

  // Generate WebP srcset
  const generateWebPSrcSet = (baseSrc) => {
    if (!baseSrc || baseSrc.endsWith('.svg')) return '';
    
    const ext = baseSrc.split('.').pop();
    const baseUrl = baseSrc.replace(`.${ext}`, '');
    
    const sizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    return sizes
      .map((size) => `${baseUrl}-${size}w.webp ${size}w`)
      .join(', ');
  };

  // Generate AVIF srcset (best compression)
  const generateAVIFSrcSet = (baseSrc) => {
    if (!baseSrc || baseSrc.endsWith('.svg')) return '';
    
    const ext = baseSrc.split('.').pop();
    const baseUrl = baseSrc.replace(`.${ext}`, '');
    
    const sizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
    return sizes
      .map((size) => `${baseUrl}-${size}w.avif ${size}w`)
      .join(', ');
  };

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  // Calculate aspect ratio for maintaining layout stability
  const aspectRatio = width && height ? (height / width) * 100 : null;

  return (
    <div
      ref={imgRef}
      className={`optimized-image-wrapper ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...(aspectRatio && {
          paddingBottom: `${aspectRatio}%`,
          height: 0,
        }),
      }}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && !hasError && (
        <div
          className="image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: blurDataURL
              ? `url(${blurDataURL})`
              : 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      )}

      {/* Actual image with modern format support */}
      {isInView && !hasError && (
        <picture>
          {/* AVIF - best compression (Chrome 85+, Edge 91+) */}
          {!src.endsWith('.svg') && (
            <source
              type="image/avif"
              srcSet={generateAVIFSrcSet(src)}
              sizes={sizes}
            />
          )}

          {/* WebP - good compression (Chrome 23+, Firefox 65+, Safari 14+) */}
          {!src.endsWith('.svg') && (
            <source
              type="image/webp"
              srcSet={generateWebPSrcSet(src)}
              sizes={sizes}
            />
          )}

          {/* Original format - fallback */}
          <img
            src={src}
            srcSet={!src.endsWith('.svg') ? generateSrcSet(src) : undefined}
            sizes={!src.endsWith('.svg') ? sizes : undefined}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              position: aspectRatio ? 'absolute' : 'relative',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit,
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
            {...props}
          />
        </picture>
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
  priority: PropTypes.bool,
  sizes: PropTypes.string,
  objectFit: PropTypes.oneOf(['contain', 'cover', 'fill', 'none', 'scale-down']),
  quality: PropTypes.number,
  placeholder: PropTypes.oneOf(['blur', 'empty']),
  blurDataURL: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default OptimizedImage;

