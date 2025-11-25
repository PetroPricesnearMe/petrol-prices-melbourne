# Integration Example

## Replace Existing Map Component

If you have an existing map component, here's how to replace it:

### Before (Old Map)

```tsx
import { StationMap } from '@/components/listings/StationMap';

<StationMap
  stations={stations}
  userLocation={userLocation}
  selectedStation={selectedStation}
  onStationSelect={handleStationSelect}
/>
```

### After (New MapLibre Map)

```tsx
import { MapLibreMap } from '@/components/map';

<MapLibreMap
  stations={stations}
  userLocation={userLocation}
  selectedStation={selectedStation}
  onStationSelect={handleStationSelect}
  height="600px"
  enableClustering={true}
  enableLazyLoad={true}
/>
```

## In a Page Component

```tsx
'use client';

import { useState } from 'react';
import { MapLibreMap } from '@/components/map';
import type { Station } from '@/types/station';

export default function StationsMapPage() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  
  // Your stations data
  const stations: Station[] = [
    // ... your stations
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Find Petrol Stations</h1>
      
      <MapLibreMap
        stations={stations}
        selectedStation={selectedStation}
        onStationSelect={setSelectedStation}
        defaultZoom={11}
        defaultCenter={{ latitude: -37.8136, longitude: 144.9631 }}
        height="700px"
        className="rounded-2xl shadow-xl"
      />
      
      {selectedStation && (
        <div className="mt-6">
          <h2>{selectedStation.name}</h2>
          {/* Station details */}
        </div>
      )}
    </div>
  );
}
```

## With Data Fetching

```tsx
'use client';

import { use } from 'react';
import { MapLibreMap } from '@/components/map';
import { getLiveStationsFromFairFuel } from '@/lib/fairfuel/service';

export default function StationsMapPage() {
  // Fetch stations (server component example)
  const stationsPromise = getLiveStationsFromFairFuel();
  const stations = use(stationsPromise);

  return (
    <MapLibreMap
      stations={stations}
      height="600px"
    />
  );
}
```

## With Filters

```tsx
'use client';

import { useState, useMemo } from 'react';
import { MapLibreMap } from '@/components/map';
import type { Station } from '@/types/station';

export default function FilteredMapPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const allStations: Station[] = [/* ... */];

  const filteredStations = useMemo(() => {
    if (!selectedBrand) return allStations;
    return allStations.filter(s => s.brand === selectedBrand);
  }, [allStations, selectedBrand]);

  return (
    <div>
      <select
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
      >
        <option value="">All Brands</option>
        <option value="BP">BP</option>
        <option value="Shell">Shell</option>
        {/* ... */}
      </select>

      <MapLibreMap
        stations={filteredStations}
        height="600px"
      />
    </div>
  );
}
```

