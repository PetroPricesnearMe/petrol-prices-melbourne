import { useEffect } from 'react';
import Head from 'next/head';
import Breadcrumbs from '../src/components/Breadcrumbs';
import { trackPageView } from '../src/utils/analytics';

export default function AboutPage() {
  useEffect(() => {
    trackPageView('About');
  }, []);

  return (
    <>
      <Head>
        <title>About Us - Melbourne Petrol Price Comparison</title>
        <meta name="description" content="Learn about Melbourne's premier fuel price comparison service. Our mission is to help you save money on every fill-up." />
        <link rel="canonical" href="/about" />
      </Head>

      <div className="about-page">
        <Breadcrumbs />
        <h1>About Melbourne Fuel</h1>
        {/* Rest of about content */}
      </div>
    </>
  );
}

