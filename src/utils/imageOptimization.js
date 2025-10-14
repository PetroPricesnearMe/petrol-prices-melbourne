/**
 * Image Optimization Utilities
 * Lazy loading, responsive images, and format optimization
 * @version 2.0.0
 */

/**
 * Generate srcset for responsive images
 * @param {string} imagePath - Base image path
 * @param {Array<number>} widths - Array of widths
 * @returns {string} srcset attribute value
 */
export const generateSrcSet = (imagePath, widths = [320, 640, 768, 1024, 1280]) => {
  const ext = imagePath.split('.').pop();
  const basePath = imagePath.replace(`.${ext}`, '');

  return widths
    .map(width => `${basePath}-${width}w.${ext} ${width}w`)
    .join(', ');
};

/**
 * Generate sizes attribute for responsive images
 * @param {Object} breakpoints - Breakpoint configuration
 * @returns {string} sizes attribute value
 */
export const generateSizes = (breakpoints = {
  mobile: '100vw',
  tablet: '50vw',
  desktop: '33vw'
}) => {
  return [
    `(max-width: 768px) ${breakpoints.mobile || '100vw'}`,
    `(max-width: 1024px) ${breakpoints.tablet || '50vw'}`,
    breakpoints.desktop || '33vw'
  ].join(', ');
};

/**
 * Check if WebP is supported
 * @returns {Promise<boolean>} True if WebP is supported
 */
export const isWebPSupported = () => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
};

/**
 * Get optimized image URL
 * @param {string} imagePath - Original image path
 * @param {Object} options - Optimization options
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (imagePath, options = {}) => {
  const {
    width,
    height,
    quality = 85,
    format = 'auto',
  } = options;

  // If using CDN or image optimization service, modify URL here
  // For now, return original path
  // TODO: Integrate with image CDN (Cloudinary, Imgix, etc.)

  let url = imagePath;
  const params = new URLSearchParams();

  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (quality) params.append('q', quality);
  if (format && format !== 'auto') params.append('fm', format);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  return url;
};

/**
 * Lazy load image with IntersectionObserver
 * @param {HTMLImageElement} img - Image element
 * @param {Object} options - Observer options
 */
export const lazyLoadImage = (img, options = {}) => {
  const {
    rootMargin = '200px',
    threshold = 0.01,
  } = options;

  // Skip if already loaded
  if (img.complete) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const image = entry.target;

        // Load the image
        if (image.dataset.src) {
          image.src = image.dataset.src;
        }

        if (image.dataset.srcset) {
          image.srcset = image.dataset.srcset;
        }

        // Remove data attributes and placeholder
        image.classList.remove('lazy-loading');
        image.classList.add('lazy-loaded');

        // Stop observing
        obs.unobserve(image);
      }
    });
  }, {
    rootMargin,
    threshold,
  });

  observer.observe(img);
};

/**
 * Preload critical images
 * @param {Array<string>} imageUrls - Array of image URLs to preload
 */
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Create low-quality image placeholder (LQIP)
 * @param {string} imagePath - Image path
 * @param {number} quality - LQIP quality (1-100)
 * @returns {string} LQIP data URL
 */
export const createLQIP = async (imagePath, quality = 10) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set small dimensions for placeholder
      const width = 20;
      const height = (img.height / img.width) * width;

      canvas.width = width;
      canvas.height = height;

      // Draw blurred image
      ctx.filter = 'blur(10px)';
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
      resolve(dataUrl);
    };

    img.onerror = reject;
    img.src = imagePath;
  });
};

/**
 * Image component wrapper with optimization
 * @param {Object} props - Image properties
 * @returns {Object} Optimized image props
 */
export const createOptimizedImageProps = (props) => {
  const {
    src,
    alt,
    width,
    height,
    lazy = true,
    quality = 85,
    responsive = true,
  } = props;

  const optimizedProps = {
    alt: alt || '',
    loading: lazy ? 'lazy' : 'eager',
    decoding: 'async',
  };

  // Add responsive attributes
  if (responsive && width) {
    optimizedProps['data-srcset'] = generateSrcSet(src);
    optimizedProps['data-sizes'] = generateSizes();
  }

  // Add optimized source
  if (lazy) {
    optimizedProps['data-src'] = getOptimizedImageUrl(src, { width, height, quality });
    optimizedProps.className = 'lazy-loading';
    // Use placeholder
    optimizedProps.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
  } else {
    optimizedProps.src = getOptimizedImageUrl(src, { width, height, quality });
  }

  // Add dimensions to prevent layout shift
  if (width) optimizedProps.width = width;
  if (height) optimizedProps.height = height;

  return optimizedProps;
};

/**
 * Initialize lazy loading for all images with data-src attribute
 */
export const initializeLazyLoading = () => {
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => lazyLoadImage(img));
  } else {
    // Fallback: load all images immediately
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      if (img.dataset.src) img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    });
  }
};

/**
 * Monitor image loading performance
 * @param {HTMLImageElement} img - Image element
 * @param {Function} callback - Callback with performance data
 */
export const monitorImageLoad = (img, callback) => {
  const startTime = performance.now();

  img.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    const size = img.naturalWidth * img.naturalHeight;

    callback({
      src: img.src,
      loadTime,
      width: img.naturalWidth,
      height: img.naturalHeight,
      size,
    });
  });

  img.addEventListener('error', () => {
    callback({
      src: img.src,
      error: true,
      loadTime: performance.now() - startTime,
    });
  });
};

const imageOptimization = {
  generateSrcSet,
  generateSizes,
  isWebPSupported,
  getOptimizedImageUrl,
  lazyLoadImage,
  preloadImages,
  createLQIP,
  createOptimizedImageProps,
  initializeLazyLoading,
  monitorImageLoad,
};

export default imageOptimization;

