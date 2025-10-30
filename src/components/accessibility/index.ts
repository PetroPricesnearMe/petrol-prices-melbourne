/**
 * Accessibility Components Export
 *
 * Central export point for all accessibility-related components
 */

export { SkipToContent, default as SkipToContentComponent } from './SkipToContent';
export { FocusTrap, useFocusTrap } from './FocusTrap';
export { Modal, default as ModalComponent } from './Modal';

// Re-export types
export type { default as SkipToContentProps } from './SkipToContent';
export type { default as FocusTrapProps } from './FocusTrap';
export type { default as ModalProps } from './Modal';
