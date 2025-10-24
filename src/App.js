import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import ExtensionErrorBoundary from './components/ExtensionErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import NetworkStatus from './components/NetworkStatus';
import HomePage from './components/HomePage';

// Lazy load non-critical pages to reduce initial bundle size
const DirectoryPage = React.lazy(() => import('./components/DirectoryPageNew'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const FuelPriceTrendsPage = React.lazy(() => import('./components/FuelPriceTrendsPage'));
const StationAmenitiesPage = React.lazy(() => import('./components/StationAmenitiesPage'));
const HowPricingWorksPage = React.lazy(() => import('./components/HowPricingWorksPage'));
const BlogPage = React.lazy(() => import('./components/BlogPage'));
const FAQPage = React.lazy(() => import('./components/FAQPage'));
const AIChat = React.lazy(() => import('./components/AIChat'));
const GooglePlacesSearch = React.lazy(() => import('./components/GooglePlacesSearch'));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <LoadingSpinner
    message="Loading page..."
    showTips={true}
    size="medium"
  />
);

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ExtensionErrorBoundary>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <div className="App">
              {/* Skip to main content for keyboard navigation */}
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>

              <NetworkStatus />

              {/* Header with navigation */}
              <header role="banner">
                <Navbar />
              </header>

              {/* Main content area */}
              <main id="main-content" role="main" tabIndex={-1}>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/directory" element={<DirectoryPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/fuel-price-trends" element={<FuelPriceTrendsPage />} />
                    <Route path="/station-amenities" element={<StationAmenitiesPage />} />
                    <Route path="/how-pricing-works" element={<HowPricingWorksPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/chat" element={<AIChat />} />
                    <Route path="/google-places" element={<GooglePlacesSearch />} />
                  </Routes>
                </Suspense>
              </main>

              {/* Footer - can be added later when needed */}
            </div>
          </Router>
        </ExtensionErrorBoundary>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
