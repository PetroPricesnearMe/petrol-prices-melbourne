import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// CSS imported in pages/_app.js

/**
 * Breadcrumbs Component
 * Provides hierarchical navigation trail for user orientation
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.customCrumbs - Optional custom breadcrumb items
 * @returns {JSX.Element} Breadcrumb navigation
 */
const Breadcrumbs = ({ customCrumbs }) => {
  const location = useLocation();

  // Route name mapping for better UX
  const routeNames = {
    '': 'Home',
    'directory': 'Station Directory',
    'about': 'About Us',
    'fuel-price-trends': 'Fuel Price Trends',
    'station-amenities': 'Station Amenities',
    'how-pricing-works': 'How Pricing Works',
    'blog': 'Blog',
    'faq': 'FAQ',
  };

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    if (customCrumbs) return customCrumbs;

    const paths = location.pathname.split('/').filter(path => path);

    const breadcrumbs = [
      { label: 'Home', path: '/', icon: '🏠' }
    ];

    let currentPath = '';
    paths.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: index === paths.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb navigation">
      <ol className="breadcrumb-list" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbs.map((crumb, index) => (
          <li
            key={index}
            className={`breadcrumb-item ${crumb.isActive ? 'active' : ''}`}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {crumb.isActive ? (
              <span className="breadcrumb-current" itemProp="name" aria-current="page">
                {crumb.icon && <span className="breadcrumb-icon" aria-hidden="true">{crumb.icon}</span>}
                {crumb.label}
              </span>
            ) : (
              <>
                <Link
                  to={crumb.path}
                  className="breadcrumb-link"
                  itemProp="item"
                  aria-label={`Go to ${crumb.label}`}
                >
                  {crumb.icon && <span className="breadcrumb-icon" aria-hidden="true">{crumb.icon}</span>}
                  <span itemProp="name">{crumb.label}</span>
                </Link>
                <span className="breadcrumb-separator" aria-hidden="true">/</span>
              </>
            )}
            <meta itemProp="position" content={index + 1} />
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

