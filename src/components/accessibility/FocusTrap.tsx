/**
 * Focus Trap Component
 *
 * Traps keyboard focus within a container (for modals, dropdowns, etc.)
 * Ensures proper keyboard navigation and accessibility
 *
 * WCAG 2.1 Level A - Keyboard (2.1.1) and Focus Order (2.4.3)
 */

'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

interface FocusTrapProps {
  children: ReactNode;
  active: boolean;
  onEscape?: () => void;
  initialFocus?: boolean;
  returnFocus?: boolean;
  className?: string;
}

export function FocusTrap({
  children,
  active,
  onEscape,
  initialFocus = true,
  returnFocus = true,
  className = '',
}: FocusTrapProps) {
  const trapRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the currently focused element
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const trapElement = trapRef.current;
    if (!trapElement) return;

    // Get all focusable elements within the trap
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(', ');

      return Array.from(
        trapElement.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter(el => {
        // Filter out hidden elements
        return el.offsetParent !== null &&
               !el.hasAttribute('aria-hidden') &&
               el.getAttribute('aria-disabled') !== 'true';
      });
    };

    // Focus the first focusable element
    if (initialFocus) {
      const focusableElements = getFocusableElements();
      const firstFocusable = focusableElements[0];

      if (firstFocusable) {
        // Small delay to ensure element is rendered
        setTimeout(() => {
          firstFocusable.focus();
        }, 10);
      }
    }

    // Handle tab key navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      // Only trap Tab key
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab (going backwards)
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
      // Tab (going forwards)
      else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add event listener
    trapElement.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      trapElement.removeEventListener('keydown', handleKeyDown);

      // Return focus to previously focused element
      if (returnFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [active, onEscape, initialFocus, returnFocus]);

  // Don't render trap if not active
  if (!active) {
    return <>{children}</>;
  }

  return (
    <div
      ref={trapRef}
      className={className}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}

/**
 * Custom hook for focus trap
 */
export function useFocusTrap(active: boolean, onEscape?: () => void) {
  const trapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!active || !trapRef.current) return;

    const element = trapRef.current;
    const previouslyFocused = document.activeElement as HTMLElement;

    // Focus first focusable element
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
      }

      if (e.key !== 'Tab') return;

      const focusable = Array.from(focusableElements);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  }, [active, onEscape]);

  return trapRef;
}

export default FocusTrap;
