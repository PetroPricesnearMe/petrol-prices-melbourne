/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse
 */

import type { NextApiRequest, NextApiResponse } from 'next';

import { errors } from './errorHandler';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  check(
    identifier: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; reset: Date } {
    const now = Date.now();
    const entry = this.store[identifier];

    if (!entry || entry.resetTime < now) {
      // New window
      this.store[identifier] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return {
        allowed: true,
        remaining: limit - 1,
        reset: new Date(now + windowMs),
      };
    }

    if (entry.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        reset: new Date(entry.resetTime),
      };
    }

    entry.count++;
    return {
      allowed: true,
      remaining: limit - entry.count,
      reset: new Date(entry.resetTime),
    };
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
  }
}

const limiter = new RateLimiter();

export interface RateLimitConfig {
  limit?: number; // requests per window
  windowMs?: number; // window duration in milliseconds
  keyGenerator?: (req: NextApiRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

const defaultConfig: Required<RateLimitConfig> = {
  limit: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  keyGenerator: (req) => {
    // Use IP address as default identifier
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded
      ? Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(',')[0]
      : req.socket.remoteAddress;
    return ip || 'unknown';
  },
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

export function rateLimit(config: RateLimitConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config };

  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void | Promise<void>
  ): Promise<void> => {
    const identifier = finalConfig.keyGenerator(req);
    const { allowed, remaining, reset } = limiter.check(
      identifier,
      finalConfig.limit,
      finalConfig.windowMs
    );

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', finalConfig.limit.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', reset.toISOString());

    if (!allowed) {
      const retryAfter = Math.ceil((reset.getTime() - Date.now()) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());

      throw errors.rateLimitExceeded(
        `Rate limit exceeded. Try again in ${retryAfter} seconds.`
      );
    }

    await next();
  };
}

// Preset configurations
export const rateLimitPresets = {
  strict: { limit: 10, windowMs: 60000 }, // 10 req/min
  moderate: { limit: 60, windowMs: 60000 }, // 60 req/min
  lenient: { limit: 100, windowMs: 60000 }, // 100 req/min
  api: { limit: 100, windowMs: 15 * 60000 }, // 100 req/15min
  auth: { limit: 5, windowMs: 15 * 60000 }, // 5 req/15min (for login attempts)
};

export default limiter;
