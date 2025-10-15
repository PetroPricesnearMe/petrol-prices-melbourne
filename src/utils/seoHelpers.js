/**
 * SEO Helper Functions
 * Dynamic metadata generation for Technical SEO
 */

/**
 * Generate dynamic meta title for station pages
 * Format: {Station Name} - {Suburb} | Petrol Prices & Opening Hours
 * Max length: 60 characters (optimal for Google)
 */
export const generateStationTitle = (stationName, suburb, brand = '') => {
  const brandPrefix = brand ? `${brand} ` : '';
  const title = `${brandPrefix}${stationName} - ${suburb} | Petrol Prices & Hours`;

  // Truncate if too long (keep under 60 chars)
  if (title.length > 60) {
    return `${brandPrefix}${stationName} - ${suburb} | Fuel Prices`;
  }

  return title;
};

/**
 * Generate compelling meta description with CTA
 * Length: 120-158 characters (optimal for Google)
 */
export const generateStationDescription = (stationName, suburb, fuelTypes = [], address = '') => {
  const fuelList = fuelTypes.length > 0
    ? fuelTypes.slice(0, 3).join(', ')
    : 'Unleaded, Diesel, Premium';

  const description = `${stationName} in ${suburb} - Live fuel prices for ${fuelList}. View opening hours, services, and directions. Save money on your next fill-up!`;

  // Ensure optimal length
  if (description.length > 158) {
    return `${stationName} ${suburb} - Live ${fuelList} prices. View hours, services & directions. Save now!`;
  }

  return description;
};

/**
 * Generate suburb category page title
 */
export const generateSuburbTitle = (suburb, stationCount = 0) => {
  const count = stationCount > 0 ? ` - ${stationCount} Stations` : '';
  return `${suburb} Petrol Prices${count} | Cheapest Fuel Near You`;
};

/**
 * Generate suburb category page description
 */
export const generateSuburbDescription = (suburb, stationCount = 0, avgPrice = null) => {
  const count = stationCount > 0 ? `Compare live prices from ${stationCount}+ petrol stations in ${suburb}` : `Find the cheapest petrol in ${suburb}`;
  const priceInfo = avgPrice ? ` Average price: ${avgPrice}c/L.` : '';

  return `${count}.${priceInfo} Real-time fuel prices, opening hours, and reviews. Save money on unleaded, diesel & premium fuel today!`;
};

/**
 * Generate fuel type page title
 */
export const generateFuelTypeTitle = (fuelType, suburb = 'Melbourne') => {
  return `${fuelType} Prices in ${suburb} | Live Fuel Price Comparison`;
};

/**
 * Generate fuel type page description
 */
export const generateFuelTypeDescription = (fuelType, suburb = 'Melbourne', stationCount = 0) => {
  const count = stationCount > 0 ? `${stationCount}+` : 'multiple';
  return `Compare ${fuelType} prices across ${count} stations in ${suburb}. Find the cheapest ${fuelType} near you with real-time price updates. Save on every fill-up!`;
};

/**
 * Generate canonical URL
 * Prevents duplicate content issues
 */
export const generateCanonicalUrl = (path, baseUrl = 'https://www.petrolpricesnearme.com.au') => {
  // Remove trailing slashes and query parameters
  const cleanPath = path.replace(/\/$/, '').split('?')[0];
  return `${baseUrl}${cleanPath}`;
};

/**
 * Generate Open Graph image URL for station
 */
export const generateOGImage = (stationName, suburb, brand = '') => {
  // Use brand logo if available, otherwise use default
  const brandSlug = brand.toLowerCase().replace(/\s+/g, '-');
  return brand
    ? `https://www.petrolpricesnearme.com.au/images/brands/${brandSlug}.svg`
    : 'https://www.petrolpricesnearme.com.au/images/fuel-nozzles.svg';
};

/**
 * Generate structured breadcrumb data
 */
export const generateBreadcrumbs = (items = []) => {
  const baseUrl = 'https://www.petrolpricesnearme.com.au';

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.name,
        "item": `${baseUrl}${item.path}`
      }))
    ]
  };
};

/**
 * Generate LocalBusiness schema for individual station
 */
