/**
 * Map Page FAQs Component
 * 
 * Displays FAQs with JSON-LD schema for SEO
 */

'use client';

import { useState } from 'react';

import { cn, patterns } from '@/styles/system/css-in-js';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'Where can I find the cheapest petrol in Melbourne today?',
    answer: 'Use our interactive map above to find the cheapest petrol prices near you. Prices are updated daily from verified stations across Melbourne. You can filter by fuel type (Unleaded 91, Premium 95/98, Diesel) and suburb to find the best deals in your area.',
  },
  {
    question: 'How accurate is the petrol price data?',
    answer: 'Our petrol price data is updated daily from verified stations across Melbourne and Victoria. We source information from multiple reliable sources including station operators, government databases, and user submissions. While prices can change throughout the day, our data provides an accurate snapshot of current fuel prices.',
  },
  {
    question: 'Why are fuel prices different between suburbs?',
    answer: 'Fuel prices vary between suburbs due to several factors including competition levels, operating costs, location convenience, and local market conditions. Inner-city stations often charge more due to higher rent and operating costs, while outer suburbs may have more competitive pricing. Use our map to compare prices across different areas.',
  },
  {
    question: 'Is diesel cheaper in outer suburbs?',
    answer: 'Generally, diesel prices can be lower in outer suburbs due to increased competition and lower operating costs. However, prices fluctuate daily. Use our map to filter by diesel prices and compare stations across Melbourne. The cheapest diesel prices are often found in industrial areas or along major highways.',
  },
  {
    question: 'What is the cheapest day to buy petrol in Victoria?',
    answer: 'Historically, Tuesday and Wednesday tend to have lower fuel prices in Victoria, as stations often increase prices heading into weekends. However, prices can vary daily. We recommend checking our map regularly and filling up when you find a good price, rather than waiting for a specific day.',
  },
  {
    question: 'How often are petrol prices updated on this map?',
    answer: 'Our petrol price data is updated daily. The map shows the most recent verified prices from stations across Melbourne. Each station listing displays when the price was last updated, so you can see how current the information is.',
  },
  {
    question: 'Can I get directions to the cheapest petrol station?',
    answer: 'Yes! Click on any station marker on the map to see details, then use the "Directions" button to get Google Maps directions. You can also click through to individual station pages for more information and route planning.',
  },
  {
    question: 'Are premium fuels (95 and 98) worth the extra cost?',
    answer: 'Premium fuels (95 and 98 octane) are designed for high-performance engines and may provide better fuel economy and performance in compatible vehicles. However, if your car manufacturer recommends regular unleaded (91), premium fuels typically don\'t provide significant benefits. Check your vehicle manual for recommended fuel type.',
  },
  {
    question: 'How do I find petrol stations near my location?',
    answer: 'Use the "Use My Location" button on the map to automatically find stations near you. You can also search by suburb or postcode using the search bar. The map will show all nearby stations with current prices, and you can filter by fuel type or brand.',
  },
  {
    question: 'What fuel types are available at Melbourne stations?',
    answer: 'Most Melbourne petrol stations offer Unleaded 91, Premium 95, Premium 98, and Diesel. Some stations also offer LPG and E10. Use the fuel type filter on the map to find stations that stock your preferred fuel type.',
  },
  {
    question: 'Do fuel prices change during the day?',
    answer: 'Yes, fuel prices can change multiple times throughout the day. Stations may adjust prices based on wholesale costs, competition, and demand. Our map shows the most recent verified prices, but we recommend checking prices at the station before filling up, especially for long trips.',
  },
  {
    question: 'Are there any fuel price cycles in Melbourne?',
    answer: 'Melbourne experiences weekly fuel price cycles, typically with lower prices mid-week (Tuesday-Thursday) and higher prices on weekends. However, cycles can vary by area and competition levels. Use our map to track prices and identify the best times to fill up in your area.',
  },
  {
    question: 'Can I compare prices between different brands?',
    answer: 'Yes! Use the brand filter on the map to compare prices between BP, Shell, Caltex, 7-Eleven, Coles Express, and other brands. You can also sort stations by price to see which brands offer the best value in your area.',
  },
  {
    question: 'How do I report incorrect fuel prices?',
    answer: 'If you notice an incorrect price on our map, please contact us through our website. We regularly verify and update price information to ensure accuracy. User reports help us maintain the most current and reliable fuel price data.',
  },
  {
    question: 'What is the average fuel price in Melbourne?',
    answer: 'Average fuel prices in Melbourne vary by fuel type. As of our latest update, average prices are typically: Unleaded 91 around 198¢/L, Premium 95 around 210¢/L, Premium 98 around 215¢/L, and Diesel around 200¢/L. Use our map to see current averages and find the cheapest options.',
  },
];

export function MapFAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  // Generate JSON-LD schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className={patterns.container()}>
          <div className="mb-8 text-center">
            <h2 className={cn(patterns.text.h2, 'mb-3')}>
              Frequently Asked Questions – Melbourne Fuel Prices
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about finding the cheapest fuel prices in Melbourne and Victoria.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <svg
                    className={cn(
                      'w-5 h-5 text-gray-500 flex-shrink-0 transition-transform',
                      openIndex === index && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

