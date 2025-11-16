/**
 * Type definitions for Landing Page components
 * Centralized type safety for better maintainability
 */

import type { Variant } from 'framer-motion';
import type { ReactNode } from 'react';

// ============================================================================
// Base Types
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// ============================================================================
// Feature Types
// ============================================================================

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

// ============================================================================
// Stats Types
// ============================================================================

export interface Stat {
  value: string;
  label: string;
  description: string;
}

// ============================================================================
// Link Types
// ============================================================================

export interface NavLink {
  name: string;
  href: string;
}

export interface FooterLinks {
  product: NavLink[];
  company: NavLink[];
  support: NavLink[];
  legal: NavLink[];
}

// ============================================================================
// Social Media Types
// ============================================================================

export interface SocialLink {
  href: string;
  label: string;
  icon: string;
}

// ============================================================================
// Trust Indicator Types
// ============================================================================

export interface TrustIndicator {
  text: string;
  icon?: ReactNode;
}

// ============================================================================
// Animation Types
// ============================================================================

export interface AnimationConfig {
  initial: Variant;
  animate: Variant;
  transition?: {
    duration: number;
    delay?: number;
    ease?: string | number[];
    repeat?: number;
  };
}

export interface StaggerAnimationConfig extends AnimationConfig {
  staggerDelay: number;
}

// ============================================================================
// Button Types
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends BaseComponentProps {
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
  disabled?: boolean;
}

// ============================================================================
// Section Types
// ============================================================================

export interface SectionProps extends BaseComponentProps {
  id?: string;
  fullWidth?: boolean;
  background?: 'white' | 'gray' | 'gradient' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
}

// ============================================================================
// Badge Types
// ============================================================================

export interface BadgeProps extends BaseComponentProps {
  text: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  pulse?: boolean;
}

// ============================================================================
// Card Types
// ============================================================================

export interface FloatingCardProps {
  title: string;
  subtitle: string;
  status?: 'success' | 'info' | 'warning';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// ============================================================================
// Icon Types
// ============================================================================

export type IconName = 'search' | 'chart' | 'check' | 'arrow-down';

export interface IconProps {
  name?: IconName;
  className?: string;
  size?: number;
  path?: string;
}

// ============================================================================
// Performance Monitoring Types
// ============================================================================

export interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  startTime?: number;
}

export type VitalType = 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'INP';
