/**
 * Color Tokens - Design System
 * 
 * All colors are WCAG AA compliant for accessibility.
 * Use these tokens throughout the application for consistency.
 * 
 * @module design-system/tokens/colors
 */

/**
 * Primary brand colors - Trust & Energy
 * Use for: Main actions, links, brand elements
 */
export const primary = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',  // Main primary
  600: '#2563EB',  // Primary hover/active
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
  950: '#172554',
} as const;

/**
 * Secondary colors - Fresh & Eco-friendly
 * Use for: Success states, positive actions, eco-friendly features
 */
export const secondary = {
  50: '#ECFDF5',
  100: '#D1FAE5',
  200: '#A7F3D0',
  300: '#6EE7B7',
  400: '#34D399',
  500: '#10B981',  // Main secondary
  600: '#059669',
  700: '#047857',
  800: '#065F46',
  900: '#064E3B',
  950: '#022C22',
} as const;

/**
 * Accent colors - Warm & Call-to-action
 * Use for: Highlights, warnings, featured content
 */
export const accent = {
  50: '#FFF7ED',
  100: '#FFEDD5',
  200: '#FED7AA',
  300: '#FDBA74',
  400: '#FB923C',
  500: '#F97316',  // Main accent
  600: '#EA580C',
  700: '#C2410C',
  800: '#9A3412',
  900: '#7C2D12',
  950: '#431407',
} as const;

/**
 * Neutral grays - Professional & Clean
 * Use for: Text, backgrounds, borders
 */
export const gray = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  950: '#030712',
} as const;

/**
 * Semantic colors for UI states
 */
export const semantic = {
  success: {
    light: '#D1FAE5',
    DEFAULT: '#10B981',
    dark: '#047857',
  },
  error: {
    light: '#FEE2E2',
    DEFAULT: '#EF4444',
    dark: '#B91C1C',
  },
  warning: {
    light: '#FEF3C7',
    DEFAULT: '#F59E0B',
    dark: '#B45309',
  },
  info: {
    light: '#DBEAFE',
    DEFAULT: '#3B82F6',
    dark: '#1D4ED8',
  },
} as const;

/**
 * Fuel brand colors for station cards
 */
export const fuelBrands = {
  shell: { primary: '#E31E24', secondary: '#FFD700' },
  bp: { primary: '#00A651', secondary: '#FFD700' },
  caltex: { primary: '#E31E24', secondary: '#0066CC' },
  ampol: { primary: '#E31E24', secondary: '#0066CC' },
  sevenEleven: { primary: '#FF6600', secondary: '#00A651' },
  mobil: { primary: '#E31E24', secondary: '#0066CC' },
  united: { primary: '#004C97', secondary: '#0066CC' },
  liberty: { primary: '#E31E24', secondary: '#FFD700' },
  metro: { primary: '#FF6B35', secondary: '#0066CC' },
  costco: { primary: '#0066B2', secondary: '#FFD700' },
} as const;

/**
 * Fuel type colors for price display
 */
export const fuelTypes = {
  unleaded: '#22C55E',
  premium: '#EF4444',
  diesel: '#374151',
  lpg: '#3B82F6',
  e10: '#F59E0B',
  '98': '#DC2626',
  '95': '#F59E0B',
  '91': '#1D4ED8',
} as const;

/**
 * Essential colors
 */
export const essential = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  current: 'currentColor',
} as const;

/**
 * Export all color tokens
 */
export const colors = {
  primary,
  secondary,
  accent,
  gray,
  semantic,
  fuelBrands,
  fuelTypes,
  ...essential,
} as const;

/**
 * Type helper for color tokens
 */
export type ColorToken = typeof colors;
export type ColorScale = keyof typeof primary;
export type SemanticColor = keyof typeof semantic;
