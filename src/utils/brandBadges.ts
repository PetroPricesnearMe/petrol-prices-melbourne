/**
 * Brand Badges & Certifications Utility
 *
 * Manages badges, certifications, and awards for petrol station brands
 *
 * @module utils/brandBadges
 */

export enum BadgeType {
  VERIFIED = 'verified',
  QUALITY = 'quality',
  ECO_FRIENDLY = 'eco_friendly',
  BEST_PRICE = 'best_price',
  TOP_RATED = 'top_rated',
  AWARD_WINNER = 'award_winner',
  NEW = 'new',
  POPULAR = 'popular',
  OPEN_24_7 = 'open_24_7',
  ELECTRIC_CHARGING = 'electric_charging',
  RESTROOM_AVAILABLE = 'restroom_available',
  CAR_WASH = 'car_wash',
  CAFE = 'cafe',
  ATM = 'atm',
}

export interface Badge {
  type: BadgeType;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  priority: number; // Higher priority badges shown first
}

export interface BrandCertification {
  name: string;
  issuer: string;
  dateIssued: Date;
  expiryDate?: Date;
  badgeUrl?: string;
  verificationUrl?: string;
}

/**
 * Badge configurations
 */
export const BADGE_CONFIG: Record<BadgeType, Badge> = {
  [BadgeType.VERIFIED]: {
    type: BadgeType.VERIFIED,
    label: 'Verified',
    icon: '✓',
    color: '#ffffff',
    bgColor: '#10b981',
    description: 'Verified by Service Victoria',
    priority: 100,
  },
  [BadgeType.QUALITY]: {
    type: BadgeType.QUALITY,
    label: 'Quality Assured',
    icon: '⭐',
    color: '#ffffff',
    bgColor: '#f59e0b',
    description: 'Quality assurance certified',
    priority: 90,
  },
  [BadgeType.ECO_FRIENDLY]: {
    type: BadgeType.ECO_FRIENDLY,
    label: 'Eco-Friendly',
    icon: '🌱',
    color: '#ffffff',
    bgColor: '#059669',
    description: 'Environmentally friendly practices',
    priority: 85,
  },
  [BadgeType.BEST_PRICE]: {
    type: BadgeType.BEST_PRICE,
    label: 'Best Price',
    icon: '💰',
    color: '#ffffff',
    bgColor: '#3b82f6',
    description: 'Lowest price in area',
    priority: 95,
  },
  [BadgeType.TOP_RATED]: {
    type: BadgeType.TOP_RATED,
    label: 'Top Rated',
    icon: '⭐',
    color: '#ffffff',
    bgColor: '#8b5cf6',
    description: 'Highly rated by customers',
    priority: 88,
  },
  [BadgeType.AWARD_WINNER]: {
    type: BadgeType.AWARD_WINNER,
    label: 'Award Winner',
    icon: '🏆',
    color: '#ffffff',
    bgColor: '#f59e0b',
    description: 'Industry award recipient',
    priority: 92,
  },
  [BadgeType.NEW]: {
    type: BadgeType.NEW,
    label: 'New',
    icon: '✨',
    color: '#ffffff',
    bgColor: '#06b6d4',
    description: 'Recently opened',
    priority: 70,
  },
  [BadgeType.POPULAR]: {
    type: BadgeType.POPULAR,
    label: 'Popular',
    icon: '🔥',
    color: '#ffffff',
    bgColor: '#ef4444',
    description: 'Popular among users',
    priority: 80,
  },
  [BadgeType.OPEN_24_7]: {
    type: BadgeType.OPEN_24_7,
    label: '24/7',
    icon: '🕐',
    color: '#ffffff',
    bgColor: '#6366f1',
    description: 'Open 24 hours',
    priority: 75,
  },
  [BadgeType.ELECTRIC_CHARGING]: {
    type: BadgeType.ELECTRIC_CHARGING,
    label: 'EV Charging',
    icon: '⚡',
    color: '#ffffff',
    bgColor: '#8b5cf6',
    description: 'Electric vehicle charging available',
    priority: 82,
  },
  [BadgeType.RESTROOM_AVAILABLE]: {
    type: BadgeType.RESTROOM_AVAILABLE,
    label: 'Restrooms',
    icon: '🚻',
    color: '#ffffff',
    bgColor: '#64748b',
    description: 'Clean restrooms available',
    priority: 60,
  },
  [BadgeType.CAR_WASH]: {
    type: BadgeType.CAR_WASH,
    label: 'Car Wash',
    icon: '🚿',
    color: '#ffffff',
    bgColor: '#14b8a6',
    description: 'Car wash facility',
    priority: 65,
  },
  [BadgeType.CAFE]: {
    type: BadgeType.CAFE,
    label: 'Café',
    icon: '☕',
    color: '#ffffff',
    bgColor: '#92400e',
    description: 'Café on premises',
    priority: 68,
  },
  [BadgeType.ATM]: {
    type: BadgeType.ATM,
    label: 'ATM',
    icon: '💳',
    color: '#ffffff',
    bgColor: '#475569',
    description: 'ATM available',
    priority: 55,
  },
};

