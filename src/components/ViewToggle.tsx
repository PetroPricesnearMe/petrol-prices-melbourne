/**
 * View Toggle Component
 *
 * Accessible toggle for switching between list and map display modes
 * Features:
 * - Keyboard navigation
 * - ARIA labels
 * - Smooth animations with enhanced spring physics
 * - Touch-friendly (44px+ touch targets)
 * - Responsive design
 * - State persistence support
 */

import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import './ViewToggle.css';

export type ViewMode = 'list' | 'grid' | 'map';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  showGrid?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
}

interface ViewOption {
  value: ViewMode;
  icon: string;
  label: string;
  ariaLabel: string;
}

const viewOptions: ViewOption[] = [
  {
    value: 'list',
    icon: '☰',
    label: 'List',
    ariaLabel: 'Switch to list view',
  },
  {
    value: 'grid',
    icon: '⊞',
    label: 'Grid',
    ariaLabel: 'Switch to grid view',
  },
  {
    value: 'map',
    icon: '🗺️',
    label: 'Map',
    ariaLabel: 'Switch to map view',
  },
];

/**
 * View Toggle Component
 */
export const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange,
  showGrid = true,
  className = '',
  size = 'md',
  orientation = 'horizontal',
}) => {
  const options = showGrid
    ? viewOptions
    : viewOptions.filter(opt => opt.value !== 'grid');
  
  const announcementRef = useRef<HTMLDivElement>(null);
  const previousViewRef = useRef<ViewMode>(currentView);

  // Enhanced spring animation configuration for smoother transitions
  const springConfig = {
    type: 'spring' as const,
    stiffness: 600,
    damping: 35,
    mass: 0.8,
  };

  // Announce view changes to screen readers
  useEffect(() => {
    if (previousViewRef.current !== currentView && announcementRef.current) {
      const option = options.find(opt => opt.value === currentView);
      if (option) {
        announcementRef.current.textContent = `Switched to ${option.label.toLowerCase()} view`;
      }
    }
    previousViewRef.current = currentView;
  }, [currentView, options]);

  const handleKeyDown = (e: React.KeyboardEvent, view: ViewMode) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onViewChange(view);
    }

    // Arrow key navigation
    if (orientation === 'horizontal' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      const currentIndex = options.findIndex(opt => opt.value === currentView);
      const direction = e.key === 'ArrowLeft' ? -1 : 1;
      const newIndex = (currentIndex + direction + options.length) % options.length;
      onViewChange(options[newIndex].value);
    }

    if (orientation === 'vertical' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const currentIndex = options.findIndex(opt => opt.value === currentView);
      const direction = e.key === 'ArrowUp' ? -1 : 1;
      const newIndex = (currentIndex + direction + options.length) % options.length;
      onViewChange(options[newIndex].value);
    }
  };

  const handleClick = (view: ViewMode) => {
    if (view !== currentView) {
      onViewChange(view);
    }
  };

  const containerClass = `
    view-toggle
    view-toggle--${size}
    view-toggle--${orientation}
    ${className}
  `.trim();

  return (
    <>
      {/* Screen reader announcements */}
      <div
        ref={announcementRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      
      <div
        className={containerClass}
        role="radiogroup"
        aria-label="View mode selection"
      >
        {options.map((option) => {
          const isActive = currentView === option.value;

          return (
            <motion.button
              key={option.value}
              className={`view-toggle__btn ${isActive ? 'active' : ''}`}
              onClick={() => handleClick(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              role="radio"
              aria-checked={isActive ? 'true' : 'false'}
              aria-label={option.ariaLabel}
              title={option.label}
              tabIndex={isActive ? 0 : -1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={springConfig}
              initial={false}
            >
              {/* Background highlight with smooth animation */}
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    className="view-toggle__bg"
                    layoutId="viewToggleBg"
                    initial={false}
                    transition={springConfig}
                    exit={{ opacity: 0, scale: 0.8 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon and Label with smooth transitions */}
              <motion.span 
                className="view-toggle__content"
                animate={{
                  scale: isActive ? 1 : 0.95,
                }}
                transition={springConfig}
              >
                <span className="view-toggle__icon" aria-hidden="true">
                  {option.icon}
                </span>
                <span className="view-toggle__label">{option.label}</span>
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </>
  );
};

/**
 * Compact View Toggle (Icon only)
 */
export const ViewToggleCompact: React.FC<Omit<ViewToggleProps, 'showLabels'>> = (props) => {
  return (
    <div className="view-toggle-compact">
      {viewOptions
        .filter(opt => props.showGrid !== false || opt.value !== 'grid')
        .map((option) => {
          const isActive = props.currentView === option.value;

          return (
            <button
              key={option.value}
              className={`view-toggle-compact__btn ${isActive ? 'active' : ''}`}
              onClick={() => props.onViewChange(option.value)}
              aria-label={option.ariaLabel}
              aria-pressed={isActive ? 'true' : 'false'}
              title={option.label}
            >
              <span aria-hidden="true">{option.icon}</span>
            </button>
          );
        })}
    </div>
  );
};

export default ViewToggle;