export const generateStationSchema = ({
  name,
  brand,
  address,
  suburb,
  postalCode,
  latitude,
  longitude,
  phone,
  openingHours = [],
  fuelPrices = [],
  amenities = [],
  rating = null,
  reviewCount = 0
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "GasStation",
    "name": name,
    "brand": brand ? {
      "@type": "Brand",
      "name": brand
    } : undefined,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
      "addressLocality": suburb,
      "addressRegion": "VIC",
      "postalCode": postalCode,
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude
    },
    "telephone": phone,
    "url": `https://www.petrolpricesnearme.com.au/stations/${suburb.toLowerCase().replace(/\s+/g, '-')}/${name.toLowerCase().replace(/\s+/g, '-')}`,
    "priceRange": fuelPrices.length > 0
      ? `$${Math.min(...fuelPrices.map(fp => fp.price))} - $${Math.max(...fuelPrices.map(fp => fp.price))}`
      : undefined,
    "openingHoursSpecification": openingHours.length > 0 ? openingHours : [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }],
    "amenityFeature": amenities.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })),
    "aggregateRating": rating ? {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "paymentAccepted": "Cash, Credit Card, Debit Card, Contactless",
    "currenciesAccepted": "AUD"
  };

  // Remove undefined values
  return JSON.parse(JSON.stringify(schema));
};

/**
 * Generate FAQ schema for help pages
 */
export const generateFAQSchema = (faqs = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

/**
 * Generate Article schema for blog posts
 */
export const generateArticleSchema = ({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author = "Petrol Prices Near Me Team",
  keywords = []
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": image,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": "https://www.petrolpricesnearme.com.au"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Petrol Prices Near Me",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.petrolpricesnearme.com.au/images/fuel-icon-192.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.petrolpricesnearme.com.au"
    },
    "keywords": keywords.join(', ')
  };
};

/**
 * Clean URL slug generation
 * Format: /melbourne/richmond/shell-bridge-road
 */
export const generateStationSlug = (stationName, suburb, street = '') => {
  const cleanName = stationName.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const cleanSuburb = suburb.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const cleanStreet = street ? '-' + street.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() : '';

  return `/melbourne/${cleanSuburb}/${cleanName}${cleanStreet}`;
};

/**
 * Generate suburb category URL
 */
export const generateSuburbSlug = (suburb) => {
  const cleanSuburb = suburb.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  return `/suburbs/${cleanSuburb}`;
};

/**
 * Generate fuel type URL
 */
export const generateFuelTypeSlug = (fuelType) => {
  const cleanType = fuelType.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  return `/fuel-types/${cleanType}`;
};

/**
 * Validate meta description length
 */
export const isValidDescriptionLength = (description) => {
  return description.length >= 120 && description.length <= 158;
};

/**
 * Validate meta title length
 */
export const isValidTitleLength = (title) => {
  return title.length >= 30 && title.length <= 60;
};

/**
 * Generate Twitter Card meta tags
 */
export const generateTwitterCardTags = (title, description, image) => {
  return {
    "twitter:card": "summary_large_image",
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": image,
    "twitter:site": "@PetrolPricesAU",
    "twitter:creator": "@PetrolPricesAU"
  };
};

/**
 * Generate robots meta tag based on page type
 */
export const generateRobotsTag = (pageType = 'index') => {
  const robotsMap = {
    'index': 'index, follow, max-snippet:-1, max-image-preview:large',
    'noindex': 'noindex, nofollow',
    'archive': 'noindex, follow',
    'category': 'index, follow'
  };

  return robotsMap[pageType] || robotsMap.index;
};

export default {
  generateStationTitle,
  generateStationDescription,
  generateSuburbTitle,
  generateSuburbDescription,
  generateFuelTypeTitle,
  generateFuelTypeDescription,
  generateCanonicalUrl,
  generateOGImage,
  generateBreadcrumbs,
  generateStationSchema,
  generateFAQSchema,
  generateArticleSchema,
  generateStationSlug,
  generateSuburbSlug,
  generateFuelTypeSlug,
  isValidDescriptionLength,
  isValidTitleLength,
  generateTwitterCardTags,
  generateRobotsTag
};

