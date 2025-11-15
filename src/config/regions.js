/**
 * Melbourne Regions Configuration
 * Defines the 6 major regions for filtering petrol stations
 */

export const MELBOURNE_REGIONS = {
  NORTHERN: {
    id: 'northern',
    name: 'Northern Suburbs',
    color: '#7B68B6', // Purple
    icon: '🌆',
    description: 'Preston, Coburg, Essendon, Tullamarine, Sunbury',
    suburbs: [
      'Preston',
      'Coburg',
      'Brunswick',
      'Essendon',
      'Airport West',
      'Tullamarine',
      'Sunbury',
      'Keilor',
      'Niddrie',
      'Strathmore',
      'Moonee Ponds',
      'Ascot Vale',
      'Flemington',
      'Kensington',
      'Glenroy',
      'Oak Park',
      'Pascoe Vale',
      'Brunswick West',
      'Reservoir',
      'Thornbury',
      'Northcote',
      'Fairfield',
      'Ivanhoe',
    ],
    bounds: {
      latMin: -37.75,
      latMax: -37.6,
      lngMin: 144.85,
      lngMax: 145.05,
    },
  },

  WESTERN: {
    id: 'western',
    name: 'Western Suburbs',
    color: '#FF6B6B', // Coral Red
    icon: '🌅',
    description: 'Footscray, Sunshine, Werribee, Point Cook',
    suburbs: [
      'Footscray',
      'Sunshine',
      'Werribee',
      'Point Cook',
      'Altona',
      'Williamstown',
      'Newport',
      'Yarraville',
      'Seddon',
      'Hoppers Crossing',
      'Tarneit',
      'Truganina',
      'Caroline Springs',
      'Deer Park',
      'St Albans',
      'Melton',
      'Laverton',
    ],
    bounds: {
      latMin: -37.95,
      latMax: -37.7,
      lngMin: 144.7,
      lngMax: 144.85,
    },
  },

  EASTERN: {
    id: 'eastern',
    name: 'Eastern Suburbs',
    color: '#4ECDC4', // Turquoise
    icon: '🏞️',
    description: 'Doncaster, Box Hill, Ringwood, Glen Waverley',
    suburbs: [
      'Doncaster',
      'Box Hill',
      'Ringwood',
      'Templestowe',
      'Bulleen',
      'Balwyn',
      'Kew',
      'Camberwell',
      'Hawthorn',
      'Surrey Hills',
      'Blackburn',
      'Mitcham',
      'Nunawading',
      'Vermont',
      'Forest Hill',
      'Croydon',
      'Lilydale',
      'Chirnside Park',
      'Glen Waverley',
      'Mount Waverley',
      'Wheelers Hill',
      'Burwood',
    ],
    bounds: {
      latMin: -37.92,
      latMax: -37.7,
      lngMin: 145.05,
      lngMax: 145.3,
    },
  },

  MELBOURNE_INNER: {
    id: 'melbourne_inner',
    name: 'Melbourne Inner',
    color: '#FFD93D', // Golden Yellow
    icon: '🏙️',
    description: 'CBD, Carlton, Fitzroy, South Yarra, Richmond',
    suburbs: [
      'Melbourne',
      'CBD',
      'Carlton',
      'Fitzroy',
      'Collingwood',
      'Richmond',
      'South Yarra',
      'Prahran',
      'St Kilda',
      'Port Melbourne',
      'South Melbourne',
      'Albert Park',
      'Middle Park',
      'Parkville',
      'North Melbourne',
      'Southbank',
      'Docklands',
      'East Melbourne',
      'Jolimont',
      'Cremorne',
      'Abbotsford',
    ],
    bounds: {
      latMin: -37.87,
      latMax: -37.78,
      lngMin: 144.93,
      lngMax: 145.05,
    },
  },

  SOUTH_EASTERN: {
    id: 'south_eastern',
    name: 'South Eastern Suburbs',
    color: '#6BCB77', // Green
    icon: '🌳',
    description: 'Frankston, Dandenong, Cranbourne, Clayton',
    suburbs: [
      'Frankston',
      'Dandenong',
      'Cranbourne',
      'Mordialloc',
      'Chelsea',
      'Carrum',
      'Seaford',
      'Mentone',
      'Parkdale',
      'Cheltenham',
      'Springvale',
      'Noble Park',
      'Keysborough',
      'Hampton Park',
      'Narre Warren',
      'Berwick',
      'Pakenham',
      'Endeavour Hills',
      'Hallam',
      'Lyndhurst',
      'Lynbrook',
      'Clayton',
      'Oakleigh',
      'Malvern',
      'Caulfield',
      'Carnegie',
      'Murrumbeena',
      'Hughesdale',
      'Bentleigh',
    ],
    bounds: {
      latMin: -38.2,
      latMax: -37.82,
      lngMin: 145.0,
      lngMax: 145.3,
    },
  },
};

/**
 * Determine which region a station belongs to based on coordinates
 */
export const getStationRegion = (lat, lng, suburb) => {
  // First try to match by suburb name
  if (suburb) {
    const suburbLower = suburb.toLowerCase();
    for (const region of Object.values(MELBOURNE_REGIONS)) {
      if (region.suburbs.some((s) => suburbLower.includes(s.toLowerCase()))) {
        return region;
      }
    }
  }

  // Fall back to coordinate-based matching
  for (const region of Object.values(MELBOURNE_REGIONS)) {
    if (
      lat >= region.bounds.latMin &&
      lat <= region.bounds.latMax &&
      lng >= region.bounds.lngMin &&
      lng <= region.bounds.lngMax
    ) {
      return region;
    }
  }

  // Default to Melbourne Inner if can't determine
  return MELBOURNE_REGIONS.MELBOURNE_INNER;
};

/**
 * Get count of stations in each region
 */
export const getRegionCounts = (stations) => {
  const counts = {};

  Object.keys(MELBOURNE_REGIONS).forEach((key) => {
    counts[key] = 0;
  });

  stations.forEach((station) => {
    const region = getStationRegion(
      station.lat || station.Latitude,
      station.lng || station.Longitude,
      station.city || station.City || station.suburb
    );

    // Safety check - ensure region exists
    if (region && region.id) {
      const regionKey = region.id.toUpperCase();
      if (counts.hasOwnProperty(regionKey)) {
        counts[regionKey]++;
      }
    }
  });

  return counts;
};

export default MELBOURNE_REGIONS;
