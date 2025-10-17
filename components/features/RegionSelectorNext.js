'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MotionDiv } from '../../src/components/MotionComponents';
import { MELBOURNE_REGIONS } from '../../src/config/regions';

const RegionSelectorNext = ({ regionCounts, totalStations }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const regions = Object.values(MELBOURNE_REGIONS);

  return (
    <section className="region-selector-section" id="regions">
      <div className="container">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="region-header">
            <h2>Explore Melbourne by Region</h2>
            <p>Find the cheapest fuel in your area - Select your region below</p>
          </div>

          <div className="region-content">
            {/* Modern Region Card Grid */}
            <div className="region-grid-modern">
              {regions.map((region, index) => (
                <MotionDiv
                  key={region.id}
                  className="modern-region-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  <Link
                    href={`/directory?region=${region.id}`}
                    className="modern-region-link"
                    onClick={() => {
                      console.log('🔗 Region link clicked:', region.id);
                      console.log('📍 Navigation URL:', `/directory?region=${region.id}`);
                    }}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    style={{
                      background: hoveredRegion === region.id
                        ? `linear-gradient(135deg, ${region.color}25, ${region.color}15)`
                        : 'white',
                      transform: hoveredRegion === region.id ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)'
                    }}
                  >
                    {/* Icon Circle */}
                    <div className="region-icon-circle" style={{ backgroundColor: region.color }}>
                      <span className="region-emoji">{region.icon}</span>
                    </div>

                    {/* Region Info */}
                    <div className="modern-region-info">
                      <h3 className="modern-region-name">{region.name}</h3>
                      <p className="modern-region-description">{region.description}</p>
                    </div>

                    {/* Station Count Badge */}
                    <div className="region-count-badge" style={{ backgroundColor: region.color }}>
                      <span className="count-number">{regionCounts[region.id.toUpperCase()] || 0}</span>
                      <span className="count-label">Stations</span>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="card-hover-shine"></div>
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </div>

          {/* Total Summary */}
          <div className="region-summary-modern">
            <div className="summary-content">
              <div className="summary-icon">🚗</div>
              <div className="summary-text">
                <span className="summary-number">{totalStations}</span>
                <span className="summary-label">Petrol Stations Across Greater Melbourne</span>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};

export default RegionSelectorNext;

