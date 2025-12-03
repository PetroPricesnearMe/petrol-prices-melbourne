/**
 * Security utility functions for input validation and sanitization
 */

// Input sanitization patterns
const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[\d\s\-()]+$/,
  postcode: /^[0-9]{4}$/,
  coordinates: /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/,
  alphanumeric: /^[a-zA-Z0-9\s\-_]+$/,
  searchQuery: /^[a-zA-Z0-9\s\-_.,&'()]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/
};

/**
 * Sanitize string input to prevent XSS attacks
 */
export const sanitizeString = (input, maxLength = 255) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>"']/g, (match) => {
      const htmlEntities = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return htmlEntities[match] || match;
    });
};

/**
 * Validate email address
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return PATTERNS.email.test(email) && email.length <= 254;
};

/**
 * Validate search query input
 */
export const validateSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return false;
  const sanitized = sanitizeString(query, 100);
  return PATTERNS.searchQuery.test(sanitized) && sanitized.length >= 2;
};

/**
 * Validate coordinates (latitude/longitude)
 */
export const validateCoordinates = (lat, lng) => {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  
  return !isNaN(latNum) && 
         !isNaN(lngNum) && 
         latNum >= -90 && 
         latNum <= 90 && 
         lngNum >= -180 && 
         lngNum <= 180;
};

/**
 * Validate and sanitize station data from API
 */
export const validateStationData = (station) => {
  if (!station || typeof station !== 'object') {
    throw new Error('Invalid station data: must be an object');
  }
  
  const errors = [];
  const sanitized = {};
  
  // Validate required fields
  if (!station.name || typeof station.name !== 'string') {
    errors.push('Station name is required and must be a string');
  } else {
    sanitized.name = sanitizeString(station.name, 100);
  }
  
  if (!station.address || typeof station.address !== 'string') {
    errors.push('Station address is required and must be a string');
  } else {
    sanitized.address = sanitizeString(station.address, 200);
  }
  
  // Validate coordinates if provided
  if (station.latitude !== undefined || station.longitude !== undefined) {
    if (!validateCoordinates(station.latitude, station.longitude)) {
      errors.push('Invalid coordinates provided');
    } else {
      sanitized.latitude = parseFloat(station.latitude);
      sanitized.longitude = parseFloat(station.longitude);
    }
  }
  
  // Validate prices if provided
  if (station.prices && typeof station.prices === 'object') {
    sanitized.prices = {};
    Object.keys(station.prices).forEach(fuelType => {
      const price = parseFloat(station.prices[fuelType]);
      if (!isNaN(price) && price >= 0 && price <= 1000) {
        sanitized.prices[fuelType] = price;
      }
    });
  }
  
  // Sanitize optional fields
  if (station.suburb) {
    sanitized.suburb = sanitizeString(station.suburb, 50);
  }
  
  if (station.brand) {
    sanitized.brand = sanitizeString(station.brand, 50);
  }
  
  if (station.phone) {
    const phone = station.phone.toString();
    if (PATTERNS.phone.test(phone)) {
      sanitized.phone = phone;
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Station validation failed: ${errors.join(', ')}`);
  }
  
  return sanitized;
};

/**
 * Rate limiting for API calls
 */
export class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }
  
  isAllowed(identifier = 'default') {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const userRequests = this.requests.get(identifier);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => time > windowStart);
    this.requests.set(identifier, validRequests);
    
    // Check if under the limit
    if (validRequests.length < this.maxRequests) {
      validRequests.push(now);
      return true;
    }
    
    return false;
  }
  
  getRemainingRequests(identifier = 'default') {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const userRequests = this.requests.get(identifier) || [];
    const validRequests = userRequests.filter(time => time > windowStart);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

/**
 * Content Security Policy helpers
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for inline scripts in production builds
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components
    "https://fonts.googleapis.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "https:",
    "blob:"
  ],
  'connect-src': [
    "'self'",
    "https://api.baserow.io",
    "wss://api.baserow.io",
    "https://www.google-analytics.com"
  ],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};

/**
 * Generate CSP header value
 */
export const generateCSPHeader = () => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

/**
 * Secure localStorage with encryption (simple implementation)
 */
export class SecureStorage {
  constructor(prefix = 'app_') {
    this.prefix = prefix;
  }
  
  // Simple encryption using base64 and reverse (not for sensitive data)
  encrypt(data) {
    try {
      const jsonString = JSON.stringify(data);
      const encoded = btoa(jsonString).split('').reverse().join('');
      return encoded;
    } catch (e) {
      console.error('Encryption failed:', e);
      return null;
    }
  }
  
  decrypt(encryptedData) {
    try {
      const decoded = atob(encryptedData.split('').reverse().join(''));
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Decryption failed:', e);
      return null;
    }
  }
  
  setItem(key, value) {
    try {
      const encrypted = this.encrypt(value);
      if (encrypted) {
        localStorage.setItem(this.prefix + key, encrypted);
        return true;
      }
    } catch (e) {
      console.error('SecureStorage setItem failed:', e);
    }
    return false;
  }
  
  getItem(key) {
    try {
      const encrypted = localStorage.getItem(this.prefix + key);
      if (encrypted) {
        return this.decrypt(encrypted);
      }
    } catch (e) {
      console.error('SecureStorage getItem failed:', e);
    }
    return null;
  }
  
  removeItem(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (e) {
      console.error('SecureStorage removeItem failed:', e);
      return false;
    }
  }
}

// Create default instances
export const apiRateLimiter = new RateLimiter(100, 60000); // 100 requests per minute
export const secureStorage = new SecureStorage('ppnm_');
