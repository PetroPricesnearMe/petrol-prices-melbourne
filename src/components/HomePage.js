import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from 'next/image';
import { MotionDiv, MotionH1, MotionP, MotionSection, containerVariants, itemVariants } from './MotionComponents';
import RegionSelector from './RegionSelector';
import SEO from './SEO';
import { trackPageView } from '../utils/analytics';

/**
 * HomePage Component - Fully Responsive with Tailwind CSS
 * Fluid typography, mobile-first design, and optimized images
 * 
 * @component
 */

// Structured data for homepage
const homepageStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Petrol Prices Near Me",
    "url": "https://www.petrolpricesnearme.com.au",
    "description": "Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates. Find the cheapest unleaded, diesel & premium near you today!",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.petrolpricesnearme.com.au/directory?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Petrol Prices Near Me",
    "description": "Melbourne's premier fuel price comparison service",
    "areaServed": {
      "@type": "City",
      "name": "Melbourne",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Melbourne",
        "addressRegion": "VIC",
        "addressCountry": "AU"
      }
    },
    "priceRange": "$$"
  }
];

// Override stagger timing for homepage
const heroContainerVariants = {
  ...containerVariants,
  visible: {
    ...containerVariants.visible,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const HomePage = () => {
  // Track page view on mount
  useEffect(() => {
    trackPageView('Home');
  }, []);

  return (
    <>
      <SEO
        title="Compare Live Petrol Prices from 250+ Stations in Melbourne | Save up to 20c/L"
        description="Compare live petrol prices from 250+ stations in Melbourne. Save up to 20c/L with real-time fuel price updates. Find the cheapest unleaded, diesel & premium near you today!"
        keywords="petrol prices melbourne, fuel prices melbourne, cheapest petrol, petrol stations near me, live fuel prices, melbourne petrol, fuel comparison, unleaded prices, diesel prices, premium fuel"
        canonical="/"
        structuredData={homepageStructuredData}
      />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section - Fully Responsive */}
        <MotionDiv
          className="relative min-h-screen flex items-center overflow-hidden"
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          role="banner"
          aria-label="Hero section"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700 -z-10">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Hero Content - Mobile-First */}
              <header className="text-center lg:text-left space-y-6 sm:space-y-8 order-2 lg:order-1">
                {/* Badge */}
                <MotionDiv 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-sm font-medium text-white shadow-lg"
                  variants={itemVariants}
                >
                  <span className="flex w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Live Fuel Prices</span>
                </MotionDiv>

                {/* Title - Fluid Typography */}
                <MotionH1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight tracking-tight"
                  variants={itemVariants}
                >
                  Compare Live Petrol Prices from{' '}
                  <span className="inline-block bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent animate-pulse">
                    250+ Stations
                  </span>{' '}
                  in Melbourne
                </MotionH1>

                {/* Subtitle - Fluid Typography */}
                <MotionP 
                  className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                  variants={itemVariants}
                >
                  Save up to <span className="font-bold text-yellow-300">20c/L</span> with real-time fuel price updates. 
                  Find the cheapest unleaded, diesel & premium near you today!
                </MotionP>

                {/* CTA Buttons - Touch-Friendly */}
                <MotionDiv 
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  variants={itemVariants}
                >
                  <a 
                    href="#regions" 
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[52px] touch-manipulation active:scale-95"
                  >
                    <span>🗺️</span>
                    <span>Browse by Region</span>
                  </a>

                  <Link 
                    to="/directory" 
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold bg-white hover:bg-gray-50 text-primary-600 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[52px] touch-manipulation active:scale-95"
                  >
                    <span>🏪</span>
                    <span>View All Stations</span>
                  </Link>
                </MotionDiv>

                {/* Stats - Responsive Grid */}
                <MotionDiv 
                  className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-6 sm:pt-8"
                  variants={itemVariants}
                >
                  <div className="text-center lg:text-left space-y-1">
                    <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white drop-shadow-lg">
                      250+
                    </div>
                    <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide font-medium">
                      Stations
                    </div>
                  </div>
                  <div className="text-center lg:text-left space-y-1">
                    <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-yellow-300 drop-shadow-lg">
                      Live
                    </div>
                    <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide font-medium">
                      Updates
                    </div>
                  </div>
                  <div className="text-center lg:text-left space-y-1">
                    <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white drop-shadow-lg">
                      24/7
                    </div>
                    <div className="text-xs sm:text-sm text-white/80 uppercase tracking-wide font-medium">
                      Monitoring
                    </div>
                  </div>
                </MotionDiv>
              </header>

              {/* Hero Image - Optimized */}
              <MotionDiv
                className="order-1 lg:order-2 flex items-center justify-center"
                variants={itemVariants}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <figure className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:-translate-y-2">
                    <img
                      src="/images/fuel-nozzles.svg"
                      alt="Fuel nozzles at petrol station showing different fuel types - Diesel, 98 Octane, 95 Octane, Unleaded, and 91 Octane"
                      className="w-full h-auto opacity-0 transition-opacity duration-300"
                      loading="eager"
                      decoding="async"
                      fetchpriority="high"
                      onLoad={(e) => {
                        e.target.style.opacity = '1';
                      }}
                      onError={(e) => {
                        console.warn('Failed to load fuel-nozzles image');
                        e.target.style.display = 'none';
                      }}
                    />
                    <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
                      <div className="flex flex-wrap justify-center gap-2">
                        <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
                          Diesel
                        </span>
                        <span className="px-2 py-1 bg-red-600/60 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
                          98 Octane
                        </span>
                        <span className="px-2 py-1 bg-yellow-500/60 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
                          95 Octane
                        </span>
                        <span className="px-2 py-1 bg-green-600/60 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
                          Unleaded
                        </span>
                        <span className="px-2 py-1 bg-purple-600/60 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
                          91 Octane
                        </span>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </MotionDiv>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block">
            <MotionDiv
              className="w-6 h-10 border-2 border-white/50 rounded-full p-1"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-1.5 h-3 bg-white rounded-full mx-auto" />
            </MotionDiv>
          </div>
        </MotionDiv>

        {/* Region Selector */}
        <RegionSelector />

        {/* Features Section - Responsive Cards */}
        <MotionSection
          className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-gray-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <MotionDiv
              className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight">
                Why Choose{' '}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Melbourne Fuel?
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                Comprehensive fuel price monitoring to help you save money on every fill-up
              </p>
            </MotionDiv>

            {/* Features Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {[
                {
                  icon: '🕐',
                  title: 'Real-Time Updates',
                  description: 'Get live fuel price updates from petrol stations across Melbourne with instant notifications when prices change'
                },
                {
                  icon: '🎯',
                  title: 'Location-Based Search',
                  description: 'Find the nearest and cheapest petrol stations in your area using our advanced location-based search system'
                },
                {
                  icon: '💰',
                  title: 'Save Money',
                  description: 'Compare prices from over 250 petrol stations and save up to 20 cents per liter on every fuel purchase'
                }
              ].map((feature, index) => (
                <article
                  key={index}
                  className="group relative bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-soft hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border border-gray-200"
                  itemScope
                  itemType="https://schema.org/Service"
                >
                  <MotionDiv
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl mb-5 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 
                      itemProp="name"
                      className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-primary-600 transition-colors"
                    >
                      {feature.title}
                    </h3>
                    <p 
                      itemProp="description"
                      className="text-sm sm:text-base text-gray-600 leading-relaxed"
                    >
                      {feature.description}
                    </p>
                  </MotionDiv>
                </article>
              ))}
            </div>
          </div>
        </MotionSection>
      </main>
    </>
  );
};

export default HomePage;
