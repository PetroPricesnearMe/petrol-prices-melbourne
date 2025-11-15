/**
 * Detailed Listing Page Component
 *
 * Comprehensive listing page with hero image, tabs for description/reviews/map,
 * and responsive sections
 *
 * @module components/pages/DetailedListingPage
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/utils/cn';

// ============================================================================
// TYPES
// ============================================================================

interface DetailedListingPageProps {
  listing: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
    images: string[];
    price: number;
    currency: string;
    location: {
      address: string;
      city: string;
      state: string;
      country: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    features: string[];
    amenities: Record<string, boolean>;
    contact: {
      phone: string;
      email: string;
      website?: string;
    };
    rating: number;
    reviewCount: number;
    reviews: Array<{
      id: string;
      author: string;
      rating: number;
      comment: string;
      date: string;
      avatar?: string;
    }>;
    availability: {
      status: 'available' | 'pending' | 'sold';
      date?: string;
    };
    specifications: Record<string, string>;
    category: string;
    tags: string[];
  };
  className?: string;
}

interface TabProps {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

interface HeroSectionProps {
  title: string;
  subtitle: string;
  heroImage: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  location: DetailedListingPageProps['listing']['location'];
  availability: DetailedListingPageProps['listing']['availability'];
}

// ============================================================================
// TAB COMPONENT
// ============================================================================

/**
 * Individual tab component
 */
function Tab({ id, label, icon, content, active, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center space-x-2 rounded-lg px-4 py-3 font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        active
          ? 'bg-primary-600 text-white shadow-lg'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
      )}
      aria-selected={active}
      role="tab"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================

/**
 * Hero section with image, title, and key information
 */
