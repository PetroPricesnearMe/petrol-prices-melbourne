import { HelmetProvider } from 'react-helmet-async';

// Global styles
import '../src/index.css';
import '../src/styles/design-system.css';
import '../src/styles/accessibility.css';
import '../src/styles/normalize.css';
import '../src/styles/cross-browser-utils.css';

// Component styles (Next.js requires all global CSS in _app.js)
import '../src/components/Navbar.css';
import '../src/components/HomePage.css';
import '../src/components/DirectoryPageNew.css';
import '../src/components/RegionSelector.css';
import '../src/components/AdvancedFilters.css';
import '../src/components/StationCards.css';
import '../src/components/StationMap.css';
import '../src/components/LoadingSpinner.css';
import '../src/components/ErrorBoundary.css';
import '../src/components/NetworkStatus.css';
import '../src/components/Breadcrumbs.css';
import '../src/components/BlogPage.css';
import '../src/components/FAQPage.css';
import '../src/components/FuelPriceTrendsPage.css';
import '../src/components/StationAmenitiesPage.css';
import '../src/components/HowPricingWorksPage.css';
import '../src/components/AIChat.css';

// Import layout components (Next.js versions)
import NavbarNext from '../components/layout/NavbarNext';
import NetworkStatus from '../src/components/NetworkStatus';
import ErrorBoundary from '../src/components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <div className="App">
          {/* Skip to main content for keyboard navigation */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          
          <NetworkStatus />
          
          {/* Header with navigation */}
          <header role="banner">
            <NavbarNext />
          </header>
          
          {/* Main content area */}
          <main id="main-content" role="main" tabIndex={-1}>
            <Component {...pageProps} />
          </main>
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default MyApp;

