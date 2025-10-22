/**
 * API Handler Wrapper
 * Unified handler for API routes with middleware support
 */

import type { NextApiRequest, NextApiResponse } from 'next';

import { errorHandler } from './middleware/errorHandler';
import type { RateLimitConfig } from './middleware/rateLimit';
import { rateLimit } from './middleware/rateLimit';
import type { ValidationSchema } from './middleware/validator';
import { validate } from './middleware/validator';
import type { ApiResponse } from './types';
import { HTTP_STATUS } from './types';
import { logger } from './utils/logger';
import { generateRequestId, successResponse } from './utils/response';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

interface RouteHandler<T = unknown> {
  (req: NextApiRequest, res: NextApiResponse): Promise<T> | T;
}

interface RouteConfig {
  validation?: ValidationSchema;
  rateLimit?: RateLimitConfig | false;
  auth?: boolean;
  cache?: {
    enabled: boolean;
    ttl: number; // seconds
  };
}

interface HandlerConfig {
  [key: string]: {
    handler: RouteHandler;
    config?: RouteConfig;
  };
}

/**
 * Create a unified API handler with middleware support
 */
export function createApiHandler(handlers: Partial<Record<HttpMethod, RouteHandler>>, config?: RouteConfig) {
  return async (req: NextApiRequest, res: NextApiResponse<ApiResponse>): Promise<void> => {
    const startTime = Date.now();
    const requestId = generateRequestId();
    const method = req.method as HttpMethod;

    // Set request ID header
    res.setHeader('X-Request-Id', requestId);
    req.headers['x-request-id'] = requestId;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Handle OPTIONS for CORS preflight
    if (method === 'OPTIONS') {
      res.status(HTTP_STATUS.OK).end();
      return;
    }

    try {
      // Log request
      logger.apiRequest(method, req.url || '', {
        query: req.query,
        body: req.body,
        requestId,
      });

      // Check if method is allowed
      const handler = handlers[method];
      if (!handler) {
        res.setHeader('Allow', Object.keys(handlers).join(', '));
        res.status(405).json({
          success: false,
          error: {
            code: 'METHOD_NOT_ALLOWED',
            message: `Method ${method} not allowed`,
            statusCode: 405,
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId,
          },
        });
        return;
      }

      // Apply rate limiting
      if (config?.rateLimit !== false) {
        const rateLimitConfig = config?.rateLimit || {};
        await rateLimit(rateLimitConfig)(req, res, async () => {});
      }

      // Apply validation
      if (config?.validation) {
        await validate(config.validation)(req);
      }

      // Execute handler
      const result = await handler(req, res);

      // If response not sent, send success response
      if (!res.headersSent && result !== undefined) {
        successResponse(res, result, HTTP_STATUS.OK, { requestId });
      }

      // Log response
      const duration = Date.now() - startTime;
      logger.apiResponse(method, req.url || '', res.statusCode, duration);

    } catch (error) {
      logger.apiError(method, req.url || '', error as Error);
      errorHandler(error as Error, req, res);
    }
  };
}

/**
 * Create multiple route handlers with different configurations
 */
export function createRouteHandlers(config: HandlerConfig) {
  const handlers: Partial<Record<HttpMethod, RouteHandler>> = {};

  Object.entries(config).forEach(([method, { handler }]) => {
    handlers[method as HttpMethod] = handler;
  });

  // Merge all route configs
  const mergedConfig: RouteConfig = {};
  Object.values(config).forEach(({ config: routeConfig }) => {
    if (routeConfig) {
      Object.assign(mergedConfig, routeConfig);
    }
  });

  return createApiHandler(handlers, mergedConfig);
}

/**
 * Async wrapper for try-catch blocks
 */
export function asyncHandler<T>(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<T>
): RouteHandler<T> {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<T> => {
    try {
      return await handler(req, res);
    } catch (error) {
      throw error;
    }
  };
}

export default createApiHandler;
