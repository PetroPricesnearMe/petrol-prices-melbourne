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

  // More geographically accurate Melbourne regions
  // Based on actual Melbourne geography with Port Phillip Bay
  const regions = [
    {
      id: 'northern',
      name: 'NORTHERN SUBURBS',
      config: MELBOURNE_REGIONS.NORTHERN,
      // Northern region - accurate northern suburbs shape
      path: 'M 150 80 L 750 80 L 750 200 L 700 240 L 650 260 L 600 270 L 500 275 L 400 270 L 300 260 L 200 230 L 150 180 Z',
      labelPosition: { x: 450, y: 170 },
    },
    {
      id: 'western',
      name: 'WESTERN SUBURBS',
      config: MELBOURNE_REGIONS.WESTERN,
      // Western region - left side with bay curve
      path: 'M 150 180 L 200 230 L 220 280 L 230 350 L 240 420 L 250 480 L 270 540 L 300 580 L 350 600 L 200 600 L 120 580 L 80 540 L 60 480 L 50 400 L 60 320 L 90 240 L 120 180 Z',
      labelPosition: { x: 160, y: 390 },
    },
    {
      id: 'melbourne_inner',
      name: 'INNER MELBOURNE',
      config: MELBOURNE_REGIONS.MELBOURNE_INNER,
      // Inner Melbourne - CBD and inner suburbs with bay frontage
      path: 'M 200 230 L 300 260 L 400 270 L 500 275 L 600 270 L 650 260 L 700 240 L 750 200 L 750 350 L 740 420 L 720 480 L 680 540 L 620 580 L 550 600 L 350 600 L 300 580 L 270 540 L 250 480 L 240 420 L 230 350 L 220 280 Z',
      labelPosition: { x: 480, y: 380 },
    },
    {
      id: 'eastern',
      name: 'EASTERN SUBURBS',
      config: MELBOURNE_REGIONS.EASTERN,
      // Eastern region - accurate eastern suburbs
      path: 'M 750 200 L 850 220 L 900 260 L 920 320 L 930 390 L 920 460 L 890 520 L 840 560 L 780 580 L 720 590 L 680 540 L 720 480 L 740 420 L 750 350 Z',
      labelPosition: { x: 820, y: 380 },
    },
    {
      id: 'south_eastern',
      name: 'SOUTH EASTERN SUBURBS',
      config: MELBOURNE_REGIONS.SOUTH_EASTERN,
      // South Eastern region - with Mornington Peninsula hint
      path: 'M 550 600 L 620 580 L 680 540 L 720 590 L 780 580 L 840 560 L 880 600 L 900 650 L 880 700 L 820 730 L 740 750 L 660 760 L 580 750 L 520 730 L 480 700 L 460 650 L 470 620 Z',
      labelPosition: { x: 680, y: 670 },
    },
  ];

  // Port Phillip Bay - more realistic shape
  const waterBody = {
    path: 'M 350 600 Q 400 620 450 630 Q 500 640 550 645 Q 600 650 650 660 Q 700 670 750 690 Q 800 710 820 730 L 820 800 L 200 800 L 200 600 Q 250 610 300 605 Z',
    color: '#4A90E2'
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
              viewBox="0 0 1000 850"
              className="melbourne-map-svg"
              aria-label="Interactive map of Greater Melbourne showing 5 regions"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Modern gradient definitions with blue/green theme */}
                <linearGradient id="gradient-northern" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.75" />
                </linearGradient>

                <linearGradient id="gradient-western" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.75" />
                </linearGradient>

                <linearGradient id="gradient-melbourne_inner" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.8" />
                </linearGradient>

                <linearGradient id="gradient-eastern" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.75" />
                </linearGradient>

                <linearGradient id="gradient-south_eastern" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.75" />
                </linearGradient>

                {/* Modern shadow effect */}
                <filter id="shadow">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.25" />
                </filter>

                {/* Hover glow effect */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
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
                        fontSize: isHovered ? '22px' : '18px',
                        fontWeight: '900',
                        fill: 'white',
                        pointerEvents: 'none',
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
                          cy={region.labelPosition.y + 35}
                          r="32"
                          fill="#ffffff"
                          stroke="#2563EB"
                          strokeWidth="4"
                          filter="url(#shadow)"
                        />
                        <text
                          x={region.labelPosition.x}
                          y={region.labelPosition.y + 38}
                          textAnchor="middle"
                          style={{
                            fontSize: '20px',
                            fontWeight: '900',
                            fill: '#2563EB',
                            pointerEvents: 'none',
                          }}
                        >
                          {stationCount}
                        </text>
                        <text
                          x={region.labelPosition.x}
                          y={region.labelPosition.y + 54}
                          textAnchor="middle"
                          style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            fill: '#6c757d',
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
                      y={region.labelPosition.y - 20}
                      textAnchor="middle"
                      className="region-icon"
                      style={{
                        fontSize: isHovered ? '32px' : '28px',
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
