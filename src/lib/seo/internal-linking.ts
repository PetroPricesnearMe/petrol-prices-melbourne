/**
 * Internal Linking Strategy
 *
 * Utilities for building a strong internal linking structure
 * Improves SEO by distributing page authority
 *
 * @module lib/seo/internal-linking
 */

// ============================================================================
// Link Structure
// ============================================================================

export interface InternalLink {
  href: string;
  title: string;
  rel?: string;
  priority: 'high' | 'medium' | 'low';
  category?: string;
}

// ============================================================================
// Site Navigation Structure
// ============================================================================

export const NAVIGATION_LINKS: InternalLink[] = [
  {
    href: '/',
    title: 'Home - Find Cheapest Petrol Prices',
    priority: 'high',
    category: 'main',
  },
  {
    href: '/directory',
    title: 'Petrol Station Directory',
    priority: 'high',
    category: 'main',
  },
  {
    href: '/fuel-price-trends',
    title: 'Fuel Price Trends & Analysis',
    priority: 'high',
    category: 'main',
  },
  {
    href: '/station-amenities',
    title: 'Station Amenities Guide',
    priority: 'medium',
    category: 'main',
  },
  {
    href: '/how-pricing-works',
    title: 'How Petrol Pricing Works',
    priority: 'medium',
    category: 'content',
  },
  {
    href: '/about',
    title: 'About Us',
    priority: 'low',
    category: 'footer',
  },
  {
    href: '/blog',
    title: 'Fuel Savings Blog',
    priority: 'medium',
    category: 'content',
  },
  {
    href: '/faq',
    title: 'Frequently Asked Questions',
    priority: 'medium',
    category: 'footer',
  },
];

// ============================================================================
// Related Content
// ============================================================================

/**
 * Get related links for a page
 * Helps with internal linking and SEO
 */
export function getRelatedLinks(currentPath: string, limit: number = 5): InternalLink[] {
  const relatedMap: Record<string, string[]> = {
    '/': ['/directory', '/fuel-price-trends', '/how-pricing-works'],
    '/directory': ['/fuel-price-trends', '/station-amenities', '/'],
    '/fuel-price-trends': ['/directory', '/how-pricing-works', '/blog'],
    '/station-amenities': ['/directory', '/how-pricing-works', '/'],
    '/how-pricing-works': ['/fuel-price-trends', '/faq', '/blog'],
    '/blog': ['/fuel-price-trends', '/how-pricing-works', '/faq'],
    '/faq': ['/how-pricing-works', '/about', '/'],
    '/about': ['/faq', '/', '/blog'],
  };

  const relatedPaths = relatedMap[currentPath] || ['/'];

  return NAVIGATION_LINKS
    .filter(link => relatedPaths.includes(link.href))
    .slice(0, limit);
}

/**
 * Get breadcrumb links for a path
 */
export function getBreadcrumbLinks(pathname: string): InternalLink[] {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: InternalLink[] = [
    {
      href: '/',
      title: 'Home',
      priority: 'high',
      category: 'breadcrumb',
    },
  ];

  let currentPath = '';
  paths.forEach((segment) => {
    currentPath += `/${segment}`;
    const link = NAVIGATION_LINKS.find(l => l.href === currentPath);

    if (link) {
      breadcrumbs.push({
        ...link,
        category: 'breadcrumb',
      });
    } else {
      // Generate title from path segment
      const title = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());

      breadcrumbs.push({
        href: currentPath,
        title,
        priority: 'medium',
        category: 'breadcrumb',
      });
    }
  });

  return breadcrumbs;
}

// ============================================================================
// Contextual Links
// ============================================================================

/**
 * Generate contextual links based on content keywords
 */
