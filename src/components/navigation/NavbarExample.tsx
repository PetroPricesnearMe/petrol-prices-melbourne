/**
 * Navbar Example
 * Complete example showing Navbar with all features
 */

'use client';

import { Home, MapPin, TrendingUp, Info, HelpCircle } from 'lucide-react';
import { Navbar } from './Navbar';

export function NavbarExample() {
  const links = [
    { href: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    {
      href: '/directory',
      label: 'Directory',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      href: '/fuel-price-trends',
      label: 'Trends',
      icon: <TrendingUp className="h-4 w-4" />,
    },
    { href: '/about', label: 'About', icon: <Info className="h-4 w-4" /> },
    { href: '/faq', label: 'FAQ', icon: <HelpCircle className="h-4 w-4" /> },
  ];

  return (
    <Navbar
      logo={
        <span className="text-2xl font-bold text-primary-600">⛽ PPNM</span>
      }
      links={links}
      showSearch
      onSearchClick={() => console.log('Search clicked')}
      cta={{
        text: 'Get Started',
        href: '/directory',
      }}
      sticky
    />
  );
}

export default NavbarExample;
