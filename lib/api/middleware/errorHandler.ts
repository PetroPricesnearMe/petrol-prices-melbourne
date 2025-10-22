/**
 * API Error Handler Middleware
 * Centralized error handling for API routes
 */

import type { NextApiRequest, NextApiResponse } from 'next';

import type { ApiError, ApiResponse } from '../types';
import { ApiErrorCode, HTTP_STATUS } from '../types';
import { logger } from '../utils/logger';

export class ApiException extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiException';
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  error: Error | ApiException,
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): void {
  // Log the error
  logger.error('API Error:', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    requestId: req.headers['x-request-id'],
  });

  // Handle known API exceptions
  if (error instanceof ApiException) {
    const apiError: ApiError = {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    };

    res.status(error.statusCode).json({
      success: false,
      error: apiError,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req.headers['x-request-id'] as string) || generateRequestId(),
      },
    });
    return;
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    const apiError: ApiError = {
      code: ApiErrorCode.VALIDATION_ERROR,
      message: 'Validation failed',
      statusCode: HTTP_STATUS.BAD_REQUEST,
      details: { validationErrors: error.message },
    };

    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: apiError,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req.headers['x-request-id'] as string) || generateRequestId(),
      },
    });
    return;
  }

  // Handle unknown errors
  const apiError: ApiError = {
    code: ApiErrorCode.INTERNAL_ERROR,
    message: process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred'
      : error.message,
    statusCode: HTTP_STATUS.INTERNAL_ERROR,
  };

  res.status(HTTP_STATUS.INTERNAL_ERROR).json({
    success: false,
    error: apiError,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: (req.headers['x-request-id'] as string) || generateRequestId(),
    },
  });
}

export function createError(
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
): ApiException {
  return new ApiException(statusCode, code, message, details);
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Common error creators
export const errors = {
  badRequest: (message = 'Bad request', details?: Record<string, unknown>) =>
    createError(HTTP_STATUS.BAD_REQUEST, ApiErrorCode.BAD_REQUEST, message, details),

  unauthorized: (message = 'Unauthorized') =>
    createError(HTTP_STATUS.UNAUTHORIZED, ApiErrorCode.UNAUTHORIZED, message),

  forbidden: (message = 'Forbidden') =>
    createError(HTTP_STATUS.FORBIDDEN, ApiErrorCode.FORBIDDEN, message),

  notFound: (message = 'Resource not found') =>
    createError(HTTP_STATUS.NOT_FOUND, ApiErrorCode.NOT_FOUND, message),

  rateLimitExceeded: (message = 'Rate limit exceeded') =>
    createError(
      HTTP_STATUS.RATE_LIMIT_EXCEEDED,
      ApiErrorCode.RATE_LIMIT_EXCEEDED,
      message
    ),

  internalError: (message = 'Internal server error') =>
    createError(HTTP_STATUS.INTERNAL_ERROR, ApiErrorCode.INTERNAL_ERROR, message),

  serviceUnavailable: (message = 'Service temporarily unavailable') =>
    createError(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      ApiErrorCode.SERVICE_UNAVAILABLE,
      message
    ),
};
