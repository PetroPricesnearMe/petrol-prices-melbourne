import PropTypes from 'prop-types';
import React from 'react';

import { useResponsive } from '../hooks/useResponsive';

/**
 * ResponsiveImage Component
 * Renders optimized images based on screen size
 * Provides art direction and resolution switching
 * 
 * @component
 * @example
 * <ResponsiveImage
 *   src="/images/hero.jpg"
 *   srcMobile="/images/hero-mobile.jpg"
 *   srcTablet="/images/hero-tablet.jpg"
 *   alt="Hero image"
 *   className="w-full h-auto"
 * />
 */
const ResponsiveImage = ({
  src,
  srcMobile,
  srcTablet,
  srcDesktop,
  srcXl,
  alt,
  className,
  loading,
  decoding,
  fetchpriority,
  width,
  height,
  onLoad,
  onError,
  ...props
}) => {
  const { isMobile, isTablet, isDesktop, isXlAndUp } = useResponsive();

  // Determine which image to use
  const getImageSrc = () => {
    if (isXlAndUp && srcXl) return srcXl;
    if (isDesktop && srcDesktop) return srcDesktop;
    if (isTablet && srcTablet) return srcTablet;
    if (isMobile && srcMobile) return srcMobile;
    return src;
  };

  const imageSrc = getImageSrc();

  return (
    <picture>
      {/* Provide sources for different screen sizes */}
      {srcXl && (
        <source
          media="(min-width: 1280px)"
          srcSet={srcXl}
        />
      )}
      {srcDesktop && (
        <source
          media="(min-width: 1024px)"
          srcSet={srcDesktop}
        />
      )}
      {srcTablet && (
        <source
          media="(min-width: 640px)"
          srcSet={srcTablet}
        />
      )}
      {srcMobile && (
        <source
          media="(max-width: 639px)"
          srcSet={srcMobile}
        />
      )}
      
      {/* Fallback image */}
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchpriority}
        width={width}
        height={height}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    </picture>
  );
};

ResponsiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  srcMobile: PropTypes.string,
  srcTablet: PropTypes.string,
  srcDesktop: PropTypes.string,
  srcXl: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  decoding: PropTypes.oneOf(['async', 'sync', 'auto']),
  fetchpriority: PropTypes.oneOf(['high', 'low', 'auto']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

ResponsiveImage.defaultProps = {
  srcMobile: null,
  srcTablet: null,
  srcDesktop: null,
  srcXl: null,
  className: '',
  loading: 'lazy',
  decoding: 'async',
  fetchpriority: 'auto',
  width: undefined,
  height: undefined,
  onLoad: undefined,
  onError: undefined,
};

export default ResponsiveImage;

