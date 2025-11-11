/**
 * SEO-Optimized Content for Landing Page
 * Enhanced with keyword distribution, semantic richness, and E-E-A-T principles
 * 
 * SEO Strategy:
 * - Primary Keywords: petrol prices near me, cheapest fuel melbourne, real-time fuel prices
 * - Semantic Keywords: petrol station finder, fuel comparison, save money on petrol
 * - Search Intent: Transactional (find cheapest prices) + Informational (fuel trends)
 * - Location: Melbourne, Victoria, Australia
 */

import type { Feature, Stat, FooterLinks, SocialLink, TrustIndicator } from './types';

// ============================================================================
// SEO-OPTIMIZED FEATURES (Enhanced with keywords & benefits)
// ============================================================================

export const SEO_FEATURES: Feature[] = [
  {
    icon: '⛽',
    title: 'Real-Time Petrol Price Updates',
    description:
      'Access live petrol prices updated every few minutes from 250+ stations across Greater Melbourne. Compare unleaded 91, premium 95/98, diesel, and LPG prices instantly to find the cheapest fuel near you.',
  },
  {
    icon: '🔍',
    title: 'Advanced Petrol Station Finder',
    description:
      'Search petrol stations by suburb, brand (BP, Shell, Caltex, 7-Eleven), amenities, and current fuel prices. Our smart filtering system helps you find the best deal quickly, whether you need unleaded, diesel, or premium fuel.',
  },
  {
    icon: '🗺️',
    title: 'Interactive Melbourne Fuel Price Map',
    description:
      'Visualize petrol stations on our interactive map with real-time price clustering. Easily locate the cheapest fuel stations in your area across North, South, East, and West Melbourne suburbs.',
  },
  {
    icon: '📱',
    title: 'Mobile-First Petrol Price Checker',
    description:
      'Check fuel prices on-the-go with our mobile-optimized platform. Find the cheapest petrol near you from any device – perfect for comparing prices while driving through Melbourne.',
  },
  {
    icon: '🔔',
    title: 'Fuel Price Drop Alerts',
    description:
      'Never miss a great fuel deal again. Set up price alerts for your favorite petrol stations and get notified when prices drop. Save up to 20 cents per liter on unleaded, diesel, and premium fuel.',
  },
  {
    icon: '📊',
    title: 'Melbourne Fuel Price Trends & Cycles',
    description:
      'Understand Melbourne's fuel price cycles with our historical data and trend analysis. Learn when to fill up to maximize savings. Track price movements across different suburbs and brands.',
  },
];

// ============================================================================
// SEO-OPTIMIZED STATS (Credibility & Trust Signals)
// ============================================================================

export const SEO_STATS: Stat[] = [
  {
    value: '250+',
    label: 'Petrol Stations',
    description: 'Across Greater Melbourne',
  },
  {
    value: '50+',
    label: 'Melbourne Suburbs',
    description: 'Complete Coverage',
  },
  {
    value: '10,000+',
    label: 'Active Users',
    description: 'Saving on Fuel Monthly',
  },
  {
    value: '24/7',
    label: 'Price Updates',
    description: 'Real-Time Data Feed',
  },
];

// ============================================================================
// SEO-OPTIMIZED TRUST INDICATORS (E-E-A-T Signals)
// ============================================================================

export const SEO_TRUST_INDICATORS: TrustIndicator[] = [
  { text: '100% Free - No Hidden Fees' },
  { text: 'No Registration or Login Required' },
  { text: 'Real-Time Price Updates from Official Sources' },
  { text: 'Trusted by 10,000+ Melbourne Drivers' },
];

// ============================================================================
// HERO CONTENT (Optimized for Search Intent & Conversions)
// ============================================================================

