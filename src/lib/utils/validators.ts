/**
 * Validators - Utility Functions
 *
 * Pure functions for validating data.
 * All functions return boolean values.
 *
 * Consolidated from securityUtils.js and enhanced with TypeScript.
 *
 * @module lib/utils/validators
 */

/**
 * Validation patterns
 */
const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[\d\s\-\(\)]+$/,
  postcode: /^[0-9]{4}$/,
  coordinates: /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/,
  alphanumeric: /^[a-zA-Z0-9\s\-_]+$/,
  searchQuery: /^[a-zA-Z0-9\s\-_.,&'()]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
} as const;

/**
 * Validate email address
 *
 * @param email - Email string to validate
 * @returns True if valid email
 *
 * @example
 * ```typescript
 * isValidEmail('test@example.com'); // true
 * isValidEmail('invalid');          // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return PATTERNS.email.test(email) && email.length <= 254;
}

/**
 * Validate phone number (Australian format)
 *
 * @param phone - Phone number string
 * @returns True if valid phone number
 *
 * @example
 * ```typescript
 * isValidPhone('0412345678'); // true
 * isValidPhone('123');        // false
 * ```
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  return PATTERNS.phone.test(phone);
}

/**
 * Validate Australian phone number (strict)
 *
 * @param phone - Phone number string
 * @returns True if valid Australian phone
 *
 * @example
 * ```typescript
 * isValidAustralianPhone('0412345678'); // true
 * isValidAustralianPhone('123');        // false
 * ```
 */
export function isValidAustralianPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/\D/g, '');
  // Australian mobile (04XX XXX XXX) or landline (0X XXXX XXXX)
  return /^0[2-478]\d{8}$/.test(cleaned);
}

/**
 * Validate URL
 *
 * @param url - URL string to validate
 * @returns True if valid URL
 *
 * @example
 * ```typescript
 * isValidUrl('https://example.com'); // true
 * isValidUrl('not a url');           // false
 * ```
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate postcode (Australian)
 *
 * @param postcode - Postcode string
 * @returns True if valid Australian postcode
 *
 * @example
 * ```typescript
 * isValidPostcode('3000'); // true
 * isValidPostcode('123');  // false
 * ```
 */
export function isValidPostcode(postcode: string): boolean {
  if (!postcode || typeof postcode !== 'string') return false;
  return PATTERNS.postcode.test(postcode);
}

/**
 * Validate search query input
 *
 * @param query - Search query string
 * @returns True if valid search query
 *
 * @example
 * ```typescript
 * isValidSearchQuery('petrol station'); // true
 * isValidSearchQuery('a');              // false (too short)
 * ```
 */
export function isValidSearchQuery(query: string): boolean {
  if (!query || typeof query !== 'string') return false;
  // Basic sanitization: trim and limit length
  const sanitized = query.trim().slice(0, 100);
  return PATTERNS.searchQuery.test(sanitized) && sanitized.length >= 2;
}

/**
 * Validate coordinates (latitude/longitude)
 *
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns True if valid coordinates
 *
 * @example
 * ```typescript
 * isValidCoordinates(-37.8136, 144.9631); // true
 * isValidCoordinates(91, 0);              // false
 * ```
 */
export function isValidCoordinates(
  lat: number | string,
  lng: number | string
): boolean {
  const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
  const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;

  return (
    !isNaN(latNum) &&
    !isNaN(lngNum) &&
    latNum >= -90 &&
    latNum <= 90 &&
    lngNum >= -180 &&
    lngNum <= 180
  );
}

/**
 * Check if string is empty or whitespace
 *
 * @param value - String to check
 * @returns True if empty or whitespace
 *
 * @example
 * ```typescript
 * isEmpty('');      // true
 * isEmpty('  ');    // true
 * isEmpty('hello'); // false
 * ```
 */
export function isEmpty(value: string): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Check if value is a number
 *
 * @param value - Value to check
 * @returns True if valid number
 *
 * @example
 * ```typescript
 * isNumber(123);    // true
 * isNumber('123');  // true
 * isNumber('abc');  // false
 * ```
 */
export function isNumber(value: unknown): boolean {
  return !isNaN(Number(value)) && isFinite(Number(value));
}

/**
 * Check if value is within range
 *
 * @param value - Value to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if in range
 *
 * @example
 * ```typescript
 * isInRange(5, 1, 10);  // true
 * isInRange(15, 1, 10); // false
 * ```
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Check if string matches pattern
 *
 * @param value - String to check
 * @param pattern - RegExp pattern
 * @returns True if matches pattern
 *
 * @example
 * ```typescript
 * matchesPattern('abc123', /^[a-z]+\d+$/); // true
 * ```
 */
export function matchesPattern(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

/**
 * Validate credit card number (Luhn algorithm)
 *
 * @param cardNumber - Credit card number
 * @returns True if valid card number
 *
 * @example
 * ```typescript
 * isValidCreditCard('4532015112830366'); // true
 * isValidCreditCard('1234567890123456'); // false
 * ```
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, '');

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Check if date is in the past
 *
 * @param date - Date to check
 * @returns True if date is in the past
 *
 * @example
 * ```typescript
 * isPastDate(new Date('2020-01-01')); // true
 * isPastDate(new Date('2030-01-01')); // false
 * ```
 */
export function isPastDate(date: Date): boolean {
  return date < new Date();
}

/**
 * Check if date is in the future
 *
 * @param date - Date to check
 * @returns True if date is in the future
 *
 * @example
 * ```typescript
 * isFutureDate(new Date('2030-01-01')); // true
 * isFutureDate(new Date('2020-01-01')); // false
 * ```
 */
export function isFutureDate(date: Date): boolean {
  return date > new Date();
}

/**
 * Check if password is strong
 *
 * @param password - Password to check
 * @returns True if strong password
 *
 * Criteria:
 * - At least 8 characters
 * - Contains uppercase letter
 * - Contains lowercase letter
 * - Contains number
 * - Contains special character
 *
 * @example
 * ```typescript
 * isStrongPassword('Pass123!'); // true
 * isStrongPassword('weak');     // false
 * ```
 */
export function isStrongPassword(password: string): boolean {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  );
}
