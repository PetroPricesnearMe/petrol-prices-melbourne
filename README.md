# Petrol Price Near Me 🚗⛽

> **Enterprise-level petrol station finder with real-time fuel prices for Australia**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Component Library](#component-library)
- [SEO & Performance](#seo--performance)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

**Petrol Price Near Me** is a comprehensive, enterprise-level web application designed to help Australian motorists find the cheapest petrol stations in their area. Built with modern web technologies and SEO best practices, it provides real-time fuel price comparisons, interactive maps, and advanced search capabilities.

### Why This Project Exists

With rising fuel costs, finding the cheapest petrol near you can save significant money over time. Our platform aggregates real-time fuel price data from 250+ stations across Australia, providing users with:

- **Instant price comparisons** at a glance
- **Location-based recommendations** using geolocation
- **Multiple fuel types** including unleaded, premium, diesel, and LPG
- **Advanced search filters** by price, distance, brand, and amenities
- **Mobile-first responsive design** for on-the-go access

## ✨ Features

### Core Functionality

- 🗺️ **Interactive Map** - Find stations with clustering and custom markers
- 💰 **Price Comparison** - Real-time fuel price comparisons across stations
- 📍 **Location-Based** - Geolocation-powered nearby station discovery
- ⛽ **Multiple Fuel Types** - Unleaded (91/95/98), Diesel, LPG, E10, E85
- 🔍 **Advanced Search** - Filter by price, distance, brand, amenities
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile

### Advanced Features

- ⚡ **Real-Time Data** - Live fuel prices from multiple sources
- 🌙 **Dark Mode** - System-aware theme switching
- ♿ **WCAG 2.1 AA** - Full accessibility compliance
- 🚀 **Core Web Vitals** - 90+ Lighthouse scores
- 📄 **ISR Support** - Incremental Static Regeneration
- 📊 **Privacy-Focused Analytics** - User insights without tracking
- 🎯 **Advanced SEO** - Structured data, meta tags, Open Graph

## 🏗️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript 5.3** - Type safety and better DX
- **Tailwind CSS 3.4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

### State Management & Data

- **TanStack Query** - Server state management
- **SWR** - Data fetching and caching
- **React Context** - Global state management
- **Zod** - Runtime type validation

### UI Component Library

- **Atomic Design** - Atoms → Molecules → Organisms
- **shadcn/ui** - Reusable UI primitives
- **Radix UI** - Accessible component primitives
- **class-variance-authority** - Component variants

### SEO & Performance

- **Next.js Metadata API** - Advanced SEO configuration
- **JSON-LD Schema** - Structured data markup
- **next/image** - Optimized image loading
- **Core Web Vitals** - Performance monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/petrol-price-near-me.git

# Navigate to project directory
cd petrol-price-near-me

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧩 Component Library

### Button Component

```tsx
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="gradient">Gradient</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>

// With Icons
<Button leftIcon={<Plus />}>Add Item</Button>
<Button rightIcon={<Download />}>Download</Button>

// Loading State
<Button loading>Loading...</Button>
```

### Card Component

```tsx
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>Main card content</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Input Component

```tsx
import { Input } from '@/components/ui/input';
import { Search, Mail } from 'lucide-react';

<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  leftIcon={<Mail />}
  helperText="We'll never share your email"
/>

<Input
  label="Search"
  error={hasError}
  errorMessage="This field is required"
  leftIcon={<Search />}
/>

<Input
  label="Password"
  type="password"
  rightIcon={<Eye />}
/>
```

### Modal/Dialog Component

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

### Navbar Component

```tsx
import { Navbar } from '@/components/ui/navbar';

<Navbar
  brand={{
    name: 'Petrol Price Near Me',
    logo: '/logo.svg',
    href: '/',
  }}
  items={[
    { label: 'Directory', href: '/directory' },
    { label: 'Map', href: '/map' },
    {
      label: 'More',
      href: '/',
      children: [
        { label: 'About', href: '/about' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
  ]}
  cta={{
    label: 'Find Stations',
    href: '/directory',
  }}
/>;
```

## 🔍 SEO & Performance

### SEO Optimizations

#### 1. Metadata Configuration

- **Title templates** for consistent branding
- **Open Graph tags** for social sharing
- **Twitter Cards** for rich previews
- **Canonical URLs** to prevent duplicate content
- **Structured data** (JSON-LD) for rich snippets

#### 2. Core Web Vitals

- **LCP** < 2.5s (Largest Contentful Paint)
- **FID** < 100ms (First Input Delay)
- **CLS** < 0.1 (Cumulative Layout Shift)
- **FCP** < 1.8s (First Contentful Paint)

#### 3. Image Optimization

- **next/image** with automatic WebP/AVIF conversion
- **Priority loading** for above-fold images
- **Lazy loading** for below-fold content
- **Blur placeholders** for smooth loading
- **Responsive sizes** based on viewport

#### 4. Structured Data

```tsx
import { StructuredData } from '@/components/StructuredData';
import { generateWebSiteSchema } from '@/lib/schema';

const schemas = generateWebSiteSchema(baseUrl);
<StructuredData data={schemas} />;
```

Available schemas:

- WebSite (with SearchAction)
- LocalBusiness
- Place
- Product (fuel offers)
- FAQPage
- Article/BlogPosting
- BreadcrumbList

### Performance Best Practices

```tsx
// Priority loading for hero images
<Image
  src="/hero.jpg"
  alt="Hero"
  priority
  quality={90}
/>

// Lazy loading for below-fold images
<Image
  src="/content.jpg"
  alt="Content"
  loading="lazy"
  quality={75}
/>

// Dynamic imports for heavy components
const StationMap = dynamic(() => import('./StationMap'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page
│   ├── stations/[id]/       # Dynamic station pages
│   └── api/                 # API routes
├── components/
│   ├── ui/                  # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── navbar.tsx
│   ├── atoms/               # Atomic design - atoms
│   ├── molecules/           # Atomic design - molecules
│   ├── organisms/           # Atomic design - organisms
│   └── pages/               # Page-level components
├── lib/
│   ├── seo/
│   │   └── metadata.ts      # SEO metadata utilities
│   ├── schema.ts            # JSON-LD structured data
│   └── utils.ts             # Utility functions
├── styles/
│   └── globals.css          # Global styles
└── types/
    └── station.ts           # TypeScript types
```

## 🔐 Environment Variables

Create a `.env.local` file:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=https://petrolpricenearme.com.au

# Google Services
GOOGLE_SITE_VERIFICATION=your_verification_code
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_api_key

# Baserow (Data Source)
BASEROW_URL=your_baserow_url
BASEROW_TOKEN=your_baserow_token

# Analytics
NEXT_PUBLIC_GA_ID=your_ga_id

# Optional
YANDEX_VERIFICATION=your_yandex_code
BING_VERIFICATION=your_bing_code

# Fair Fuel Open Data API (Service Victoria)
FAIRFUEL_API_BASE_URL=https://api.fuel.service.vic.gov.au/open-data/v1
FAIRFUEL_CONSUMER_ID=972955e644e7df65c1cde7aabd2ba64a
FAIRFUEL_USER_AGENT=petrol-price-near-me/2.0.0
FAIRFUEL_CACHE_TTL_MS=900000
FAIRFUEL_REQUEST_TIMEOUT_MS=15000
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically on push

### Docker

```bash
docker build -t petrol-price-near-me .
docker run -p 3000:3000 petrol-price-near-me
```

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run type-check       # TypeScript type checking
npm run format           # Format with Prettier

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:e2e         # E2E tests

# Performance
npm run analyze          # Bundle analysis
npm run lighthouse       # Lighthouse audit
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [Full Documentation](https://docs.petrolpricenearme.com.au)
- **Issues**: [GitHub Issues](https://github.com/yourusername/petrol-price-near-me/issues)
- **Email**: support@petrolpricenearme.com.au

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Lucide](https://lucide.dev/) - Icon library

---

Made with ❤️ by the Petrol Price Near Me team
