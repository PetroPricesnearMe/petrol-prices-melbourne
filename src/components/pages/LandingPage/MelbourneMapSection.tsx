/**
 * Melbourne Map Section Component
 *
 * Displays an interactive visual map of Melbourne showing coverage areas
 * with modern design, animations, and responsive layout.
 *
 * Features:
 * - Next.js Image optimization for fast loading
 * - Responsive design (mobile-first)
 * - Glass morphism effects
 * - Framer Motion animations
 * - Interactive region cards
 * - Accessibility compliant
 *
 * @component
 * @example
 * <MelbourneMapSection />
 */

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { Section, SectionHeader } from './components';
import { ANIMATION_CONFIGS } from './constants';
import { useAnimatedSection } from './hooks';

// ============================================================================
// TYPES
// ============================================================================

export interface RegionData {
  name: string;
  slug: string;
  color: string;
  stations: number;
  description: string;
}

interface MelbourneMapSectionProps {
  className?: string;
  showRegionCards?: boolean;
  regions?: RegionData[];
}

// ============================================================================
// DEFAULT REGIONS DATA
// ============================================================================

const DEFAULT_REGIONS: RegionData[] = [
  {
    name: 'Melbourne CBD',
    slug: 'melbourne',
    color: 'from-purple-500 to-purple-600',
    stations: 45,
    description: 'Central business district with convenient city stations',
  },
  {
    name: 'Northern Suburbs',
    slug: 'northern-suburbs',
    color: 'from-red-500 to-red-600',
    stations: 68,
    description: 'Including Preston, Coburg, Brunswick, and surrounds',
  },
  {
    name: 'Western Suburbs',
    slug: 'western-suburbs',
    color: 'from-gray-500 to-gray-600',
    stations: 52,
    description: 'Footscray, Sunshine, Werribee, and western regions',
  },
  {
    name: 'Eastern Suburbs',
    slug: 'eastern-suburbs',
    color: 'from-pink-500 to-pink-600',
    stations: 61,
    description: 'Richmond, Box Hill, Glen Waverley, and eastern areas',
  },
  {
    name: 'South Eastern Suburbs',
    slug: 'south-eastern-suburbs',
    color: 'from-orange-500 to-orange-600',
    stations: 47,
    description: 'Dandenong, Clayton, Oakleigh, and south-east regions',
  },
];

// ============================================================================
// REGION CARD COMPONENT
// ============================================================================

function RegionCard({ region, index }: { region: RegionData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Link
        href={`/regions/${region.slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        {/* Gradient accent bar */}
        <div
          className={cn(
            'absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r',
            region.color
          )}
        />

        {/* Region color indicator */}
        <div className="mb-4 flex items-center gap-4">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br text-2xl font-bold text-white shadow-lg',
              region.color
            )}
          >
            {region.stations}
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-xl font-bold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
              {region.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {region.stations} stations available
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {region.description}
        </p>

        {/* Call to action */}
        <div className="flex items-center text-sm font-semibold text-primary-600 transition-transform duration-300 group-hover:translate-x-2 dark:text-primary-400">
          View stations
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>

        {/* Hover effect overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MelbourneMapSection({
  className,
  showRegionCards = true,
  regions = DEFAULT_REGIONS,
}: MelbourneMapSectionProps) {
  const { ref, isInView } = useAnimatedSection();

  return (
    <Section
      ref={ref}
      background="white"
      padding="lg"
      className={cn('relative overflow-hidden', className)}
    >
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-primary-100/30 to-secondary-100/30 blur-3xl dark:from-primary-900/10 dark:to-secondary-900/10" />
        <div className="to-purple-100/30 dark:to-purple-900/10 absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-to-tr from-accent-100/30 blur-3xl dark:from-accent-900/10" />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          {...ANIMATION_CONFIGS.fadeInUp}
          animate={isInView ? ANIMATION_CONFIGS.fadeInUp.animate : {}}
        >
          <SectionHeader
            title="Comprehensive Melbourne Coverage"
            description="We monitor petrol prices across all major regions of Melbourne, ensuring you always find the best fuel deals near you."
            centered
          />
        </motion.div>

        {/* Map Display Container */}
        <motion.div
          className="mx-auto mb-16 max-w-5xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Map wrapper with glass morphism effect */}
          <div className="group relative">
            {/* Glass morphism card */}
            <div className="relative overflow-hidden rounded-3xl border border-gray-200/50 bg-white/70 p-4 shadow-2xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/70 sm:p-6 md:p-8">
              {/* Gradient border effect on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Map Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                {/* Loading skeleton (shown while image loads) */}
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Optimized Image */}
                <Image
                  src="/images/melbourne-map-vector.png"
                  alt="Melbourne regions map showing coverage areas including CBD, Northern, Western, Eastern, and South Eastern suburbs with petrol station locations"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority={false}
                  quality={90}
                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nGNYMXfuv7///zMwMPz//5+BgYGBkZHx////DAwMDIyMjP///2dgYGD4//8/AA8RDQVjdJg5AAAAAElFTkSuQmCC"
                />

                {/* Subtle overlay gradient for better contrast */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5" />
              </div>

              {/* Map legend */}
              <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
                {regions.map((region, index) => (
                  <motion.div
                    key={region.slug}
                    className="flex items-center gap-2 rounded-full bg-gray-100/80 px-3 py-1.5 backdrop-blur-sm dark:bg-gray-700/80"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  >
                    <div
                      className={cn(
                        'h-3 w-3 rounded-full bg-gradient-to-br shadow-sm',
                        region.color
                      )}
                    />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:text-sm">
                      {region.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Decorative glow effect */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
          </div>

          {/* Coverage stats */}
          <motion.div
            className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 p-4 text-center dark:from-primary-900/20 dark:to-primary-800/20">
              <div className="mb-1 text-3xl font-bold text-primary-600 dark:text-primary-400">
                250+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Stations
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-secondary-50 to-secondary-100/50 p-4 text-center dark:from-secondary-900/20 dark:to-secondary-800/20">
              <div className="mb-1 text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                5
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Major Regions
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-accent-50 to-accent-100/50 p-4 text-center dark:from-accent-900/20 dark:to-accent-800/20">
              <div className="mb-1 text-3xl font-bold text-accent-600 dark:text-accent-400">
                50+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Suburbs Covered
              </div>
            </div>
            <div className="from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl bg-gradient-to-br p-4 text-center">
              <div className="text-purple-600 dark:text-purple-400 mb-1 text-3xl font-bold">
                24/7
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Price Updates
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Region Cards Grid */}
        {showRegionCards && (
          <div className="mx-auto max-w-6xl">
            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {regions.map((region, index) => (
                <RegionCard key={region.slug} region={region} index={index} />
              ))}
            </motion.div>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Link
            href="/directory"
            className="inline-flex transform items-center justify-center rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary-700 hover:to-secondary-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Find Stations in Your Area
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}

export default MelbourneMapSection;
