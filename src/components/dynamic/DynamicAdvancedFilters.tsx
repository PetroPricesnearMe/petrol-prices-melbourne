import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// Dynamic import for AdvancedFilters with loading fallback
const AdvancedFilters = dynamic(() => import('../AdvancedFilters'), {
  loading: () => (
    <div className="animate-pulse">
      <div className="mb-4 h-12 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-10 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-10 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  ),
}) as ComponentType<any>;

export default AdvancedFilters;
