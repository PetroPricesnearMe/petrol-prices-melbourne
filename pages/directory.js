'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import BreadcrumbsNext from '../components/layout/BreadcrumbsNext';
import { MELBOURNE_REGIONS } from '../src/config/regions';
import { trackPageView } from '../src/utils/analytics';

// Dynamically import StationCards with SSR disabled to avoid window/localStorage issues
const StationCards = dynamic(() => import('../src/components/StationCards'), {
  ssr: false,
  loading: () => (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        border: '3px solid #f3f4f6',
        borderTop: '3px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
      }} />
      <p style={{ color: '#6b7280' }}>Loading stations...</p>
    </div>
  )
});

export default function DirectoryPage() {
  const router = useRouter();
  const { region: regionParam } = router.query;
  
  const selectedRegion = regionParam ? MELBOURNE_REGIONS[regionParam.toUpperCase()] : null;

  // Track page view
  useEffect(() => {
    trackPageView(selectedRegion ? `Directory - ${selectedRegion.name}` : 'Directory - All Stations');
  }, [selectedRegion]);

  // SEO data
  const pageTitle = selectedRegion
    ? `${selectedRegion.name} Petrol Stations - Live Fuel Prices`
    : 'Melbourne Petrol Stations Directory - Live Fuel Prices';

  const pageDescription = selectedRegion
    ? `Find the cheapest petrol prices in ${selectedRegion.name}, Melbourne. Compare real-time fuel prices from petrol stations in the area.`
    : `Browse 700+ petrol stations across Melbourne. Compare live fuel prices and find the cheapest petrol near you.`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta 
          name="keywords" 
          content={`petrol prices ${selectedRegion?.name || 'melbourne'}, fuel prices ${selectedRegion?.name || 'melbourne'}, cheapest petrol, station directory`} 
        />
        <link rel="canonical" href={`/directory${regionParam ? `?region=${regionParam}` : ''}`} />
      </Head>

      <div className="directory-page">
        <BreadcrumbsNext customCrumbs={selectedRegion ? [
          { label: 'Home', path: '/', icon: '🏠' },
          { label: 'Station Directory', path: '/directory' },
          { label: selectedRegion.name, path: `/directory?region=${regionParam}`, isActive: true }
        ] : undefined} />

        {/* StationCards component handles everything - filters, search, display, pagination */}
        <StationCards />
      </div>
    </>
  );
}


