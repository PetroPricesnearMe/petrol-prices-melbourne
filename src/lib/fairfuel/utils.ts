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

export function transformPripmceDetailToStation(
  detail: FairFuelPriceDetail
): Station | null {
  if (!detail?.fuelStation) {
    return null;
  }

  const { fuelStation } = detail;
  const coordinates = normalizeCoordinates(fuelStation.location);
  const parsedAddress = parseAustralianAddress(fuelStation.address);
  const fuelPrices = convertFuelPrices(fuelStation.id, detail.fuelPrices);

  return {
    id: fuelStation.id,
    name: fuelStation.name,
    stationName: fuelStation.name,
    brand: fuelStation.brandId || undefined,
    address: parsedAddress.street || fuelStation.address,
    suburb: parsedAddress.suburb || undefined,
    city: parsedAddress.suburb || undefined,
    region: parsedAddress.region || 'VIC',
    postcode: parsedAddress.postcode || undefined,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    locationDetails: fuelStation.address,
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

  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  const street = parts.shift();
  const remainder = parts.join(', ').trim();
  const match =
    remainder &&
    remainder.match(/(.+?)\s+(VIC|NSW|QLD|SA|WA|TAS|ACT|NT)\s+(\d{4})$/i);

  if (match) {
    return {
      street: street || address,
      suburb: match[1].trim(),
      region: match[2].toUpperCase(),
      postcode: match[3],
    };
  }

  return {
    street: street || address,
    suburb: remainder || undefined,
    region: 'VIC',
    postcode: undefined,
  };
}

function convertFuelPrices(
  stationId: string,
  items: FairFuelPriceItem[] = []
): FuelPrice[] {
  return items
    .filter((item) => typeof item?.price === 'number')
    .map((item) => {
      const pricePerLiter = Number(item.price) / 100;
      const mappedType = mapFuelTypeCode(item.fuelType);

      return {
        id: `${stationId}-${item.fuelType}`,
        stationId,
        fuelType: mappedType,
        code: item.fuelType,
        pricePerLiter,
        price: pricePerLiter,
        rawPrice: item.price as number,
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
