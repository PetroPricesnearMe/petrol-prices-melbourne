/**
 * Brand Logo Usage Examples
 * 
 * This file demonstrates various ways to use the brand logo system
 * in different contexts and components.
 */

import React from 'react';
import { getBrandLogo, useBrandLogo, getBrandClass } from '../../src/utils/brandLogo';

// ============================================================================
// Example 1: Basic Usage in a Simple Component
// ============================================================================

function BasicStationCard({ station }) {
  return (
    <div className="station-card">
      <img
        src={getBrandLogo(station.brand)}
        alt={`${station.brand} logo`}
        height={36}
        style={{ objectFit: 'contain' }}
        loading="lazy"
      />
      <h3>{station.name}</h3>
      <p>{station.address}</p>
    </div>
  );
}

// ============================================================================
// Example 2: Using the React Hook for Automatic Error Handling
// ============================================================================

function StationCardWithHook({ station }) {
  const { src, onError } = useBrandLogo(station.brand);

  return (
    <div className="station-card">
      <img
        src={src}
        onError={onError}
        alt={`${station.brand} logo`}
        className="brand-logo-img"
        loading="lazy"
        width={36}
        height={36}
      />
      <h3>{station.name}</h3>
    </div>
  );
}

// ============================================================================
// Example 3: Card with Brand-Specific Styling
// ============================================================================

