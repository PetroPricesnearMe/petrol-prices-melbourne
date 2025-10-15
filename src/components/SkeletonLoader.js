/**
 * Skeleton Loader Component
 * Modern skeleton screens for loading states (better UX than spinners)
 */

import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({
  variant = 'card',
  count = 1,
  className = '',
  height,
  width
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return <div className="skeleton skeleton-text" style={{ height, width }} />;

      case 'avatar':
        return <div className="skeleton skeleton-avatar" style={{ height: height || 48, width: width || 48 }} />;

      case 'card':
        return (
          <div className="skeleton-card" style={{ height, width }}>
            <div className="skeleton skeleton-avatar" />
            <div className="skeleton-card-content">
              <div className="skeleton skeleton-text" style={{ width: '60%' }} />
              <div className="skeleton skeleton-text" style={{ width: '90%' }} />
              <div className="skeleton skeleton-text" style={{ width: '70%' }} />
            </div>
          </div>
        );

      case 'station-card':
        return (
          <div className="skeleton-station-card">
            <div className="skeleton skeleton-image" />
            <div className="skeleton-station-content">
              <div className="skeleton skeleton-text" style={{ width: '70%', height: 24 }} />
              <div className="skeleton skeleton-text" style={{ width: '90%', height: 16, marginTop: 8 }} />
              <div className="skeleton skeleton-text" style={{ width: '60%', height: 16, marginTop: 4 }} />
              <div className="skeleton-price-grid">
                <div className="skeleton skeleton-text" style={{ width: 100, height: 40 }} />
                <div className="skeleton skeleton-text" style={{ width: 100, height: 40 }} />
                <div className="skeleton skeleton-text" style={{ width: 100, height: 40 }} />
              </div>
            </div>
          </div>
        );

      case 'list-item':
        return (
          <div className="skeleton-list-item">
            <div className="skeleton skeleton-avatar" style={{ width: 40, height: 40 }} />
            <div className="skeleton-list-content">
              <div className="skeleton skeleton-text" style={{ width: '40%' }} />
              <div className="skeleton skeleton-text" style={{ width: '60%', height: 12 }} />
            </div>
          </div>
        );

      case 'table-row':
        return (
          <div className="skeleton-table-row">
            <div className="skeleton skeleton-text" style={{ width: '20%' }} />
            <div className="skeleton skeleton-text" style={{ width: '30%' }} />
            <div className="skeleton skeleton-text" style={{ width: '25%' }} />
            <div className="skeleton skeleton-text" style={{ width: '15%' }} />
          </div>
        );

      default:
        return <div className="skeleton" style={{ height, width }} />;
    }
  };

  return (
    <div className={`skeleton-wrapper ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <React.Fragment key={index}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * Station Grid Skeleton
 */
export const StationGridSkeleton = ({ count = 12 }) => (
  <div className="stations-grid">
    <SkeletonLoader variant="station-card" count={count} />
  </div>
);

/**
 * List Skeleton
 */
export const ListSkeleton = ({ count = 10 }) => (
  <div className="list-skeleton">
    <SkeletonLoader variant="list-item" count={count} />
  </div>
);

/**
 * Table Skeleton
 */
export const TableSkeleton = ({ rows = 10 }) => (
  <div className="table-skeleton">
    <SkeletonLoader variant="table-row" count={rows} />
  </div>
);

/**
 * Text Lines Skeleton
 */
export const TextSkeleton = ({ lines = 3 }) => (
  <div className="text-skeleton">
    <SkeletonLoader variant="text" count={lines} />
  </div>
);

export default SkeletonLoader;