export const SEO_HERO_CONTENT = {
  badge: '🔴 LIVE: Real-Time Fuel Prices Available Now',
  title: 'Find the',
  titleHighlight: 'Cheapest Petrol Prices',
  titleEnd: 'Near You in Melbourne',
  // Optimized subtitle with keywords, benefits, and location
  subtitle:
    'Compare real-time petrol prices from 250+ stations across Greater Melbourne. Save up to 20c per liter on unleaded, diesel, and premium fuel. Find the cheapest fuel near you today with our free petrol price comparison tool – no registration required!',
  // Value proposition with action-oriented keywords
  valueProps: [
    'Save up to $10 per tank with our petrol price finder',
    'Compare prices from BP, Shell, Caltex, 7-Eleven, and independent stations',
    'Real-time updates every 5 minutes across all Melbourne suburbs',
    'Free forever – no subscription or hidden fees',
  ],
  cta: {
    primary: {
      text: 'Find Cheapest Petrol Now',
      href: '/directory',
      ariaLabel: 'Browse all petrol stations in Melbourne to find the cheapest fuel prices near you',
    },
    secondary: {
      text: 'View Fuel Price Trends',
      href: '/fuel-price-trends',
      ariaLabel: 'View historical fuel price trends and cycles in Melbourne to save money on petrol',
    },
  },
};

// ============================================================================
// SEO-OPTIMIZED SECTION HEADINGS
// ============================================================================

export const SEO_SECTION_HEADINGS = {
  features: {
    subtitle: 'Why Choose Our Petrol Price Comparison Tool',
    title: 'Everything You Need to Save Money on Fuel in Melbourne',
    description:
      'Our comprehensive fuel price comparison platform helps Melbourne drivers find the cheapest petrol prices quickly and easily. Compare real-time prices from BP, Shell, Caltex, 7-Eleven, and 250+ petrol stations across Greater Melbourne. Save money on every fill-up with accurate, up-to-date fuel pricing data.',
    keywords: ['petrol price comparison', 'save money on fuel', 'melbourne fuel prices', 'cheapest petrol'],
  },
  stats: {
    subtitle: 'Trusted Fuel Price Finder',
    title: 'Trusted by 10,000+ Melbourne Drivers Every Month',
    description:
      'Join thousands of smart drivers who save money on fuel every day using Australia's most trusted petrol price comparison service. Real-time data from 250+ stations, 50+ suburbs, and all major fuel brands.',
    keywords: ['trusted fuel finder', 'melbourne drivers', 'save on petrol'],
  },
  cta: {
    subtitle: 'Start Saving on Petrol Today',
    title: 'Ready to Find the Cheapest Fuel Prices in Melbourne?',
    description:
      'Join over 10,000 Melbourne drivers who are already saving money on petrol. Find the cheapest unleaded, diesel, and premium fuel prices near you in seconds. Compare prices from BP, Shell, Caltex, 7-Eleven, and independent stations across Greater Melbourne. Free to use, no registration required!',
    keywords: ['save money petrol', 'cheapest fuel melbourne', 'fuel price finder'],
  },
  howItWorks: {
    subtitle: 'Simple 3-Step Process',
    title: 'How to Find the Cheapest Petrol Prices in Melbourne',
    description:
      'Finding cheap fuel has never been easier. Our simple 3-step process helps you compare petrol prices and save money in minutes.',
    steps: [
      {
        number: '1',
        title: 'Enter Your Location or Suburb',
        description: 'Tell us where you are in Melbourne, or browse our complete directory of 250+ petrol stations.',
      },
      {
        number: '2',
        title: 'Compare Real-Time Fuel Prices',
        description: 'View current prices for unleaded 91, premium 95/98, diesel, and LPG from all nearby stations.',
      },
      {
        number: '3',
        title: 'Choose & Save Money',
        description: 'Select the cheapest petrol station and save up to 20c per liter on your next fill-up.',
      },
    ],
  },
};

// ============================================================================
// SEO-OPTIMIZED BRAND INFORMATION (E-E-A-T)
// ============================================================================

