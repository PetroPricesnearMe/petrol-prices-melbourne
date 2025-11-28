/**
 * Debounce Utility
 * 
 * Delays function execution until after a specified wait time has passed
 * since the last time it was invoked. Useful for search queries and API calls.
 */

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Debounced async function that returns a promise
 * Useful for debouncing API calls while still being able to await the result
 */
export function debounceAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  let timeout: NodeJS.Timeout | null = null;
  let latestArgs: Parameters<T> | null = null;
  let resolveLatest: ((value: Awaited<ReturnType<T>>) => void) | null = null;
  let rejectLatest: ((error: unknown) => void) | null = null;

  return function executedFunction(...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
    return new Promise((resolve, reject) => {
      latestArgs = args;
      resolveLatest = resolve;
      rejectLatest = reject;

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(async () => {
        if (latestArgs && resolveLatest && rejectLatest) {
          try {
            const result = await func(...latestArgs);
            resolveLatest(result as Awaited<ReturnType<T>>);
          } catch (error) {
            rejectLatest(error);
          }
        }
        latestArgs = null;
        resolveLatest = null;
        rejectLatest = null;
      }, wait);
    });
  };
}

/**
 * Throttle utility
 * Limits function execution to at most once per specified time period
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

