/**
 * Station SEO Example Usage
 * 
 * This file demonstrates how to use the new SEO-friendly station URLs
 * in various scenarios throughout your application.
 */

import Link from 'next/link';
import type { Metadata } from 'next';
import { 
  getStationUrl, 
  generateStationSlug,
  generateStationSEOMetadata,
  parseStationSlug,
  generateStationStructuredData,
  generateStationBreadcrumbs,
} from '@/lib/seo/station-seo';
import type { Station } from '@/types/station';

// ============================================================================
// EXAMPLE 1: Simple Station Card Component
// ============================================================================

interface StationCardProps {
  station: Station;
}

function StationCard({ station }: StationCardProps) {
  return (
    <div className="station-card">
      <h3>{station.name}</h3>
      <p>{station.address}</p>
      <p>{station.suburb}</p>
      
      {/* ✅ Use getStationUrl() for the href */}
      <Link href={getStationUrl(station)} className="btn btn-primary">
        View Details →
      </Link>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Map Popup Component
// ============================================================================

function MapStationPopup({ station }: { station: Station }) {
  return (
    <div className="map-popup">
      <h4 className="font-bold">{station.name}</h4>
      <p className="text-sm">{station.brand}</p>
      <p className="text-xs text-gray-600">{station.address}</p>
      
      <div className="flex gap-2 mt-3">
        {/* ✅ Use getStationUrl() for the href */}
        <Link 
          href={getStationUrl(station)}
          className="flex-1 bg-blue-600 text-white text-center py-2 rounded"
        >
          View Details
        </Link>
        
        <a 
          href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gray-600 text-white text-center py-2 rounded"
        >
          Directions
        </a>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: HTML String Interpolation (for MapLibre popups)
// ============================================================================

function createMapPopupHTML(station: Station): string {
  // ✅ Use generateStationSlug() in HTML strings
  const stationSlug = generateStationSlug(station);
  
  return `
    <div class="maplibre-popup" style="min-width: 280px; max-width: 320px;">
      <div style="padding: 12px;">
        <h4 style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">
          ${station.name}
        </h4>
        <p style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">
          ${station.brand || 'Service Station'}
        </p>
        <p style="font-size: 12px; color: #9ca3af;">
          ${station.address || ''}
        </p>
      </div>
      
      <div style="padding: 12px; display: flex; gap: 8px;">
        <a 
          href="/stations/${stationSlug}"
          style="flex: 1; background: #3b82f6; color: white; text-align: center; 
                 padding: 10px; border-radius: 6px; text-decoration: none; 
                 font-weight: 600; font-size: 13px;"
        >
          View Details
        </a>
      </div>
    </div>
  `;
}

// ============================================================================
// EXAMPLE 4: Dynamic Station Page with Metadata
// ============================================================================

interface StationPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for the station page
export async function generateMetadata({ params }: StationPageProps): Promise<Metadata> {
  const { id } = await params;
  
  // ✅ Parse both old and new URL formats
  const stationId = parseStationSlug(id);
  
  // Fetch station data
  const station = await getStationById(stationId);
  
  if (!station) {
    return {
      title: 'Station Not Found',
    };
  }
  
  // ✅ Use generateStationSEOMetadata() for complete SEO metadata
  return generateStationSEOMetadata(station);
}

// Station page component
export default async function StationPage({ params }: StationPageProps) {
  const { id } = await params;
  
  // ✅ Parse both old and new URL formats
  const stationId = parseStationSlug(id);
  
  const station = await getStationById(stationId);
  
  if (!station) {
    return <div>Station not found</div>;
  }
  
  // ✅ Generate structured data
  const structuredData = [
    generateStationStructuredData(station),
    generateStationBreadcrumbs(station),
  ];
  
  return (
    <>
      {/* Add structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="station-page">
        <h1>{station.name}</h1>
        <p>{station.brand}</p>
        <p>{station.address}</p>
        
        {/* Page content */}
      </div>
    </>
  );
}

// ============================================================================
// EXAMPLE 5: Station List with SEO URLs
// ============================================================================

interface StationListProps {
  stations: Station[];
}

function StationList({ stations }: StationListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stations.map((station) => (
        <Link 
          key={station.id}
          // ✅ Use getStationUrl() for the href
          href={getStationUrl(station)}
          className="block border rounded-lg p-4 hover:shadow-lg transition"
        >
          <h3 className="font-bold text-lg">{station.name}</h3>
          <p className="text-sm text-gray-600">{station.brand}</p>
          <p className="text-xs text-gray-500">{station.suburb}</p>
          
          {station.cheapestPrice && (
            <p className="mt-2 text-lg font-bold text-blue-600">
              From {station.cheapestPrice.toFixed(1)}¢/L
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Nearby Stations Section
// ============================================================================

interface NearbyStationsSectionProps {
  stations: Station[];
  currentStation: Station;
}

function NearbyStationsSection({ stations, currentStation }: NearbyStationsSectionProps) {
  return (
    <section className="nearby-stations">
      <h2 className="text-2xl font-bold mb-4">Nearby Stations</h2>
      
      <div className="space-y-3">
        {stations.map((station) => (
          <div key={station.id} className="flex items-center justify-between border-b pb-3">
            <div className="flex-1">
              <h3 className="font-semibold">{station.name}</h3>
              <p className="text-sm text-gray-600">{station.address}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-600">
                {station.distance?.toFixed(1)}km
              </span>
              
              {/* ✅ Use getStationUrl() for the href */}
              <Link 
                href={getStationUrl(station)}
                className="text-sm text-blue-600 hover:underline"
              >
                View →
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Link back to directory with current suburb */}
      <Link 
        href={`/directory/${currentStation.suburb?.toLowerCase().replace(/\s+/g, '-')}`}
        className="mt-4 inline-block text-blue-600 hover:underline"
      >
        View all stations in {currentStation.suburb} →
      </Link>
    </section>
  );
}

// ============================================================================
// EXAMPLE 7: Testing URL Format
// ============================================================================

function testStationURLs() {
  const mockStation: Station = {
    id: '456',
    name: 'BP Thomastown',
    stationName: 'BP Thomastown',
    brand: 'BP',
    suburb: 'Thomastown',
    address: '123 Main St, Thomastown VIC 3074',
    latitude: -37.6900,
    longitude: 145.0100,
  };
  
  console.log('Testing Station SEO URLs:');
  console.log('========================');
  
  // Generate slug
  const slug = generateStationSlug(mockStation);
  console.log('Generated slug:', slug);
  // Output: "bp-thomastown-456"
  
  // Get full URL
  const url = getStationUrl(mockStation);
  console.log('Full URL:', url);
  // Output: "/stations/bp-thomastown-456"
  
  // Parse old format
  const oldId = parseStationSlug('456');
  console.log('Parse old format (456):', oldId);
  // Output: "456"
  
  // Parse new format
  const newId = parseStationSlug('bp-thomastown-456');
  console.log('Parse new format (bp-thomastown-456):', newId);
  // Output: "456"
  
  console.log('✅ All URL formats working correctly!');
}

// ============================================================================
// EXAMPLE 8: Search Results with SEO URLs
// ============================================================================

interface SearchResultsProps {
  query: string;
  stations: Station[];
}

function SearchResults({ query, stations }: SearchResultsProps) {
  return (
    <div className="search-results">
      <h2 className="text-2xl font-bold mb-4">
        Search Results for &quot;{query}&quot;
      </h2>
      
      <p className="text-gray-600 mb-6">
        Found {stations.length} stations
      </p>
      
      <div className="space-y-4">
        {stations.map((station) => (
          <Link
            key={station.id}
            // ✅ Use getStationUrl() for the href
            href={getStationUrl(station)}
            className="block border rounded-lg p-5 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {station.name}
                </h3>
                <p className="text-sm text-blue-600 mt-1">
                  {station.brand}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  📍 {station.address}
                </p>
              </div>
              
              {station.cheapestPrice && (
                <div className="ml-4 text-right">
                  <p className="text-xs text-gray-500">From</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {station.cheapestPrice.toFixed(1)}¢
                  </p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Utility Functions for Examples
// ============================================================================

// Mock function to simulate fetching station by ID
async function getStationById(id: string): Promise<Station | null> {
  // In real implementation, this would fetch from database or API
  // For this example, we'll return a mock station
  return {
    id,
    name: 'BP Thomastown',
    stationName: 'BP Thomastown',
    brand: 'BP',
    suburb: 'Thomastown',
    address: '123 Main St, Thomastown VIC 3074',
    latitude: -37.6900,
    longitude: 145.0100,
    region: 'VIC',
    postcode: '3074',
  };
}

// Export examples for use in documentation
export {
  StationCard,
  MapStationPopup,
  createMapPopupHTML,
  StationList,
  NearbyStationsSection,
  SearchResults,
  testStationURLs,
};

