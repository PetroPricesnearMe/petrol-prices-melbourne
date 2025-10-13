import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MotionDiv } from './MotionComponents';
import { MELBOURNE_REGIONS, getRegionCounts } from '../config/regions';
import dataSourceManager from '../services/DataSourceManager';
import './MelbourneRegionalMap.css';

/**
 * MelbourneRegionalMap Component
 *
 * Interactive SVG-based map of Greater Melbourne divided into 5 regions
 * Features:
 * - Clickable regions linking to directory pages
 * - Smooth hover animations with scale and glow effects
 * - Color-coded regions matching site theme
 * - Real-time station counts displayed on hover
 * - Fully responsive and accessible
 */

const MelbourneRegionalMap = () => {
  const navigate = useNavigate();
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [regionCounts, setRegionCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Load station counts for each region
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

  // Region definitions with SVG paths for Greater Melbourne
  // These paths create a stylized map of Melbourne's 5 major regions
  const regions = [
    {
      id: 'northern',
      name: 'Northern Suburbs',
      config: MELBOURNE_REGIONS.NORTHERN,
      // Northern region - top portion of map
      path: 'M 250 50 L 450 50 L 480 100 L 460 150 L 440 180 L 400 200 L 350 210 L 300 200 L 260 180 L 240 150 L 230 100 Z',
      labelPosition: { x: 350, y: 130 },
    },
    {
      id: 'western',
      name: 'Western Suburbs',
      config: MELBOURNE_REGIONS.WESTERN,
      // Western region - left side
      path: 'M 80 200 L 240 150 L 260 180 L 250 250 L 240 320 L 220 380 L 200 430 L 180 480 L 120 500 L 90 450 L 70 380 L 60 300 Z',
      labelPosition: { x: 150, y: 320 },
    },
    {
      id: 'melbourne_inner',
      name: 'Melbourne Inner',
      config: MELBOURNE_REGIONS.MELBOURNE_INNER,
      // Inner Melbourne - center
      path: 'M 250 250 L 350 210 L 400 200 L 440 220 L 450 280 L 440 340 L 420 380 L 380 400 L 330 410 L 280 400 L 240 380 L 230 320 Z',
      labelPosition: { x: 340, y: 310 },
    },
    {
      id: 'eastern',
      name: 'Eastern Suburbs',
      config: MELBOURNE_REGIONS.EASTERN,
      // Eastern region - right side
      path: 'M 440 180 L 460 150 L 480 100 L 550 120 L 600 160 L 640 220 L 660 280 L 650 340 L 620 380 L 580 400 L 540 410 L 500 400 L 450 380 L 440 340 L 450 280 L 440 220 Z',
      labelPosition: { x: 550, y: 280 },
    },
    {
      id: 'south_eastern',
      name: 'South Eastern Suburbs',
      config: MELBOURNE_REGIONS.SOUTH_EASTERN,
      // South Eastern region - bottom portion
      path: 'M 200 430 L 220 380 L 240 380 L 280 400 L 330 410 L 380 400 L 420 380 L 450 380 L 500 400 L 540 410 L 560 450 L 560 500 L 540 550 L 500 580 L 440 600 L 380 610 L 320 600 L 260 580 L 220 550 L 180 500 Z',
      labelPosition: { x: 380, y: 510 },
    },
  ];

  const handleRegionClick = (regionId) => {
    navigate(`/directory?region=${regionId}`);
  };

  const handleRegionKeyPress = (e, regionId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleRegionClick(regionId);
    }
  };

  return (
    <section className="melbourne-map-section" id="melbourne-map">
      <div className="container">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="map-header">
            <h2 className="map-title">Explore Melbourne by Region</h2>
            <p className="map-subtitle">
              Click any region to find the cheapest fuel prices near you
            </p>
          </div>

          {/* Interactive SVG Map */}
          <MotionDiv
            className="map-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <svg
              viewBox="0 0 720 660"
              className="melbourne-map-svg"
              role="img"
              aria-label="Interactive map of Greater Melbourne showing 5 regions"
            >
              <defs>
                {/* Gradient definitions for each region */}
                {regions.map((region) => (
                  <linearGradient
                    key={`gradient-${region.id}`}
                    id={`gradient-${region.id}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={region.config.color} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={region.config.color} stopOpacity="0.7" />
                  </linearGradient>
                ))}

                {/* Glow effect filter for hover */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Shadow effect */}
                <filter id="shadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Map Regions */}
              {regions.map((region, index) => {
                const isHovered = hoveredRegion === region.id;
                const stationCount = regionCounts[region.id.toUpperCase()] || 0;

                return (
                  <g
                    key={region.id}
                    className={`map-region ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => handleRegionClick(region.id)}
                    onKeyDown={(e) => handleRegionKeyPress(e, region.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${region.name} - ${stationCount} stations`}
                  >
                    {/* Region path with gradient fill */}
                    <path
                      d={region.path}
                      fill={`url(#gradient-${region.id})`}
                      stroke="white"
                      strokeWidth={isHovered ? 5 : 3}
                      strokeLinejoin="round"
                      className="region-path"
                      style={{
                        filter: isHovered ? 'url(#glow) url(#shadow)' : 'url(#shadow)',
                        cursor: 'pointer',
                      }}
                    />

                    {/* Region label */}
                    <text
                      x={region.labelPosition.x}
                      y={region.labelPosition.y}
                      textAnchor="middle"
                      className="region-label"
                      style={{
                        fontSize: isHovered ? '18px' : '16px',
                        fontWeight: isHovered ? '800' : '700',
                        fill: 'white',
                        pointerEvents: 'none',
                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {region.name}
                    </text>

                    {/* Station count badge (shown on hover) */}
                    {isHovered && !loading && (
                      <g className="station-count-badge">
                        <circle
                          cx={region.labelPosition.x}
                          cy={region.labelPosition.y + 30}
                          r="28"
                          fill="rgba(255, 255, 255, 0.95)"
                          stroke={region.config.color}
                          strokeWidth="3"
                          filter="url(#shadow)"
                        />
                        <text
                          x={region.labelPosition.x}
                          y={region.labelPosition.y + 33}
                          textAnchor="middle"
                          style={{
                            fontSize: '16px',
                            fontWeight: '900',
                            fill: region.config.color,
                            pointerEvents: 'none',
                          }}
                        >
                          {stationCount}
                        </text>
                        <text
                          x={region.labelPosition.x}
                          y={region.labelPosition.y + 48}
                          textAnchor="middle"
                          style={{
                            fontSize: '9px',
                            fontWeight: '600',
                            fill: '#6b7280',
                            pointerEvents: 'none',
                            textTransform: 'uppercase',
                          }}
                        >
                          Stations
                        </text>
                      </g>
                    )}

                    {/* Icon indicator */}
                    <text
                      x={region.labelPosition.x}
                      y={region.labelPosition.y - 15}
                      textAnchor="middle"
                      className="region-icon"
                      style={{
                        fontSize: isHovered ? '26px' : '22px',
                        pointerEvents: 'none',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {region.config.icon}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Legend */}
            <div className="map-legend">
              <div className="legend-title">Regions</div>
              <div className="legend-items">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    className={`legend-item ${hoveredRegion === region.id ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => handleRegionClick(region.id)}
                    aria-label={`View ${region.name}`}
                  >
                    <div
                      className="legend-color"
                      style={{ backgroundColor: region.config.color }}
                    />
                    <span className="legend-name">{region.name}</span>
                    {!loading && (
                      <span className="legend-count">
                        ({regionCounts[region.id.toUpperCase()] || 0})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </MotionDiv>

          {/* Call to Action */}
          <MotionDiv
            className="map-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="cta-content">
              <div className="cta-icon">⛽</div>
              <div className="cta-text">
                <h3>Find the Best Fuel Prices</h3>
                <p>Compare prices from {Object.values(regionCounts).reduce((a, b) => a + b, 0)}+ stations across Melbourne</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/directory')}
              >
                View All Stations
              </button>
            </div>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
};

export default MelbourneRegionalMap;
