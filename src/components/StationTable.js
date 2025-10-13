import React, { useState, useEffect, useMemo } from 'react';
import dataSourceManager from '../services/DataSourceManager';
import { trackSearch, trackFilter } from '../utils/analytics';
import './StationTable.css';

/**
 * Station Table Component
 * Searchable and sortable table of all Melbourne petrol stations
 * Supports both CSV import and Baserow API
 * 
 * @component
 */
const StationTable = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Load stations from Baserow or CSV
  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      setLoading(true);

      // Try to load CSV first if available
      const csvData = await loadCSV();
      if (csvData && csvData.length > 0) {
        setStations(csvData);
        return;
      }

      // Fallback to Baserow API
      const data = await dataSourceManager.fetchStations();
      setStations(data);
    } catch (error) {
      console.error('Error loading stations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load CSV file from public folder
  const loadCSV = async () => {
    try {
      const response = await fetch('/export-Petrol-Stations-Grid-view.csv');
      if (!response.ok) return null;

      const text = await response.text();
      return parseCSV(text);
    } catch (error) {
      console.log('CSV not available, using Baserow API');
      return null;
    }
  };

  // Parse CSV data
  const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    return lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const station = {};

        headers.forEach((header, i) => {
          station[header] = values[i] || '';
        });

        // Normalize field names
        return {
          id: index + 1,
          name: station['Station Name'] || station.name || '',
          address: station['Address'] || station.address || '',
          city: station['City'] || station.city || '',
          postalCode: station['Postal Code'] || station.postalCode || '',
          region: station['Region'] || station.region || '',
          brand: station['brand'] || station.Brand || '',
          latitude: parseFloat(station['Latitude'] || station.lat || 0),
          longitude: parseFloat(station['Longitude'] || station.lng || 0),
          category: station['Category'] || station.category || '',
          locationDetails: station['Location Details'] || station.locationDetails || '',
          lastUpdated: station['Last Updated'] || new Date().toISOString(),
        };
      })
      .filter(s => s.name); // Filter out empty rows
  };

  // Get unique brands and regions for filters
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(stations.map(s => s.brand).filter(Boolean))];
    return ['all', ...uniqueBrands.sort()];
  }, [stations]);

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(stations.map(s => s.region).filter(Boolean))];
    return ['all', ...uniqueRegions.sort()];
  }, [stations]);

  // Filter and search stations
  const filteredStations = useMemo(() => {
    let filtered = [...stations];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(station =>
        station.name?.toLowerCase().includes(search) ||
        station.address?.toLowerCase().includes(search) ||
        station.city?.toLowerCase().includes(search) ||
        station.brand?.toLowerCase().includes(search) ||
        station.postalCode?.includes(search)
      );
      trackSearch(searchTerm, filtered.length);
    }

    // Brand filter
    if (filterBrand !== 'all') {
      filtered = filtered.filter(s => s.brand === filterBrand);
      trackFilter('brand', filterBrand);
    }

    // Region filter
    if (filterRegion !== 'all') {
      filtered = filtered.filter(s => s.region === filterRegion);
      trackFilter('region', filterRegion);
    }

    return filtered;
  }, [stations, searchTerm, filterBrand, filterRegion]);

  // Sort stations
  const sortedStations = useMemo(() => {
    const sorted = [...filteredStations];

    sorted.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredStations, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedStations.length / itemsPerPage);
  const paginatedStations = sortedStations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="station-table-loading">
        <div className="loading-spinner"></div>
        <p>Loading stations...</p>
      </div>
    );
  }

  return (
    <div className="station-table-container">
      {/* Header */}
      <div className="table-header">
        <h2>Melbourne Petrol Stations Directory</h2>
        <p className="table-subtitle">
          {sortedStations.length} stations • Searchable & Sortable
        </p>
      </div>

      {/* Filters */}
      <div className="table-filters">
        <div className="filter-group">
          <label htmlFor="search">🔍 Search</label>
          <input
            id="search"
            type="search"
            placeholder="Search by name, address, brand, suburb..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="brand-filter">🏪 Brand</label>
          <select
            id="brand-filter"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="filter-select"
          >
            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand === 'all' ? 'All Brands' : brand}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="region-filter">📍 Region</label>
          <select
            id="region-filter"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="filter-select"
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="station-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Station Name {getSortIndicator('name')}
              </th>
              <th onClick={() => handleSort('address')} className="sortable">
                Address {getSortIndicator('address')}
              </th>
              <th onClick={() => handleSort('city')} className="sortable">
                Suburb {getSortIndicator('city')}
              </th>
              <th onClick={() => handleSort('postalCode')} className="sortable">
                Postcode {getSortIndicator('postalCode')}
              </th>
              <th onClick={() => handleSort('brand')} className="sortable">
                Brand {getSortIndicator('brand')}
              </th>
              <th onClick={() => handleSort('region')} className="sortable">
                Region {getSortIndicator('region')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStations.map((station) => (
              <tr key={station.id}>
                <td className="station-name">{station.name}</td>
                <td>{station.address || '-'}</td>
                <td>{station.city || '-'}</td>
                <td>{station.postalCode || '-'}</td>
                <td>
                  {station.brand ? (
                    <span className="brand-badge">{station.brand}</span>
                  ) : '-'}
                </td>
                <td>{station.region || '-'}</td>
                <td className="actions">
                  {station.latitude && station.longitude && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn"
                      title="Get directions"
                    >
                      🧭
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="table-pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ← Previous
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next →
          </button>
        </div>
      )}

      {/* Results Info */}
      <div className="table-footer">
        <p>
          Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, sortedStations.length)} of {sortedStations.length} stations
          {searchTerm && ` (filtered from ${stations.length} total)`}
        </p>
      </div>
    </div>
  );
};

export default StationTable;