function StyledStationCard({ station }) {
  const brandClass = getBrandClass(station.brand);

  return (
    <div className="station-card">
      {/* Brand-colored header */}
      <div className={`card-header ${brandClass}`}>
        <img
          src={getBrandLogo(station.brand)}
          alt={`${station.brand} logo`}
          className="brand-logo"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/brands/default-logo.svg';
          }}
        />
        <div className="brand-badge">{station.brand}</div>
      </div>

      {/* Card content */}
      <div className="card-content">
        <h3 className="station-name">{station.name}</h3>
        <p className="station-address">{station.address}</p>

        {/* Fuel prices */}
        {station.fuelPrices && station.fuelPrices.length > 0 && (
          <div className="fuel-prices">
            {station.fuelPrices.map((fuel, index) => (
              <div key={index} className="fuel-price-item">
                <span>{fuel.type}</span>
                <span>${fuel.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Example 4: Directory Listing with Logo
// ============================================================================

function DirectoryListItem({ station }) {
  return (
    <div className="directory-list-item">
      <div className="brand-logo-container">
        <img
          src={getBrandLogo(station.brand)}
          alt={`${station.brand} logo`}
          height={36}
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
        <div className="station-info">
          <h4>{station.name}</h4>
          <p>{station.city}</p>
        </div>
      </div>

      <div className="station-actions">
        <button>View Details</button>
        <button>Get Directions</button>
      </div>
    </div>
  );
}

// ============================================================================
// Example 5: Map Popup with Logo
// ============================================================================

function MapPopupContent({ station }) {
  return (
    <div className="map-popup">
      <div className="popup-header">
        <img
          src={getBrandLogo(station.brand)}
          alt={`${station.brand} logo`}
          height={28}
          style={{ objectFit: 'contain' }}
          className="brand-logo-img"
        />
        <h4>{station.name}</h4>
      </div>

      <div className="popup-body">
        <p className="address">{station.address}</p>

        {station.fuelPrices && station.fuelPrices.length > 0 && (
          <div className="prices">
            <strong>Current Prices:</strong>
            {station.fuelPrices.slice(0, 3).map((fuel, i) => (
              <div key={i}>
                {fuel.type}: ${fuel.price.toFixed(2)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Example 6: List View with Multiple Stations
// ============================================================================

function StationList({ stations }) {
  return (
    <div className="station-list">
      {stations.map(station => (
        <div key={station.id} className="station-list-row">
          {/* Logo column */}
          <div className="logo-cell">
            <img
              src={getBrandLogo(station.brand)}
              alt={`${station.brand} logo`}
              className="brand-logo-img"
              loading="lazy"
              width={36}
              height={36}
            />
          </div>

          {/* Station info column */}
          <div className="info-cell">
            <strong>{station.name}</strong>
            <small>{station.address}</small>
          </div>

          {/* Brand name column */}
          <div className="brand-cell">
            <span className={`brand-badge ${getBrandClass(station.brand)}`}>
              {station.brand}
            </span>
          </div>

          {/* Price column */}
          <div className="price-cell">
            {station.fuelPrices && station.fuelPrices[0] && (
              <span className="price">
                ${station.fuelPrices[0].price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Example 7: Compact Mobile Card
// ============================================================================

function MobileStationCard({ station }) {
  return (
    <div className="mobile-station-card">
      <div className="mobile-card-header">
        <img
          src={getBrandLogo(station.brand)}
          alt={`${station.brand} logo`}
          height={28}
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
        <span className="brand-name">{station.brand}</span>
      </div>

      <h4 className="mobile-station-name">{station.name}</h4>
      <p className="mobile-station-address">{station.city}</p>

      {station.fuelPrices && station.fuelPrices[0] && (
        <div className="mobile-price-highlight">
          Unleaded: ${station.fuelPrices[0].price.toFixed(2)}
        </div>
      )}

      <button className="mobile-action-btn">Get Directions</button>
    </div>
  );
}

// ============================================================================
// Example 8: Station Filter/Selector Dropdown
// ============================================================================

function BrandFilterDropdown({ brands, selectedBrand, onChange }) {
  return (
    <div className="brand-filter">
      <label htmlFor="brand-select">Filter by Brand:</label>
      <select
        id="brand-select"
        value={selectedBrand}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">All Brands</option>
        {brands.map(brand => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      {/* Visual brand selector with logos */}
      <div className="brand-logo-grid">
        {brands.map(brand => (
          <button
            key={brand}
            className={`brand-selector ${selectedBrand === brand ? 'active' : ''}`}
            onClick={() => onChange(brand)}
            title={brand}
          >
            <img
              src={getBrandLogo(brand)}
              alt={`${brand} logo`}
              height={32}
              style={{ objectFit: 'contain' }}
            />
            <span className="sr-only">{brand}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Example 9: Station Comparison Grid
// ============================================================================

function StationComparisonGrid({ stations }) {
  return (
    <div className="comparison-grid">
      {stations.map(station => (
        <div key={station.id} className="comparison-card">
          {/* Logo at top */}
          <div className="comparison-logo">
            <img
              src={getBrandLogo(station.brand)}
              alt={`${station.brand} logo`}
              height={36}
              style={{ objectFit: 'contain' }}
              loading="lazy"
            />
          </div>

          {/* Station details */}
          <h5>{station.name}</h5>
          <p className="small">{station.city}</p>

          {/* Price comparison */}
          {station.fuelPrices && (
            <table className="price-table">
              <tbody>
                {station.fuelPrices.map((fuel, i) => (
                  <tr key={i}>
                    <td>{fuel.type}</td>
                    <td className="price">${fuel.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Example 10: Brand Logo with Fallback and Loading State
// ============================================================================

function StationCardWithLoading({ station, isLoading }) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <div className="station-card">
      <div className="brand-logo-wrapper">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="logo-skeleton" />
        )}

        {/* Actual logo */}
        <img
          src={getBrandLogo(station.brand)}
          alt={`${station.brand} logo`}
          className={`brand-logo ${imageLoaded ? 'loaded' : 'loading'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = '/images/brands/default-logo.svg';
            setImageLoaded(true);
          }}
          height={36}
          width={120}
          style={{ objectFit: 'contain' }}
        />
      </div>

      {isLoading ? (
        <div className="station-content-skeleton">
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      ) : (
        <div className="station-content">
          <h3>{station.name}</h3>
          <p>{station.address}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Export all examples
// ============================================================================

export {
  BasicStationCard,
  StationCardWithHook,
  StyledStationCard,
  DirectoryListItem,
  MapPopupContent,
  StationList,
  MobileStationCard,
  BrandFilterDropdown,
  StationComparisonGrid,
  StationCardWithLoading,
};

// ============================================================================
// Example Data for Testing
// ============================================================================

export const sampleStation = {
  id: 1,
  name: "Shell Coles Express",
  brand: "Shell",
  address: "123 Main St, Melbourne VIC 3000",
  city: "Melbourne",
  latitude: -37.8136,
  longitude: 144.9631,
  fuelPrices: [
    { type: "Unleaded", price: 1.85 },
    { type: "Premium", price: 2.05 },
    { type: "Diesel", price: 1.95 },
  ]
};

export const sampleStations = [
  sampleStation,
  {
    id: 2,
    name: "BP Connect",
    brand: "BP",
    address: "456 High St, Melbourne VIC 3000",
    city: "Melbourne",
    latitude: -37.8200,
    longitude: 144.9700,
    fuelPrices: [
      { type: "Unleaded", price: 1.89 },
      { type: "Premium", price: 2.09 },
    ]
  },
  {
    id: 3,
    name: "7-Eleven",
    brand: "7-Eleven",
    address: "789 Collins St, Melbourne VIC 3000",
    city: "Melbourne",
    latitude: -37.8180,
    longitude: 144.9650,
    fuelPrices: [
      { type: "Unleaded", price: 1.79 },
      { type: "Diesel", price: 1.89 },
    ]
  }
];

// ============================================================================
// CSS Examples (place in your component's CSS file)
// ============================================================================

/*

.brand-logo-wrapper {
  position: relative;
  width: 120px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo.loading {
  opacity: 0;
}

.brand-logo.loaded {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.logo-skeleton {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.brand-logo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.brand-selector {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.brand-selector:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.brand-selector.active {
  border-color: #667eea;
  background: #f0f4ff;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

*/

