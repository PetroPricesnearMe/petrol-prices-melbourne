// Server-side safe Motion Components
// During SSR, these will be plain HTML elements; on client they'll be animated
import React from 'react';

// On server, export plain HTML elements
// On client, these will be replaced with motion components
export const MotionDiv = React.forwardRef(function MotionDiv(props, ref) {
  return React.createElement('div', { ...props, ref });
});
MotionDiv.displayName = 'MotionDiv';

export const MotionH1 = React.forwardRef(function MotionH1(props, ref) {
  return React.createElement('h1', { ...props, ref });
});
MotionH1.displayName = 'MotionH1';

export const MotionP = React.forwardRef(function MotionP(props, ref) {
  return React.createElement('p', { ...props, ref });
});
MotionP.displayName = 'MotionP';

export const MotionSection = React.forwardRef(
  function MotionSection(props, ref) {
    return React.createElement('section', { ...props, ref });
  }
);
MotionSection.displayName = 'MotionSection';

export const MotionArticle = React.forwardRef(
  function MotionArticle(props, ref) {
    return React.createElement('article', { ...props, ref });
  }
);
MotionArticle.displayName = 'MotionArticle';

// Common animation variants to reduce duplication
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};
