import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import { ApiError } from '../types';

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: string;
  timestamp: string;
  path: string;
  method: string;
}

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const status = (err as ApiError).status || 500;
  const errorMessage = err.message || 'Internal Server Error';
  
  // Log error
  console.error('❌ Error:', {
    message: errorMessage,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Send to Sentry if configured
  if (process.env['SENTRY_DSN']) {
    Sentry.captureException(err, {
      extra: {
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }
    });
  }

  // Don't leak error details in production
  const isDevelopment = process.env['NODE_ENV'] === 'development';
  
  const errorResponse: ErrorResponse = {
    success: false,
    error: errorMessage,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  if (isDevelopment) {
    errorResponse.details = err.stack || '';
  }

  res.status(status).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  };

  res.status(404).json(errorResponse);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 