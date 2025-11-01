/**
 * Modern Station Card with Glassmorphism
 *
 * Features:
 * - Blurred glassmorphism background
 * - Responsive brand images
 * - Interactive tooltips
 * - Smooth hover animations
 * - Price badges with gradients
 * - Verified status indicator
 * - Accessibility compliant
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import { LazyImage } from '@/components/atoms/LazyImage';
import { cn } from '@/styles/system/css-in-js';
import { getBrandInfo } from '@/utils/brandImages';
import './ModernStationCard.css';

interface FuelPrices {
  unleaded?: number | null;
  diesel?: number | null;
  premium95?: number | null;
  premium98?: number | null;
  lpg?: number | null;
}

interface StationCardProps {
  id: number;
  name: string;
  brand: string;
  address: string;
  suburb: string;
  postcode?: string;
  fuelPrices: FuelPrices;
  verified?: boolean;
  lastUpdated: string;
  onDirectionsClick?: () => void;
  className?: string;
}

export function ModernStationCard({
  id,
  name,
  brand,
  address,
  suburb,
  postcode,
  fuelPrices,
  verified = false,
  lastUpdated,
  onDirectionsClick,
  className = '',
}: StationCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const brandInfo = getBrandInfo(brand);

  // Get lowest price for badge
  const getLowestPrice = () => {
    const prices = Object.values(fuelPrices).filter((p): p is number => p !== null && p !== undefined);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const lowestPrice = getLowestPrice();

  // Get price color based on value
  const getPriceColor = (price: number | null) => {
    if (price === null) return 'text-gray-400';
    if (price < 200) return 'text-success-600 dark:text-success-400';
    if (price <= 210) return 'text-warning-600 dark:text-warning-400';
    return 'text-error-600 dark:text-error-400';
  };

  // Get fuel type label
  const getFuelLabel = (type: string) => {
    const labels: Record<string, string> = {
      unleaded: 'U91',
      diesel: 'Diesel',
      premium95: 'P95',
      premium98: 'P98',
      lpg: 'LPG',
    };
    return labels[type] || type;
  };

  return (
    <motion.article
      className={cn('modern-station-card', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      itemScope
      itemType="https://schema.org/GasStation"
    >
      {/* Glassmorphism Background Overlay */}
      <div className="card-glass-overlay" aria-hidden="true" />

      {/* Brand Image Header */}
      <div className="card-image-header" style={{
        background: `linear-gradient(135deg, ${brandInfo.color}20 0%, ${brandInfo.fallback}10 100%)`
      }}>
        <div className="brand-logo-container">
          {!imageError ? (
            <LazyImage
              src={brandInfo.logo}
              alt={`${brandInfo.name} logo`}
              width={120}
              height={80}
              className="object-contain"
              objectFit="contain"
              priority={false}
              rootMargin="100px"
              onError={() => setImageError(true)}
              aspectRatio="3/2"
            />
          ) : (
            <div className="brand-logo-fallback">
              <span className="text-4xl">⛽</span>
            </div>
          )}
        </div>

        {/* Badges Overlay */}
        <div className="card-badges">
          {verified && (
            <div
              className="verified-badge"
              onMouseEnter={() => setShowTooltip('verified')}
              onMouseLeave={() => setShowTooltip(null)}
              role="img"
              aria-label="Verified station"
            >
              <span aria-hidden="true">✓</span>
              {showTooltip === 'verified' && (
                <div className="tooltip" role="tooltip">
                  Verified Station
                </div>
              )}
            </div>
          )}

          {lowestPrice && (
            <div
              className="price-badge"
              onMouseEnter={() => setShowTooltip('lowest')}
              onMouseLeave={() => setShowTooltip(null)}
              role="status"
              aria-label={`Lowest price ${lowestPrice.toFixed(1)} cents per liter`}
            >
              <span className="price-badge-label">From</span>
              <span className="price-badge-value">{lowestPrice.toFixed(1)}¢</span>
              {showTooltip === 'lowest' && (
                <div className="tooltip" role="tooltip">
                  Lowest fuel price
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        {/* Station Name & Brand */}
        <div className="card-header">
          <h3 className="station-name" itemProp="name">
            {name}
          </h3>
          <div
            className="brand-chip"
            style={{
              background: `linear-gradient(135deg, ${brandInfo.color} 0%, ${brandInfo.fallback} 100%)`
            }}
          >
            {brand}
          </div>
        </div>

        {/* Address */}
        <div
          className="station-address"
          itemProp="address"
          itemScope
          itemType="https://schema.org/PostalAddress"
        >
          <span className="address-icon" aria-hidden="true">📍</span>
          <div>
            <div itemProp="streetAddress">{address}</div>
            <div className="address-locality">
              <span itemProp="addressLocality">{suburb}</span>
              {postcode && <span itemProp="postalCode"> {postcode}</span>}
            </div>
          </div>
        </div>

        {/* Fuel Prices Grid */}
        <div className="fuel-prices-grid">
          {Object.entries(fuelPrices).map(([type, price]) => {
            if (price === null || price === undefined) return null;

            return (
              <div
                key={type}
                className="fuel-price-item"
                onMouseEnter={() => setShowTooltip(type)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <span className="fuel-type">{getFuelLabel(type)}</span>
                <span className={cn('fuel-price', getPriceColor(price))}>
                  {price.toFixed(1)}
                </span>
                {showTooltip === type && (
                  <div className="tooltip" role="tooltip">
                    {type.charAt(0).toUpperCase() + type.slice(1)} fuel
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Last Updated */}
        <div className="card-footer">
          <span className="updated-time">
            Updated: {new Date(lastUpdated).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="card-actions">
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(address + ' ' + suburb)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="directions-button"
          onClick={(e) => {
            if (onDirectionsClick) {
              e.preventDefault();
              onDirectionsClick();
            }
          }}
          onMouseEnter={() => setShowTooltip('directions')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <span aria-hidden="true">🧭</span>
          <span>Get Directions</span>
          {showTooltip === 'directions' && (
            <div className="tooltip" role="tooltip">
              Open in Google Maps
            </div>
          )}
        </a>
      </div>

      {/* Hover Glow Effect */}
      <div className="card-glow" aria-hidden="true" />
    </motion.article>
  );
}

export default ModernStationCard;
