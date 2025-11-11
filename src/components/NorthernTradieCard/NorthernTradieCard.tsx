/**
 * NorthernTradieCard - Main Component
 * A highly reusable, accessible, and performant card component
 * 
 * @example
 * ```tsx
 * <NorthernTradieCard variant="elevated" size="md">
 *   <NorthernTradieCard.Header title="Card Title" />
 *   <NorthernTradieCard.Content>Content here</NorthernTradieCard.Content>
 * </NorthernTradieCard>
 * ```
 */

import { motion, AnimatePresence } from 'framer-motion';
import React, { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react';

import { CardContent } from './CardContent';
import { CardFooter } from './CardFooter';
import { CardHeader } from './CardHeader';
import { CardMedia } from './CardMedia';
import { loadingStyles, errorStyles } from './styles';
import type { NorthernTradieCardProps } from './types';
import { 
  getCardClasses, 
  handleKeyboardInteraction, 
  getAnimationVariants,
  generateId,
  validateProps,
  cn
} from './utils';

/**
 * Main Card Component with compound pattern support
 */
const NorthernTradieCardBase = memo<NorthernTradieCardProps>(({
  variant = 'default',
  size = 'md',
  state = 'idle',
  errorMessage,
  loadingMessage = 'Loading...',
  children,
  className,
  hoverable = false,
  clickable = false,
  onClick,
  disabled = false,
  animated = true,
  animationDelay = 0,
  testId,
  ariaLabel,
  role,
  tabIndex,
  onKeyPress,
  onFocus,
  onBlur,
  bordered = true,
  shadow = false,
  bgColor,
  ...props
}) => {
  // Generate unique ID for accessibility
  const cardId = useMemo(() => generateId('northern-tradie-card'), []);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Validate props in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const errors = validateProps({ 
        variant, 
        size, 
        state, 
        animationDelay 
      });
      if (errors.length > 0) {
        console.warn('NorthernTradieCard validation errors:', errors);
      }
    }
  }, [variant, size, state, animationDelay]);

  // Memoized class names for performance
  const cardClasses = useMemo(
    () => getCardClasses({
      variant,
      size,
      state,
      hoverable,
      clickable,
      disabled,
      bordered,
      shadow,
      className,
    }),
    [variant, size, state, hoverable, clickable, disabled, bordered, shadow, className]
  );

  // Memoized animation variants
  const animationVariants = useMemo(
    () => getAnimationVariants(animationDelay),
    [animationDelay]
  );

  // Keyboard interaction handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      handleKeyboardInteraction(event, onClick, onKeyPress);
    },
    [onClick, onKeyPress]
  );

  // Focus handlers
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  // Click handler with disabled check
  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  // Accessibility props
  const accessibilityProps = useMemo(() => ({
    id: cardId,
    role: role || (clickable ? 'button' : 'article'),
    'aria-label': ariaLabel,
    'aria-disabled': disabled,
    'aria-busy': state === 'loading',
    'aria-live': state === 'error' || state === 'loading' ? 'polite' : undefined,
    tabIndex: disabled ? -1 : tabIndex ?? (clickable ? 0 : undefined),
  }), [cardId, role, clickable, ariaLabel, disabled, state, tabIndex]);

  // Render loading state
  const renderLoadingState = () => (
    <div className={loadingStyles.container} role="status" aria-live="polite">
      <div className="flex flex-col items-center">
        <div className={loadingStyles.spinner} aria-hidden="true" />
        {loadingMessage && (
          <p className={loadingStyles.message}>{loadingMessage}</p>
        )}
        <span className="sr-only">{loadingMessage}</span>
      </div>
    </div>
  );

  // Render error state
  const renderErrorState = () => {
    if (state !== 'error' || !errorMessage) return null;
    
    return (
      <div className={errorStyles.container} role="alert" aria-live="assertive">
        <svg
          className={errorStyles.icon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className={errorStyles.message}>{errorMessage}</p>
      </div>
    );
  };

  // Base card element
  const cardElement = (
    <div
      ref={cardRef}
      className={cn(
        cardClasses,
        bgColor && `bg-${bgColor}`,
        isFocused && 'ring-2 ring-blue-500 ring-offset-2'
      )}
      onClick={clickable ? handleClick : undefined}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-testid={testId}
      {...accessibilityProps}
      {...props}
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {state === 'loading' && renderLoadingState()}
      </AnimatePresence>

      {/* Card content */}
      <div className={cn(state === 'loading' && 'opacity-50')}>
        {renderErrorState()}
        {children}
      </div>
    </div>
  );

  // Wrap with animation if enabled
  if (animated) {
    return (
      <motion.div
        ref={cardRef}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={hoverable && !disabled ? "hover" : undefined}
        whileTap={clickable && !disabled ? "tap" : undefined}
        variants={animationVariants}
        className={cn(
          cardClasses,
          bgColor && `bg-${bgColor}`,
          isFocused && 'ring-2 ring-blue-500 ring-offset-2'
        )}
        onClick={clickable ? handleClick : undefined}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid={testId}
        {...accessibilityProps}
        {...props}
      >
        {/* Loading overlay */}
        <AnimatePresence>
          {state === 'loading' && renderLoadingState()}
        </AnimatePresence>

        {/* Card content */}
        <div className={cn(state === 'loading' && 'opacity-50')}>
          {renderErrorState()}
          {children}
        </div>
      </motion.div>
    );
  }

  return cardElement;
});

NorthernTradieCardBase.displayName = 'NorthernTradieCard';

/**
 * Compound component exports
 */
export const NorthernTradieCard = Object.assign(NorthernTradieCardBase, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
  Media: CardMedia,
});

// Export types for external use
export type { NorthernTradieCardProps } from './types';

