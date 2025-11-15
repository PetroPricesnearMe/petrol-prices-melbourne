# Project Structure Documentation

## Overview

This is an enterprise-level Next.js 15 application built with React 19, TypeScript, and Tailwind CSS following modern best practices and atomic design principles.

## Technology Stack

### Core

- **Next.js 15**: React framework with App Router
- **React 19**: UI library with latest features
- **TypeScript 5.3**: Type-safe development
- **Tailwind CSS 3.4**: Utility-first CSS framework

### State Management & Data Fetching

- **TanStack Query (React Query)**: Server state management
- **Axios**: HTTP client

### UI & Components

- **Atomic Design Pattern**: Scalable component architecture
- **Framer Motion**: Animation library
- **React Leaflet**: Map integration

### Code Quality

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Lint-staged**: Pre-commit linting

### Testing

- **Jest**: Testing framework
- **React Testing Library**: Component testing

### Authentication

- **NextAuth.js**: Authentication solution

## Folder Structure

```
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   ├── stations/        # Station endpoints
│   │   │   └── health/          # Health check
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── loading.tsx          # Loading UI
│   │   ├── error.tsx            # Error UI
│   │   ├── not-found.tsx        # 404 page
│   │   └── providers.tsx        # Client providers
│   │
│   ├── components/              # React components (Atomic Design)
│   │   ├── atoms/               # Basic building blocks
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   └── Badge/
│   │   ├── molecules/           # Combinations of atoms
│   │   │   ├── SearchBar/
│   │   │   └── StationCard/
│   │   └── organisms/           # Complex components
│   │       ├── Hero/
│   │       ├── SearchSection/
│   │       └── FeaturesSection/
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useGeolocation.ts
│   │   ├── useStations.ts
│   │   └── index.ts
│   │
│   ├── lib/                     # Library code
│   │   ├── api/                 # API client
│   │   │   └── client.ts
│   │   ├── repositories/        # Data access layer
│   │   │   └── stations.repository.ts
│   │   └── services/            # Business logic
│   │       └── baserow.service.ts
│   │
│   ├── services/                # External services
│   │   └── stations.service.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── index.ts             # Core types
│   │   └── baserow.ts           # Baserow-specific types
│   │
│   ├── utils/                   # Utility functions
│   │   ├── cn.ts                # Class name merger
│   │   ├── formatters.ts        # Formatting utilities
│   │   ├── validators.ts        # Validation utilities
│   │   └── geo.ts               # Geolocation utilities
│   │
│   ├── config/                  # Configuration
│   │   └── constants.ts         # App constants
│   │
│   ├── styles/                  # Global styles
│   │   └── globals.css          # Global CSS with Tailwind
│   │
│   └── middleware.ts            # Next.js middleware
│
├── public/                      # Static assets
│   ├── images/
│   ├── favicon.ico
│   └── manifest.json
│
├── .husky/                      # Git hooks
├── node_modules/                # Dependencies
│
├── Configuration Files
├── .env.example                 # Environment variables template
├── .eslintrc.json              # ESLint configuration
├── .prettierrc.json            # Prettier configuration
├── .prettierignore             # Prettier ignore patterns
├── .gitignore                  # Git ignore patterns
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── jest.config.js              # Jest configuration
├── jest.setup.js               # Jest setup
├── package.json                # Dependencies and scripts
└── README.md                   # Project README
```

## Architecture Patterns

### 1. Atomic Design

Components are organized in three levels:

- **Atoms**: Basic UI elements (Button, Input, Card, Badge)
- **Molecules**: Simple combinations (SearchBar, StationCard)
- **Organisms**: Complex components (Hero, SearchSection)

### 2. Repository Pattern

Data access is separated into repositories:

```typescript
API → Service → Repository → Component
```

### 3. Separation of Concerns

- **Components**: UI rendering only
- **Hooks**: State and side effects
- **Services**: Business logic
- **Repositories**: Data access
- **Utils**: Pure functions

### 4. Type Safety

- Strict TypeScript configuration
- Comprehensive type definitions
- Type guards for runtime safety

## Key Features

### Performance Optimizations

- ✅ Image optimization with Next.js Image
- ✅ Code splitting and lazy loading
- ✅ Server and client component separation
- ✅ React Query for caching
- ✅ Bundle analysis available
- ✅ SWC minification

### Security

- ✅ Security headers in middleware
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ XSS protection
- ✅ CSRF protection (NextAuth)

### Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management

### SEO

- ✅ Meta tags configuration
- ✅ OpenGraph tags
- ✅ Twitter cards
- ✅ Structured data ready
- ✅ Sitemap support
- ✅ robots.txt

## Environment Variables

Required environment variables (see `.env.example`):

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database (Baserow)
BASEROW_API_URL=https://api.baserow.io
BASEROW_API_TOKEN=your_token
BASEROW_PETROL_STATIONS_TABLE_ID=623329
BASEROW_FUEL_PRICES_TABLE_ID=623330

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

# Analytics (Optional)
NEXT_PUBLIC_GA_TRACKING_ID=GA-XXXXX
```

## Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier
npm run format:check    # Check formatting
npm run type-check      # TypeScript type checking

# Testing
npm run test            # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Analysis
npm run analyze         # Bundle analysis
```

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

## Component Usage Examples

### Button Component

```tsx
import { Button } from '@/components/atoms/Button';

<Button variant="primary" size="md">
  Click me
</Button>;
```

### Using Hooks

```tsx
import { useStations } from '@/hooks';

const MyComponent = () => {
  const { data, isLoading, error } = useStations();
  // ...
};
```

### API Service

```tsx
import { stationsService } from '@/services/stations.service';

const stations = await stationsService.getStations({
  fuelType: 'unleaded',
  maxDistance: 10,
});
```

## Best Practices

1. **Always use TypeScript types** - No `any` types
2. **Follow atomic design** - Place components in correct folders
3. **Use custom hooks** - Extract reusable logic
4. **Keep components small** - Single responsibility
5. **Write tests** - Aim for 70%+ coverage
6. **Document complex logic** - Add comments
7. **Use semantic HTML** - Accessibility first
8. **Optimize images** - Use Next.js Image component
9. **Error handling** - Always handle errors gracefully
10. **Performance** - Monitor with Vercel Analytics

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Docker

```bash
docker build -t petrol-price-app .
docker run -p 3000:3000 petrol-price-app
```

### Manual

```bash
npm run build
npm run start
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Commit with conventional commits
5. Push and create PR

## Support

For issues and questions, please create a GitHub issue or contact the development team.

---

**Built with ❤️ using Next.js 15, React 19, and TypeScript**
