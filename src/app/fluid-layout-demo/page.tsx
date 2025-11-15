/**
 * Fluid Layout & Typography Demo Page
 * Showcases the new responsive design system
 */

import React from 'react';

import FluidLayoutExamples from '@/components/examples/FluidLayoutExamples';

export const metadata = {
  title: 'Fluid Layout Demo | Responsive Design System',
  description:
    'Interactive demonstration of the fluid layout and typography system with auto-fit grids and clamp() utilities',
};

export default function FluidLayoutDemoPage() {
  return (
    <main className="min-h-screen">
      {/* Banner */}
      <div className="px-fluid bg-gradient-to-r from-primary-600 to-secondary-600 py-4 text-white">
        <div className="container">
          <div className="flex-responsive-between items-center">
            <div className="stack-sm">
              <h1 className="text-2xl font-bold">
                🎨 Fluid Layout & Typography Demo
              </h1>
              <p className="text-sm opacity-90">
                Resize your browser to see responsive layouts in action
              </p>
            </div>
            <a
              href="/FLUID_LAYOUT_GUIDE.md"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 transition-all hover:shadow-lg"
            >
              View Documentation
            </a>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <FluidLayoutExamples />

      {/* Footer */}
      <footer className="section-spacing bg-gray-900 text-white">
        <div className="container">
          <div className="stack text-center">
            <h3 className="text-3xl font-bold">Ready to Use This System?</h3>
            <p className="text-measure mx-auto text-lg text-gray-300">
              Check out the comprehensive documentation and quick reference
              guide to start implementing fluid layouts in your project.
            </p>
            <div className="flex-responsive-center pt-8">
              <a
                href="/FLUID_LAYOUT_GUIDE.md"
                className="rounded-xl bg-primary-600 px-8 py-4 font-bold transition-all hover:bg-primary-700"
              >
                Full Documentation
              </a>
              <a
                href="/FLUID_LAYOUT_QUICK_REFERENCE.md"
                className="rounded-xl bg-gray-800 px-8 py-4 font-bold transition-all hover:bg-gray-700"
              >
                Quick Reference
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
