/**
 * Testimonials Section Component
 *
 * Customer testimonials with ratings and avatars
 *
 * SEO OPTIMIZATION: Commented out - testimonials do not contribute to on-page SEO
 * or search intent for a petrol price directory
 */

'use client';

// Commented out for SEO optimization - testimonials don't contribute to search intent
/* eslint-disable */
/*
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const testimonials: TestimonialProps[] = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      company: 'TechCorp',
      content: 'This app has saved me hundreds of dollars! I check it every morning before heading to work and always find the cheapest prices nearby.',
      avatar: '/images/testimonials/sarah.jpg',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Delivery Driver',
      company: 'FastDelivery',
      content: 'As someone who drives all day, finding cheap fuel is crucial. This platform makes it so easy to compare prices and plan my routes efficiently.',
      avatar: '/images/testimonials/mike.jpg',
      rating: 5,
    },
    {
      name: 'Emma Wilson',
      role: 'Student',
      company: 'Melbourne University',
      content: 'Being a student on a budget, every cent counts. This app helps me save money on fuel so I can spend it on more important things.',
      avatar: '/images/testimonials/emma.jpg',
      rating: 5,
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of satisfied users who are already saving money on fuel every day.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-gray-600 dark:text-gray-400 mb-6 italic">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar}
                      alt={`${testimonial.name} profile picture`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
*/
/* eslint-enable */

// SEO Optimization: Testimonials section removed as it doesn't contribute to on-page SEO
export function TestimonialsSection() {
  return null;
}
