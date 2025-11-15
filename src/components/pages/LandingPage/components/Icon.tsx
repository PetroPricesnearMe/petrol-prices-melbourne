/**
 * Reusable Icon Component
 * SVG icon wrapper with predefined paths
 */

import type { IconProps } from '../types';
import { ICON_PATHS } from '../constants';

/**
 * Icon Component
 * Renders SVG icons with consistent sizing and styling
 *
 * @example
 * ```tsx
 * <Icon name="search" className="text-primary-600" size={20} />
 * <Icon path="M10 20l5-5-5-5" size={24} />
 * ```
 */
export function Icon({ name, path, className = '', size = 24 }: IconProps) {
  const iconPath = name ? ICON_PATHS[name] : path;

  if (!iconPath) {
    console.warn(`Icon: No path provided for name "${name}"`);
    return null;
  }

  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={iconPath}
      />
    </svg>
  );
}

/**
 * Filled Icon Component
 * For icons that should be filled instead of stroked
 */
export function IconFilled({
  name,
  path,
  className = '',
  size = 24,
}: IconProps) {
  const iconPath = name ? ICON_PATHS[name] : path;

  if (!iconPath) {
    return null;
  }

  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path fillRule="evenodd" clipRule="evenodd" d={iconPath} />
    </svg>
  );
}

/**
 * Social Icon Component
 * Specifically for social media icons (no stroke)
 */
export function SocialIcon({
  name,
  className = '',
  size = 24,
}: Omit<IconProps, 'path'>) {
  const iconPath = name ? ICON_PATHS[name] : '';

  if (!iconPath) {
    return null;
  }

  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d={iconPath} />
    </svg>
  );
}
