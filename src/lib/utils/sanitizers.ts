/**
 * Sanitizers - Security Utility Functions
 *
 * Functions for sanitizing user input to prevent XSS attacks
 * and ensure data integrity.
 *
 * Migrated from securityUtils.js and enhanced with TypeScript.
 *
 * @module lib/utils/sanitizers
 */

/**
 * HTML entity map for XSS prevention
 */
const HTML_ENTITIES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '&': '&amp;',
} as const;

/**
 * Sanitize string input to prevent XSS attacks
 *
 * @param input - String to sanitize
 * @param maxLength - Maximum length (default: 255)
 * @returns Sanitized string
 *
 * @example
 * ```typescript
 * sanitizeString('<script>alert("xss")</script>'); // '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * sanitizeString('Hello World', 5);                // 'Hello'
 * ```
 */
export function sanitizeString(
  input: unknown,
  maxLength: number = 255
): string {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>"'&]/g, (match) => HTML_ENTITIES[match] || match);
}

/**
 * Sanitize object properties recursively
 *
 * @param obj - Object to sanitize
 * @param maxLength - Maximum string length
 * @returns Sanitized object
 *
 * @example
 * ```typescript
 * sanitizeObject({ name: '<script>', age: 25 });
 * // { name: '&lt;script&gt;', age: 25 }
 * ```
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  maxLength: number = 255
): T {
  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value, maxLength) as T[Extract<
        keyof T,
        string
      >];
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(
        value as Record<string, unknown>,
        maxLength
      ) as T[Extract<keyof T, string>];
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string' ? sanitizeString(item, maxLength) : item
      ) as T[Extract<keyof T, string>];
    }
  }

  return sanitized;
}

/**
 * Validate and sanitize station data from API
 *
 * @param station - Station data object
 * @returns Sanitized station data
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * try {
 *   const clean = validateAndSanitizeStation(rawStation);
 * } catch (error) {
 *   console.error(error.message);
 * }
 * ```
 */
export function validateAndSanitizeStation(station: unknown): {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  suburb?: string;
  brand?: string;
  phone?: string;
  prices?: Record<string, number>;
} {
  if (!station || typeof station !== 'object') {
    throw new Error('Invalid station data: must be an object');
  }

  const stationObj = station as Record<string, unknown>;
  const errors: string[] = [];
  const sanitized: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
    suburb?: string;
    brand?: string;
    phone?: string;
    prices?: Record<string, number>;
  } = {
    name: '',
    address: '',
  };

  // Validate required fields
  if (!stationObj.name || typeof stationObj.name !== 'string') {
    errors.push('Station name is required and must be a string');
  } else {
    sanitized.name = sanitizeString(stationObj.name, 100);
  }

  if (!stationObj.address || typeof stationObj.address !== 'string') {
    errors.push('Station address is required and must be a string');
  } else {
    sanitized.address = sanitizeString(stationObj.address, 200);
  }

  // Validate coordinates if provided
  if (stationObj.latitude !== undefined || stationObj.longitude !== undefined) {
    const lat = stationObj.latitude;
    const lng = stationObj.longitude;

    const latNum = typeof lat === 'string' ? parseFloat(lat) : (lat as number);
    const lngNum = typeof lng === 'string' ? parseFloat(lng) : (lng as number);

    if (
      isNaN(latNum) ||
      isNaN(lngNum) ||
      latNum < -90 ||
      latNum > 90 ||
      lngNum < -180 ||
      lngNum > 180
    ) {
      errors.push('Invalid coordinates provided');
    } else {
      sanitized.latitude = latNum;
      sanitized.longitude = lngNum;
    }
  }

  // Validate prices if provided
  if (
    stationObj.prices &&
    typeof stationObj.prices === 'object' &&
    !Array.isArray(stationObj.prices)
  ) {
    sanitized.prices = {};
    const prices = stationObj.prices as Record<string, unknown>;

    Object.keys(prices).forEach((fuelType) => {
      const price =
        typeof prices[fuelType] === 'string'
          ? parseFloat(prices[fuelType] as string)
          : (prices[fuelType] as number);

      if (!isNaN(price) && price >= 0 && price <= 1000) {
        sanitized.prices![fuelType] = price;
      }
    });
  }

  // Sanitize optional fields
  if (stationObj.suburb && typeof stationObj.suburb === 'string') {
    sanitized.suburb = sanitizeString(stationObj.suburb, 50);
  }

  if (stationObj.brand && typeof stationObj.brand === 'string') {
    sanitized.brand = sanitizeString(stationObj.brand, 50);
  }

  if (stationObj.phone) {
    const phone = String(stationObj.phone);
    if (/^[\+]?[\d\s\-\(\)]+$/.test(phone)) {
      sanitized.phone = phone;
    }
  }

  if (errors.length > 0) {
    throw new Error(`Station validation failed: ${errors.join(', ')}`);
  }

  return sanitized;
}
