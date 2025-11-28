import type { FairFuelPriceDetail, FairFuelPriceItem } from '@/types/fairfuel';
import {
  FuelType,
  StationCategory,
  type FuelPrice,
  type Station,
} from '@/types/station';

export async function safeReadBody(response: Response): Promise<string | null> {
  try {
    const text = await response.text();
    return text?.slice(0, 500) || null;
  } catch {
    return null;
  }
}

export function transformPriceDetailToStation(
  detail: FairFuelPriceDetail
): Station | null {
  if (!detail?.fuelStation) {
    return null;
  }

  const { fuelStation } = detail;
  const coordinates = normalizeCoordinates(fuelStation.location);
  const parsedAddress = parseAustralianAddress(fuelStation.address);
  const fuelPrices = convertFuelPrices(fuelStation.id, detail.fuelPrices);
  
  // Normalize brand name
  const normalizedBrand = normalizeBrandName(fuelStation.brandId || fuelStation.name);
  
  // Normalize station name
  const normalizedName = normalizeStationName(fuelStation.name, normalizedBrand);
  
  // Normalize suburb name
  const normalizedSuburb = parsedAddress.suburb 
    ? normalizeSuburbName(parsedAddress.suburb)
    : undefined;

  return {
    id: fuelStation.id,
    name: normalizedName,
    stationName: normalizedName,
    brand: normalizedBrand,
    address: normalizeAddress(parsedAddress.street || fuelStation.address),
    suburb: normalizedSuburb,
    city: normalizedSuburb,
    region: parsedAddress.region || 'VIC',
    postcode: parsedAddress.postcode || undefined,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    locationDetails: normalizeAddress(fuelStation.address),
    phoneNumber: fuelStation.contactPhone,
    category: StationCategory.PETROL_STATION,
    fuelPrices,
    lastUpdated: detail.updatedAt,
  };
}

function normalizeCoordinates(location?: {
  latitude: number | null;
  longitude: number | null;
}) {
  return {
    latitude: typeof location?.latitude === 'number' ? location.latitude : 0,
    longitude: typeof location?.longitude === 'number' ? location.longitude : 0,
  };
}

function parseAustralianAddress(address?: string) {
  if (!address) {
    return {
      street: undefined,
      suburb: undefined,
      region: 'VIC',
      postcode: undefined,
    };
  }

  // Clean up address string
  const cleaned = address.trim().replace(/\s+/g, ' ');
  
  const parts = cleaned
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  const street = parts.shift();
  const remainder = parts.join(', ').trim();
  
  // Match pattern: "Suburb STATE 1234" or "Suburb 1234"
  const statePostcodeMatch =
    remainder &&
    remainder.match(/(.+?)\s+(VIC|NSW|QLD|SA|WA|TAS|ACT|NT)\s+(\d{4})$/i);

  if (statePostcodeMatch) {
    return {
      street: normalizeAddress(street || address),
      suburb: normalizeSuburbName(statePostcodeMatch[1].trim()),
      region: statePostcodeMatch[2].toUpperCase(),
      postcode: statePostcodeMatch[3],
    };
  }

  // Match pattern: "Suburb 1234" (assume VIC if no state)
  const postcodeMatch = remainder.match(/^(.+?)\s+(\d{4})$/);
  if (postcodeMatch) {
    return {
      street: normalizeAddress(street || address),
      suburb: normalizeSuburbName(postcodeMatch[1].trim()),
      region: 'VIC',
      postcode: postcodeMatch[2],
    };
  }

  return {
    street: normalizeAddress(street || address),
    suburb: remainder ? normalizeSuburbName(remainder) : undefined,
    region: 'VIC',
    postcode: undefined,
  };
}

/**
 * Normalize brand names to standard format
 */
