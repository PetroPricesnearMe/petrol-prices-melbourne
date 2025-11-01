/**
 * Design System - Color Tokens
 * 
 * Centralized color palette following accessibility guidelines (WCAG 2.1 AA)
 * All colors are tested for proper contrast ratios
 */

export const colors = {
  // ============================================================================
  // Primary Colors - Brand Identity
  // ============================================================================
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // Main brand color
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // ============================================================================
  // Secondary Colors - Supporting Brand
  // ============================================================================
  secondary: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#9C27B0',
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  },

  // ============================================================================
  // Semantic Colors - Status & Feedback
  // ============================================================================
  success: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  warning: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800',
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },

  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },

  info: {
    50: '#E1F5FE',
    100: '#B3E5FC',
    200: '#81D4FA',
    300: '#4FC3F7',
    400: '#29B6F6',
    500: '#03A9F4',
    600: '#039BE5',
    700: '#0288D1',
    800: '#0277BD',
    900: '#01579B',
  },

  // ============================================================================
  // Neutral Colors - Text & Backgrounds
  // ============================================================================
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    1000: '#000000',
  },

  // ============================================================================
  // Fuel Type Colors - Domain-Specific
  // ============================================================================
  fuel: {
    unleaded: '#4CAF50',      // Green
    premium: '#9C27B0',       // Purple
    diesel: '#FF9800',        // Orange
    lpg: '#2196F3',          // Blue
    e10: '#8BC34A',          // Light Green
    e85: '#CDDC39',          // Lime
    electric: '#00BCD4',     // Cyan
  },

  // ============================================================================
  // Functional Colors - UI Elements
  // ============================================================================
  background: {
    default: '#FFFFFF',
    paper: '#FAFAFA',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },

  border: {
    light: '#E0E0E0',
    main: '#BDBDBD',
    dark: '#9E9E9E',
  },

  action: {
    active: '#2196F3',
    hover: 'rgba(33, 150, 243, 0.08)',
    selected: 'rgba(33, 150, 243, 0.16)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(33, 150, 243, 0.24)',
  },

  // ============================================================================
  // Shadow Colors
  // ============================================================================
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

/**
 * Type for color keys
 */
export type ColorKey = keyof typeof colors;

/**
 * Type for color shade
 */
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Utility function to get color value
 */
export const getColor = (key: ColorKey, shade?: number | string): string => {
  const colorGroup = colors[key];
  if (!colorGroup) return colors.neutral[500];
  
  if (shade && typeof colorGroup === 'object' && shade in colorGroup) {
    return colorGroup[shade as keyof typeof colorGroup] as string;
  }
  
  return typeof colorGroup === 'string' ? colorGroup : colorGroup[500] || colors.neutral[500];
};

