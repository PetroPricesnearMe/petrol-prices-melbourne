import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from './SEO';
import Breadcrumbs from './Breadcrumbs';
import { trackPageView } from '../utils/analytics';
import fuelPriceService from '../services/FuelPriceService';
import dataSourceManager from '../services/DataSourceManager';
import './FuelPriceTrendsPage.css';

const FuelPriceTrendsPage = () => {
  const [selectedFuelType, setSelectedFuelType] = useState('unleaded');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track page view on mount
  useEffect(() => {
    trackPageView('Fuel Price Trends');
  }, []);

  const fuelTypes = [
    { key: 'unleaded', label: 'Unleaded 91', icon: '⛽' },
    { key: 'premium', label: 'Premium 95', icon: '🔋' },
    { key: 'premium98', label: 'Premium 98', icon: '⚡' },
    { key: 'diesel', label: 'Diesel', icon: '🚛' },
    { key: 'gas', label: 'Gas', icon: '🔥' }
  ];

  const timeframes = [
    { key: '24hours', label: '24 Hours' },
    { key: '7days', label: '7 Days' },
    { key: '30days', label: '30 Days' },
    { key: '90days', label: '90 Days' }
  ];

  // Fetch real trend data from Baserow
  useEffect(() => {
    const fetchTrendData = async () => {
      setLoading(true);

      try {
        // Calculate number of days based on timeframe
        const days = selectedTimeframe === '24hours' ? 1 :
          selectedTimeframe === '7days' ? 7 :
            selectedTimeframe === '30days' ? 30 : 90;

        // Get trend data from Baserow
        const trendDataFromService = await fuelPriceService.getTrendData(selectedFuelType, days);

        // If we have real data, use it
        if (trendDataFromService && trendDataFromService.length > 0) {
          setTrendData(trendDataFromService);
        } else {
          // Fallback: Calculate from current station data
          console.log('⚠️ No historical trend data, using current prices as baseline');
          const stations = await dataSourceManager.fetchStations();
          const currentAverage = fuelPriceService.getAveragePrice(stations, selectedFuelType);

          // Generate simple trend based on current average
          const fallbackData = [];
          for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));

            fallbackData.push({
              date: date.toISOString().split('T')[0],
              price: currentAverage > 0 ? currentAverage : 180, // Use real average or fallback to 180
              count: 0
            });
          }
          setTrendData(fallbackData);
        }
      } catch (error) {
        console.error('Error fetching trend data:', error);
        // Set empty data on error
        setTrendData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [selectedFuelType, selectedTimeframe]);

  const getTrendDirection = () => {
    if (!trendData || trendData.length < 2) return 'stable';
    const first = trendData[0].price;
    const last = trendData[trendData.length - 1].price;
    const change = last - first;

    if (change > 2) return 'increasing';
    if (change < -2) return 'decreasing';
    return 'stable';
  };

  const getTrendIcon = () => {
    const direction = getTrendDirection();
    return direction === 'increasing' ? '📈' :
      direction === 'decreasing' ? '📉' : '➡️';
  };

  const getTrendColor = () => {
    const direction = getTrendDirection();
    return direction === 'increasing' ? '#ef4444' :
      direction === 'decreasing' ? '#10b981' : '#6b7280';
  };

  return (
    <>
      <SEO
        title="Melbourne Fuel Price Trends 2025 | Live Analysis & Historical Data - Save Up to 30c/L"
        description="📊 Track live fuel price trends in Melbourne with real-time analysis and historical data. Understand price cycles, compare unleaded/diesel/premium trends, and discover the best days to fill up for maximum savings!"
        keywords="fuel price trends melbourne 2025, petrol price history melbourne, fuel price cycle australia, petrol price analysis melbourne, melbourne fuel trends live, price forecasting petrol, fuel price patterns melbourne, weekly price cycle vic, best day to buy petrol melbourne, unleaded diesel trends melbourne"
        canonical="/fuel-price-trends"
      />
      <motion.div
        className="fuel-price-trends-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumbs customCrumbs={[
          { label: 'Home', path: '/', icon: '🏠' },
          { label: 'Fuel Price Trends', path: '/fuel-price-trends', isActive: true }
        ]} />
        <div className="trends-header">
          <div className="container">
            <motion.div
              className="header-content"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800 }}>
                Melbourne Fuel Price Trends & Analysis
              </h1>
              <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', marginTop: '0.75rem', maxWidth: '800px', margin: '0 auto' }}>
                Track real-time fuel price movements across Melbourne. Understand weekly cycles, analyze historical trends,
                and discover the optimal times to fill up and save up to 30c per liter on every purchase.
              </p>
            </motion.div>

            <motion.div
              className="trends-controls"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="control-group">
                <label className="control-label">Fuel Type</label>
                <div className="fuel-type-buttons">
                  {fuelTypes.map(fuel => (
                    <button
                      key={fuel.key}
                      className={`fuel-btn ${selectedFuelType === fuel.key ? 'active' : ''}`}
                      onClick={() => setSelectedFuelType(fuel.key)}
                    >
                      <span className="fuel-icon">{fuel.icon}</span>
                      <span className="fuel-label">{fuel.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-group">
                <label className="control-label">Time Period</label>
                <div className="timeframe-buttons">
                  {timeframes.map(timeframe => (
                    <button
                      key={timeframe.key}
                      className={`timeframe-btn ${selectedTimeframe === timeframe.key ? 'active' : ''}`}
                      onClick={() => setSelectedTimeframe(timeframe.key)}
                    >
                      {timeframe.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="trends-content">
          <div className="container">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <h3>Loading trend data...</h3>
              </div>
            ) : (
              <motion.div
                className="trends-dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {/* Trend Summary */}
                <div className="trend-summary">
                  <div className="summary-card">
                    <div className="summary-header">
                      <h3>Current Trend</h3>
                      <span className="trend-icon">{getTrendIcon()}</span>
                    </div>
                    <div className="summary-content">
                      <div className="current-price">
                        {trendData && trendData[trendData.length - 1]?.price}¢
                      </div>
                      <div className="trend-description" style={{ color: getTrendColor() }}>
                        {getTrendDirection().charAt(0).toUpperCase() + getTrendDirection().slice(1)}
                        {trendData && trendData.length > 1 &&
                          ` by ${Math.abs(trendData[trendData.length - 1].price - trendData[0].price).toFixed(1)}¢`}
                      </div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-header">
                      <h3>Average Price</h3>
                      <span className="summary-icon">📊</span>
                    </div>
                    <div className="summary-content">
                      <div className="average-price">
                        {trendData && (trendData.reduce((sum, item) => sum + item.price, 0) / trendData.length).toFixed(1)}¢
                      </div>
                      <div className="summary-description">
                        Over {selectedTimeframe.replace('days', ' days').replace('hours', ' hours')}
                      </div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-header">
                      <h3>Price Range</h3>
                      <span className="summary-icon">📏</span>
                    </div>
                    <div className="summary-content">
                      <div className="price-range">
                        {trendData && Math.min(...trendData.map(d => d.price)).toFixed(1)}¢ - {trendData && Math.max(...trendData.map(d => d.price)).toFixed(1)}¢
                      </div>
                      <div className="summary-description">
                        Lowest to highest
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="chart-container">
                  <h3>Price Trend Chart</h3>
                  <div className="chart-placeholder">
                    <div className="chart-message">
                      <span className="chart-icon">📈</span>
                      <h4>Interactive Chart Coming Soon</h4>
                      <p>We're working on an interactive chart to visualize fuel price trends over time.</p>
                      <div className="chart-features">
                        <div className="feature">• Historical price data</div>
                        <div className="feature">• Price predictions</div>
                        <div className="feature">• Station-specific trends</div>
                        <div className="feature">• Export data functionality</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="insights-section">
                  <h3>Price Insights</h3>
                  <div className="insights-grid">
                    <div className="insight-card">
                      <div className="insight-icon">⏰</div>
                      <h4>Best Time to Fill Up</h4>
                      <p>Tuesday and Wednesday mornings typically offer the lowest prices as stations compete for mid-week customers.</p>
                    </div>

                    <div className="insight-card">
                      <div className="insight-icon">📅</div>
                      <h4>Weekly Patterns</h4>
                      <p>Prices usually peak on Fridays and weekends when demand is highest. Plan your fill-ups for weekdays.</p>
                    </div>

                    <div className="insight-card">
                      <div className="insight-icon">🏪</div>
                      <h4>Station Competition</h4>
                      <p>Areas with multiple stations within 2km radius tend to have more competitive pricing and frequent changes.</p>
                    </div>

                    <div className="insight-card">
                      <div className="insight-icon">🛣️</div>
                      <h4>Location Matters</h4>
                      <p>Stations near major highways and shopping centers often have higher prices due to convenience premium.</p>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="cta-section">
                  <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '1rem' }}>
                    Ready to Start Saving Money on Fuel?
                  </h3>
                  <p style={{ fontSize: '1.05rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    Use our live tools to find the cheapest petrol prices near you right now and start saving up to $520 per year!
                  </p>
                  <div className="cta-buttons">
                    <Link to="/map" className="btn btn-primary">
                      <span className="btn-text">🗺️ View Live Map</span>
                    </Link>
                    <Link to="/directory" className="btn btn-secondary">
                      <span className="btn-text">📋 Browse All Stations</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FuelPriceTrendsPage;
