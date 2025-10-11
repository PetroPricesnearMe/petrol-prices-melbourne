import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import NetworkStatus from './components/NetworkStatus';
import HomePage from './components/HomePage';

// Lazy load non-critical pages to reduce initial bundle size
const MapPage = React.lazy(() => import('./components/MapPage'));
const DirectoryPage = React.lazy(() => import('./components/DirectoryPageNew'));
const AboutPage = React.lazy(() => import('./components/AboutPage'));
const FuelPriceTrendsPage = React.lazy(() => import('./components/FuelPriceTrendsPage'));
const StationAmenitiesPage = React.lazy(() => import('./components/StationAmenitiesPage'));
const HowPricingWorksPage = React.lazy(() => import('./components/HowPricingWorksPage'));
const RoadsideAssistancePage = React.lazy(() => import('./components/RoadsideAssistancePage'));
const TrafficPage = React.lazy(() => import('./components/TrafficPage'));
const AccountPage = React.lazy(() => import('./components/AccountPage'));
const CarWashesPage = React.lazy(() => import('./components/CarWashesPage'));
const TruckStopsPage = React.lazy(() => import('./components/TruckStopsPage'));
const ServiceStationsPage = React.lazy(() => import('./components/ServiceStationsPage'));
const NewsPage = React.lazy(() => import('./components/NewsPage'));
const StationBrandsPage = React.lazy(() => import('./components/StationBrandsPage'));
const SignInPage = React.lazy(() => import('./components/SignInPage'));
const BecomeMemberPage = React.lazy(() => import('./components/BecomeMemberPage'));

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
              <Route path="/map" element={<MapPage />} />
              <Route path="/directory" element={<DirectoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/fuel-price-trends" element={<FuelPriceTrendsPage />} />
              <Route path="/station-amenities" element={<StationAmenitiesPage />} />
              <Route path="/how-pricing-works" element={<HowPricingWorksPage />} />
              <Route path="/roadside-assistance" element={<RoadsideAssistancePage />} />
              <Route path="/traffic" element={<TrafficPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/car-washes" element={<CarWashesPage />} />
              <Route path="/truck-stops" element={<TruckStopsPage />} />
              <Route path="/service-stations" element={<ServiceStationsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/station-brands" element={<StationBrandsPage />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/become-member" element={<BecomeMemberPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 