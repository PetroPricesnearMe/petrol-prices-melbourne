/**
 * Hero Section Component - Responsive hero with image and overlay content
 * Supports different layouts and responsive breakpoints
 */
'use client';

import Image from 'next/image';
import React from 'react';

import { cn } from '@/utils/cn';

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  overlay?: boolean;
  height?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  contentPosition?: 'left' | 'center' | 'right';
  className?: string;
  children?: React.ReactNode;
}

const heightClasses = {
  sm: 'h-64 md:h-80',
  md: 'h-80 md:h-96',
  lg: 'h-96 md:h-[28rem]',
  xl: 'h-[28rem] md:h-[32rem]',
  full: 'h-screen',
};

const contentPositionClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  imageAlt = '',
  overlay = true,
  height = 'lg',
  contentPosition = 'left',
  className = '',
  children,
}) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden',
        heightClasses[height],
        className
      )}
    >
      {/* Background Image */}
      {imageUrl && (
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
          {overlay && (
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
          )}
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          'relative z-10 h-full flex items-center',
          contentPositionClasses[contentPosition]
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              'max-w-4xl',
              contentPosition === 'center' && 'text-center mx-auto',
              contentPosition === 'right' && 'ml-auto'
            )}
          >
            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm font-semibold text-primary-400 uppercase tracking-wide mb-2">
                {subtitle}
              </p>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-lg sm:text-xl text-gray-200 mb-6 max-w-2xl">
                {description}
              </p>
            )}

            {/* Additional Content */}
            {children && (
              <div className="flex flex-col sm:flex-row gap-4">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
