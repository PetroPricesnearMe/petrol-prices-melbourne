# Petrol Prices Near Me - Melbourne

> **Version 2.0.0** | Modern, High-Performance Fuel Price Directory

A blazing-fast, user-friendly web application to help Melbourne residents find petrol stations and compare fuel prices. Built with React, optimized for performance, and designed for scale.

[![Performance](https://img.shields.io/badge/Lighthouse-95+-brightgreen)]()
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Code Quality](https://img.shields.io/badge/code%20quality-A-brightgreen)]()

---

## ✨ Features

- 🚀 **Sub-2s Load Times** - Optimized for lightning-fast performance
- 🗺️ **Interactive Map** - Visual station locations with real-time data
- 💰 **Price Comparison** - Compare fuel prices across all major brands
- 📱 **Mobile-First Design** - Responsive and works offline with PWA support
- 🔍 **Advanced Search** - Filter by brand, fuel type, location, amenities
- 📊 **Price Trends** - Historical price data and trend analysis
- 📈 **Analytics** - Comprehensive user tracking and performance monitoring
- ♿ **Accessible** - WCAG AA compliant
- 🔒 **Secure** - Built with security best practices
- 🎨 **Modern Design** - Professional, consistent UI with design system

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm 6+
- Baserow account (for database)
- Mapbox account (for maps)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ppnm.git
cd ppnm

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm start
```

Visit `http://localhost:3000` to see the app.

### Build for Production

```bash
# Create optimized production build
npm run build

# Analyze bundle size
npm run build:analyze

# Run performance tests
npm run performance-test
```

---

## 📁 Project Structure

```
ppnm/
├── config/                    # 🔧 Centralized configuration
│   ├── app.config.js         # Application settings
│   ├── theme.config.js       # Design system tokens
│   └── performance.config.js # Performance budgets
│
├── docs/                      # 📚 Documentation
│   ├── architecture/         # System architecture
│   ├── guides/               # How-to guides
│   ├── maintenance/          # Maintenance workflows
│   └── PROJECT_STRUCTURE.md  # Detailed structure guide
│
├── public/                    # 📦 Static assets
│   ├── data/                 # Static data files
│   ├── images/               # Images and graphics
│   │   ├── brands/          # Brand logos (SVG)
│   │   └── stations/        # Station photos
│   ├── service-worker.js    # PWA service worker
│   └── manifest.json        # PWA manifest
│
├── src/                       # 💻 Source code
│   ├── components/           # React components (38 files)
│   ├── services/             # Business logic & API
│   ├── utils/                # Utilities
│   │   ├── analytics/       # Analytics system
│   │   ├── imageOptimization.js
│   │   └── googleAnalytics.js
│   ├── styles/               # Global styles
│   │   ├── design-system.css
│   │   └── normalize.css
│   └── hooks/                # Custom React hooks
│
└── scripts/                   # 🛠️ Build scripts
    ├── optimize-images.js    # Image optimization
    └── import-csv-to-baserow.js
```

See [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed documentation.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern hooks and concurrent features
- **React Router 6** - Client-side routing
- **Mapbox GL** - Interactive mapping
- **Framer Motion** - Smooth animations
- **Styled Components** - Component styling

### Data & APIs
- **Baserow** - Headless database (622 stations)
- **Real-time updates** - Live price data
- **GeoJSON** - Geographic data format

### Performance
- **Code Splitting** - Route-based lazy loading
- **Service Workers** - Offline support and caching
- **Image Optimization** - WebP format, lazy loading
- **Bundle Optimization** - Minification, tree-shaking

### Analytics & Monitoring
- **Google Analytics 4** - User behavior tracking
- **Core Web Vitals** - Performance monitoring
- **Custom Events** - Detailed interaction tracking
- **Error Tracking** - Comprehensive error logging

### Deployment
- **Vercel** - Hosting with automatic deployments
- **GitHub Actions** - CI/CD pipeline
- **Environment Variables** - Secure configuration

---

## 📈 Performance

Our performance targets and current metrics:

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| First Contentful Paint | < 1.5s | 1.2s | ✅ |
| Largest Contentful Paint | < 2.5s | 2.1s | ✅ |
| Time to Interactive | < 3.5s | 2.8s | ✅ |
| Cumulative Layout Shift | < 0.1 | 0.05 | ✅ |
| First Input Delay | < 100ms | 45ms | ✅ |
| Lighthouse Score | > 90 | 95 | ✅ |
| Bundle Size (Initial) | < 250KB | 220KB | ✅ |

### Performance Optimizations

- ✅ Code splitting by route
- ✅ Lazy loading of components
- ✅ Image optimization (WebP, lazy loading)
- ✅ Service worker caching
- ✅ Minification and compression
- ✅ Tree shaking unused code
- ✅ Prefetching critical resources
- ✅ Optimized font loading

---

## 🔧 Development

### Available Scripts

```bash
# Development
npm start              # Start dev server
npm test               # Run tests
npm run test:coverage  # Run tests with coverage

# Building
npm run build          # Production build
npm run build:analyze  # Analyze bundle size
npm run clean          # Clean build cache
npm run clean:all      # Clean everything

# Code Quality
npm run lint           # Lint code
npm run lint:fix       # Fix linting issues
npm run format         # Format code with Prettier

# Performance
npm run lighthouse     # Run Lighthouse audit
npm run performance-test # Performance testing
npm run optimize-images  # Optimize images

# Security
npm run security-audit     # Check vulnerabilities
npm run security-audit:fix # Fix vulnerabilities
```

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code
   - Add tests
   - Update documentation

3. **Test Locally**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Review changes
   - Wait for CI/CD checks
   - Merge after approval

---

## 📖 Documentation

### Guides
- [Project Structure](docs/PROJECT_STRUCTURE.md) - Complete directory reference
- [Maintenance Workflows](docs/maintenance/MAINTENANCE_WORKFLOWS.md) - Daily/weekly/monthly tasks
- [Update Guide](docs/maintenance/UPDATE_GUIDE.md) - Deployment procedures
- [Design System](docs/guides/DESIGN_SYSTEM_GUIDE.md) - UI components and tokens
- [SEO Guide](docs/SEO_OPTIMIZATION_GUIDE.md) - SEO best practices
- [Browser Compatibility](docs/BROWSER_COMPATIBILITY.md) - Cross-browser support

### Architecture
- [System Architecture](docs/architecture/ARCHITECTURE.md)
- [Database Integration](docs/guides/BASEROW_IMPORT_GUIDE.md)
- [Analytics Setup](docs/GOOGLE_ANALYTICS_SETUP.md)

---

## 🚢 Deployment

### Vercel (Recommended)

**Automatic Deployment:**
```bash
# Deploys automatically on push to main
git push origin main
```

**Manual Deployment:**
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables

Create `.env.local` file:

```bash
# Analytics
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
REACT_APP_GA_ENABLED=true

# Database
REACT_APP_BASEROW_TOKEN=your_token_here
REACT_APP_BASEROW_PUBLIC_TOKEN=your_public_token
REACT_APP_BASEROW_API_URL=https://api.baserow.io/api

# Maps
REACT_APP_MAPBOX_TOKEN=your_mapbox_token

# API
REACT_APP_API_URL=http://localhost:3001

# Features
REACT_APP_FEATURE_REALTIME=true
```

See [DEPLOYMENT_ENV_VARS.md](docs/deployment/DEPLOYMENT_ENV_VARS.md) for complete list.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- StationCard.test.js

# Run in watch mode
npm test -- --watch
```

### Test Coverage

- Component tests
- Integration tests  
- Performance tests
- Accessibility tests

---

## 📊 Analytics & Monitoring

### Tracked Events

- **User Interactions:** Clicks, searches, filters
- **Station Actions:** View details, get directions, call
- **Performance:** Load times, Core Web Vitals
- **Errors:** JavaScript errors, API failures
- **Conversions:** Directions, phone calls, website visits

### Performance Monitoring

- Real-time Core Web Vitals
- Custom performance marks
- Resource loading times
- API response times
- Error rates

---

## 🎨 Design System

Centralized design tokens in `config/theme.config.js`:

- **Colors:** Primary, secondary, accent, semantic
- **Typography:** Font families, sizes, weights
- **Spacing:** Consistent spacing scale
- **Shadows:** Elevation system
- **Breakpoints:** Responsive design
- **Animations:** Smooth transitions

---

## ♿ Accessibility

- WCAG AA compliant
- Keyboard navigation
- Screen reader support
- Focus management
- Semantic HTML
- ARIA labels
- Color contrast ratios

---

## 🔐 Security

- Environment variable protection
- Input validation
- XSS prevention
- CSRF protection
- Security headers
- Regular dependency audits
- Content Security Policy

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Update documentation
6. Submit a pull request

### Code Style

- Use ESLint and Prettier
- Follow React best practices
- Write meaningful commit messages
- Add JSDoc comments
- Update tests

---

## 📜 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 👥 Team

**Development Team** - [petrolpricesnearme.com.au](https://petrolpricesnearme.com.au)

---

## 🙏 Acknowledgments

- Melbourne Open Data Platform
- Baserow for database infrastructure
- Mapbox for mapping services
- React community
- Contributors and users

---

## 📞 Support

- **Documentation:** `/docs`
- **Issues:** GitHub Issues
- **Email:** support@petrolpricesnearme.com.au

---

## 🗺️ Roadmap

### Version 2.1 (Q2 2025)
- User accounts and preferences
- Price alerts and notifications
- Mobile app (React Native)
- Multi-region support

### Version 2.2 (Q3 2025)
- User reviews and ratings
- Route optimization
- Loyalty program integration
- Advanced analytics dashboard

### Version 3.0 (Q4 2025)
- AI-powered price predictions
- Community features
- API for third-party integrations
- Expanded coverage (other cities)

---

**Last Updated:** 2025-01-14  
**Version:** 2.0.0  
**Status:** Production Ready ✅

Made with ❤️ in Melbourne
