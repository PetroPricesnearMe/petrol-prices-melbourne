/**
 * Price formatting utilities
 * 
 * Provides consistent price formatting across the application
 * with support for different display formats (currency, cents/L, etc.)
 */

/**
 * Format price as currency (e.g., $1.50)
 * @param price - Price value
 * @param currency - Currency code (default: AUD)
 * @param options - Formatting options
 * @returns Formatted price string
 */
export function formatPrice(
  price: number | null | undefined,
  currency: string = 'AUD',
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  if (price === null || price === undefined || price === 0) {
    return 'N/A';
  }

  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(price);
}

/**
 * Format price as cents per liter (e.g., 150.5¢/L)
 * This is the standard format for fuel prices in Australia
 * @param price - Price in cents per liter
 * @returns Formatted price string
 */
export function formatPriceCentsPerLiter(
  price: number | null | undefined
): string {
  if (price === null || price === undefined || price === 0) {
    return 'N/A';
  }
  return `${price.toFixed(1)}¢/L`;
}

/**
 * Format price as cents only (e.g., 150.5¢)
 * @param price - Price in cents
 * @returns Formatted price string
 */
export function formatPriceCents(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) {
    return 'N/A';
  }
  return `${price.toFixed(1)}¢`;
}

/**
 * Format price with custom decimal places (e.g., $1.5 or $1.50)
 * @param price - Price value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted price string
 */
export function formatPriceDecimal(
  price: number | null | undefined,
  decimals: number = 1
): string {
  if (price === null || price === undefined || price === 0) {
    return 'N/A';
  }
  return `$${price.toFixed(decimals)}`;
}

/**
 * Get price color class based on price value
 * Used for visual price indicators (green = cheap, red = expensive)
 * @param price - Price in cents per liter
 * @returns Tailwind CSS color class
 */
export function getPriceColorClass(price: number | null): string {
  if (price === null) return 'text-gray-400';
  if (price < 200) return 'text-green-600';
  if (price <= 210) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Get price color value (hex) based on price value
 * @param price - Price in cents per liter
 * @returns Hex color value
 */
export function getPriceColor(price: number | null): string {
  if (price === null) return '#9CA3AF'; // gray-400
  if (price < 200) return '#16A34A'; // green-600
  if (price <= 210) return '#CA8A04'; // yellow-600
  return '#DC2626'; // red-600
}

