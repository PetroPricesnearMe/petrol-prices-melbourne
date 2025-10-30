/**
 * MobileMenuOverlay Component
 * Overlay component for mobile menu with blur effects
 * Features:
 * - Smooth overlay animation
 * - Backdrop blur effect
 * - Click to close functionality
 * - Accessibility features
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/styles/system/css-in-js';

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function MobileMenuOverlay({ isOpen, onClose, className }: MobileMenuOverlayProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed inset-0 z-40',
        'bg-black/50 backdrop-blur-sm',
        'transition-all duration-300',
        className
      )}
      onClick={onClose}
      aria-hidden="true"
    />
  );
}

export default MobileMenuOverlay;
