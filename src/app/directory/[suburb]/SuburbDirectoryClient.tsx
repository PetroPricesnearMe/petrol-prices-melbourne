import type { Metadata } from 'next';

interface SuburbPageProps {
  params: {
    suburb: string;
  };
}

/**
 * Generate metadata for a specific suburb directory page.
 */
export async function generateMetadata(
  { params }: SuburbPageProps
): Promise<Metadata> {
  const suburbName = decodeURIComponent(params.suburb).replace(/-/g, ' ');
  const title = `Petrol Stations in ${suburbName} | Petrol Price Near Me`;
  const description = `Browse petrol stations and fuel prices in ${suburbName}. Compare prices and find the cheapest fuel near you.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

/**
 * For now we don't pre-generate any specific suburbs.
 * This keeps the route dynamic while avoiding build-time data coupling.
 */
export async function generateStaticParams(): Promise<SuburbPageProps['params'][]> {
  return [];
}

/**
 * Dynamic suburb directory page.
 *
 * NOTE: This is a minimal placeholder implementation that keeps the
 * build pipeline healthy while the full suburb‑filtered directory
 * experience is wired up.
 */
export default function SuburbDirectoryPage({ params }: SuburbPageProps) {
  const suburbName = decodeURIComponent(params.suburb).replace(/-/g, ' ');

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Petrol stations in {suburbName}
          </h1>
          <p className="mt-2 text-gray-600">
            Suburb‑specific station listings will appear here. In the meantime,
            you can browse all stations from the main directory page.
          </p>
        </header>
      </div>
    </main>
  );
}


