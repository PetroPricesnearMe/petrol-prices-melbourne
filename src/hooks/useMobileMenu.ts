/**
 * useMobileMenu Hook
 * Custom hook for managing mobile menu state and interactions
 * Features:
 * - Menu state management
 * - Keyboard navigation
 * - Touch gestures
 * - Accessibility features
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseMobileMenuOptions {
  onOpen?: () => void;
  onClose?: () => void;
  preventBodyScroll?: boolean;
  closeOnRouteChange?: boolean;
}

export function useMobileMenu(options: UseMobileMenuOptions = {}) {
  const {
    onOpen,
    onClose,
    preventBodyScroll = true,
    closeOnRouteChange = true,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle menu toggle
  const toggleMenu = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      onOpen?.();
    } else {
      onClose?.();
    }

    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  }, [isOpen, isAnimating, onOpen, onClose]);

  // Handle menu open
  const openMenu = useCallback(() => {
    if (isOpen || isAnimating) return;

    setIsAnimating(true);
    setIsOpen(true);
    onOpen?.();

    setTimeout(() => setIsAnimating(false), 300);
  }, [isOpen, isAnimating, onOpen]);

  // Handle menu close
  const closeMenu = useCallback(() => {
    if (!isOpen || isAnimating) return;

    setIsAnimating(true);
    setIsOpen(false);
    onClose?.();

    setTimeout(() => setIsAnimating(false), 300);
  }, [isOpen, isAnimating, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (preventBodyScroll && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preventBodyScroll]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeMenu]);

  // Handle route changes
  useEffect(() => {
    if (closeOnRouteChange && isOpen) {
      closeMenu();
    }
  }, [closeOnRouteChange, isOpen, closeMenu]);

  // Handle click outside
  const handleClickOutside = useCallback(
    (event: MouseEvent, menuRef: React.RefObject<HTMLElement>) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    },
    [closeMenu]
  );

  // Handle swipe gestures (for mobile)
  const handleSwipe = useCallback(
    (direction: 'left' | 'right', threshold = 100) => {
      if (direction === 'left' && isOpen) {
        closeMenu();
      }
    },
    [isOpen, closeMenu]
  );

  return {
    isOpen,
    isAnimating,
    toggleMenu,
    openMenu,
    closeMenu,
    handleClickOutside,
    handleSwipe,
  };
}

export default useMobileMenu;
