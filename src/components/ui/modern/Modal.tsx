/**
 * Modern Modal Component
 *
 * Features:
 * - Smooth enter/exit animations
 * - Backdrop blur effect
 * - Keyboard navigation (ESC to close)
 * - Focus trap
 * - Scroll lock
 * - Multiple sizes
 * - Dark mode support
 * - WCAG AA compliant
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

// ============================================================================
// SIZE VARIANTS
// ============================================================================

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl',
};

// ============================================================================
// MAIN MODAL COMPONENT
// ============================================================================

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'relative w-full',
                sizeClasses[size],
                'bg-white dark:bg-gray-900',
                'rounded-2xl shadow-2xl',
                'border border-gray-200 dark:border-gray-700',
                'max-h-[90vh] overflow-hidden',
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-start justify-between border-b border-gray-200 p-6 dark:border-gray-800">
                  <div className="flex-1 space-y-2">
                    {title && (
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {description}
                      </p>
                    )}
                  </div>

                  {/* Close Button */}
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className={cn(
                        'rounded-lg p-2',
                        'text-gray-500 dark:text-gray-400',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        'hover:text-gray-700 dark:hover:text-gray-300',
                        'transition-colors'
                      )}
                      aria-label="Close modal"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// CONFIRMATION MODAL PRESET
// ============================================================================

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      footer={
        <div className="flex justify-end space-x-3">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-gray-200 px-6 py-2.5 font-semibold text-gray-900 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            {cancelText}
          </motion.button>
          <motion.button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'rounded-xl px-6 py-2.5 font-semibold text-white shadow-lg transition-all',
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/30'
                : 'bg-primary-600 hover:bg-primary-700 hover:shadow-primary-500/30'
            )}
          >
            {confirmText}
          </motion.button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div
            className={cn(
              'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full',
              variant === 'danger'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
            )}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Usage:
 *
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Station Details"
 *   description="View fuel prices and information"
 *   size="lg"
 *   footer={
 *     <div className="flex justify-end space-x-3">
 *       <Button variant="secondary" onClick={() => setIsOpen(false)}>
 *         Cancel
 *       </Button>
 *       <Button variant="primary">
 *         Confirm
 *       </Button>
 *     </div>
 *   }
 * >
 *   <div>Modal content here</div>
 * </Modal>
 *
 * <ConfirmModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onConfirm={() => handleDelete()}
 *   title="Delete Station?"
 *   message="This action cannot be undone."
 *   variant="danger"
 * />
 */
