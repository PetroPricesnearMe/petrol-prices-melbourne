/**
 * Utility Functions Unit Tests
 */

import {
  cn,
  getCardClasses,
  handleKeyboardInteraction,
  getAnimationVariants,
  generateId,
  validateProps,
  debounce,
} from '../utils';

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('combines multiple classes', () => {
      expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
    });

    it('filters out falsy values', () => {
      expect(cn('class1', false, 'class2', null, undefined, 'class3')).toBe(
        'class1 class2 class3'
      );
    });

    it('handles empty input', () => {
      expect(cn()).toBe('');
    });

    it('handles all falsy values', () => {
      expect(cn(false, null, undefined, '')).toBe('');
    });
  });

  describe('getCardClasses', () => {
    it('returns base classes with default props', () => {
      const classes = getCardClasses({});
      expect(classes).toContain('relative');
      expect(classes).toContain('rounded-lg');
    });

    it('applies variant classes', () => {
      const classes = getCardClasses({ variant: 'elevated' });
      expect(classes).toBeTruthy();
    });

    it('applies size classes', () => {
      const classes = getCardClasses({ size: 'lg' });
      expect(classes).toBeTruthy();
    });

    it('applies state classes', () => {
      const classes = getCardClasses({ state: 'loading' });
      expect(classes).toContain('opacity-70');
    });

    it('applies hoverable classes', () => {
      const classes = getCardClasses({ hoverable: true });
      expect(classes).toContain('hover:shadow-md');
    });

    it('applies clickable classes', () => {
      const classes = getCardClasses({ clickable: true });
      expect(classes).toContain('cursor-pointer');
    });

    it('applies disabled classes', () => {
      const classes = getCardClasses({ disabled: true });
      expect(classes).toContain('opacity-50');
      expect(classes).toContain('cursor-not-allowed');
    });

    it('removes border when bordered is false', () => {
      const classes = getCardClasses({ bordered: false });
      expect(classes).toContain('border-0');
    });

    it('applies custom className', () => {
      const classes = getCardClasses({ className: 'custom-class' });
      expect(classes).toContain('custom-class');
    });

    it('does not apply hover when disabled', () => {
      const classes = getCardClasses({ hoverable: true, disabled: true });
      expect(classes).not.toContain('hover:shadow-md');
    });

    it('does not apply clickable cursor when disabled', () => {
      const classes = getCardClasses({ clickable: true, disabled: true });
      expect(classes).not.toContain('cursor-pointer');
    });
  });

  describe('handleKeyboardInteraction', () => {
    it('calls onClick on Enter key', () => {
      const onClick = jest.fn();
      const event = {
        key: 'Enter',
        preventDefault: jest.fn(),
      } as any;

      handleKeyboardInteraction(event, onClick);
      expect(onClick).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('calls onClick on Space key', () => {
      const onClick = jest.fn();
      const event = {
        key: ' ',
        preventDefault: jest.fn(),
      } as any;

      handleKeyboardInteraction(event, onClick);
      expect(onClick).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('does not call onClick on other keys', () => {
      const onClick = jest.fn();
      const event = {
        key: 'a',
        preventDefault: jest.fn(),
      } as any;

      handleKeyboardInteraction(event, onClick);
      expect(onClick).not.toHaveBeenCalled();
      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('calls custom onKeyPress handler', () => {
      const onKeyPress = jest.fn();
      const event = {
        key: 'a',
        preventDefault: jest.fn(),
      } as any;

      handleKeyboardInteraction(event, undefined, onKeyPress);
      expect(onKeyPress).toHaveBeenCalledWith(event);
    });

    it('calls both onKeyPress and onClick when appropriate', () => {
      const onClick = jest.fn();
      const onKeyPress = jest.fn();
      const event = {
        key: 'Enter',
        preventDefault: jest.fn(),
      } as any;

      handleKeyboardInteraction(event, onClick, onKeyPress);
      expect(onKeyPress).toHaveBeenCalledWith(event);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('getAnimationVariants', () => {
    it('returns animation variants with default delay', () => {
      const variants = getAnimationVariants();
      expect(variants).toHaveProperty('hidden');
      expect(variants).toHaveProperty('visible');
      expect(variants).toHaveProperty('exit');
      expect(variants).toHaveProperty('hover');
      expect(variants).toHaveProperty('tap');
    });

    it('applies custom delay', () => {
      const variants = getAnimationVariants(500);
      expect(variants.visible.transition.delay).toBe(500);
    });

    it('has correct opacity values', () => {
      const variants = getAnimationVariants();
      expect(variants.hidden.opacity).toBe(0);
      expect(variants.visible.opacity).toBe(1);
      expect(variants.exit.opacity).toBe(0);
    });

    it('has correct y position values', () => {
      const variants = getAnimationVariants();
      expect(variants.hidden.y).toBe(20);
      expect(variants.visible.y).toBe(0);
      expect(variants.exit.y).toBe(-20);
    });

    it('has correct scale values', () => {
      const variants = getAnimationVariants();
      expect(variants.hidden.scale).toBe(0.95);
      expect(variants.visible.scale).toBe(1);
      expect(variants.exit.scale).toBe(0.95);
      expect(variants.tap.scale).toBe(0.98);
    });
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('uses default prefix', () => {
      const id = generateId();
      expect(id).toMatch(/^card-\d+-\d+$/);
    });

    it('uses custom prefix', () => {
      const id = generateId('custom');
      expect(id).toMatch(/^custom-\d+-\d+$/);
    });
  });

  describe('validateProps', () => {
    it('returns empty array for valid props', () => {
      const errors = validateProps({
        variant: 'default',
        size: 'md',
        state: 'idle',
        animationDelay: 100,
      });
      expect(errors).toEqual([]);
    });

    it('validates variant', () => {
      const errors = validateProps({ variant: 'invalid' });
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('Invalid variant');
    });

    it('validates size', () => {
      const errors = validateProps({ size: 'invalid' });
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('Invalid size');
    });

    it('validates state', () => {
      const errors = validateProps({ state: 'invalid' });
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('Invalid state');
    });

    it('validates animationDelay as number', () => {
      const errors = validateProps({ animationDelay: 'invalid' });
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('animationDelay must be a positive number');
    });

    it('validates animationDelay as positive', () => {
      const errors = validateProps({ animationDelay: -100 });
      expect(errors).toHaveLength(1);
      expect(errors[0]).toContain('animationDelay must be a positive number');
    });

    it('returns multiple errors for multiple invalid props', () => {
      const errors = validateProps({
        variant: 'invalid',
        size: 'invalid',
        state: 'invalid',
      });
      expect(errors.length).toBeGreaterThan(1);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('delays function execution', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc();
      expect(func).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      jest.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('passes arguments correctly', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc('arg1', 'arg2');
      jest.advanceTimersByTime(100);

      expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });
});

