/**
 * Formatters - Utility Functions
 *
 * Pure functions for formatting data into human-readable strings.
 * All functions are type-safe and handle edge cases.
 *
 * Consolidated from multiple utility files for DRY principles.
 *
 * @module lib/utils/formatters
 */

/**
 * Format distance in meters to human-readable string
 *
 * @param meters - Distance in meters
 * @returns Formatted distance (e.g., "1.2 km", "500 m")
 *
 * @example
 * ```typescript
 * formatDistance(1234); // "1.2 km"
 * formatDistance(500);  // "500 m"
 * formatDistance(0);    // "0 m"
 * ```
 */
export function formatDistance(meters: number): string {
  if (meters < 0) return '0 m';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format price with currency symbol
 *
 * @param price - Price value
 * @param currency - Currency code (default: 'AUD')
 * @returns Formatted price (e.g., "$1.85", "$1.50")
 *
 * @example
 * ```typescript
 * formatPrice(1.85);        // "$1.85"
 * formatPrice(1.5);         // "$1.50"
 * formatPrice(1.234, 'USD'); // "$1.23"
 * ```
 */
export function formatPrice(price: number, currency: string = 'AUD'): string {
  const formatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(price);
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 *
 * @param date - Date to format
 * @returns Relative time string
 *
 * @example
 * ```typescript
 * formatRelativeTime(new Date(Date.now() - 3600000)); // "1 hour ago"
 * formatRelativeTime(new Date(Date.now() - 86400000)); // "1 day ago"
 * ```
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  // For older dates, show formatted date
  return formatDate(date);
}

/**
 * Format date to localized string
 *
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDate(new Date()); // "Nov 11, 2025"
 * formatDate(new Date(), { dateStyle: 'full' }); // "Tuesday, November 11, 2025"
 * ```
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat('en-AU', options).format(date);
}

/**
 * Format phone number to Australian format
 *
 * @param phone - Phone number string
 * @returns Formatted phone number
 *
 * @example
 * ```typescript
 * formatPhoneNumber('0412345678'); // "0412 345 678"
 * formatPhoneNumber('0298765432'); // "02 9876 5432"
 * ```
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Mobile: 04XX XXX XXX
  if (cleaned.startsWith('04') && cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  // Landline: 0X XXXX XXXX
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
  }

  return phone;
}

/**
 * Format number with thousands separator
 *
 * @param value - Number to format
 * @returns Formatted number string
 *
 * @example
 * ```typescript
 * formatNumber(1234567); // "1,234,567"
 * formatNumber(1000);    // "1,000"
 * ```
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-AU').format(value);
}

/**
 * Format percentage
 *
 * @param value - Decimal value (0.15 = 15%)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 *
 * @example
 * ```typescript
 * formatPercentage(0.1542);    // "15.42%"
 * formatPercentage(0.1542, 0); // "15%"
 * ```
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format file size to human-readable string
 *
 * @param bytes - File size in bytes
 * @returns Formatted file size
 *
 * @example
 * ```typescript
 * formatFileSize(1024);      // "1 KB"
 * formatFileSize(1048576);   // "1 MB"
 * formatFileSize(1073741824); // "1 GB"
 * ```
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Truncate string with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 *
 * @example
 * ```typescript
 * truncate('Hello World', 8); // "Hello..."
 * truncate('Hi', 10);         // "Hi"
 * ```
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Convert string to slug (URL-friendly)
 *
 * @param text - Text to convert
 * @returns Slug string
 *
 * @example
 * ```typescript
 * slugify('Hello World!');    // "hello-world"
 * slugify('Café au Lait');    // "cafe-au-lait"
 * ```
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens
    .trim();
}

/**
 * Capitalize first letter of string
 *
 * @param text - Text to capitalize
 * @returns Capitalized string
 *
 * @example
 * ```typescript
 * capitalize('hello world'); // "Hello world"
 * capitalize('HELLO');        // "Hello"
 * ```
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 *
 * @param text - Text to convert
 * @returns Title case string
 *
 * @example
 * ```typescript
 * titleCase('hello world');    // "Hello World"
 * titleCase('the quick brown'); // "The Quick Brown"
 * ```
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
