/**
 * Footer Example
 * Complete example showing Footer with all features
 */

'use client';

import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Footer } from './Footer';

export function FooterExample() {
  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      icon: <Facebook className="h-5 w-5" />,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: <Twitter className="h-5 w-5" />,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      icon: <Instagram className="h-5 w-5" />,
    },
  ];

  const contactInfo = {
    email: 'petrolpricesnearme@gmail.com',
    phone: '0423 530 204',
    address: 'Melbourne, VIC, Australia',
  };

  return (
    <Footer
      logo={<span className="text-2xl font-bold text-white">⛽ PPNM</span>}
      socialLinks={socialLinks}
      contactInfo={contactInfo}
      copyright="© 2024 Petrol Price Near Me. All rights reserved."
    />
  );
}

export default FooterExample;
