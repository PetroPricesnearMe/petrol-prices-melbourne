/**
 * NorthernTradieCard Demo Page
 * Live demonstration of all component features
 */

import React, { useState } from 'react';
import { NorthernTradieCard } from '@/components/NorthernTradieCard';
import type { CardVariant, CardSize, CardState } from '@/components/NorthernTradieCard';

export default function NorthernTradieCardDemo() {
  const [selectedVariant, setSelectedVariant] = useState<CardVariant>('default');
  const [selectedSize, setSelectedSize] = useState<CardSize>('md');
  const [selectedState, setSelectedState] = useState<CardState>('idle');
  const [clickCount, setClickCount] = useState(0);

  const variants: CardVariant[] = ['default', 'elevated', 'outlined', 'filled', 'interactive', 'featured'];
  const sizes: CardSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  const states: CardState[] = ['idle', 'loading', 'error', 'success'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NorthernTradieCard Component Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A highly reusable, accessible, and performant card component with multiple variants,
            sizes, and states. Explore all features interactively below.
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Interactive Controls
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Variant Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variant
              </label>
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value as CardVariant)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Select card variant"
              >
                {variants.map((variant) => (
                  <option key={variant} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value as CardSize)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Select card size"
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* State Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value as CardState)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Select card state"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Interactive Preview
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <NorthernTradieCard
                variant={selectedVariant}
                size={selectedSize}
                state={selectedState}
                errorMessage="An error occurred while loading the card."
                loadingMessage="Loading card content..."
                clickable
                hoverable
                onClick={() => setClickCount((prev) => prev + 1)}
                animated
                shadow="md"
              >
                <NorthernTradieCard.Header
                  title="Interactive Card"
                  subtitle={`Variant: ${selectedVariant} • Size: ${selectedSize}`}
                  icon={
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  }
                />
                <NorthernTradieCard.Content>
                  <p className="text-gray-700 mb-3">
                    This is a live preview of the NorthernTradieCard component. 
                    Use the controls above to change the variant, size, and state.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Click count:</strong> {clickCount}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Try clicking the card or pressing Enter/Space when focused!
                    </p>
                  </div>
                </NorthernTradieCard.Content>
                <NorthernTradieCard.Footer align="between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setClickCount(0);
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Reset
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Action
                  </button>
                </NorthernTradieCard.Footer>
              </NorthernTradieCard>
            </div>
          </div>
        </div>

        {/* All Variants Showcase */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            All Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {variants.map((variant) => (
              <NorthernTradieCard key={variant} variant={variant} animated>
                <NorthernTradieCard.Header title={`${variant} Variant`} />
                <NorthernTradieCard.Content>
                  This is the {variant} variant of the card component.
                </NorthernTradieCard.Content>
              </NorthernTradieCard>
            ))}
          </div>
        </div>

        {/* Real-world Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Real-world Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Card */}
            <NorthernTradieCard variant="elevated" hoverable animated>
              <NorthernTradieCard.Media aspectRatio="4/3">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </NorthernTradieCard.Media>
              <NorthernTradieCard.Header
                title="Product Name"
                subtitle="Electronics"
              />
              <NorthernTradieCard.Content>
                <p className="text-gray-600 text-sm mb-2">
                  High-quality product with excellent features.
                </p>
                <div className="text-2xl font-bold text-gray-900">$299</div>
              </NorthernTradieCard.Content>
              <NorthernTradieCard.Footer align="between">
                <span className="text-sm text-green-600 font-medium">In Stock</span>
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Add to Cart
                </button>
              </NorthernTradieCard.Footer>
            </NorthernTradieCard>

            {/* Stats Card */}
            <NorthernTradieCard variant="filled" animated animationDelay={100}>
              <NorthernTradieCard.Header
                title="Total Users"
                icon={
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                }
              />
              <NorthernTradieCard.Content>
                <div className="text-3xl font-bold text-gray-900 mb-1">1,234</div>
                <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <span>↑</span>
                  <span>12% vs last month</span>
                </div>
              </NorthernTradieCard.Content>
            </NorthernTradieCard>

            {/* Pricing Card */}
            <NorthernTradieCard variant="featured" shadow="xl" animated animationDelay={200}>
              <NorthernTradieCard.Header
                title="Premium Plan"
                subtitle="Most Popular"
              />
              <NorthernTradieCard.Content>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$49</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Unlimited access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Advanced features</span>
                  </li>
                </ul>
              </NorthernTradieCard.Content>
              <NorthernTradieCard.Footer>
                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </button>
              </NorthernTradieCard.Footer>
            </NorthernTradieCard>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            📚 Documentation & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Getting Started</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• README.md - Complete API reference</li>
                <li>• QUICKSTART.md - 5-minute guide</li>
                <li>• EXAMPLES.md - Real-world use cases</li>
                <li>• COMPONENT_SUMMARY.md - Implementation details</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Development</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Run tests: <code className="bg-blue-100 px-2 py-1 rounded">npm test</code></li>
                <li>• View stories: <code className="bg-blue-100 px-2 py-1 rounded">npm run storybook</code></li>
                <li>• Type check: <code className="bg-blue-100 px-2 py-1 rounded">npm run type-check</code></li>
                <li>• Location: <code className="bg-blue-100 px-2 py-1 rounded">src/components/NorthernTradieCard/</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

