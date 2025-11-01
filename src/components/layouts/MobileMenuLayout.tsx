/**
 * MobileMenuLayout Component
 * Layout component demonstrating mobile menu integration
 * Features:
 * - Responsive navigation
 * - Mobile menu integration
 * - Smooth transitions
 * - Accessibility features
 */

'use client';

import { ResponsiveNavigation } from '@/components/navigation/ResponsiveNavigation';
import { cn } from '@/styles/system/css-in-js';

interface MobileMenuLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileMenuLayout({ children, className }: MobileMenuLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      {/* Navigation */}
      <ResponsiveNavigation />

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}

export default MobileMenuLayout;
