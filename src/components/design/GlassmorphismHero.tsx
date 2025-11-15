'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { cn } from '@/lib/utils';

interface GlassmorphismHeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
  className?: string;
}

/**
 * Glassmorphism Hero Section
 * Full-width hero with blurred glass effect, gradient overlay, and subtle animations
 */
export const GlassmorphismHero: React.FC<GlassmorphismHeroProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage = '/images/hero-bg.jpg',
  className,
}) => {
  return (
    <section
      className={cn(
        'relative flex min-h-screen items-center justify-center overflow-hidden',
        className
      )}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Gradient Overlay */}
      <div className="from-blue-900/60 via-purple-900/50 to-pink-900/60 absolute inset-0 bg-gradient-to-br" />

      {/* Glassmorphism Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        {/* Glass Card */}
        <div className="rounded-3xl border border-white/20 bg-white/10 p-12 shadow-2xl backdrop-blur-xl">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-8 text-xl leading-relaxed text-white/90 md:text-2xl"
          >
            {subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.a
              href={ctaLink}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="from-blue-500 to-purple-600 inline-block rounded-full bg-gradient-to-r px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              {ctaText}
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default GlassmorphismHero;
