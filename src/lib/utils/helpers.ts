/**
 * Helper Utilities
 * 
 * General-purpose utility functions for common tasks.
 * 
 * @module lib/utils/helpers
 */

/**
 * Debounce function calls
 * 
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching:', query);
 * }, 300);
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function calls
 * 
 * @param fn - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 * 
 * @example
 * ```typescript
 * const throttledScroll = throttle(() => {
 *   console.log('Scrolling');
 * }, 100);
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone an object
 * 
 * @param obj - Object to clone
 * @returns Cloned object
 * 
 * @example
 * ```typescript
 * const cloned = deepClone({ a: 1, b: { c: 2 } });
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (obj instanceof Object) {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Deep merge objects
 * 
 * @param target - Target object
 * @param sources - Source objects
 * @returns Merged object
 * 
 * @example
 * ```typescript
 * const result = deepMerge({ a: 1 }, { b: 2 }, { c: 3 });
 * // { a: 1, b: 2, c: 3 }
 * ```
 */
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (source === undefined) return target;

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as any, source[key] as any);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * Check if value is a plain object
 * 
 * @param item - Value to check
 * @returns True if plain object
 */
function isObject(item: any): item is object {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Generate unique ID
 * 
 * @param prefix - Optional prefix
 * @returns Unique ID string
 * 
 * @example
 * ```typescript
 * generateId(); // "abc123def456"
 * generateId('user'); // "user-abc123def456"
 * ```
 */
export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2, 15);
  return prefix ? `${prefix}-${id}` : id;
}

/**
 * Sleep/delay execution
 * 
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 * 
 * @example
 * ```typescript
 * await sleep(1000); // Wait 1 second
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry async function
 * 
 * @param fn - Async function to retry
 * @param retries - Number of retries
 * @param delay - Delay between retries
 * @returns Promise with function result
 * 
 * @example
 * ```typescript
 * const data = await retry(fetchData, 3, 1000);
 * ```
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await sleep(delay);
    return retry(fn, retries - 1, delay);
  }
}

/**
 * Group array by key
 * 
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Grouped object
 * 
 * @example
 * ```typescript
 * const users = [
 *   { name: 'Alice', role: 'admin' },
 *   { name: 'Bob', role: 'user' },
 * ];
 * groupBy(users, 'role');
 * // { admin: [...], user: [...] }
 * ```
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Pick properties from object
 * 
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns New object with picked properties
 * 
 * @example
 * ```typescript
 * const user = { name: 'Alice', age: 30, email: 'alice@example.com' };
 * pick(user, ['name', 'email']);
 * // { name: 'Alice', email: 'alice@example.com' }
 * ```
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit properties from object
 * 
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns New object without omitted properties
 * 
 * @example
 * ```typescript
 * const user = { name: 'Alice', age: 30, password: 'secret' };
 * omit(user, ['password']);
 * // { name: 'Alice', age: 30 }
 * ```
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * Check if arrays are equal (shallow comparison)
 * 
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns True if arrays are equal
 * 
 * @example
 * ```typescript
 * areArraysEqual([1, 2, 3], [1, 2, 3]); // true
 * areArraysEqual([1, 2], [1, 3]);       // false
 * ```
 */
export function areArraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
}

/**
 * Remove duplicates from array
 * 
 * @param array - Array with potential duplicates
 * @returns Array without duplicates
 * 
 * @example
 * ```typescript
 * unique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
 * ```
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Chunk array into smaller arrays
 * 
 * @param array - Array to chunk
 * @param size - Chunk size
 * @returns Array of chunks
 * 
 * @example
 * ```typescript
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle array
 * 
 * @param array - Array to shuffle
 * @returns Shuffled array (new array)
 * 
 * @example
 * ```typescript
 * shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4]
 * ```
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Calculate average of numbers
 * 
 * @param numbers - Array of numbers
 * @returns Average value
 * 
 * @example
 * ```typescript
 * average([1, 2, 3, 4, 5]); // 3
 * ```
 */
export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Clamp number between min and max
 * 
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 * 
 * @example
 * ```typescript
 * clamp(15, 0, 10); // 10
 * clamp(-5, 0, 10); // 0
 * clamp(5, 0, 10);  // 5
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