/**
 * Get badge configuration
 */
export function getBadge(type: BadgeType): Badge {
  return BADGE_CONFIG[type];
}

/**
 * Get multiple badges sorted by priority
 */
export function getBadges(types: BadgeType[]): Badge[] {
  return types
    .map((type) => BADGE_CONFIG[type])
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Determine badges for a station based on its attributes
 */
export interface StationAttributes {
  verified?: boolean;
  isOpen24Hours?: boolean;
  hasElectricCharging?: boolean;
  hasCarWash?: boolean;
  hasCafe?: boolean;
  hasATM?: boolean;
  hasRestroom?: boolean;
  rating?: number;
  cheapestInArea?: boolean;
  isNew?: boolean;
  viewCount?: number;
  ecoFriendly?: boolean;
  hasAward?: boolean;
}

export function determineStationBadges(attributes: StationAttributes): Badge[] {
  const badges: BadgeType[] = [];

  if (attributes.verified) badges.push(BadgeType.VERIFIED);
  if (attributes.cheapestInArea) badges.push(BadgeType.BEST_PRICE);
  if (attributes.rating && attributes.rating >= 4.5) badges.push(BadgeType.TOP_RATED);
  if (attributes.hasAward) badges.push(BadgeType.AWARD_WINNER);
  if (attributes.ecoFriendly) badges.push(BadgeType.ECO_FRIENDLY);
  if (attributes.isNew) badges.push(BadgeType.NEW);
  if (attributes.viewCount && attributes.viewCount > 1000) badges.push(BadgeType.POPULAR);
  if (attributes.isOpen24Hours) badges.push(BadgeType.OPEN_24_7);
  if (attributes.hasElectricCharging) badges.push(BadgeType.ELECTRIC_CHARGING);
  if (attributes.hasCarWash) badges.push(BadgeType.CAR_WASH);
  if (attributes.hasCafe) badges.push(BadgeType.CAFE);
  if (attributes.hasRestroom) badges.push(BadgeType.RESTROOM_AVAILABLE);
  if (attributes.hasATM) badges.push(BadgeType.ATM);

  return getBadges(badges);
}

/**
 * Limit badges to display (show top N by priority)
 */
export function limitBadges(badges: Badge[], maxCount: number = 3): Badge[] {
  return badges.slice(0, maxCount);
}

/**
 * Get badge CSS class
 */
export function getBadgeClassName(badge: Badge): string {
  return `badge badge-${badge.type} badge-sm`;
}

/**
 * Get badge style object
 */
export function getBadgeStyle(badge: Badge): React.CSSProperties {
  return {
    backgroundColor: badge.bgColor,
    color: badge.color,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    lineHeight: '1rem',
  };
}

/**
 * Format certification date range
 */
export function formatCertificationPeriod(cert: BrandCertification): string {
  const issued = cert.dateIssued.toLocaleDateString('en-AU', { year: 'numeric', month: 'short' });

  if (cert.expiryDate) {
    const expiry = cert.expiryDate.toLocaleDateString('en-AU', { year: 'numeric', month: 'short' });
    return `${issued} - ${expiry}`;
  }

  return `Since ${issued}`;
}

/**
 * Check if certification is valid
 */
export function isCertificationValid(cert: BrandCertification): boolean {
  if (!cert.expiryDate) return true;
  return new Date() <= cert.expiryDate;
}

/**
 * Get certification badge HTML for SEO
 */
export function getCertificationSchema(cert: BrandCertification): object {
  return {
    '@type': 'Certification',
    name: cert.name,
    issuedBy: {
      '@type': 'Organization',
      name: cert.issuer,
    },
    dateIssued: cert.dateIssued.toISOString(),
    expires: cert.expiryDate?.toISOString(),
    url: cert.verificationUrl,
  };
}

