# Error Handling Components

This directory contains reusable components and hooks for graceful error handling with retry logic and offline detection.

## Components

### `FetchErrorDisplay`
Displays friendly error messages with retry functionality.

```tsx
import { FetchErrorDisplay } from '@/components/common/FetchErrorDisplay';

<FetchErrorDisplay
  error={error}
  isOffline={isOffline}
  retryCount={retryCount}
  onRetry={handleRetry}
  variant="card" // 'inline' | 'banner' | 'card'
  showRetry={true}
/>
```

### `OfflineNotice`
Shows a banner when the user is offline.

```tsx
import { OfflineNotice } from '@/components/common/OfflineNotice';

// Add to your layout or root component
<OfflineNotice />
```

### `FetchWithErrorHandling`
Wrapper component that handles fetch errors gracefully.

```tsx
import { FetchWithErrorHandling } from '@/components/common/FetchWithErrorHandling';

<FetchWithErrorHandling
  url="/api/stations"
  fetchOptions={{
    retries: 3,
    retryDelay: 1000,
    timeout: 30000,
  }}
  errorDisplay={{
    variant: 'card',
    showRetry: true,
  }}
>
  {({ data, isLoading, error, retry }) => {
    if (isLoading) return <div>Loading...</div>;
    if (data) return <StationList stations={data} />;
    return null;
  }}
</FetchWithErrorHandling>
```

## Hooks

### `useFetchWithRetry`
Hook for fetch with retry logic and offline detection.

```tsx
import { useFetchWithRetry } from '@/hooks/useFetchWithRetry';

function MyComponent() {
  const { data, error, isLoading, isOffline, retry, retryCount } = useFetchWithRetry(
    '/api/stations',
    {
      retries: 3,
      retryDelay: 1000,
      timeout: 30000,
    }
  );

  if (error) {
    return (
      <FetchErrorDisplay
        error={error}
        isOffline={isOffline}
        retryCount={retryCount}
        onRetry={retry}
      />
    );
  }

  if (isLoading) return <div>Loading...</div>;
  return <StationList stations={data} />;
}
```

## Features

- ✅ Automatic retry logic with exponential backoff
- ✅ Offline detection using browser APIs
- ✅ Friendly error messages
- ✅ Configurable retry attempts and delays
- ✅ Timeout handling
- ✅ Network error detection
- ✅ HTTP status code-based retry logic

## Integration Example

```tsx
'use client';

import { FetchWithErrorHandling } from '@/components/common/FetchWithErrorHandling';
import { OfflineNotice } from '@/components/common/OfflineNotice';

export default function StationsPage() {
  return (
    <>
      <OfflineNotice />
      <FetchWithErrorHandling
        url="/api/stations"
        errorDisplay={{ variant: 'banner', showRetry: true }}
      >
        {({ data, isLoading }) => {
          if (isLoading) return <LoadingSpinner />;
          return <StationList stations={data} />;
        }}
      </FetchWithErrorHandling>
    </>
  );
}
```

