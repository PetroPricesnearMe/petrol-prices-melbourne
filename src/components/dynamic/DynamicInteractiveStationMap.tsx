import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// Dynamic import for InteractiveStationMap with loading fallback
const InteractiveStationMap = dynamic(
  () => import('../InteractiveStationMap'),
  {
    loading: () => (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading interactive map...
          </p>
        </div>
      </div>
    ),
    ssr: false, // Disable SSR for map components to avoid hydration issues
  }
) as ComponentType<any>;

export default InteractiveStationMap;
