/**
 * Brand Image Utility
 *
 * Centralized mapping of petrol station brands to their logo images
 */

export interface BrandInfo {
  name: string;
  logo: string;
  color: string;
  fallback: string;
}

export const BRAND_LOGOS: Record<string, BrandInfo> = {
  shell: {
    name: 'Shell',
    logo: '/images/brands/shell.svg',
    color: '#FBCE07',
    fallback: '#DD1D21',
  },
  bp: {
    name: 'BP',
    logo: '/images/brands/bp.svg',
    color: '#00A850',
    fallback: '#00A850',
  },
  caltex: {
    name: 'Caltex',
    logo: '/images/brands/caltex.svg',
    color: '#ED1C24',
    fallback: '#ED1C24',
  },
  ampol: {
    name: 'Ampol',
    logo: '/images/brands/ampol.svg',
    color: '#003DA5',
    fallback: '#003DA5',
  },
  '7-eleven': {
    name: '7-Eleven',
    logo: '/images/brands/7-eleven.svg',
    color: '#FF6201',
    fallback: '#008848',
  },
  'seven eleven': {
    name: '7-Eleven',
    logo: '/images/brands/7-eleven.svg',
    color: '#FF6201',
    fallback: '#008848',
  },
  mobil: {
    name: 'Mobil',
    logo: '/images/brands/mobil.svg',
    color: '#EE3124',
    fallback: '#EE3124',
  },
  coles: {
    name: 'Coles Express',
    logo: '/images/brands/coles.svg',
    color: '#E31E26',
    fallback: '#E31E26',
  },
  'coles express': {
    name: 'Coles Express',
    logo: '/images/brands/coles-express.svg',
    color: '#E31E26',
    fallback: '#E31E26',
  },
  united: {
    name: 'United Petroleum',
    logo: '/images/brands/united.svg',
    color: '#0066B3',
    fallback: '#0066B3',
  },
  liberty: {
    name: 'Liberty',
    logo: '/images/brands/liberty.svg',
    color: '#003087',
    fallback: '#003087',
  },
  apco: {
    name: 'APCO',
    logo: '/images/brands/apco.svg',
    color: '#E31E26',
    fallback: '#E31E26',
  },
};

/**
 * Get brand information by brand name
 */
export function getBrandInfo(brandName: string | null | undefined): BrandInfo {
  if (!brandName) {
    return {
      name: 'Independent',
      logo: '/images/brands/default-logo.svg',
      color: '#6B7280',
      fallback: '#6B7280',
    };
  }

  const normalizedBrand = brandName.toLowerCase().trim();

  // Try exact match first
  if (BRAND_LOGOS[normalizedBrand]) {
    return BRAND_LOGOS[normalizedBrand];
  }

  // Try partial match
  for (const [key, info] of Object.entries(BRAND_LOGOS)) {
    if (normalizedBrand.includes(key) || key.includes(normalizedBrand)) {
      return info;
    }
  }

  // Return default
  return {
    name: brandName,
    logo: '/images/brands/default-logo.svg',
    color: '#6B7280',
    fallback: '#6B7280',
  };
}

/**
 * Get brand logo URL
 */
export function getBrandLogo(brandName: string | null | undefined): string {
  return getBrandInfo(brandName).logo;
}

/**
 * Get brand color
 */
export function getBrandColor(brandName: string | null | undefined): string {
  return getBrandInfo(brandName).color;
}

/**
 * Get CSS class for brand styling
 */
export function getBrandClass(brandName: string | null | undefined): string {
  if (!brandName) return '';

  const normalizedBrand = brandName.toLowerCase().trim();

  if (normalizedBrand.includes('shell')) return 'brand-shell';
  if (normalizedBrand.includes('bp')) return 'brand-bp';
  if (normalizedBrand.includes('caltex') || normalizedBrand.includes('ampol'))
    return 'brand-caltex';
  if (normalizedBrand.includes('7') || normalizedBrand.includes('seven'))
    return 'brand-seven-eleven';
  if (normalizedBrand.includes('mobil')) return 'brand-mobil';
  if (normalizedBrand.includes('coles')) return 'brand-coles';
  if (normalizedBrand.includes('united')) return 'brand-united';
  if (normalizedBrand.includes('liberty')) return 'brand-liberty';
  if (normalizedBrand.includes('apco')) return 'brand-apco';

  return '';
}
