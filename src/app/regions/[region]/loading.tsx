import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { patterns } from '@/styles/system/css-in-js';

export default function RegionLoading() {
  return (
    <div className={patterns.flex.center + ' min-h-screen bg-gray-50 dark:bg-gray-900'}>
      <div className="text-center">
        <LoadingSpinner size="lg" label="Loading regional stations..." />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Please wait while we load stations for this region.
        </p>
      </div>
    </div>
  );
}


