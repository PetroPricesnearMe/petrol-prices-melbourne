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
  // Simplified blocky style matching the reference image exactly
  const regions = [
    {
      id: 'northern',
      name: 'NORTHERN SUBURBS',
      config: MELBOURNE_REGIONS.NORTHERN,
      // Northern region - top portion (red)
      path: 'M 50 50 L 550 50 L 580 120 L 560 170 L 520 190 L 460 200 L 400 190 L 340 170 L 300 140 L 80 120 Z',
      labelPosition: { x: 320, y: 130 },
    },
    {
      id: 'western',
      name: 'WESTERN SUBURBS',
      config: MELBOURNE_REGIONS.WESTERN,
      // Western region - left side (gray)
      path: 'M 50 50 L 80 120 L 100 170 L 120 220 L 140 270 L 160 320 L 180 370 L 200 420 L 180 470 L 160 520 L 140 570 L 100 590 L 60 570 L 50 520 L 40 470 L 35 420 L 40 370 L 45 320 L 50 270 L 55 220 L 60 170 L 70 120 Z',
      labelPosition: { x: 120, y: 320 },
    },
    {
      id: 'melbourne_inner',
      name: 'MELBOURNE',
      config: MELBOURNE_REGIONS.MELBOURNE_INNER,
      // Inner Melbourne - center (purple) - smaller central area
      path: 'M 300 140 L 400 190 L 460 200 L 520 190 L 560 170 L 580 120 L 550 50 L 50 50 L 80 120 L 100 170 L 120 220 L 140 270 L 160 320 L 180 370 L 200 420 L 180 470 L 160 520 L 140 570 L 200 590 L 240 570 L 280 550 L 320 530 L 360 510 L 400 490 L 440 470 L 480 450 L 520 430 L 560 410 L 580 370 L 580 320 L 580 270 L 580 220 L 580 170 Z',
      labelPosition: { x: 320, y: 320 },
    },
    {
      id: 'eastern',
      name: 'EASTERN SUBURBS',
      config: MELBOURNE_REGIONS.EASTERN,
      // Eastern region - right side (pink)
      path: 'M 580 120 L 650 140 L 700 170 L 750 210 L 780 250 L 800 290 L 810 330 L 800 370 L 780 410 L 750 450 L 700 490 L 650 510 L 600 520 L 580 470 L 580 420 L 580 370 L 580 320 L 580 270 L 580 220 L 580 170 Z',
      labelPosition: { x: 700, y: 320 },
    },
    {
      id: 'south_eastern',
      name: 'SOUTH EASTERN SUBURBS',
      config: MELBOURNE_REGIONS.SOUTH_EASTERN,
      // South Eastern region - bottom portion (orange)
      path: 'M 200 590 L 240 570 L 280 550 L 320 530 L 360 510 L 400 490 L 440 470 L 480 450 L 520 430 L 560 410 L 600 430 L 640 450 L 680 470 L 720 490 L 760 510 L 800 530 L 840 550 L 880 570 L 900 590 L 880 620 L 860 650 L 840 680 L 800 700 L 760 720 L 720 730 L 680 720 L 640 700 L 600 680 L 560 660 L 520 640 L 480 620 L 440 600 L 400 590 L 360 580 L 320 590 L 280 600 L 240 610 L 200 620 Z',
      labelPosition: { x: 550, y: 650 },
    },
  ];

  // Water body (blue) at the bottom
  const waterBody = {
    path: 'M 0 650 L 950 650 L 950 800 L 0 800 Z',
    color: '#3B82F6'
  };

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
              viewBox="0 0 950 800"
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

              {/* Water Body */}
              <path
                d={waterBody.path}
                fill={waterBody.color}
                stroke="white"
                strokeWidth="2"
                className="water-body"
              />

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
                        fill: region.id === 'melbourne_inner' ? '#FCD34D' : 'white', // Yellow for Melbourne, white for others
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
