import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
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
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="App">
          <NetworkStatus />
          <Navbar />
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
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 