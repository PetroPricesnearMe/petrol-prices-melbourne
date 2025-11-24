/**
 * Rate Limiter for Service Victoria Fair Fuel API
 * 
 * Implements rate limiting to comply with Service Victoria API Terms:
 * - Maximum 10 requests per 60 seconds
 * 
 * This is a simple in-memory rate limiter. For production use with multiple
 * server instances, consider using Redis or a distributed rate limiter.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number = 10;
  private readonly windowMs: number = 60 * 1000; // 60 seconds

  /**
   * Check if a request is allowed
   * @param key - Unique identifier for the rate limit (e.g., consumer ID)
   * @returns true if request is allowed, false if rate limit exceeded
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.requests.get(key);

    // No entry or window expired, allow request
    if (!entry || now > entry.resetTime) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    // Check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return false;
    }

    // Increment count
    entry.count++;
    return true;
  }

  /**
   * Get remaining requests in current window
   * @param key - Unique identifier for the rate limit
   * @returns Number of remaining requests, or maxRequests if window expired
   */
  getRemaining(key: string): number {
    const now = Date.now();
    const entry = this.requests.get(key);

    if (!entry || now > entry.resetTime) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - entry.count);
  }

  /**
   * Get time until rate limit resets (in milliseconds)
   * @param key - Unique identifier for the rate limit
   * @returns Milliseconds until reset, or 0 if window expired
   */
  getResetTime(key: string): number {
    const now = Date.now();
    const entry = this.requests.get(key);

    if (!entry || now > entry.resetTime) {
      return 0;
    }

    return entry.resetTime - now;
  }

  /**
   * Clear all rate limit entries (useful for testing)
   */
  clear(): void {
    this.requests.clear();
  }
}

// Singleton instance
export const fairFuelRateLimiter = new RateLimiter();

/**
 * Check if a request to the Fair Fuel API is allowed
 * @param consumerId - The consumer ID making the request
 * @returns Object with allowed status and remaining requests info
 */
export function checkRateLimit(consumerId: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const allowed = fairFuelRateLimiter.isAllowed(consumerId);
  const remaining = fairFuelRateLimiter.getRemaining(consumerId);
  const resetTime = fairFuelRateLimiter.getResetTime(consumerId);

  return {
    allowed,
    remaining,
    resetTime,
  };
}

/**
 * Rate limit error class
 */
export class RateLimitError extends Error {
  constructor(
    public readonly resetTime: number,
    message = 'Rate limit exceeded. Please try again later.'
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

