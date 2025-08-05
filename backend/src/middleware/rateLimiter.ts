import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { RateLimitConfig } from '../types';
import config from '../config';

// Create Redis client if configured
const redisClient = config.redis ? new Redis({
  host: config.redis.host,
  port: config.redis.port,
  ...(config.redis.password && { password: config.redis.password }),
  ...(config.redis.db && { db: config.redis.db })
}) : null;

// Default rate limit configuration
const defaultRateLimitConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
};

// Create rate limiter with Redis store if available, otherwise use memory store
export const createRateLimiter = (options: Partial<RateLimitConfig> = {}) => {
  const config: RateLimitConfig = { ...defaultRateLimitConfig, ...options };
  
  if (redisClient) {
    return rateLimit({
      ...config,
      store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.call(args[0] || '', ...args.slice(1)) as any,
      }),
    });
  }
  
  return rateLimit(config);
};

// Specific rate limiters for different endpoints
export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many API requests from this IP, please try again later.'
});

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts from this IP, please try again later.'
});

export const searchLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // limit each IP to 50 search requests per windowMs
  message: 'Too many search requests from this IP, please try again later.'
});

export const createLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 create requests per hour
  message: 'Too many create requests from this IP, please try again later.'
});

export const updateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 update requests per hour
  message: 'Too many update requests from this IP, please try again later.'
});

export const deleteLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 delete requests per hour
  message: 'Too many delete requests from this IP, please try again later.'
});

// Health check endpoint (no rate limiting)
export const healthCheckLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // very high limit for health checks
  message: 'Too many health check requests from this IP.'
});

// Export Redis client for other uses
export { redisClient }; 