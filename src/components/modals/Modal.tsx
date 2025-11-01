/**
 * Modal Popup Components
 *
 * Modal components using Headless UI with Tailwind transitions
 * for displaying listing details without leaving the current page
 *
 * @module components/modals/Modal
 */

'use client';

import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { cn } from '@/utils/cn';

// ============================================================================
// TYPES
// ============================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

interface StationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: {
    id: string;
    name: string;
    brand: string;
    address: string;
    suburb: string;
    postcode: string;
    fuelPrices: Record<string, number | null>;
    amenities: Record<string, boolean>;
    operatingHours: Record<string, string>;
    phoneNumber?: string;
    website?: string;
    rating?: number;
    reviewCount?: number;
    lastUpdated: string;
    verified: boolean;
  } | null;
}

// ============================================================================
// BASE MODAL COMPONENT
// ============================================================================

/**
 * Base modal component with Headless UI and Tailwind transitions
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  'w-full transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800',
                  'text-left align-middle shadow-xl transition-all',
                  sizeClasses[size],
                  className
                )}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    {title && (
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900 dark:text-white"
                      >
                        {title}
                      </Dialog.Title>
                    )}
                    {showCloseButton && (
                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={onClose}
                        aria-label="Close modal"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// ============================================================================
// STATION DETAILS MODAL
// ============================================================================

/**
 * Specialized modal for displaying station details
 */
export function StationDetailsModal({ isOpen, onClose, station }: StationDetailsModalProps) {
  if (!station) return null;

  const getPriceColor = (price: number | null): string => {
    if (price === null) return 'text-gray-400';
    if (price < 200) return 'text-success-600 dark:text-success-400';
    if (price <= 210) return 'text-warning-600 dark:text-warning-400';
    return 'text-error-600 dark:text-error-400';
  };

  const getBrandClass = (brand: string) => {
    const brandClassMap: Record<string, string> = {
      'BP': 'badge-success',
      'Shell': 'badge-warning',
      'Caltex': 'badge-error',
      '7-Eleven': 'badge-primary',
      'Coles Express': 'badge-error',
      'Woolworths': 'badge-success',
      'United': 'badge-primary',
      'Puma': 'badge-secondary',
    };
    return brandClassMap[brand] || 'badge-secondary';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={station.name}
      size="lg"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-6">
        {/* Station Header */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                {station.brand.charAt(0)}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                {station.name}
              </h2>
              {station.verified && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200">
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className={cn("badge text-sm", getBrandClass(station.brand))}>
                {station.brand}
              </span>
              {station.rating && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {station.rating.toFixed(1)} ({station.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                {station.address}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {station.suburb} {station.postcode}
              </p>
            </div>
          </div>
        </div>

        {/* Fuel Prices */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Current Fuel Prices
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(station.fuelPrices).map(([type, price]) => {
              if (price === null) return null;
              return (
                <div
                  key={type}
                  className="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <span className="text-gray-700 dark:text-gray-300 capitalize">
                    {type === 'premium95' ? 'Premium 95' :
                     type === 'premium98' ? 'Premium 98' : type}
                  </span>
                  <span className={cn('text-lg font-bold', getPriceColor(price))}>
                    {price.toFixed(1)}¢
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Amenities */}
        {station.amenities && Object.values(station.amenities).some(Boolean) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Amenities
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(station.amenities).map(([amenity, available]) => {
                if (!available) return null;
                return (
                  <div key={amenity} className="flex items-center space-x-2">
                    <span className="text-success-500">✓</span>
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {amenity.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Operating Hours */}
        {station.operatingHours && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Operating Hours
            </h3>
            <div className="space-y-2">
              {Object.entries(station.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                  <span className="text-gray-700 dark:text-gray-300 capitalize font-medium">
                    {day}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Contact Information
          </h3>
          <div className="space-y-3">
            {station.phoneNumber && (
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href={`tel:${station.phoneNumber}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {station.phoneNumber}
                </a>
              </div>
            )}
            {station.website && (
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <a
                  href={station.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center pt-4 border-t border-gray-200 dark:border-gray-600">
          Last updated: {new Date(station.lastUpdated).toLocaleDateString()}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(station.address + ' ' + station.suburb)}`, '_blank')}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            🧭 Get Directions
          </button>
          <button
            onClick={() => window.open(`/stations/${station.id}`, '_blank')}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            📄 View Full Page
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { ModalProps, StationDetailsModalProps };
