/**
 * Centralized Error Handling
 * Provides consistent error responses and logging across all API routes
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// ============================================================================
// ERROR TYPES
// ============================================================================

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

// ============================================================================
// ERROR HANDLER
// ============================================================================

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
  requestId?: string;
}

/**
 * Centralized error handler for API routes
 */
export function handleAPIError(error: unknown, requestId?: string): NextResponse<ErrorResponse> {
  // Log error (in production, send to logging service)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to logging service (Sentry, LogRocket, etc.)
    console.error('API Error:', error);
  } else {
    console.error('API Error:', error);
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.flatten(),
        timestamp: new Date().toISOString(),
        requestId,
      },
      { status: 400 }
    );
  }

  // Handle custom API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString(),
        requestId,
      },
      { status: error.statusCode }
    );
  }

  // Handle fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return NextResponse.json(
      {
        success: false,
        error: 'External service unavailable',
        code: 'SERVICE_UNAVAILABLE',
        timestamp: new Date().toISOString(),
        requestId,
      },
      { status: 503 }
    );
  }

  // Handle generic errors
  const message = error instanceof Error ? error.message : 'Internal server error';
  
  return NextResponse.json(
    {
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : message,
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
      timestamp: new Date().toISOString(),
      requestId,
    },
    { status: 500 }
  );
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  options: {
    message?: string;
    statusCode?: number;
    headers?: Record<string, string>;
    cached?: boolean;
    requestId?: string;
  } = {}
): NextResponse {
  const {
    message,
    statusCode = 200,
    headers = {},
    cached = false,
    requestId,
  } = options;

  return NextResponse.json(
    {
      success: true,
      ...(message && { message }),
      data,
      cached,
      timestamp: new Date().toISOString(),
      requestId,
    },
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': cached ? 'public, max-age=3600' : 'no-cache',
        ...headers,
      },
    }
  );
}

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Try-catch wrapper for async route handlers
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    const requestId = generateRequestId();
    
    try {
      return await handler(...args);
    } catch (error) {
      return handleAPIError(error, requestId);
    }
  }) as T;
}

