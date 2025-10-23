/**
 * Footer Component
 * Site-wide footer with navigation and information
 */

import Link from 'next/link';

import { patterns } from '@/styles/system/css-in-js';

const footerLinks = {
  'Quick Links': [
    { href: '/', label: 'Home' },
    { href: '/directory', label: 'Station Directory' },
    { href: '/fuel-price-trends', label: 'Price Trends' },
    { href: '/station-amenities', label: 'Amenities' },
  ],
  'Resources': [
    { href: '/blog', label: 'Blog' },
    { href: '/how-pricing-works', label: 'How Pricing Works' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About Us' },
  ],
  'Legal': [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
};

const CONTACT_INFO = {
  name: 'Al T',
  mobile: '0423 530 204',
  mobileRaw: '0423530204',
  email: 'contact@petrolpricenearme.com.au',
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white print-hidden mt-auto">
      <div className={patterns.container() + ' py-12'}>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">⛽ Petrol Price Near Me</h3>
            <p className="text-gray-400 text-sm mb-4">
              Find the cheapest petrol stations near you in Melbourne with real-time fuel prices.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors focus-ring-white"
                aria-label="Facebook"
              >
                F
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors focus-ring-white"
                aria-label="Twitter"
              >
                𝕏
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <p className="text-gray-400 text-sm font-medium mb-1">{CONTACT_INFO.name}</p>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.mobileRaw}`}
                  className="text-gray-400 hover:text-white text-sm transition-colors focus-ring-white rounded flex items-center gap-2"
                >
                  <span>📱</span>
                  {CONTACT_INFO.mobile}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-gray-400 hover:text-white text-sm transition-colors focus-ring-white rounded flex items-center gap-2"
                >
                  <span>✉️</span>
                  <span className="break-all">{CONTACT_INFO.email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors focus-ring-white rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className={patterns.flex.between + ' flex-col md:flex-row gap-4'}>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Petrol Price Near Me. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Made with ❤️ in Melbourne, Australia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
