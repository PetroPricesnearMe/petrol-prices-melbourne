import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// Dynamic import for StationCards with loading fallback
const StationCards = dynamic(() => import('../StationCards'), {
  loading: () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="mb-4 h-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      ))}
    </div>
  ),
}) as ComponentType<any>;

export default StationCards;
