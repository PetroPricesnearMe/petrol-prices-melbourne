/**
 * CMS Error Handler
 *
 * Centralized error handling for CMS operations with:
 * - Error classification
 * - Retry logic
 * - Fallback strategies
 * - Error reporting
 */

import type { CMSError, CMSProvider } from './types';

/**
 * Create a structured CMS error
 */
export function createCMSError(
  provider: CMSProvider,
  message: string,
  statusCode?: number,
  code?: string
): CMSError {
  // Determine if error is retryable based on status code
  const retryable = statusCode
    ? statusCode >= 500 || statusCode === 429 || statusCode === 408
    : true;

  return {
    code: code || `${provider.toUpperCase()}_ERROR`,
    message,
    statusCode,
    provider,
    timestamp: new Date(),
    retryable,
  };
}

/**
 * Parse error from different sources
 */
export function parseCMSError(error: any, provider: CMSProvider): CMSError {
  if (error instanceof Response) {
    return createCMSError(
      provider,
      `HTTP ${error.status}: ${error.statusText}`,
      error.status,
      `HTTP_${error.status}`
    );
  }

  if (error instanceof Error) {
    // Network errors
    if (
      error.message.includes('fetch failed') ||
      error.message.includes('ECONNREFUSED')
    ) {
      return createCMSError(
        provider,
        'Network connection failed',
        undefined,
        'NETWORK_ERROR'
      );
    }

    // Timeout errors
    if (error.message.includes('timeout')) {
      return createCMSError(provider, 'Request timeout', 408, 'TIMEOUT_ERROR');
    }

    return createCMSError(provider, error.message);
  }

  return createCMSError(provider, 'Unknown error occurred');
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    shouldRetry?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    shouldRetry = (error) => error.retryable !== false,
  } = options;

  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Check if we should retry this error
      if (!shouldRetry(error)) {
        break;
      }

      // Wait before retrying with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffMultiplier, maxDelay);

      console.warn(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`);
    }
  }

  throw lastError;
}

/**
 * Execute with timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

/**
 * Error fallback strategy
 */
export interface FallbackStrategy<T> {
  /**
   * Get fallback data when primary fetch fails
   */
  getFallback: () => Promise<T> | T;

  /**
   * Check if fallback should be used
   */
  shouldUseFallback?: (error: CMSError) => boolean;

  /**
   * Handle error before using fallback
   */
  onError?: (error: CMSError) => void;
}

/**
 * Execute with fallback
 */
export async function withFallback<T>(
  primaryFn: () => Promise<T>,
  fallbackStrategy: FallbackStrategy<T>
): Promise<T> {
  try {
    return await primaryFn();
  } catch (error) {
    const cmsError = error as CMSError;

    // Log error
    if (fallbackStrategy.onError) {
      fallbackStrategy.onError(cmsError);
    }

    // Check if we should use fallback
    if (
      fallbackStrategy.shouldUseFallback &&
      !fallbackStrategy.shouldUseFallback(cmsError)
    ) {
      throw error;
    }

    // Use fallback
    console.warn('Using fallback due to error:', cmsError.message);
    return await Promise.resolve(fallbackStrategy.getFallback());
  }
}

/**
 * Circuit breaker for preventing cascade failures
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000, // 1 minute
    private resetTimeout: number = 30000 // 30 seconds
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.resetTimeout) {
        this.state = 'half-open';
        if (process.env.NODE_ENV === 'development') {
          console.log('Circuit breaker entering half-open state');
        }
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'open';
      console.error(`Circuit breaker opened after ${this.failures} failures`);
    }
  }

  getState(): string {
    return this.state;
  }

  reset(): void {
    this.failures = 0;
    this.lastFailureTime = 0;
    this.state = 'closed';
  }
}
