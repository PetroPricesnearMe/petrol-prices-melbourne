/**
 * Framer Motion Mock for Jest Tests
 * Simplifies animations in test environment
 */

/* global jest */

const React = require('react');

const mockMotion = {
  motion: new Proxy(
    {},
    {
      get: (_, prop) => {
        // Return a mock component for any motion element (motion.div, motion.button, etc.)
        const MotionComponent = React.forwardRef(
          ({ children, ...props }, ref) => {
            // Remove framer-motion specific props by filtering them out
            const framerMotionProps = [
              'initial',
              'animate',
              'exit',
              'variants',
              'transition',
              'whileHover',
              'whileTap',
              'whileFocus',
              'whileDrag',
              'drag',
              'dragConstraints',
              'dragElastic',
              'dragMomentum',
              'onDragStart',
              'onDrag',
              'onDragEnd',
              'layout',
              'layoutId',
            ];

            const domProps = Object.keys(props).reduce((acc, key) => {
              if (!framerMotionProps.includes(key)) {
                acc[key] = props[key];
              }
              return acc;
            }, {});

            // Render as regular HTML element
            return React.createElement(prop, { ...domProps, ref }, children);
          }
        );
        MotionComponent.displayName = `Motion${String(prop).charAt(0).toUpperCase() + String(prop).slice(1)}`;
        return MotionComponent;
      },
    }
  ),

  AnimatePresence: ({ children }) => children,

  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),

  useMotionValue: (initialValue) => ({
    get: () => initialValue,
    set: jest.fn(),
    subscribe: jest.fn(),
  }),

  useTransform: () => ({
    get: () => 0,
    set: jest.fn(),
  }),

  useSpring: (value) => value,

  useScroll: () => ({
    scrollX: { get: () => 0 },
    scrollY: { get: () => 0 },
    scrollXProgress: { get: () => 0 },
    scrollYProgress: { get: () => 0 },
  }),

  useInView: () => true,

  useReducedMotion: () => false,

  useDragControls: () => ({
    start: jest.fn(),
  }),

  domAnimation: {},
  domMax: {},
  m: {},
};

module.exports = mockMotion;
