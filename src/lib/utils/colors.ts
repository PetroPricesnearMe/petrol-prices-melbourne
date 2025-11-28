/**
 * Color utilities for brand colors and price indicators
 * 
 * Provides consistent color mapping for brands and price-based styling
 */

/**
 * Brand color mapping
 * Maps station brand names to their official brand colors
 */
export const BRAND_COLORS: Record<string, string> = {
  BP: '#00A651',
  Shell: '#FFD700',
  Caltex: '#FF6B35',
  '7-Eleven': '#FF6900',
  'Coles Express': '#E31837',
  Woolworths: '#1B5E20',
  United: '#1976D2',
  Puma: '#E91E63',
  Liberty: '#6B46C1',
  Metro: '#059669',
  Ampol: '#005BBB',
  Independent: '#6B7280',
  // Alternative brand name mappings
  '7-Eleven PTY LTD': '#FF6900',
  'Coles Express Shell': '#E31837',
  'Safeway Caltex': '#FF6B35',
};

/**
 * Get brand color for a given brand name
 * @param brand - Brand name (case-insensitive)
 * @param fallback - Fallback color if brand not found (default: gray)
 * @returns Hex color value
 */
export function getBrandColor(
  brand?: string | null,
  fallback: string = '#6B7280'
): string {
  if (!brand) return fallback;

  // Try exact match first
  if (BRAND_COLORS[brand]) {
    return BRAND_COLORS[brand];
  }

  // Try case-insensitive match
  const brandKey = Object.keys(BRAND_COLORS).find(
    (key) => key.toLowerCase() === brand.toLowerCase()
  );

  if (brandKey) {
    return BRAND_COLORS[brandKey];
  }

  return fallback;
}

/**
 * Get brand color with opacity
 * @param brand - Brand name
 * @param opacity - Opacity value (0-1)
 * @returns RGBA color string
 */
export function getBrandColorWithOpacity(
  brand?: string | null,
  opacity: number = 1
): string {
  const color = getBrandColor(brand);
  
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get brand color class name for Tailwind CSS
 * Maps brand colors to Tailwind color classes where possible
 * @param brand - Brand name
 * @returns Tailwind CSS class name or inline style
 */
export function getBrandColorClass(brand?: string | null): string {
  const color = getBrandColor(brand);
  
  // Map common colors to Tailwind classes
  const colorMap: Record<string, string> = {
    '#00A651': 'text-green-600', // BP
    '#FFD700': 'text-yellow-500', // Shell
    '#FF6B35': 'text-orange-600', // Caltex
    '#FF6900': 'text-orange-500', // 7-Eleven
    '#E31837': 'text-red-600', // Coles Express
    '#1B5E20': 'text-green-800', // Woolworths
    '#1976D2': 'text-blue-600', // United
    '#E91E63': 'text-pink-600', // Puma
    '#6B46C1': 'text-purple-600', // Liberty
    '#059669': 'text-emerald-600', // Metro
    '#005BBB': 'text-blue-700', // Ampol
    '#6B7280': 'text-gray-500', // Independent/Default
  };

  return colorMap[color] || 'text-gray-500';
}

/**
 * Check if a color is light or dark
 * Used to determine text color contrast
 * @param hexColor - Hex color value
 * @returns true if color is light, false if dark
 */
export function isLightColor(hexColor: string): boolean {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
}

/**
 * Get appropriate text color (black or white) for a background color
 * @param backgroundColor - Background hex color
 * @returns '#000000' for light backgrounds, '#FFFFFF' for dark backgrounds
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#000000' : '#FFFFFF';
}

