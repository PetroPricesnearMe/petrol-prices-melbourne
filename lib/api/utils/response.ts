/**
 * API Response Utilities
 * Standardized response formatting
 */

import type { NextApiResponse } from 'next';

import type { ApiResponse, PaginationMeta, RateLimitMeta } from '../types';
import { HTTP_STATUS } from '../types';

export function successResponse<T>(
  res: NextApiResponse<ApiResponse<T>>,
  data: T,
  statusCode: number = HTTP_STATUS.OK,
  meta?: Partial<ApiResponse['meta']>
): void {
  res.status(statusCode).json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: meta?.requestId || generateRequestId(),
      ...meta,
    },
  });
}

export function paginatedResponse<T>(
  res: NextApiResponse<ApiResponse<T[]>>,
  data: T[],
  pagination: PaginationMeta,
  meta?: Partial<ApiResponse['meta']>
): void {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: meta?.requestId || generateRequestId(),
      pagination,
      ...meta,
    },
  });
}

export function createdResponse<T>(
  res: NextApiResponse<ApiResponse<T>>,
  data: T,
  meta?: Partial<ApiResponse['meta']>
): void {
  successResponse(res, data, HTTP_STATUS.CREATED, meta);
}

export function noContentResponse(
  res: NextApiResponse
): void {
  res.status(HTTP_STATUS.NO_CONTENT).end();
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function calculatePagination(
  totalItems: number,
  page: number,
  pageSize: number
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}

export function getRateLimitInfo(res: NextApiResponse): RateLimitMeta | undefined {
  const limit = res.getHeader('X-RateLimit-Limit');
  const remaining = res.getHeader('X-RateLimit-Remaining');
  const reset = res.getHeader('X-RateLimit-Reset');

  if (limit && remaining && reset) {
    return {
      limit: parseInt(limit.toString(), 10),
      remaining: parseInt(remaining.toString(), 10),
      reset: reset.toString(),
    };
  }

  return undefined;
}