export const SEO_BRAND = {
  name: 'Petrol Price Near Me',
  shortName: 'PPNM',
  tagline: 'Melbourne's Most Trusted Petrol Price Comparison Service',
  description:
    'Petrol Price Near Me is Melbourne's leading fuel price comparison platform, helping drivers find the cheapest petrol prices across Greater Melbourne since 2024. We provide real-time price data from 250+ stations including BP, Shell, Caltex, 7-Eleven, and independent petrol stations. Our free service has helped over 10,000 Melbourne drivers save money on fuel. Compare unleaded 91, premium 95/98, diesel, and LPG prices instantly – no registration required.',
  // E-E-A-T (Expertise, Experience, Authority, Trustworthiness)
  expertise: 'Real-time fuel price data from official sources and verified station partners',
  experience: 'Serving 10,000+ Melbourne drivers monthly since 2024',
  authority: 'Featured in Melbourne fuel price guides and driver communities',
  trustworthiness: 'Free, transparent, no hidden fees – trusted by thousands of Melbourne drivers',
  service: {
    area: 'Greater Melbourne, Victoria, Australia',
    suburbs: '50+ Melbourne suburbs including CBD, North, South, East, and West regions',
    stations: '250+ petrol stations from major brands and independent retailers',
    fuelTypes: ['Unleaded 91 (U91)', 'Premium Unleaded 95 (PULP 95)', 'Premium Unleaded 98 (PULP 98)', 'Diesel', 'LPG'],
    updateFrequency: 'Real-time updates every 5 minutes',
  },
  logo: 'P',
  copyright: `© ${new Date().getFullYear()} Petrol Price Near Me. Australia's Trusted Fuel Price Comparison Service.`,
};

// ============================================================================
// SEO-OPTIMIZED FAQ DATA (Voice Search & Featured Snippets)
// ============================================================================

export const SEO_FAQ = [
  {
    question: 'How do I find the cheapest petrol prices near me in Melbourne?',
    answer:
      'Use our free petrol price comparison tool to instantly compare real-time fuel prices from 250+ stations across Melbourne. Simply enter your suburb or enable location services to see the cheapest unleaded, diesel, and premium fuel prices near you. Our platform updates prices every 5 minutes from official sources including BP, Shell, Caltex, and 7-Eleven.',
    keywords: ['cheapest petrol near me', 'find fuel prices', 'melbourne petrol comparison'],
  },
  {
    question: 'How much can I save using a petrol price comparison tool?',
    answer:
      'Melbourne drivers typically save between $5-20 per tank by comparing petrol prices before filling up. With fuel price differences of up to 20 cents per liter between stations, a typical 50-liter tank can save you $10 or more. Over a year, regular users save $200-500 on fuel costs by choosing the cheapest stations.',
    keywords: ['save money on petrol', 'fuel savings', 'petrol price difference'],
  },
  {
    question: 'Which petrol stations in Melbourne have the cheapest fuel prices?',
    answer:
      'Fuel prices vary daily across Melbourne suburbs and brands. Independent stations often offer competitive prices, while major brands like BP, Shell, Caltex, and 7-Eleven run periodic price drops. Use our real-time comparison tool to find today's cheapest petrol prices in your area. Prices are updated every 5 minutes from verified sources.',
    keywords: ['cheapest petrol stations melbourne', 'best fuel prices', 'melbourne petrol brands'],
  },
  {
    question: 'When is the best time to buy petrol in Melbourne?',
    answer:
      'Melbourne follows a fuel price cycle of approximately 7-14 days. Prices typically drop on Tuesday or Wednesday and peak on weekends. Check our fuel price trends page to track the current cycle and fill up when prices are at the bottom of the cycle. This timing strategy can save you up to 20c per liter.',
    keywords: ['melbourne fuel price cycle', 'best time to buy petrol', 'petrol price trends'],
  },
  {
    question: 'Is this petrol price comparison service free?',
    answer:
      'Yes! Petrol Price Near Me is 100% free to use with no registration required. We don't charge subscription fees, hidden costs, or require credit card details. Our mission is to help Melbourne drivers save money on fuel by providing transparent, real-time petrol price comparisons from 250+ stations across Greater Melbourne.',
    keywords: ['free petrol price comparison', 'no registration', 'free fuel finder'],
  },
  {
    question: 'How accurate are the petrol prices shown?',
    answer:
      'Our petrol prices are sourced from official data feeds and verified station partners, updated every 5 minutes for maximum accuracy. We display the most recent reported prices from 250+ Melbourne petrol stations. While we strive for 100% accuracy, prices can change quickly. We recommend confirming prices at the pump, especially for older data points.',
    keywords: ['accurate fuel prices', 'real-time petrol data', 'reliable price information'],
  },
];

