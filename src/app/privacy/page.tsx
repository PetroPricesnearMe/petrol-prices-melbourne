/**
 * Privacy Policy Page
 * Privacy policy and data handling information
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { cn, patterns } from '@/styles/system/css-in-js';

export const metadata: Metadata = {
  title: 'Privacy Policy | Petrol Price Near Me',
  description:
    'Privacy policy for Petrol Price Near Me. Learn how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy | Petrol Price Near Me',
    description:
      'Learn how we collect, use, and protect your personal information.',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <header className="bg-gradient-primary text-white py-20">
        <div className={patterns.container()}>
          <div className={patterns.flex.colCenter}>
            <h1 className={cn(patterns.text.h1, 'text-white mb-4 text-center')}>
              Privacy Policy
            </h1>
            <p className={cn(patterns.text.body, 'text-white/90 text-center max-w-2xl')}>
              Your privacy is important to us. Learn how we handle your data.
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className={patterns.container() + ' py-16'}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Last Updated */}
          <section className="card p-8">
            <p className={patterns.text.body + ' text-gray-600 dark:text-gray-400'}>
              <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </section>

          {/* Introduction */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Introduction</h2>
            <p className={patterns.text.body + ' mb-4'}>
              Petrol Price Near Me (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit 
              our website petrolpricesnearme.com.au.
            </p>
            <p className={patterns.text.body}>
              By using our website, you consent to the data practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Information We Collect</h2>
            
            <h3 className={patterns.text.h3 + ' mb-3 mt-6'}>Automatically Collected Information</h3>
            <p className={patterns.text.body + ' mb-4'}>
              When you visit our website, we automatically collect certain information about your device, including:
            </p>
            <ul className={patterns.text.body + ' list-disc list-inside space-y-2 mb-4 ml-4'}>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages you visit and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Device information (screen size, device type)</li>
            </ul>

            <h3 className={patterns.text.h3 + ' mb-3 mt-6'}>Location Information</h3>
            <p className={patterns.text.body + ' mb-4'}>
              If you choose to use location-based features, we may collect your approximate location to provide 
              relevant petrol prices in your area. This information is processed locally in your browser when 
              you grant permission.
            </p>
          </section>

          {/* How We Use Information */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>How We Use Your Information</h2>
            <p className={patterns.text.body + ' mb-4'}>
              We use the information we collect to:
            </p>
            <ul className={patterns.text.body + ' list-disc list-inside space-y-2 mb-4 ml-4'}>
              <li>Provide and maintain our service</li>
              <li>Improve and optimize our website</li>
              <li>Analyze usage patterns and trends</li>
              <li>Ensure website security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Cookies and Tracking Technologies</h2>
            <p className={patterns.text.body + ' mb-4'}>
              We use cookies and similar tracking technologies to track activity on our website and store 
              certain information. Cookies are files with a small amount of data that may include an anonymous 
              unique identifier.
            </p>
            <p className={patterns.text.body + ' mb-4'}>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
              However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </section>

          {/* Data Sharing */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Data Sharing and Disclosure</h2>
            <p className={patterns.text.body + ' mb-4'}>
              We do not sell, trade, or rent your personal information to third parties. We may share your 
              information only in the following circumstances:
            </p>
            <ul className={patterns.text.body + ' list-disc list-inside space-y-2 mb-4 ml-4'}>
              <li>With service providers who assist us in operating our website</li>
              <li>To comply with legal obligations or respond to lawful requests</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Data Security</h2>
            <p className={patterns.text.body + ' mb-4'}>
              We implement appropriate technical and organizational security measures to protect your personal 
              information. However, no method of transmission over the Internet or electronic storage is 100% 
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Your Privacy Rights</h2>
            <p className={patterns.text.body + ' mb-4'}>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className={patterns.text.body + ' list-disc list-inside space-y-2 mb-4 ml-4'}>
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to request deletion of your information</li>
              <li>The right to object to processing of your information</li>
              <li>The right to data portability</li>
            </ul>
            <p className={patterns.text.body}>
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Third-Party Links</h2>
            <p className={patterns.text.body}>
              Our website may contain links to third-party websites. We are not responsible for the privacy 
              practices of these external sites. We encourage you to review the privacy policies of any 
              third-party sites you visit.
            </p>
          </section>

          {/* Children&apos;s Privacy */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Children&apos;s Privacy</h2>
            <p className={patterns.text.body}>
              Our website is not intended for children under the age of 13. We do not knowingly collect 
              personal information from children under 13. If you believe we have collected information from 
              a child under 13, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Changes to This Privacy Policy</h2>
            <p className={patterns.text.body}>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date. You are advised to 
              review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact */}
          <section className="card p-8">
            <h2 className={patterns.text.h2 + ' mb-4'}>Contact Us</h2>
            <p className={patterns.text.body + ' mb-4'}>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <p className={patterns.text.body}>
              Email: privacy@petrolpricesnearme.com.au
            </p>
          </section>

          {/* Navigation */}
          <section className="card p-8">
            <div className="flex flex-wrap gap-4">
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
              >
                ← Back to Home
              </Link>
              <Link
                href="/about"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
              >
                About Us
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

