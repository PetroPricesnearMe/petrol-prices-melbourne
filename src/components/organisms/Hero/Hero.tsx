import { Button } from '@/components/atoms/Button';

export function Hero() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Find the{' '}
            <span className="gradient-text">Cheapest Fuel Prices</span> Near You
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Compare real-time petrol prices from stations across Australia. Save
            money on unleaded, diesel, premium, and LPG fuel.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg">Find Stations</Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

