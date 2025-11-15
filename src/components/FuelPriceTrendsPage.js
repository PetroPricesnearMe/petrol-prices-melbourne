/**
 * FuelPriceTrendsPage - Legacy component
 *
 * NOTE: This component uses framer-motion and requires 'use client' directive
 * for Next.js 15+ App Router compatibility.
 */

'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { trackPageView } from '../utils/analytics';

import Breadcrumbs from './Breadcrumbs';
import SEO from './SEO';
// CSS imported in pages/_app.js

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
    { key: 'gas', label: 'Gas', icon: '🔥' },
  ];

  const timeframes = [
    { key: '24hours', label: '24 Hours' },
    { key: '7days', label: '7 Days' },
    { key: '30days', label: '30 Days' },
    { key: '90days', label: '90 Days' },
  ];

  // Simulate trend data fetching
  useEffect(() => {
    const fetchTrendData = async () => {
      setLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate mock trend data
      const generateTrendData = (fuelType, timeframe) => {
        const days =
          timeframe === '24hours'
            ? 1
            : timeframe === '7days'
              ? 7
              : timeframe === '30days'
                ? 30
                : 90;

        const basePrice =
          fuelType === 'unleaded'
            ? 180
            : fuelType === 'premium'
              ? 190
              : fuelType === 'premium98'
                ? 200
                : fuelType === 'diesel'
                  ? 175
                  : 85;

        const data = [];
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));

          const variation = (Math.random() - 0.5) * 10; // ±5 cents variation
          const price = Math.max(basePrice - 10, basePrice + variation);

          data.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(price * 10) / 10,
            volume: Math.floor(Math.random() * 1000) + 500,
          });
        }

        return data;
      };

      const data = generateTrendData(selectedFuelType, selectedTimeframe);
      setTrendData(data);
      setLoading(false);
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
    return direction === 'increasing'
      ? '📈'
      : direction === 'decreasing'
        ? '📉'
        : '➡️';
  };

  const getTrendColor = () => {
    const direction = getTrendDirection();
    return direction === 'increasing'
      ? '#ef4444'
      : direction === 'decreasing'
        ? '#10b981'
        : '#6b7280';
  };

  return (
    <>
      <SEO
        title="Fuel Price Trends Melbourne | Live Petrol Price Analysis & History"
        description="Track fuel price trends in Melbourne with real-time analysis and historical data. View price cycles, compare fuel types, and predict when to fill up for maximum savings."
        keywords="fuel price trends melbourne, petrol price history, fuel price cycle, petrol price analysis, melbourne fuel trends, price forecasting"
        canonical="/fuel-price-trends"
      />
      <motion.div
        className="fuel-price-trends-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumbs
          customCrumbs={[
            { label: 'Home', path: '/', icon: '🏠' },
            {
              label: 'Fuel Price Trends',
              path: '/fuel-price-trends',
              isActive: true,
            },
          ]}
        />
        <div className="trends-header">
          <div className="container">
            <motion.div
              className="header-content"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1>Fuel Price Trends</h1>
              <p>
                Track fuel price movements across Melbourne to find the best
                times to fill up
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
                  {fuelTypes.map((fuel) => (
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
                  {timeframes.map((timeframe) => (
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
                      <div
                        className="trend-description"
                        style={{ color: getTrendColor() }}
                      >
                        {getTrendDirection().charAt(0).toUpperCase() +
                          getTrendDirection().slice(1)}
                        {trendData &&
                          trendData.length > 1 &&
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
                        {trendData &&
                          (
                            trendData.reduce(
                              (sum, item) => sum + item.price,
                              0
                            ) / trendData.length
                          ).toFixed(1)}
                        ¢
                      </div>
                      <div className="summary-description">
                        Over{' '}
                        {selectedTimeframe
                          .replace('days', ' days')
                          .replace('hours', ' hours')}
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
                        {trendData &&
                          Math.min(...trendData.map((d) => d.price)).toFixed(1)}
                        ¢ -{' '}
                        {trendData &&
                          Math.max(...trendData.map((d) => d.price)).toFixed(1)}
                        ¢
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
                      <p>
                        We're working on an interactive chart to visualize fuel
                        price trends over time.
                      </p>
                      <div className="chart-features">
                        <div className="feature">• Historical price data</div>
                        <div className="feature">• Price predictions</div>
                        <div className="feature">• Station-specific trends</div>
                        <div className="feature">
                          • Export data functionality
                        </div>
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
                      <p>
                        Tuesday and Wednesday mornings typically offer the
                        lowest prices as stations compete for mid-week
                        customers.
                      </p>
                    </div>

                    <div className="insight-card">
                      <div className="insight-icon">📅</div>
                      <h4>Weekly Patterns</h4>
                      <p>
                        Prices usually peak on Fridays and weekends when demand
                        is highest. Plan your fill-ups for weekdays.
                      </p>
                    </div>

                    <div className="insight-card">
                      <div className="insight-icon">🏪</div>
                      <h4>Station Competition</h4>
                      <p>
                        Areas with multiple stations within 2km radius tend to
                        have more competitive pricing and frequent changes.
                      </p>
                    </div>

                    <div className="insight-card">
                      <div className="insight-icon">🛣️</div>
                      <h4>Location Matters</h4>
                      <p>
                        Stations near major highways and shopping centers often
                        have higher prices due to convenience premium.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="cta-section">
                  <h3>Ready to Find the Best Prices?</h3>
                  <p>
                    Use our live map and directory to find the cheapest fuel
                    near you right now.
                  </p>
                  <div className="cta-buttons">
                    <Link to="/map" className="btn-primary btn">
                      <span className="btn-text">View Live Map</span>
                      <span className="btn-icon">🗺️</span>
                    </Link>
                    <Link to="/directory" className="btn-secondary btn">
                      <span className="btn-text">Browse Directory</span>
                      <span className="btn-icon">📋</span>
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
