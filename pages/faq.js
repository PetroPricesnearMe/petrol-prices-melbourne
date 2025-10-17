import { useEffect } from 'react';
import Head from 'next/head';
import BreadcrumbsNext from '../components/layout/BreadcrumbsNext';
import { trackPageView } from '../src/utils/analytics';

export default function FAQPage() {
  useEffect(() => {
    trackPageView('FAQ');
  }, []);

  return (
    <>
      <Head>
        <title>FAQ - Melbourne Petrol Prices | Frequently Asked Questions</title>
        <meta name="description" content="Frequently asked questions about finding cheap petrol prices in Melbourne, fuel price trends, and station comparison." />
        <link rel="canonical" href="/faq" />
      </Head>

      <div className="faq-page">
        <BreadcrumbsNext />
        <h1>Frequently Asked Questions</h1>
        {/* Rest of FAQ content from src/components/FAQPage.js */}
      </div>
    </>
  );
}

