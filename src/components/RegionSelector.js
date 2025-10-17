import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MotionDiv } from './MotionComponents';
import { MELBOURNE_REGIONS, getRegionCounts } from '../config/regions';
import dataSourceManager from '../services/DataSourceManager';
// CSS imported in pages/_app.js for Next.js compatibility

const RegionSelector = () => {
  const [regionCounts, setRegionCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  useEffect(() => {
    const loadRegionCounts = async () => {
      try {
        const stations = await dataSourceManager.fetchStations();
        const counts = getRegionCounts(stations);
        setRegionCounts(counts);
      } catch (error) {
        console.error('Error loading region counts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRegionCounts();
  }, []);

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
                    to={`/directory?region=${region.id}`}
                    className="modern-region-link"
                    onClick={(e) => {
                      console.log('🔗 Region link clicked:', region.id);
                      console.log('📍 Navigation URL:', `/directory?region=${region.id}`);
                      // Don't prevent default - let React Router handle navigation
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

                    {/* Fuel Pump Station Counter */}
                    <div className="fuel-pump-counter" style={{ '--region-color': region.color }}>
                      <div className="pump-display">
                        <div className="pump-screen">
                          <div className="pump-screen-content">
                            <div className="pump-icon">⛽</div>
                            <div className="pump-stats">
                              {loading ? (
                                <div className="pump-loading">
                                  <div className="loading-dots">
                                    <span></span><span></span><span></span>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="station-count">
                                    <span className="count-number">{regionCounts[region.id.toUpperCase()] || 0}</span>
                                    <span className="count-unit">Stations</span>
                                  </div>
                                  <div className="fuel-price-display">
                                    <span className="price-label">Avg Price</span>
                                    <span className="price-value">$1.85</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="pump-handle"></div>
                      </div>
                      <div className="pump-base"></div>
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
                <span className="summary-number">
                  {Object.values(regionCounts).reduce((a, b) => a + b, 0)}
                </span>
                <span className="summary-label">Petrol Stations Across Greater Melbourne</span>
              </div>
            </div>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};

export default RegionSelector;

