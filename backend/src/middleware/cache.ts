import { Request, Response, NextFunction } from 'express';
import { redisClient } from './rateLimiter';
import { CacheConfig, CacheEntry } from '../types';

const defaultCacheConfig: CacheConfig = {
  ttl: 300, // 5 minutes default
  keyPrefix: 'api:'
};

export const createCacheMiddleware = (options: Partial<CacheConfig> = {}) => {
  const config: CacheConfig = { ...defaultCacheConfig, ...options };
  
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching if Redis is not available
    if (!redisClient) {
      return next();
    }

    // Skip caching if explicitly disabled
    if (req.query['nocache'] === 'true') {
      return next();
    }

    const cacheKey = `${config.keyPrefix}${req.originalUrl}`;

    try {
      // Try to get cached response
      const cached = await redisClient.get(cacheKey);
      
      if (cached) {
        const cacheEntry: CacheEntry<any> = JSON.parse(cached);
        
        // Check if cache is still valid
        const now = Date.now();
        if (now - cacheEntry.timestamp < cacheEntry.ttl * 1000) {
          console.log(`📦 Cache hit for: ${req.originalUrl}`);
          return res.json(cacheEntry.data);
        }
      }

      // Cache miss or expired, proceed with request
      console.log(`💾 Cache miss for: ${req.originalUrl}`);
      
      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = function(data: any) {
        // Cache the response
        const cacheEntry: CacheEntry<any> = {
          data,
          timestamp: Date.now(),
          ttl: config.ttl
        };
        
        redisClient?.setex(cacheKey, config.ttl, JSON.stringify(cacheEntry))
          .catch(err => console.error('❌ Cache set error:', err));
        
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('❌ Cache middleware error:', error);
      next();
    }
  };
};

// Specific cache configurations for different endpoints
export const stationCache = createCacheMiddleware({
  ttl: 600, // 10 minutes for station data
  keyPrefix: 'api:stations:'
});

export const priceCache = createCacheMiddleware({
  ttl: 300, // 5 minutes for price data
  keyPrefix: 'api:prices:'
});

export const searchCache = createCacheMiddleware({
  ttl: 180, // 3 minutes for search results
  keyPrefix: 'api:search:'
});

export const tableCache = createCacheMiddleware({
  ttl: 3600, // 1 hour for table metadata
  keyPrefix: 'api:tables:'
});

// Cache invalidation utility
export const invalidateCache = async (pattern: string): Promise<void> => {
  if (!redisClient) return;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
      console.log(`🗑️ Invalidated ${keys.length} cache entries for pattern: ${pattern}`);
    }
  } catch (error) {
    console.error('❌ Cache invalidation error:', error);
  }
};

// Cache warming utility
export const warmCache = async (url: string, data: any, ttl: number = 300): Promise<void> => {
  if (!redisClient) return;
  
  try {
    const cacheKey = `api:${url}`;
    const cacheEntry: CacheEntry<any> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    await redisClient.setex(cacheKey, ttl, JSON.stringify(cacheEntry));
    console.log(`🔥 Cache warmed for: ${url}`);
  } catch (error) {
    console.error('❌ Cache warming error:', error);
  }
}; 