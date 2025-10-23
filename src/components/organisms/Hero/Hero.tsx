import { Button } from '@/components/atoms/Button';

export function Hero() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Find the{' '}
            <span className="gradient-text">Cheapest Fuel Prices</span> Near You
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            Compare real-time petrol prices from stations across Australia. Save
            money on unleaded, diesel, premium, and LPG fuel.
          </p>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button size="lg" className="w-full sm:w-auto min-h-[44px]">Find Stations</Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[44px]">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

