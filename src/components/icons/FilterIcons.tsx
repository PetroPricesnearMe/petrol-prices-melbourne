/**
 * Filter Icons Component
 *
 * Modern, accessible SVG icons for filter controls.
 * Provides consistent iconography across the application with proper ARIA attributes.
 */

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  ariaHidden?: boolean;
}

/**
 * Search icon for search input fields
 */
export const SearchIcon: React.FC<IconProps> = ({
  className = 'w-5 h-5',
  size = 20,
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...(ariaHidden && { 'aria-hidden': 'true' })}
  >
    <path
      d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Fuel pump icon for fuel type filter
 */
export const FuelIcon: React.FC<IconProps> = ({
  className = 'w-5 h-5',
  size = 20,
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...(ariaHidden && { 'aria-hidden': 'true' })}
  >
    <path
      d="M5 2V8H3V18H17V8H15V2H5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 6H17C17.5523 6 18 6.44772 18 7V17C18 17.5523 17.5523 18 17 18H3C2.44772 18 2 17.5523 2 17V7C2 6.44772 2.44772 6 3 6H5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

/**
 * Store icon for brand filter
 */
export const StoreIcon: React.FC<IconProps> = ({
  className = 'w-5 h-5',
  size = 20,
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...(ariaHidden && { 'aria-hidden': 'true' })}
  >
    <path
      d="M3 5H17V17H3V5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 5L4 2H16L17 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 9V13M10 9V13M13 9V13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Location pin icon for suburb/region filter
 */
export const LocationIcon: React.FC<IconProps> = ({
  className = 'w-5 h-5',
  size = 20,
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...(ariaHidden && { 'aria-hidden': 'true' })}
  >
    <path
      d="M10 10C11.1046 10 12 9.10457 12 8C12 6.89543 11.1046 6 10 6C8.89543 6 8 6.89543 8 8C8 9.10457 8.89543 10 10 10Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 2C7.79086 2 6 3.79086 6 6C6 8.5 10 13 10 13C10 13 14 8.5 14 6C14 3.79086 12.2091 2 10 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Sort/Filter icon for sorting options
 */
export const SortIcon: React.FC<IconProps> = ({
  className = 'w-5 h-5',
  size = 20,
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...(ariaHidden && { 'aria-hidden': 'true' })}
  >
    <path
      d="M5 7L10 2L15 7M5 13L10 18L15 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Price/Money icon for price filter
 */
export const PriceIcon: React.FC<IconProps> = ({
  className = 'w-5 h-5',
  size = 20,
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...(ariaHidden && { 'aria-hidden': 'true' })}
  >
    <path
      d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 6V14M7 9H13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Settings/Filters icon for filter toggle button
 */
export const FilterIcon: React.FC<IconProps> = ({
  className = 'w-5 h-5',
  size = 20,
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...(ariaHidden && { 'aria-hidden': 'true' })}
  >
    <path
      d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 10H8M12 10H18M10 2V8M10 12V18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Clear/X icon for clearing filters
 */
export const ClearIcon: React.FC<IconProps> = ({
  className = 'w-5 h-5',
  size = 20,
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...(ariaHidden && { 'aria-hidden': 'true' })}
  >
    <path
      d="M5 5L15 15M15 5L5 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
