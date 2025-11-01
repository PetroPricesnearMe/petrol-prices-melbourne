// Server-side safe Motion Components
// During SSR, these will be plain HTML elements; on client they'll be animated
import React from 'react';

// On server, export plain HTML elements
// On client, these will be replaced with motion components
export const MotionDiv = React.forwardRef((props, ref) => {
  return React.createElement('div', { ...props, ref });
});

export const MotionH1 = React.forwardRef((props, ref) => {
  return React.createElement('h1', { ...props, ref });
});

export const MotionP = React.forwardRef((props, ref) => {
  return React.createElement('p', { ...props, ref });
});

export const MotionSection = React.forwardRef((props, ref) => {
  return React.createElement('section', { ...props, ref });
});

export const MotionArticle = React.forwardRef((props, ref) => {
  return React.createElement('article', { ...props, ref });
});

// Common animation variants to reduce duplication
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};