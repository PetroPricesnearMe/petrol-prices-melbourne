import { useEffect } from 'react';
import Head from 'next/head';
import BreadcrumbsNext from '../components/layout/BreadcrumbsNext';
import { trackPageView } from '../src/utils/analytics';

export default function BlogPage() {
  useEffect(() => {
    trackPageView('Blog');
  }, []);

  return (
    <>
      <Head>
        <title>Complete Guide to Finding Cheapest Petrol Prices in Melbourne | Blog</title>
        <meta name="description" content="Expert tips for finding the best petrol prices in Melbourne. Learn when to fill up, which stations offer the best deals, and how to save money on fuel." />
        <link rel="canonical" href="/blog" />
      </Head>

      <div className="blog-page">
        <BreadcrumbsNext />
        <h1>Blog - Fuel Savings Guide</h1>
        {/* Rest of blog content from src/components/BlogPage.js */}
      </div>
    </>
  );
}

