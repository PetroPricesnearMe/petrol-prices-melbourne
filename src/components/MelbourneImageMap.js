import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MotionDiv } from './MotionComponents';
import { MELBOURNE_REGIONS, getRegionCounts } from '../config/regions';
import dataSourceManager from '../services/DataSourceManager';
import './MelbourneImageMap.css';

/**
 * MelbourneImageMap Component
 *
 * Interactive HTML image map of Greater Melbourne divided into 5 regions
 * Features:
 * - Clickable regions linking to directory pages
 * - Hover effects with region highlighting
 * - Real-time station counts displayed on hover
 * - Fully responsive and accessible
 */

const MelbourneImageMap = () => {
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

  const handleRegionClick = (regionId) => {
    navigate(`/directory?region=${regionId}`);
  };

  const handleRegionHover = (regionId) => {
    setHoveredRegion(regionId);
  };

  const handleRegionLeave = () => {
    setHoveredRegion(null);
  };

  // Region mapping based on the image map coordinates
  const regionMap = {
    'NORTHERN': {
      id: 'northern',
      config: MELBOURNE_REGIONS.NORTHERN,
      stationCount: regionCounts.NORTHERN || 0
    },
    'EASTERN': {
      id: 'eastern',
      config: MELBOURNE_REGIONS.EASTERN,
      stationCount: regionCounts.EASTERN || 0
    },
    'MELBOURNE': {
      id: 'melbourne_inner',
      config: MELBOURNE_REGIONS.MELBOURNE_INNER,
      stationCount: regionCounts.MELBOURNE_INNER || 0
    },
    'SOUTH EAST': {
      id: 'south_eastern',
      config: MELBOURNE_REGIONS.SOUTH_EASTERN,
      stationCount: regionCounts.SOUTH_EASTERN || 0
    },
    'WESTERN': {
      id: 'western',
      config: MELBOURNE_REGIONS.WESTERN,
      stationCount: regionCounts.WESTERN || 0
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

          {/* Interactive Image Map */}
          <MotionDiv
            className="map-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="image-map-wrapper">
              <img
                src="/images/melbourne-map-vector.jpg"
                alt="Interactive map of Greater Melbourne showing 5 regions"
                usemap="#melbourne-regions-map"
                className="melbourne-map-image"
              />

              <map name="melbourne-regions-map">
                <area
                  target=""
                  alt="NORTHERN"
                  title="NORTHERN SUBURBS"
                  href=""
                  coords="578,166,247"
                  shape="circle"
                  onMouseEnter={() => handleRegionHover('NORTHERN')}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionClick('northern')}
                />
                <area
                  target=""
                  alt="EASTERN"
                  title="EASTERN SUBURBS"
                  href=""
                  coords="894,150,698,415,998,609,1005,483,1006,133,954,114,914,124"
                  shape="poly"
                  onMouseEnter={() => handleRegionHover('EASTERN')}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionClick('eastern')}
                />
                <area
                  target=""
                  alt="MELBOURNE"
                  title="INNER MELBOURNE"
                  href=""
                  coords="519,419,661,432,738,492,556,516,452,463,427,396,466,405,486,415"
                  shape="poly"
                  onMouseEnter={() => handleRegionHover('MELBOURNE')}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionClick('melbourne_inner')}
                />
                <area
                  target=""
                  alt="SOUTH EAST"
                  title="SOUTH EASTERN SUBURBS"
                  href=""
                  coords="699,720,635,545,773,537,916,591,969,690,935,730,766,792,757,842,756,898,588,999,547,961,634,828"
                  shape="poly"
                  onMouseEnter={() => handleRegionHover('SOUTH EAST')}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionClick('south_eastern')}
                />
                <area
                  target=""
                  alt="WESTERN"
                  title="WESTERN SUBURBS"
                  href=""
                  coords="185,153,103,233,74,457,127,577,231,587,331,520,400,392,300,223,292,164,241,128,216,136,205,145"
                  shape="poly"
                  onMouseEnter={() => handleRegionHover('WESTERN')}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionClick('western')}
                />
              </map>

              {/* Overlay for region information */}
              {hoveredRegion && regionMap[hoveredRegion] && (
                <div className="region-overlay">
                  <div className="region-info">
                    <h3 className="region-name">
                      {hoveredRegion === 'SOUTH EAST' ? 'SOUTH EASTERN SUBURBS' :
                        hoveredRegion === 'MELBOURNE' ? 'INNER MELBOURNE' :
                          hoveredRegion + ' SUBURBS'}
                    </h3>
                    {!loading && (
                      <div className="station-count">
                        <span className="count-number">{regionMap[hoveredRegion].stationCount}</span>
                        <span className="count-label">Stations</span>
                      </div>
                    )}
                    <div className="region-icon">
                      {regionMap[hoveredRegion].config.icon}
                    </div>
                  </div>
                </div>
              )}
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

export default MelbourneImageMap;
