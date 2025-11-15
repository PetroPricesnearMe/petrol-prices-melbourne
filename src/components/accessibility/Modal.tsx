/**
 * Accessible Modal Component
 *
 * Features:
 * - Focus trapping
 * - ESC key to close
 * - Click outside to close
 * - Proper ARIA attributes
 * - Body scroll lock
 * - Return focus on close
 *
 * WCAG 2.1 Compliant
 */

'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { FocusTrap } from './FocusTrap';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  ariaDescribedBy?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  ariaDescribedBy,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  // Use React's useId hook for SSR-safe, stable IDs (prevents hydration mismatch)
  const titleId = React.useId();

  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `${title} dialog opened`;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);

    return () => {
      // Restore body scroll
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen, title]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscape = () => {
    if (closeOnEscape) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <FocusTrap
        active={isOpen}
        onEscape={handleEscape}
        initialFocus={true}
        returnFocus={true}
      >
        <div
          ref={modalRef}
          className={`modal modal--${size} ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={ariaDescribedBy}
        >
          {/* Modal Header */}
          <div className="modal-header">
            <h2 id={titleId} className="modal-title">
              {title}
            </h2>
            {showCloseButton && (
              <button
                type="button"
                className="modal-close"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Modal Content */}
          <div className="modal-content" id={ariaDescribedBy}>
            {children}
          </div>
        </div>
      </FocusTrap>
    </div>
  );

  // Render modal in portal to avoid z-index issues
  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}

export default Modal;
