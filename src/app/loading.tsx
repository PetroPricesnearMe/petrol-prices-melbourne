import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { patterns } from '@/styles/system/css-in-js';

export default function Loading() {
  return (
    <div className={patterns.flex.center + ' min-h-screen'}>
      <LoadingSpinner size="lg" label="Loading page..." />
    </div>
  );
}
