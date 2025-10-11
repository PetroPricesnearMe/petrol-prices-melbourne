import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MotionDiv } from './MotionComponents';
import { MELBOURNE_REGIONS, getRegionCounts } from '../config/regions';
import dataSourceManager from '../services/DataSourceManager';
import './RegionSelector.css';

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
            <h2>Find Petrol Stations by Region</h2>
            <p>Click on a region to view all petrol stations in that area</p>
          </div>

          <div className="region-content">
            {/* Region Map Grid */}
            <div className="region-grid">
              {regions.map((region, index) => (
                <MotionDiv
                  key={region.id}
                  className="region-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  <Link 
                    to={`/directory?region=${region.id}`}
                    className="region-link"
                    style={{
                      borderColor: region.color,
                      background: hoveredRegion === region.id 
                        ? `linear-gradient(135deg, ${region.color}15, ${region.color}25)`
                        : 'white'
                    }}
                  >
                    <div 
                      className="region-color-indicator"
                      style={{ backgroundColor: region.color }}
                    />
                    <div className="region-info">
                      <h3 className="region-name">{region.name}</h3>
                      <p className="region-description">{region.description}</p>
                      <div className="region-stats">
                        {loading ? (
                          <span className="loading-count">Loading...</span>
                        ) : (
                          <span className="station-count">
                            {regionCounts[region.id.toUpperCase()] || 0} Stations
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="region-arrow">→</div>
                  </Link>
                </MotionDiv>
              ))}
            </div>

            {/* Alternative: Simple List View */}
            <div className="region-list-view">
              <table className="region-table">
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Key Suburbs</th>
                    <th>Stations</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {regions.map((region) => (
                    <tr key={region.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '4px',
                              backgroundColor: region.color
                            }}
                          />
                          <strong>{region.name}</strong>
                        </div>
                      </td>
                      <td className="suburbs-cell">{region.description}</td>
                      <td className="count-cell">
                        <strong>{regionCounts[region.id.toUpperCase()] || 0}</strong>
                      </td>
                      <td>
                        <Link
                          to={`/directory?region=${region.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Stations
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Summary */}
          <div className="region-summary">
            <p>
              <strong>Total:</strong> {Object.values(regionCounts).reduce((a, b) => a + b, 0)} 
              petrol stations across Greater Melbourne
            </p>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};

export default RegionSelector;

