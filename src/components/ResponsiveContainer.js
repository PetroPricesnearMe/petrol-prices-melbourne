import PropTypes from 'prop-types';
import React from 'react';

import { useResponsive } from '../hooks/useResponsive';

/**
 * ResponsiveContainer Component
 * Conditionally renders children based on breakpoint
 * 
 * @component
 * @example
 * <ResponsiveContainer mobile>
 *   <MobileMenu />
 * </ResponsiveContainer>
 * 
 * <ResponsiveContainer desktop>
 *   <DesktopNav />
 * </ResponsiveContainer>
 */
const ResponsiveContainer = ({ 
  children, 
  mobile, 
  tablet, 
  desktop, 
  smAndUp, 
  mdAndUp, 
  lgAndUp,
  xlAndUp,
  portrait,
  landscape,
  className 
}) => {
  const responsive = useResponsive();

  // Determine if component should render
  const shouldRender = () => {
    if (mobile && responsive.isMobile) return true;
    if (tablet && responsive.isTablet) return true;
    if (desktop && responsive.isDesktop) return true;
    if (smAndUp && responsive.isSmAndUp) return true;
    if (mdAndUp && responsive.isMdAndUp) return true;
    if (lgAndUp && responsive.isLgAndUp) return true;
    if (xlAndUp && responsive.isXlAndUp) return true;
    if (portrait && responsive.isPortrait) return true;
    if (landscape && responsive.isLandscape) return true;
    
    // If no props specified, render by default
    if (!mobile && !tablet && !desktop && !smAndUp && !mdAndUp && !lgAndUp && !xlAndUp && !portrait && !landscape) {
      return true;
    }
    
    return false;
  };

  if (!shouldRender()) return null;

  return (
    <div className={className}>
      {typeof children === 'function' ? children(responsive) : children}
    </div>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  mobile: PropTypes.bool,
  tablet: PropTypes.bool,
  desktop: PropTypes.bool,
  smAndUp: PropTypes.bool,
  mdAndUp: PropTypes.bool,
  lgAndUp: PropTypes.bool,
  xlAndUp: PropTypes.bool,
  portrait: PropTypes.bool,
  landscape: PropTypes.bool,
  className: PropTypes.string,
};

ResponsiveContainer.defaultProps = {
  mobile: false,
  tablet: false,
  desktop: false,
  smAndUp: false,
  mdAndUp: false,
  lgAndUp: false,
  xlAndUp: false,
  portrait: false,
  landscape: false,
  className: '',
};

export default ResponsiveContainer;

