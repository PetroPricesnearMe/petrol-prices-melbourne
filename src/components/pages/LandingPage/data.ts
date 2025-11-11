/**
 * Static data for Landing Page components
 * Centralized content management
 */

import type { Feature, Stat, FooterLinks, SocialLink, TrustIndicator } from './types';

// ============================================================================
// Features Data
// ============================================================================

export const FEATURES: Feature[] = [
  {
    icon: '⛽',
    title: 'Live Price Updates',
    description:
      'Get real-time fuel prices updated every few minutes from stations across Melbourne.',
  },
  {
    icon: '🔍',
    title: 'Smart Search',
    description:
      'Find stations by location, brand, amenities, and more with our advanced filtering system.',
  },
  {
    icon: '🗺️',
    title: 'Interactive Maps',
    description:
      'Explore stations on interactive maps with clustering and custom markers for easy navigation.',
  },
  {
    icon: '📱',
    title: 'Mobile Optimized',
    description:
      'Access our platform from any device with our fully responsive and mobile-optimized design.',
  },
  {
    icon: '🔔',
    title: 'Price Alerts',
    description:
      'Set up notifications for price drops and never miss a great deal on fuel.',
  },
  {
    icon: '📊',
    title: 'Price Trends',
    description:
      'Track historical price data and trends to find the best times to fill up.',
  },
];

// ============================================================================
// Stats Data
// ============================================================================

export const STATS: Stat[] = [
  {
    value: '250+',
    label: 'Stations',
    description: 'Across Melbourne',
  },
  {
    value: '50+',
    label: 'Suburbs',
    description: 'Covered areas',
  },
  {
    value: '10K+',
    label: 'Users',
    description: 'Active monthly',
  },
  {
    value: '24/7',
    label: 'Updates',
    description: 'Live price data',
  },
];

// ============================================================================
// Trust Indicators Data
// ============================================================================

export const TRUST_INDICATORS: TrustIndicator[] = [
  { text: 'Free to use' },
  { text: 'No registration required' },
  { text: 'Real-time updates' },
];

// ============================================================================
// Footer Links Data
// ============================================================================

export const FOOTER_LINKS: FooterLinks = {
  product: [
    { name: 'Find Stations', href: '/directory' },
    { name: 'Price Trends', href: '/fuel-price-trends' },
    { name: 'Mobile App', href: '/mobile' },
    { name: 'API Access', href: '/api' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Community', href: '/community' },
    { name: 'Status', href: '/status' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
  ],
};

// ============================================================================
// Social Media Links
// ============================================================================

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: '#',
    label: 'Twitter',
    icon: 'twitter',
  },
  {
    href: '#',
    label: 'Facebook',
    icon: 'facebook',
  },
  {
    href: '#',
    label: 'LinkedIn',
    icon: 'linkedin',
  },
];

// ============================================================================
// Floating Price Cards Data
// ============================================================================

export const FLOATING_CARDS = [
  {
    title: 'BP Collins St',
    subtitle: 'Unleaded: 189.9¢',
    status: 'success' as const,
    position: 'top-left' as const,
  },
  {
    title: 'Shell Richmond',
    subtitle: 'Diesel: 195.2¢',
    status: 'info' as const,
    position: 'bottom-right' as const,
  },
];

// ============================================================================
// Hero Content
// ============================================================================

export const HERO_CONTENT = {
  badge: 'Live Fuel Prices Available',
  title: 'Find the',
  titleHighlight: 'Cheapest',
  titleEnd: 'Petrol Prices',
  subtitle:
    'Compare real-time fuel prices from 250+ stations across Melbourne. Save money on every fill-up with live unleaded, diesel, and premium prices.',
  cta: {
    primary: {
      text: 'Browse All Stations',
      href: '/directory',
      ariaLabel: 'Browse all petrol stations to find cheapest prices',
    },
    secondary: {
      text: 'View Price Trends',
      href: '/fuel-price-trends',
      ariaLabel: 'View fuel price trends and analytics',
    },
  },
};

// ============================================================================
// Section Headings
// ============================================================================

export const SECTION_HEADINGS = {
  features: {
    title: 'Everything You Need to Save on Fuel',
    description:
      'Our comprehensive platform provides all the tools you need to find the cheapest petrol prices and save money on every fill-up.',
  },
  stats: {
    title: 'Trusted by Thousands of Drivers',
    description:
      'Join the community of smart drivers who save money on fuel every day.',
  },
  cta: {
    title: 'Ready to Start Saving?',
    description:
      'Join thousands of drivers who are already saving money on fuel. Find the cheapest petrol prices near you in just a few clicks.',
  },
};

// ============================================================================
// Brand Information
// ============================================================================

export const BRAND = {
  name: 'Petrol Price Near Me',
  shortName: 'PPNM',
  tagline: 'Find the cheapest petrol prices near you',
  description:
    'Find the cheapest petrol prices near you in Melbourne. Compare real-time fuel prices from 250+ stations and save money on every fill-up.',
  logo: 'P',
  copyright: `© ${new Date().getFullYear()} Petrol Price Near Me. All rights reserved.`,
};

