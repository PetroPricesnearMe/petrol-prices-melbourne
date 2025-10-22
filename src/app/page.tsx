import type { Metadata } from 'next';

import { Hero } from '@/components/organisms/Hero';
import { SearchSection } from '@/components/organisms/SearchSection';
import { FeaturesSection } from '@/components/organisms/FeaturesSection';

export const metadata: Metadata = {
  title: 'Home',
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <SearchSection />
      <FeaturesSection />
    </main>
  );
}

