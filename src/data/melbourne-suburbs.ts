/**
 * Melbourne Suburbs - SEO-Ready Comprehensive List
 * 
 * Organized by region for better SEO and internal linking
 * Used for generating static location pages
 */

export interface SuburbData {
  name: string;
  slug: string;
  region: 'Northern' | 'Western' | 'Eastern' | 'South-Eastern' | 'Inner-Melbourne';
  displayName: string;
}

/**
 * All Melbourne suburbs organized by region
 */
export const MELBOURNE_SUBURBS: SuburbData[] = [
  // Northern Suburbs
  { name: 'Sunbury', slug: 'sunbury', region: 'Northern', displayName: 'Sunbury' },
  { name: 'Craigieburn', slug: 'craigieburn', region: 'Northern', displayName: 'Craigieburn' },
  { name: 'Broadmeadows', slug: 'broadmeadows', region: 'Northern', displayName: 'Broadmeadows' },
  { name: 'Pascoe Vale', slug: 'pascoe-vale', region: 'Northern', displayName: 'Pascoe Vale' },
  { name: 'Coburg', slug: 'coburg', region: 'Northern', displayName: 'Coburg' },
  { name: 'Fawkner', slug: 'fawkner', region: 'Northern', displayName: 'Fawkner' },
  { name: 'Glenroy', slug: 'glenroy', region: 'Northern', displayName: 'Glenroy' },
  { name: 'Greenvale', slug: 'greenvale', region: 'Northern', displayName: 'Greenvale' },
  { name: 'Airport West', slug: 'airport-west', region: 'Northern', displayName: 'Airport West' },
  { name: 'Essendon', slug: 'essendon', region: 'Northern', displayName: 'Essendon' },
  { name: 'Moonee Ponds', slug: 'moonee-ponds', region: 'Northern', displayName: 'Moonee Ponds' },
  { name: 'Brunswick', slug: 'brunswick', region: 'Northern', displayName: 'Brunswick' },
  { name: 'Preston', slug: 'preston', region: 'Northern', displayName: 'Preston' },
  { name: 'Reservoir', slug: 'reservoir', region: 'Northern', displayName: 'Reservoir' },
  { name: 'Epping', slug: 'epping', region: 'Northern', displayName: 'Epping' },
  { name: 'Lalor', slug: 'lalor', region: 'Northern', displayName: 'Lalor' },
  { name: 'Thomastown', slug: 'thomastown', region: 'Northern', displayName: 'Thomastown' },
  { name: 'Mernda', slug: 'mernda', region: 'Northern', displayName: 'Mernda' },
  { name: 'Doreen', slug: 'doreen', region: 'Northern', displayName: 'Doreen' },
  { name: 'Bundoora', slug: 'bundoora', region: 'Northern', displayName: 'Bundoora' },
  { name: 'Tullamarine', slug: 'tullamarine', region: 'Northern', displayName: 'Tullamarine' },

  // Western Suburbs
  { name: 'Werribee', slug: 'werribee', region: 'Western', displayName: 'Werribee' },
  { name: 'Hoppers Crossing', slug: 'hoppers-crossing', region: 'Western', displayName: 'Hoppers Crossing' },
  { name: 'Point Cook', slug: 'point-cook', region: 'Western', displayName: 'Point Cook' },
  { name: 'Tarneit', slug: 'tarneit', region: 'Western', displayName: 'Tarneit' },
  { name: 'Truganina', slug: 'truganina', region: 'Western', displayName: 'Truganina' },
  { name: 'Altona', slug: 'altona', region: 'Western', displayName: 'Altona' },
  { name: 'Newport', slug: 'newport', region: 'Western', displayName: 'Newport' },
  { name: 'Williamstown', slug: 'williamstown', region: 'Western', displayName: 'Williamstown' },
  { name: 'Laverton', slug: 'laverton', region: 'Western', displayName: 'Laverton' },
  { name: 'Sunshine', slug: 'sunshine', region: 'Western', displayName: 'Sunshine' },
  { name: 'Deer Park', slug: 'deer-park', region: 'Western', displayName: 'Deer Park' },
  { name: 'Footscray', slug: 'footscray', region: 'Western', displayName: 'Footscray' },
  { name: 'Yarraville', slug: 'yarraville', region: 'Western', displayName: 'Yarraville' },
  { name: 'St Albans', slug: 'st-albans', region: 'Western', displayName: 'St Albans' },
  { name: 'Caroline Springs', slug: 'caroline-springs', region: 'Western', displayName: 'Caroline Springs' },
  { name: 'Melton', slug: 'melton', region: 'Western', displayName: 'Melton' },
  { name: 'Rockbank', slug: 'rockbank', region: 'Western', displayName: 'Rockbank' },

  // Eastern Suburbs
  { name: 'Doncaster', slug: 'doncaster', region: 'Eastern', displayName: 'Doncaster' },
  { name: 'Templestowe', slug: 'templestowe', region: 'Eastern', displayName: 'Templestowe' },
  { name: 'Ringwood', slug: 'ringwood', region: 'Eastern', displayName: 'Ringwood' },
  { name: 'Box Hill', slug: 'box-hill', region: 'Eastern', displayName: 'Box Hill' },
  { name: 'Blackburn', slug: 'blackburn', region: 'Eastern', displayName: 'Blackburn' },
  { name: 'Forest Hill', slug: 'forest-hill', region: 'Eastern', displayName: 'Forest Hill' },
  { name: 'Nunawading', slug: 'nunawading', region: 'Eastern', displayName: 'Nunawading' },
  { name: 'Mitcham', slug: 'mitcham', region: 'Eastern', displayName: 'Mitcham' },
  { name: 'Burwood', slug: 'burwood', region: 'Eastern', displayName: 'Burwood' },
  { name: 'Wantirna', slug: 'wantirna', region: 'Eastern', displayName: 'Wantirna' },
  { name: 'Knoxfield', slug: 'knoxfield', region: 'Eastern', displayName: 'Knoxfield' },
  { name: 'Ferntree Gully', slug: 'ferntree-gully', region: 'Eastern', displayName: 'Ferntree Gully' },
  { name: 'Croydon', slug: 'croydon', region: 'Eastern', displayName: 'Croydon' },
  { name: 'Montrose', slug: 'montrose', region: 'Eastern', displayName: 'Montrose' },
  { name: 'Kilsyth', slug: 'kilsyth', region: 'Eastern', displayName: 'Kilsyth' },
  { name: 'Lilydale', slug: 'lilydale', region: 'Eastern', displayName: 'Lilydale' },
  { name: 'Mooroolbark', slug: 'mooroolbark', region: 'Eastern', displayName: 'Mooroolbark' },
  { name: 'Heathmont', slug: 'heathmont', region: 'Eastern', displayName: 'Heathmont' },

  // South-Eastern Suburbs
  { name: 'Dandenong', slug: 'dandenong', region: 'South-Eastern', displayName: 'Dandenong' },
  { name: 'Keysborough', slug: 'keysborough', region: 'South-Eastern', displayName: 'Keysborough' },
  { name: 'Springvale', slug: 'springvale', region: 'South-Eastern', displayName: 'Springvale' },
  { name: 'Clayton', slug: 'clayton', region: 'South-Eastern', displayName: 'Clayton' },
  { name: 'Noble Park', slug: 'noble-park', region: 'South-Eastern', displayName: 'Noble Park' },
  { name: 'Mulgrave', slug: 'mulgrave', region: 'South-Eastern', displayName: 'Mulgrave' },
  { name: 'Chadstone', slug: 'chadstone', region: 'South-Eastern', displayName: 'Chadstone' },
  { name: 'Oakleigh', slug: 'oakleigh', region: 'South-Eastern', displayName: 'Oakleigh' },
  { name: 'Carnegie', slug: 'carnegie', region: 'South-Eastern', displayName: 'Carnegie' },
  { name: 'Bentleigh', slug: 'bentleigh', region: 'South-Eastern', displayName: 'Bentleigh' },
  { name: 'Cheltenham', slug: 'cheltenham', region: 'South-Eastern', displayName: 'Cheltenham' },
  { name: 'Mentone', slug: 'mentone', region: 'South-Eastern', displayName: 'Mentone' },
  { name: 'Moorabbin', slug: 'moorabbin', region: 'South-Eastern', displayName: 'Moorabbin' },
  { name: 'Hampton Park', slug: 'hampton-park', region: 'South-Eastern', displayName: 'Hampton Park' },
  { name: 'Endeavour Hills', slug: 'endeavour-hills', region: 'South-Eastern', displayName: 'Endeavour Hills' },
  { name: 'Berwick', slug: 'berwick', region: 'South-Eastern', displayName: 'Berwick' },
  { name: 'Cranbourne', slug: 'cranbourne', region: 'South-Eastern', displayName: 'Cranbourne' },
  { name: 'Frankston', slug: 'frankston', region: 'South-Eastern', displayName: 'Frankston' },
  { name: 'Mornington', slug: 'mornington', region: 'South-Eastern', displayName: 'Mornington' },
  { name: 'Pakenham', slug: 'pakenham', region: 'South-Eastern', displayName: 'Pakenham' },
  { name: 'Officer', slug: 'officer', region: 'South-Eastern', displayName: 'Officer' },
  { name: 'Beaconsfield', slug: 'beaconsfield', region: 'South-Eastern', displayName: 'Beaconsfield' },

  // Inner-Melbourne
  { name: 'Melbourne', slug: 'melbourne', region: 'Inner-Melbourne', displayName: 'Melbourne (CBD)' },
  { name: 'Southbank', slug: 'southbank', region: 'Inner-Melbourne', displayName: 'Southbank' },
  { name: 'Docklands', slug: 'docklands', region: 'Inner-Melbourne', displayName: 'Docklands' },
  { name: 'Port Melbourne', slug: 'port-melbourne', region: 'Inner-Melbourne', displayName: 'Port Melbourne' },
  { name: 'Richmond', slug: 'richmond', region: 'Inner-Melbourne', displayName: 'Richmond' },
  { name: 'Fitzroy', slug: 'fitzroy', region: 'Inner-Melbourne', displayName: 'Fitzroy' },
  { name: 'Carlton', slug: 'carlton', region: 'Inner-Melbourne', displayName: 'Carlton' },
  { name: 'Collingwood', slug: 'collingwood', region: 'Inner-Melbourne', displayName: 'Collingwood' },
  { name: 'Abbotsford', slug: 'abbotsford', region: 'Inner-Melbourne', displayName: 'Abbotsford' },
  { name: 'South Yarra', slug: 'south-yarra', region: 'Inner-Melbourne', displayName: 'South Yarra' },
  { name: 'Prahran', slug: 'prahran', region: 'Inner-Melbourne', displayName: 'Prahran' },
  { name: 'St Kilda', slug: 'st-kilda', region: 'Inner-Melbourne', displayName: 'St Kilda' },
  { name: 'Elwood', slug: 'elwood', region: 'Inner-Melbourne', displayName: 'Elwood' },
  { name: 'Toorak', slug: 'toorak', region: 'Inner-Melbourne', displayName: 'Toorak' },
  { name: 'Kew', slug: 'kew', region: 'Inner-Melbourne', displayName: 'Kew' },
  { name: 'Hawthorn', slug: 'hawthorn', region: 'Inner-Melbourne', displayName: 'Hawthorn' },
  { name: 'Camberwell', slug: 'camberwell', region: 'Inner-Melbourne', displayName: 'Camberwell' },
];

/**
 * Get all suburb slugs for static generation
 */
export function getAllSuburbSlugs(): string[] {
  return MELBOURNE_SUBURBS.map((suburb) => suburb.slug);
}

/**
 * Get suburb data by slug
 */
export function getSuburbBySlug(slug: string): SuburbData | undefined {
  return MELBOURNE_SUBURBS.find((suburb) => suburb.slug === slug);
}

/**
 * Get suburbs by region
 */
export function getSuburbsByRegion(region: SuburbData['region']): SuburbData[] {
  return MELBOURNE_SUBURBS.filter((suburb) => suburb.region === region);
}

/**
 * Get all suburb names
 */
export function getAllSuburbNames(): string[] {
  return MELBOURNE_SUBURBS.map((suburb) => suburb.name);
}