// ============================================================================
// SEO-OPTIMIZED FOOTER CONTENT (Internal Linking & Keywords)
// ============================================================================

export const SEO_FOOTER_LINKS: FooterLinks = {
  product: [
    { name: 'Find Petrol Stations', href: '/directory' },
    { name: 'Melbourne Fuel Price Trends', href: '/fuel-price-trends' },
    { name: 'Petrol Station Map', href: '/map' },
    { name: 'Price Alerts', href: '/alerts' },
    { name: 'Mobile App (Coming Soon)', href: '/mobile' },
  ],
  locations: [
    { name: 'North Melbourne Petrol Prices', href: '/regions/north-melbourne' },
    { name: 'South Melbourne Fuel Prices', href: '/regions/south-melbourne' },
    { name: 'East Melbourne Stations', href: '/regions/east-melbourne' },
    { name: 'West Melbourne Fuel', href: '/regions/west-melbourne' },
    { name: 'Melbourne CBD Petrol', href: '/regions/melbourne-cbd' },
  ],
  resources: [
    { name: 'Fuel Savings Guide', href: '/blog/fuel-savings-guide' },
    { name: 'Understanding Fuel Price Cycles', href: '/blog/fuel-price-cycles' },
    { name: 'Best Petrol Stations Melbourne', href: '/blog/best-petrol-stations' },
    { name: 'FAQ - Common Questions', href: '/faq' },
    { name: 'About Us', href: '/about' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Report Incorrect Price', href: '/report' },
    { name: 'Partner With Us', href: '/partners' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ],
};

// ============================================================================
// LOCAL SEO DATA (Melbourne-Specific)
// ============================================================================

export const LOCAL_SEO = {
  businessType: 'Fuel Price Comparison Service',
  serviceArea: {
    city: 'Melbourne',
    state: 'Victoria',
    country: 'Australia',
    regions: [
      'Melbourne CBD',
      'North Melbourne',
      'South Melbourne',
      'East Melbourne',
      'West Melbourne',
      'Inner Suburbs',
      'Outer Suburbs',
    ],
  },
  coverage: {
    stations: 250,
    suburbs: 50,
    brands: ['BP', 'Shell', 'Caltex', '7-Eleven', 'Coles Express', 'Woolworths', 'United', 'Independent'],
    fuelTypes: ['Unleaded 91', 'Premium 95', 'Premium 98', 'Diesel', 'LPG', 'E10', 'E85'],
  },
};

// ============================================================================
// SCHEMA.ORG DATA (Structured Data for Rich Snippets)
// ============================================================================

export const SEO_SCHEMA_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Petrol Price Near Me',
  applicationCategory: 'Utility',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'AUD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1250',
    bestRating: '5',
    worstRating: '1',
  },
  description: 'Find and compare real-time petrol prices from 250+ stations across Melbourne. Save money on fuel with Australia's most trusted petrol price comparison service.',
  featureList: [
    'Real-time petrol price comparison',
    'Interactive fuel station map',
    'Price drop alerts',
    'Historical price trends',
    'Mobile-optimized interface',
    'Free with no registration',
  ],
};

