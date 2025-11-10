/**
 * useMounted Hook
 * 
 * Returns whether the component has mounted on the client.
 * Useful for preventing hydration mismatches when rendering
 * client-specific content (dates, localStorage, etc.)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const mounted = useMounted();
 *   const currentYear = mounted ? new Date().getFullYear() : 2025;
 *   
 *   return <footer>© {currentYear}</footer>;
 * }
 * ```
 */

'use client';

import { useEffect, useState } from 'react';

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

