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
import { useAnimatedSection } from './hooks';
import { Section, SectionHeader } from './components';
import { ANIMATION_CONFIGS } from './constants';

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
        className="group block relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Gradient accent bar */}
        <div
          className={cn(
            'absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r',
            region.color
          )}
        />

        {/* Region color indicator */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className={cn(
              'w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-2xl shadow-lg',
              region.color
            )}
          >
            {region.stations}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {region.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {region.stations} stations available
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
          {region.description}
        </p>

        {/* Call to action */}
        <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
          View stations
          <svg
            className="w-4 h-4 ml-2"
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
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-100/30 to-secondary-100/30 dark:from-primary-900/10 dark:to-secondary-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-100/30 to-purple-100/30 dark:from-accent-900/10 dark:to-purple-900/10 rounded-full blur-3xl" />
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
          className="max-w-5xl mx-auto mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Map wrapper with glass morphism effect */}
          <div className="relative group">
            {/* Glass morphism card */}
            <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              {/* Gradient border effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Map Image Container */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                {/* Loading skeleton (shown while image loads) */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

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
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5 pointer-events-none" />
              </div>

              {/* Map legend */}
              <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
                {regions.map((region, index) => (
                  <motion.div
                    key={region.slug}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  >
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full bg-gradient-to-br shadow-sm',
                        region.color
                      )}
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      {region.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Decorative glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          </div>

          {/* Coverage stats */}
          <motion.div
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/20">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                250+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Stations
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-secondary-50 to-secondary-100/50 dark:from-secondary-900/20 dark:to-secondary-800/20">
              <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-1">
                5
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Major Regions
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100/50 dark:from-accent-900/20 dark:to-accent-800/20">
              <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-1">
                50+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Suburbs Covered
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
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
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
          >
            <svg
              className="w-5 h-5 mr-2"
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

