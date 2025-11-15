/**
 * Modern Card Grid Component
 *
 * Features:
 * - Responsive grid layout
 * - Hover animations with lift effect
 * - Glass morphism cards
 * - Dark mode support
 * - Staggered fade-in animations
 * - Gradient borders on hover
 * - Icon animations
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface Card {
  id: string | number;
  icon?: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  badge?: string;
  stat?: {
    value: string;
    label: string;
  };
}

interface CardGridProps {
  cards: Card[];
  columns?: 1 | 2 | 3 | 4;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  className?: string;
}

// ============================================================================
// CARD VARIANTS
// ============================================================================

const cardVariants = {
  default: 'bg-white dark:bg-gray-800 shadow-md',
  elevated: 'bg-white dark:bg-gray-800 shadow-xl',
  bordered:
    'bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700',
  glass:
    'bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50',
};

// ============================================================================
// SINGLE CARD COMPONENT
// ============================================================================

function Card({
  card,
  index,
  variant = 'glass',
}: {
  card: Card;
  index: number;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
}) {
  const CardWrapper = card.href ? motion(Link) : motion.div;
  const wrapperProps = card.href ? { href: card.href } : {};

  return (
    <CardWrapper
      {...wrapperProps}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={cn(
        'group relative rounded-2xl p-8 transition-all duration-300',
        cardVariants[variant],
        card.href && 'cursor-pointer',
        'hover:shadow-2xl hover:shadow-primary-500/10'
      )}
    >
      {/* Gradient Border on Hover */}
      <div className="to-purple-500 absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-primary-500 via-secondary-500 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />

      {/* Badge */}
      {card.badge && (
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
          className="absolute -right-3 -top-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-3 py-1 text-xs font-bold text-white shadow-lg"
        >
          {card.badge}
        </motion.div>
      )}

      {/* Icon */}
      {card.icon && (
        <motion.div
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg"
          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-3xl text-white">{card.icon}</div>
        </motion.div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
          {card.title}
        </h3>

        {/* Description */}
        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
          {card.description}
        </p>

        {/* Stat */}
        {card.stat && (
          <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {card.stat.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {card.stat.label}
            </div>
          </div>
        )}

        {/* Link Arrow */}
        {card.href && (
          <motion.div
            className="flex items-center space-x-2 pt-2 font-semibold text-primary-600 dark:text-primary-400"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
          >
            <span>Learn more</span>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Hover Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
    </CardWrapper>
  );
}

// ============================================================================
// MAIN CARD GRID COMPONENT
// ============================================================================

export function CardGrid({
  cards,
  columns = 3,
  variant = 'glass',
  className,
}: CardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-8', gridCols[columns], className)}>
      {cards.map((card, index) => (
        <Card key={card.id} card={card} index={index} variant={variant} />
      ))}
    </div>
  );
}

// ============================================================================
// FEATURE CARD PRESET
// ============================================================================

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={cn(
        'group relative rounded-2xl p-8',
        'bg-white/70 backdrop-blur-xl dark:bg-gray-800/70',
        'border border-gray-200/50 dark:border-gray-700/50',
        'shadow-lg transition-all duration-300 hover:shadow-2xl',
        className
      )}
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative z-10 space-y-4">
        {/* Icon */}
        <motion.div
          className="inline-flex rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 p-4 shadow-lg"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-2xl text-white">{icon}</div>
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>

        {/* Description */}
        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// STAT CARD PRESET
// ============================================================================

export function StatCard({
  value,
  label,
  icon,
  trend,
  className,
}: {
  value: string;
  label: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        'relative rounded-2xl p-6',
        'bg-gradient-to-br from-white to-gray-50',
        'dark:from-gray-800 dark:to-gray-900',
        'border border-gray-200 dark:border-gray-700',
        'shadow-lg transition-all duration-300 hover:shadow-xl',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </div>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 dark:text-white"
          >
            {value}
          </motion.div>
          {trend && (
            <div
              className={cn(
                'flex items-center space-x-1 text-sm font-semibold',
                trend.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              <svg
                className={cn(
                  'h-4 w-4',
                  trend.isPositive ? 'rotate-0' : 'rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 p-3">
            <div className="text-2xl text-white">{icon}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Usage:
 *
 * <CardGrid
 *   columns={3}
 *   variant="glass"
 *   cards={[
 *     {
 *       id: 1,
 *       icon: '⛽',
 *       title: 'Live Prices',
 *       description: 'Real-time fuel prices updated every 5 minutes',
 *       badge: 'New',
 *       stat: { value: '250+', label: 'Stations' },
 *       href: '/features/live-prices',
 *     },
 *     // ... more cards
 *   ]}
 * />
 *
 * <FeatureCard
 *   icon="🔍"
 *   title="Smart Search"
 *   description="Find stations by location, brand, and price"
 * />
 *
 * <StatCard
 *   value="10K+"
 *   label="Active Users"
 *   icon="👥"
 *   trend={{ value: '+12%', isPositive: true }}
 * />
 */
