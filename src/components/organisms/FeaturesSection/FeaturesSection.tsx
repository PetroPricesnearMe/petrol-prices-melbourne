import { Card, CardContent } from '@/components/atoms/Card';

const features = [
  {
    title: 'Real-Time Prices',
    description:
      'Get up-to-date fuel prices from stations near you, updated regularly.',
    icon: '⚡',
  },
  {
    title: 'Location-Based Search',
    description:
      'Find petrol stations closest to your current location or search by address.',
    icon: '📍',
  },
  {
    title: 'Price Comparison',
    description:
      'Compare prices across different fuel types and brands to save money.',
    icon: '💰',
  },
  {
    title: 'Multiple Fuel Types',
    description:
      'Search for unleaded, premium, diesel, LPG, and more fuel options.',
    icon: '⛽',
  },
];

export function FeaturesSection() {
  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Why Choose Us
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Everything you need to find the best fuel prices
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="text-center">
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
