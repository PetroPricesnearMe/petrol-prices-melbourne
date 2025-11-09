import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// Dynamic import for AdvancedFilters with loading fallback
const AdvancedFilters = dynamic(
  () => import('../AdvancedFilters'),
  {
    loading: () => (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ),
  }
) as ComponentType<any>;

export default AdvancedFilters;
