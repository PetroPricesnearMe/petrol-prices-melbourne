/**
 * Internal Linking Strategy
 * Utilities for building effective internal link structure
 */

export interface InternalLink {
  href: string;
  text: string;
  title?: string;
  rel?: string;
}

/**
 * Generate related region links
 */
export function getRelatedRegionLinks(currentRegion: string): InternalLink[] {
  const regions = [
    'CBD',
    'North',
    'South',
    'East',
    'West',
    'South-East',
    'North-East',
    'North-West',
    'South-West',
  ];

  return regions
    .filter((region) => region !== currentRegion)
    .slice(0, 4) // Limit to 4 related regions
    .map((region) => ({
      href: `/directory?region=${region.toLowerCase()}`,
      text: `${region} Petrol Stations`,
      title: `View petrol prices in ${region} Melbourne`,
    }));
}

/**
 * Generate breadcrumb links
 */
export function generateBreadcrumbs(path: string): InternalLink[] {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: InternalLink[] = [
    {
      href: '/',
      text: 'Home',
      title: 'Go to homepage',
    },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    breadcrumbs.push({
      href: currentPath,
      text: segment.charAt(0).toUpperCase() + segment.slice(1),
      title: isLast ? undefined : `Go to ${segment}`,
      ...(isLast && { rel: 'canonical' }),
    });
  });

  return breadcrumbs;
}

/**
 * Get contextual links for content
 */
export function getContextualLinks(keywords: string[]): InternalLink[] {
  const linkMap: Record<string, InternalLink> = {
    petrol: {
      href: '/directory',
      text: 'Find Petrol Stations',
      title: 'Browse all petrol stations in Melbourne',
    },
    fuel: {
      href: '/directory',
      text: 'Compare Fuel Prices',
      title: 'Compare fuel prices across Melbourne',
    },
    prices: {
      href: '/',
      text: 'Live Fuel Prices',
      title: 'View live fuel prices in Melbourne',
    },
    melbourne: {
      href: '/',
      text: 'Melbourne Fuel Prices',
      title: 'Find cheapest fuel in Melbourne',
    },
    stations: {
      href: '/directory',
      text: 'Petrol Station Directory',
      title: 'Browse our directory of 700+ petrol stations',
    },
  };

  return keywords
    .map((keyword) => linkMap[keyword.toLowerCase()])
    .filter(Boolean)
    .slice(0, 3); // Limit to 3 contextual links
}

/**
 * Generate footer links
 */
export function getFooterLinks(): {
  category: string;
  links: InternalLink[];
}[] {
  return [
    {
      category: 'Regions',
      links: [
        { href: '/directory?region=cbd', text: 'CBD', title: 'CBD petrol prices' },
        { href: '/directory?region=north', text: 'North', title: 'North Melbourne prices' },
        { href: '/directory?region=south', text: 'South', title: 'South Melbourne prices' },
        { href: '/directory?region=east', text: 'East', title: 'East Melbourne prices' },
        { href: '/directory?region=west', text: 'West', title: 'West Melbourne prices' },
      ],
    },
    {
      category: 'Resources',
      links: [
        { href: '/blog', text: 'Blog', title: 'Fuel saving tips and news' },
        { href: '/faq', text: 'FAQ', title: 'Frequently asked questions' },
        {
          href: '/how-it-works',
          text: 'How It Works',
          title: 'Learn how we track fuel prices',
        },
      ],
    },
    {
      category: 'Company',
      links: [
        { href: '/about', text: 'About Us', title: 'About Petrol Prices Near Me' },
        { href: '/contact', text: 'Contact', title: 'Get in touch' },
        { href: '/privacy', text: 'Privacy Policy', title: 'Our privacy policy' },
        { href: '/terms', text: 'Terms of Service', title: 'Terms and conditions' },
      ],
    },
  ];
}

/**
 * Generate pagination links
 */
export function getPaginationLinks(
  currentPage: number,
  totalPages: number,
  basePath: string
): {
  prev?: InternalLink;
  next?: InternalLink;
  pages: InternalLink[];
} {
  const links: InternalLink[] = [];

  // Generate page links (show 5 pages max)
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  for (let i = startPage; i <= endPage; i++) {
    links.push({
      href: `${basePath}?page=${i}`,
      text: i.toString(),
      title: `Go to page ${i}`,
      ...(i === currentPage && { rel: 'canonical' }),
    });
  }

  return {
    prev:
      currentPage > 1
        ? {
            href: `${basePath}?page=${currentPage - 1}`,
            text: 'Previous',
            title: 'Go to previous page',
            rel: 'prev',
          }
        : undefined,
    next:
      currentPage < totalPages
        ? {
            href: `${basePath}?page=${currentPage + 1}`,
            text: 'Next',
            title: 'Go to next page',
            rel: 'next',
          }
        : undefined,
    pages: links,
  };
}

/**
 * Generate tag cloud links
 */
export function getTagLinks(tags: string[], basePath: string = '/blog'): InternalLink[] {
  return tags.map((tag) => ({
    href: `${basePath}?tag=${encodeURIComponent(tag.toLowerCase())}`,
    text: tag,
    title: `View posts tagged with ${tag}`,
  }));
}

/**
 * Get related content links
 */
export function getRelatedContent(
  currentId: string,
  category: string,
  allContent: Array<{ id: string; title: string; slug: string; category: string }>
): InternalLink[] {
  return allContent
    .filter((item) => item.id !== currentId && item.category === category)
    .slice(0, 4)
    .map((item) => ({
      href: `/blog/${item.slug}`,
      text: item.title,
      title: `Read: ${item.title}`,
    }));
}

/**
 * Calculate link equity (PageRank-like)
 */
export function calculateLinkPriority(page: string): number {
  const priorityMap: Record<string, number> = {
    '/': 1.0, // Homepage
    '/directory': 0.9, // Main directory
    '/blog': 0.8, // Blog index
    '/about': 0.7, // About page
    '/faq': 0.7, // FAQ
  };

  return priorityMap[page] || 0.5; // Default priority
}

export default {
  getRelatedRegionLinks,
  generateBreadcrumbs,
  getContextualLinks,
  getFooterLinks,
  getPaginationLinks,
  getTagLinks,
  getRelatedContent,
  calculateLinkPriority,
};
