# Petrol Price Near Me 🚗⛽

> Find the cheapest petrol stations near you in Australia with real-time fuel prices.

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## ✨ Features

- 🗺️ **Interactive Map** - Find stations on an interactive map
- 💰 **Price Comparison** - Compare fuel prices across different stations
- 📍 **Location-Based** - Find stations near your current location
- ⛽ **Multiple Fuel Types** - Unleaded, Premium, Diesel, LPG, and more
- 🔍 **Advanced Search** - Filter by price, distance, and brand
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Real-Time Data** - Up-to-date fuel prices
- 🌙 **Dark Mode** - Easy on the eyes
- ♿ **Accessible** - WCAG 2.1 AA compliant
- 🚀 **Fast Performance** - Optimized for speed

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **State Management**: TanStack Query (React Query)
- **Maps**: React Leaflet
- **Authentication**: NextAuth.js 5
- **API Client**: Axios
- **Animations**: Framer Motion
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier
- **Database**: Baserow (API)

## 📦 Installation

### Prerequisites

- Node.js 18.17 or higher
- npm 9.0 or higher

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/petrol-price-near-me.git
   cd petrol-price-near-me
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   BASEROW_API_TOKEN=your_baserow_token
   BASEROW_PETROL_STATIONS_TABLE_ID=623329
   BASEROW_FUEL_PRICES_TABLE_ID=623330
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types |
| `npm run test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run analyze` | Analyze bundle size |

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components (Atomic Design)
│   │   ├── atoms/       # Basic UI components
│   │   ├── molecules/   # Composite components
│   │   └── organisms/   # Complex components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Library code
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── styles/          # Global styles
├── public/              # Static assets
└── ...config files
```

For detailed structure documentation, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

## 🏗️ Architecture

This project follows enterprise-level architecture patterns:

### Atomic Design Pattern
- **Atoms**: Button, Input, Card, Badge
- **Molecules**: SearchBar, StationCard
- **Organisms**: Hero, SearchSection, FeaturesSection

### Layered Architecture
```
UI Layer (Components)
    ↓
Hooks Layer (State Management)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
API Layer (External Services)
```

### Key Principles
- ✅ Separation of Concerns
- ✅ Single Responsibility
- ✅ DRY (Don't Repeat Yourself)
- ✅ Type Safety
- ✅ Testability

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |
| `BASEROW_API_TOKEN` | Baserow API token | Yes |
| `BASEROW_PETROL_STATIONS_TABLE_ID` | Stations table ID | Yes |
| `BASEROW_FUEL_PRICES_TABLE_ID` | Fuel prices table ID | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret | No* |
| `NEXT_PUBLIC_GA_TRACKING_ID` | Google Analytics ID | No |

\* Required if authentication is enabled

## 🧪 Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/petrol-price-near-me)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Docker

```bash
docker build -t petrol-price-app .
docker run -p 3000:3000 petrol-price-app
```

### Manual Deployment

```bash
npm run build
npm run start
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

This application follows WCAG 2.1 AA standards:

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast compliance
- ✅ Focus indicators

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and analytics
- Baserow for the database solution
- OpenStreetMap for map tiles
- All contributors and users

## 📞 Support

- 📧 Email: contact@petrolpricenearme.com.au
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/petrol-price-near-me/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/petrol-price-near-me/discussions)

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Price alerts and notifications
- [ ] User accounts and favorites
- [ ] Price history and trends
- [ ] API for developers
- [ ] Integration with fuel card providers

---

**Made with ❤️ in Australia**
