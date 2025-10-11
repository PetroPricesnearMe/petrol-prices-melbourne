/**
 * Melbourne Regions Configuration
 * Defines the 6 major regions for filtering petrol stations
 */

export const MELBOURNE_REGIONS = {
  WESTERN: {
    id: 'western',
    name: 'Western Melbourne',
    color: '#8B2635', // Dark red
    description: 'Footscray, Sunshine, Werribee, Point Cook',
    suburbs: [
      'Footscray', 'Sunshine', 'Werribee', 'Point Cook', 'Altona', 'Williamstown',
      'Newport', 'Yarraville', 'Seddon', 'Hoppers Crossing', 'Tarneit', 'Truganina',
      'Caroline Springs', 'Deer Park', 'St Albans', 'Melton', 'Laverton'
    ],
    bounds: {
      latMin: -37.95,
      latMax: -37.70,
      lngMin: 144.70,
      lngMax: 144.85
    }
  },
  
  NORTHWESTERN: {
    id: 'northwestern',
    name: 'North Western Melbourne',
    color: '#C8417B', // Pink/Magenta
    description: 'Essendon, Airport West, Tullamarine, Sunbury',
    suburbs: [
      'Essendon', 'Airport West', 'Tullamarine', 'Sunbury', 'Keilor', 'Niddrie',
      'Strathmore', 'Moonee Ponds', 'Ascot Vale', 'Flemington', 'Kensington',
      'Glenroy', 'Oak Park', 'Pascoe Vale', 'Coburg', 'Brunswick West'
    ],
    bounds: {
      latMin: -37.75,
      latMax: -37.60,
      lngMin: 144.85,
      lngMax: 144.95
    }
  },
  
  NORTHEASTERN: {
    id: 'northeastern',
    name: 'North Eastern Melbourne',
    color: '#7B68B6', // Purple
    description: 'Doncaster, Box Hill, Ringwood, Templestowe',
    suburbs: [
      'Doncaster', 'Box Hill', 'Ringwood', 'Templestowe', 'Bulleen', 'Balwyn',
      'Kew', 'Camberwell', 'Hawthorn', 'Surrey Hills', 'Blackburn', 'Mitcham',
      'Nunawading', 'Vermont', 'Forest Hill', 'Croydon', 'Lilydale', 'Chirnside Park'
    ],
    bounds: {
      latMin: -37.82,
      latMax: -37.70,
      lngMin: 145.05,
      lngMax: 145.30
    }
  },
  
  CENTRAL: {
    id: 'central',
    name: 'Melbourne CBD & Inner Suburbs',
    color: '#5A6267', // Gray
    description: 'CBD, Carlton, Fitzroy, South Yarra, Richmond',
    suburbs: [
      'Melbourne', 'CBD', 'Carlton', 'Fitzroy', 'Collingwood', 'Richmond',
      'South Yarra', 'Prahran', 'St Kilda', 'Port Melbourne', 'South Melbourne',
      'Albert Park', 'Middle Park', 'Parkville', 'North Melbourne', 'Southbank',
      'Docklands', 'East Melbourne', 'Jolimont', 'Cremorne', 'Abbotsford'
    ],
    bounds: {
      latMin: -37.87,
      latMax: -37.78,
      lngMin: 144.93,
      lngMax: 145.05
    }
  },
  
  INNER_EAST: {
    id: 'inner_east',
    name: 'Inner Eastern Melbourne',
    color: '#4DB8C5', // Cyan/Teal
    description: 'Malvern, Caulfield, Glen Waverley, Oakleigh',
    suburbs: [
      'Malvern', 'Caulfield', 'Glen Waverley', 'Oakleigh', 'Clayton', 'Carnegie',
      'Murrumbeena', 'Hughesdale', 'Ashwood', 'Mount Waverley', 'Wheelers Hill',
      'Notting Hill', 'Clarinda', 'Bentleigh', 'McKinnon', 'Ormond'
    ],
    bounds: {
      latMin: -37.92,
      latMax: -37.82,
      lngMin: 145.02,
      lngMax: 145.18
    }
  },
  
  SOUTHERN: {
    id: 'southern',
    name: 'Southern Melbourne',
    color: '#2E7AB5', // Blue
    description: 'Frankston, Dandenong, Cranbourne, Mordialloc',
    suburbs: [
      'Frankston', 'Dandenong', 'Cranbourne', 'Mordialloc', 'Chelsea', 'Carrum',
      'Seaford', 'Mentone', 'Parkdale', 'Cheltenham', 'Springvale', 'Noble Park',
      'Keysborough', 'Hampton Park', 'Narre Warren', 'Berwick', 'Pakenham',
      'Endeavour Hills', 'Hallam', 'Lyndhurst', 'Lynbrook'
    ],
    bounds: {
      latMin: -38.20,
      latMax: -37.87,
      lngMin: 145.00,
      lngMax: 145.30
    }
  }
};

/**
 * Determine which region a station belongs to based on coordinates
 */
export const getStationRegion = (lat, lng, suburb) => {
  // First try to match by suburb name
  if (suburb) {
    const suburbLower = suburb.toLowerCase();
    for (const [key, region] of Object.entries(MELBOURNE_REGIONS)) {
      if (region.suburbs.some(s => suburbLower.includes(s.toLowerCase()))) {
        return region;
      }
    }
  }
  
  // Fall back to coordinate-based matching
  for (const [key, region] of Object.entries(MELBOURNE_REGIONS)) {
    if (lat >= region.bounds.latMin && 
        lat <= region.bounds.latMax &&
        lng >= region.bounds.lngMin && 
        lng <= region.bounds.lngMax) {
      return region;
    }
  }
  
  // Default to Central if can't determine
  return MELBOURNE_REGIONS.CENTRAL;
};

/**
 * Get count of stations in each region
 */
export const getRegionCounts = (stations) => {
  const counts = {};
  
  Object.keys(MELBOURNE_REGIONS).forEach(key => {
    counts[key] = 0;
  });
  
  stations.forEach(station => {
    const region = getStationRegion(
      station.lat || station.Latitude,
      station.lng || station.Longitude,
      station.city || station.City || station.suburb
    );
    counts[region.id.toUpperCase()]++;
  });
  
  return counts;
};

export default MELBOURNE_REGIONS;