function normalizeBrandName(brand?: string | null): string | undefined {
  if (!brand) return undefined;

  const normalized = brand.trim().toUpperCase();
  
  // Standard brand name mappings
  const brandMap: Record<string, string> = {
    'BP': 'BP',
    'BP AUSTRALIA': 'BP',
    'BRITISH PETROLEUM': 'BP',
    'SHELL': 'Shell',
    'SHELL AUSTRALIA': 'Shell',
    'ROYAL DUTCH SHELL': 'Shell',
    'CALTEX': 'Caltex',
    'CALTEX AUSTRALIA': 'Caltex',
    'AMPOL': 'Caltex', // Ampol merged with Caltex
    'AMPOL AUSTRALIA': 'Caltex',
    '7-ELEVEN': '7-Eleven',
    '7ELEVEN': '7-Eleven',
    'SEVEN ELEVEN': '7-Eleven',
    'COLES EXPRESS': 'Coles Express',
    'COLES': 'Coles Express',
    'UNITED': 'United',
    'UNITED PETROLEUM': 'United',
    'LIBERTY': 'Liberty',
    'LIBERTY OIL': 'Liberty',
    'METRO': 'Metro',
    'METRO FUEL': 'Metro',
    'PUMA': 'Puma',
    'PUMA ENERGY': 'Puma',
  };

  // Check exact match first
  if (brandMap[normalized]) {
    return brandMap[normalized];
  }

  // Check partial matches
  for (const [key, value] of Object.entries(brandMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  // Return capitalized version if no match
  return brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
}

/**
 * Normalize station name (remove brand prefix if redundant)
 */
function normalizeStationName(name: string, brand?: string): string {
  if (!name) return name;
  
  let normalized = name.trim();
  
  // Remove redundant brand prefixes
  if (brand) {
    const brandUpper = brand.toUpperCase();
    const patterns = [
      new RegExp(`^${brandUpper}\\s+`, 'i'),
      new RegExp(`^${brand}\\s+`, 'i'),
      new RegExp(`\\s+${brandUpper}$`, 'i'),
      new RegExp(`\\s+${brand}$`, 'i'),
    ];
    
    for (const pattern of patterns) {
      normalized = normalized.replace(pattern, ' ').trim();
    }
  }
  
  // Capitalize properly
  return normalized
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

/**
 * Normalize suburb names (proper capitalization)
 */
function normalizeSuburbName(suburb: string): string {
  if (!suburb) return suburb;
  
  // Common suburb name patterns
  const specialCases: Record<string, string> = {
    'ST KILDA': 'St Kilda',
    'ST ALBANS': 'St Albans',
    'ST LEONARDS': 'St Leonards',
    'MT WAVERLEY': 'Mt Waverley',
    'MT ELIZA': 'Mt Eliza',
    'FT GULLY': 'Ft Gully',
  };
  
  const upper = suburb.toUpperCase().trim();
  if (specialCases[upper]) {
    return specialCases[upper];
  }
  
  // Handle "Mc", "Mac", "O'", etc.
  return suburb
    .split(' ')
    .map((word, index) => {
      const lower = word.toLowerCase();
      
      // Handle special prefixes
      if (lower.startsWith("mc")) {
        return 'Mc' + word.slice(2).charAt(0).toUpperCase() + word.slice(3).toLowerCase();
      }
      if (lower.startsWith("mac")) {
        return 'Mac' + word.slice(3).charAt(0).toUpperCase() + word.slice(4).toLowerCase();
      }
      if (lower.startsWith("o'")) {
        return "O'" + word.slice(2).charAt(0).toUpperCase() + word.slice(3).toLowerCase();
      }
      
      // Capitalize first letter, lowercase rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .trim();
}

/**
 * Normalize address formatting
 */
function normalizeAddress(address: string): string {
  if (!address) return address;
  
  // Clean up whitespace and common formatting issues
  return address
    .trim()
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/\s*,\s*/g, ', ') // Normalize comma spacing
    .replace(/\s*-\s*/g, '-') // Normalize hyphen spacing
    .trim();
}

function convertFuelPrices(
  stationId: string,
  items: FairFuelPriceItem[] = []
): FuelPrice[] {
  return items
    .filter((item) => typeof item?.price === 'number' && item.price > 0)
    .map((item) => {
      // Ensure price is in cents (API provides price in cents)
      const priceInCents = Math.round(Number(item.price));
      const pricePerLiter = priceInCents / 100; // Convert to dollars for display
      const mappedType = mapFuelTypeCode(item.fuelType);

      return {
        id: `${stationId}-${item.fuelType}`,
        stationId,
        fuelType: mappedType,
        code: item.fuelType,
        pricePerLiter,
        price: priceInCents, // Store in cents for consistency
        rawPrice: priceInCents,
        currency: 'AUD',
        lastUpdated: item.updatedAt,
        priceSource: 'FairFuel Open Data API (24h delay)',
        isAvailable: item.isAvailable,
      };
    })
    .sort((a, b) => a.pricePerLiter - b.pricePerLiter);
}

function mapFuelTypeCode(code: string | undefined) {
  if (!code) {
    return 'Unknown';
  }

  const normalized = code.toUpperCase();

  switch (normalized) {
    case 'U91':
      return FuelType.UNLEADED;
    case 'P95':
      return FuelType.UNLEADED_95;
    case 'P98':
      return FuelType.PREMIUM_UNLEADED;
    case 'DSL':
    case 'PDSL':
    case 'B20':
    case 'LNG':
    case 'CNG':
      return FuelType.DIESEL;
    case 'E10':
      return FuelType.E10;
    case 'E85':
      return FuelType.E85;
    case 'LPG':
      return FuelType.LPG;
    default:
      return code;
  }
}
