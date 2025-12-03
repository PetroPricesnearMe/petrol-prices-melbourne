/**
 * Framer Motion Mock for Jest Tests
 * Simplifies animations in test environment
 */

const React = require('react');

const mockMotion = {
  motion: new Proxy(
    {},
    {
      get: (_, prop) => {
        // Return a mock component for any motion element (motion.div, motion.button, etc.)
        const MotionComponent = React.forwardRef(({ children, ...props }, ref) => {
          // Remove framer-motion specific props
          const {
            initial: _initial,
            animate: _animate,
            exit: _exit,
            variants: _variants,
            transition: _transition,
            whileHover: _whileHover,
            whileTap: _whileTap,
            whileFocus: _whileFocus,
            whileDrag: _whileDrag,
            drag: _drag,
            dragConstraints: _dragConstraints,
            dragElastic: _dragElastic,
            dragMomentum: _dragMomentum,
            onDragStart: _onDragStart,
            onDrag: _onDrag,
            onDragEnd: _onDragEnd,
            layout: _layout,
            layoutId: _layoutId,
            ...domProps
          } = props;

          // Render as regular HTML element
          return React.createElement(prop, { ...domProps, ref }, children);
        });
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

