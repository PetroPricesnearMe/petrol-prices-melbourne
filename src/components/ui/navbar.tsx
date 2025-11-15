'use client';

import { Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface NavbarProps {
  brand?: {
    name: string;
    logo?: string;
    href?: string;
  };
  items: NavItem[];
  cta?: {
    label: string;
    href: string;
  };
  className?: string;
}

const Navbar = ({ brand, items, cta, className }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(
    null
  );

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/95',
        className
      )}
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Brand */}
          {brand && (
            <Link
              href={brand.href || '/'}
              className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
            >
              {brand.logo && (
                <img src={brand.logo} alt={brand.name} className="h-8 w-8" />
              )}
              <span>{brand.name}</span>
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {items.map((item) => (
              <div key={item.label} className="group relative">
                {item.children ? (
                  <button
                    className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === item.label ? null : item.label
                      )
                    }
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute left-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            {cta && (
              <Link
                href={cta.href}
                className="hidden h-9 items-center justify-center rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 md:inline-flex"
              >
                {cta.label}
              </Link>
            )}

            <button
              className="p-2 text-gray-700 dark:text-gray-300 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-800 md:hidden">
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                        {item.label}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div className="space-y-1 pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              {cta && (
                <Link
                  href={cta.href}
                  className="block w-full rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cta.label}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export { Navbar };