export function HeroSection({
  title,
  subtitle,
  heroImage,
  price,
  currency,
  rating,
  reviewCount,
  location,
  availability,
}: HeroSectionProps) {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200';
      case 'pending':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200';
      case 'sold':
        return 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <motion.section
      className="relative h-96 overflow-hidden md:h-[500px] lg:h-[600px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative flex h-full items-end">
        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-4xl">
            {/* Breadcrumbs */}
            <motion.nav
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ol className="flex items-center space-x-2 text-white/80">
                <li>
                  <Link
                    href="/"
                    className="transition-colors duration-200 hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                <li className="text-white/60">/</li>
                <li>
                  <Link
                    href="/listings"
                    className="transition-colors duration-200 hover:text-white"
                  >
                    Listings
                  </Link>
                </li>
                <li className="text-white/60">/</li>
                <li className="truncate text-white">{title}</li>
              </ol>
            </motion.nav>

            {/* Main Content */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex-1">
                {/* Title and Subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                    {title}
                  </h1>
                  <p className="mb-6 text-lg text-white/90 md:text-xl">
                    {subtitle}
                  </p>
                </motion.div>

                {/* Location */}
                <motion.div
                  className="mb-4 flex items-center space-x-2 text-white/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>
                    {location.address}, {location.city}, {location.state}
                  </span>
                </motion.div>

                {/* Rating */}
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={cn(
                            'h-5 w-5',
                            i < Math.floor(rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          )}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-white/80">
                      {rating.toFixed(1)} ({reviewCount} reviews)
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Price and Actions */}
              <motion.div
                className="flex flex-col items-end space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {/* Price */}
                <div className="text-right">
                  <div className="text-3xl font-bold text-white md:text-4xl">
                    {currency}
                    {price.toLocaleString()}
                  </div>
                  <div className="text-sm text-white/80">
                    {availability.status === 'available'
                      ? 'Available Now'
                      : availability.status === 'pending'
                        ? 'Pending'
                        : 'Sold'}
                  </div>
                </div>

                {/* Availability Badge */}
                <div
                  className={cn(
                    'rounded-full px-3 py-1 text-sm font-medium',
                    getAvailabilityColor(availability.status)
                  )}
                >
                  {availability.status.charAt(0).toUpperCase() +
                    availability.status.slice(1)}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-primary-700">
                    Contact Now
                  </button>
                  <button className="rounded-lg bg-white/20 px-6 py-3 font-medium text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/30">
                    Save
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

// ============================================================================
// CONTENT SECTIONS
// ============================================================================

/**
 * Description tab content
 */
export function DescriptionContent({
  listing,
}: {
  listing: DetailedListingPageProps['listing'];
}) {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Description */}
      <div>
        <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Description
        </h3>
        <div className="prose dark:prose-invert max-w-none">
          <p className="leading-relaxed text-gray-600 dark:text-gray-300">
            {listing.description}
          </p>
        </div>
      </div>

      {/* Features */}
      {listing.features && listing.features.length > 0 && (
        <div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Key Features
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {listing.features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                  <svg
                    className="h-4 w-4 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Specifications */}
      {listing.specifications &&
        Object.keys(listing.specifications).length > 0 && (
          <div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Specifications
            </h3>
            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
              <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Object.entries(listing.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b border-gray-200 py-2 last:border-b-0 dark:border-gray-700"
                  >
                    <dt className="font-medium capitalize text-gray-700 dark:text-gray-300">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </dt>
                    <dd className="text-gray-900 dark:text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

      {/* Tags */}
      {listing.tags && listing.tags.length > 0 && (
        <div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {listing.tags.map((tag, index) => (
              <motion.span
                key={index}
                className="rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Reviews tab content
 */
export function ReviewsContent({
  listing,
}: {
  listing: DetailedListingPageProps['listing'];
}) {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Reviews Summary */}
      <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reviews
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={cn(
                    'h-6 w-6',
                    i < Math.floor(listing.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {listing.rating.toFixed(1)}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              ({listing.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {listing.reviews.map((review, index) => (
          <motion.div
            key={review.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {review.avatar ? (
                  <Image
                    src={review.avatar}
                    alt={review.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      {review.author.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {review.author}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={cn(
                            'h-4 w-4',
                            i < review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          )}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                  {review.comment}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Write Review Button */}
      <div className="text-center">
        <button className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-primary-700">
          Write a Review
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Map tab content
 */
export function MapContent({
  listing,
}: {
  listing: DetailedListingPageProps['listing'];
}) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Map Container */}
      <div
        className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
        style={{ height: '400px' }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">
              Interactive map will be displayed here
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              Coordinates: {listing.location.coordinates.lat.toFixed(6)},{' '}
              {listing.location.coordinates.lng.toFixed(6)}
            </p>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Location Details
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">
              {listing.location.address}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">
              {listing.location.city}, {listing.location.state},{' '}
              {listing.location.country}
            </span>
          </div>
        </div>
      </div>

      {/* Nearby Places */}
      <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Nearby Places
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { name: 'Shopping Center', distance: '0.5 km', icon: '🛍️' },
            { name: 'Restaurant', distance: '0.3 km', icon: '🍽️' },
            { name: 'School', distance: '1.2 km', icon: '🏫' },
            { name: 'Hospital', distance: '2.1 km', icon: '🏥' },
          ].map((place, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 rounded-lg bg-white p-3 dark:bg-gray-700"
            >
              <span className="text-2xl">{place.icon}</span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {place.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {place.distance}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Detailed listing page with hero, tabs, and responsive sections
 */
export function DetailedListingPage({
  listing,
  className,
}: DetailedListingPageProps) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    {
      id: 'description',
      label: 'Description',
      icon: '📝',
      content: <DescriptionContent listing={listing} />,
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: '⭐',
      content: <ReviewsContent listing={listing} />,
    },
    {
      id: 'map',
      label: 'Map & Location',
      icon: '🗺️',
      content: <MapContent listing={listing} />,
    },
  ];

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      {/* Hero Section */}
      <HeroSection
        title={listing.title}
        subtitle={listing.subtitle}
        heroImage={listing.heroImage}
        price={listing.price}
        currency={listing.currency}
        rating={listing.rating}
        reviewCount={listing.reviewCount}
        location={listing.location}
        availability={listing.availability}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Tabs Navigation */}
          <motion.div
            className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 pb-4 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                content={tab.content}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tabs.find((tab) => tab.id === activeTab)?.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Contact Section */}
      <motion.section
        className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                Interested in this listing?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Get in touch with us for more information or to schedule a
                viewing.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Contact Info */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                  <svg
                    className="h-8 w-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Call Us
                </h3>
                <a
                  href={`tel:${listing.contact.phone}`}
                  className="text-primary-600 hover:underline dark:text-primary-400"
                >
                  {listing.contact.phone}
                </a>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                  <svg
                    className="h-8 w-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Email Us
                </h3>
                <a
                  href={`mailto:${listing.contact.email}`}
                  className="text-primary-600 hover:underline dark:text-primary-400"
                >
                  {listing.contact.email}
                </a>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                  <svg
                    className="h-8 w-8 text-primary-600 dark:text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Visit Website
                </h3>
                {listing.contact.website ? (
                  <a
                    href={listing.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline dark:text-primary-400"
                  >
                    View Website
                  </a>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    Not available
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { DetailedListingPageProps, HeroSectionProps };
