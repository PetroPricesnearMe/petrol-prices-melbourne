/**
 * Bundle Optimization Utilities
 * Code splitting, tree-shaking, and chunk management
 */

/**
 * Dynamic import wrapper with error handling
 */
export const lazyLoad = (importFn, fallback = null) => {
  return async () => {
    try {
      const module = await importFn();
      return module;
    } catch (error) {
      console.error('[Bundle] Dynamic import failed:', error);

      if (fallback) {
        return fallback;
      }

      throw error;
    }
  };
};

/**
 * Preload component for faster navigation
 */
export const preloadComponent = (importFn) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFn().catch(err => console.warn('[Bundle] Preload failed:', err));
    });
  }
};

/**
 * Load component on hover (prefetch on intent)
 */
export const prefetchOnHover = (element, importFn) => {
  let loaded = false;

  const handleMouseEnter = () => {
    if (!loaded) {
      loaded = true;
      importFn().catch(err => console.warn('[Bundle] Prefetch failed:', err));
    }
  };

  element.addEventListener('mouseenter', handleMouseEnter, { once: true });
  element.addEventListener('touchstart', handleMouseEnter, { once: true });

  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('touchstart', handleMouseEnter);
  };
};

/**
 * Chunk loading strategy
 * Prioritize critical chunks
 */
export const loadChunks = async (chunks = []) => {
  const critical = chunks.filter(c => c.critical);
  const nonCritical = chunks.filter(c => !c.critical);

  // Load critical chunks first
  await Promise.all(
    critical.map(chunk => chunk.load())
  );

  // Load non-critical chunks when idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      Promise.all(
        nonCritical.map(chunk => chunk.load())
      );
    });
  } else {
    setTimeout(() => {
      Promise.all(
        nonCritical.map(chunk => chunk.load())
      );
    }, 1000);
  }
};

/**
 * Monitor chunk loading performance
 */
export const monitorChunkLoading = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('.chunk.')) {
          console.log(`[Bundle] Chunk loaded: ${entry.name.split('/').pop()}`,
            `(${(entry.duration).toFixed(2)}ms)`);
        }
      }
    });

    observer.observe({ type: 'resource', buffered: true });
  }
};

/**
 * Analyze bundle composition
 */
export const analyzeBundleComposition = () => {
  if (!performance.getEntriesByType) return null;

  const resources = performance.getEntriesByType('resource');
  const chunks = resources.filter(r => r.name.includes('.chunk.js'));

  const analysis = {
    totalChunks: chunks.length,
    totalSize: chunks.reduce((sum, chunk) => sum + (chunk.transferSize || 0), 0),
    chunks: chunks.map(chunk => ({
      name: chunk.name.split('/').pop(),
      size: ((chunk.transferSize || 0) / 1024).toFixed(2) + ' KB',
      duration: chunk.duration.toFixed(2) + ' ms'
    }))
  };

  console.table(analysis.chunks);
  console.log(`[Bundle] Total: ${(analysis.totalSize / 1024).toFixed(2)} KB across ${analysis.totalChunks} chunks`);

  return analysis;
};

/**
 * Tree-shaking helper
 * Import only specific functions from libraries
 */
export const importSpecific = async (modulePath, exports = []) => {
  try {
    const module = await import(modulePath);

    if (exports.length === 0) {
      return module;
    }

    // Return only requested exports
    const specific = {};
    exports.forEach(exportName => {
      if (exportName in module) {
        specific[exportName] = module[exportName];
      }
    });

    return specific;
  } catch (error) {
    console.error('[Bundle] Import failed:', error);
    throw error;
  }
};

/**
 * Defer third-party scripts
 */
export const deferScript = (src, attributes = {}) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.async = attributes.async || false;

    // Add custom attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key !== 'async' && key !== 'defer') {
        script.setAttribute(key, value);
      }
    });

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    // Load when idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        document.body.appendChild(script);
      });
    } else {
      setTimeout(() => {
        document.body.appendChild(script);
      }, 1000);
    }
  });
};

/**
 * Load third-party widgets on interaction
 */
export const loadOnInteraction = (scriptSrc, triggerElement, options = {}) => {
  let loaded = false;

  const load = () => {
    if (!loaded) {
      loaded = true;
      deferScript(scriptSrc, options);
    }
  };

  // Load on first interaction
  const events = ['mouseenter', 'click', 'touchstart', 'scroll'];

  events.forEach(eventType => {
    triggerElement.addEventListener(eventType, load, { once: true, passive: true });
  });

  // Fallback: load after 5 seconds
  setTimeout(load, 5000);
};

/**
 * Critical CSS extraction
 * Extract above-the-fold CSS for inline inclusion
 */
export const extractCriticalCSS = (selector = 'above-fold') => {
  const criticalElements = document.querySelectorAll(`[data-critical="${selector}"]`);
  const usedRules = new Set();

  criticalElements.forEach(element => {
    const styles = window.getComputedStyle(element);

    // Extract only essential styles
    const critical = {
      display: styles.display,
      position: styles.position,
      width: styles.width,
      height: styles.height,
      margin: styles.margin,
      padding: styles.padding,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      color: styles.color,
      backgroundColor: styles.backgroundColor
    };

    usedRules.add(JSON.stringify(critical));
  });

  return Array.from(usedRules);
};

/**
 * Prefetch route chunks
 */
export const prefetchRoute = (routePath) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = routePath;
  document.head.appendChild(link);
};

/**
 * Monitor unused CSS
 */
export const detectUnusedCSS = () => {
  const allRules = [];
  const usedSelectors = new Set();

  // Get all CSS rules
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule instanceof CSSStyleRule) {
          allRules.push(rule.selectorText);

          // Check if selector is used
          if (document.querySelector(rule.selectorText)) {
            usedSelectors.add(rule.selectorText);
          }
        }
      }
    } catch (e) {
      // Cross-origin stylesheet, skip
    }
  }

  const unusedCount = allRules.length - usedSelectors.size;
  const unusedPercentage = ((unusedCount / allRules.length) * 100).toFixed(2);

  console.log(`[Bundle] Unused CSS: ${unusedCount} rules (${unusedPercentage}%)`);

  return {
    total: allRules.length,
    used: usedSelectors.size,
    unused: unusedCount,
    percentage: parseFloat(unusedPercentage)
  };
};

export default {
  lazyLoad,
  preloadComponent,
  prefetchOnHover,
  loadChunks,
  monitorChunkLoading,
  analyzeBundleComposition,
  importSpecific,
  deferScript,
  loadOnInteraction,
  extractCriticalCSS,
  prefetchRoute,
  detectUnusedCSS,
  DataLoader,
  RequestBatcher
};