export function getContextualLinks(keywords: string[], limit: number = 3): InternalLink[] {
  const keywordMap: Record<string, string[]> = {
    'price': ['/fuel-price-trends', '/directory'],
    'fuel': ['/directory', '/fuel-price-trends', '/how-pricing-works'],
    'station': ['/directory', '/station-amenities'],
    'save': ['/fuel-price-trends', '/how-pricing-works'],
    'diesel': ['/directory', '/fuel-price-trends'],
    'unleaded': ['/directory', '/fuel-price-trends'],
    'premium': ['/directory', '/fuel-price-trends'],
    'map': ['/directory', '/'],
    'search': ['/directory', '/'],
    'amenities': ['/station-amenities', '/directory'],
  };

  const matchedPaths = new Set<string>();

  keywords.forEach(keyword => {
    const paths = keywordMap[keyword.toLowerCase()];
    if (paths) {
      paths.forEach(path => matchedPaths.add(path));
    }
  });

  return NAVIGATION_LINKS
    .filter(link => matchedPaths.has(link.href))
    .slice(0, limit);
}

// ============================================================================
// Footer Links
// ============================================================================

export const FOOTER_LINKS = {
  company: [
    { href: '/about', title: 'About Us' },
    { href: '/how-pricing-works', title: 'How It Works' },
    { href: '/faq', title: 'FAQ' },
  ],
  resources: [
    { href: '/blog', title: 'Blog' },
    { href: '/fuel-price-trends', title: 'Price Trends' },
    { href: '/station-amenities', title: 'Station Amenities' },
  ],
  legal: [
    { href: '/privacy', title: 'Privacy Policy' },
    { href: '/terms', title: 'Terms of Service' },
    { href: '/sitemap.xml', title: 'Sitemap' },
  ],
};

// ============================================================================
// Mobile Navigation
// ============================================================================

/**
 * Get prioritized links for mobile navigation
 * Shows most important links first
 */
export function getMobileNavigationLinks(): InternalLink[] {
  return NAVIGATION_LINKS
    .filter(link => link.category === 'main')
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

// ============================================================================
// SEO Link Building
// ============================================================================

/**
 * Generate anchor text for SEO-friendly internal links
 */
export function generateAnchorText(targetPage: string, context?: string): string {
  const anchorMap: Record<string, string[]> = {
    '/directory': [
      'find petrol stations',
      'view all stations',
      'station directory',
      'search stations near you',
    ],
    '/fuel-price-trends': [
      'check fuel price trends',
      'view price analytics',
      'see historical prices',
      'compare fuel prices',
    ],
    '/station-amenities': [
      'explore station amenities',
      'find stations with facilities',
      'check station services',
    ],
    '/how-pricing-works': [
      'learn how pricing works',
      'understand fuel prices',
      'see pricing explained',
    ],
  };

  const options = anchorMap[targetPage] || ['visit this page'];

  // Use context to pick most relevant anchor text
  if (context) {
    const contextLower = context.toLowerCase();
    const match = options.find(opt =>
      contextLower.includes(opt.split(' ')[0])
    );
    if (match) return match;
  }

  // Return first option or random for variety
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Calculate link juice distribution
 * For advanced SEO optimization
 */
export function calculateLinkPriority(
  link: InternalLink,
  context: {
    currentPage: string;
    userIntent?: string;
    pageDepth: number;
  }
): number {
  let score = 0;

  // Base priority score
  const priorityScores = { high: 10, medium: 5, low: 2 };
  score += priorityScores[link.priority];

  // Boost if it's a parent or sibling page
  if (link.href === '/' && context.pageDepth > 0) {
    score += 5; // Always boost home link
  }

  // Reduce score for current page
  if (link.href === context.currentPage) {
    score = 0; // Don't link to self
  }

  // Boost based on category
  if (link.category === 'main') {
    score += 3;
  }

  return score;
}

// ============================================================================
// Export
// ============================================================================

export {
  NAVIGATION_LINKS,
  FOOTER_LINKS,
  getRelatedLinks,
  getBreadcrumbLinks,
  getContextualLinks,
  getMobileNavigationLinks,
  generateAnchorText,
  calculateLinkPriority,
};
