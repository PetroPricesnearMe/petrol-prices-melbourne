# System Architecture

## 📐 Architecture Overview

This document describes the architecture of the Petrol Price Near Me application, built with Next.js 15, React 19, and TypeScript.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js App Router (React 19)             │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │         UI Layer (Components)                    │  │ │
│  │  │  • Atoms    • Molecules    • Organisms          │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │         State Management Layer                   │  │ │
│  │  │  • React Query  • Custom Hooks  • Context       │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Server (Edge)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              API Routes (/api/*)                       │ │
│  │  • Stations  • Auth  • Health                         │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Service Layer                                  │ │
│  │  • Business Logic  • Data Transformation             │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Repository Layer                               │ │
│  │  • Data Access  • Caching  • Validation              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Baserow    │  │  NextAuth    │  │   Vercel     │     │
│  │   Database   │  │    Auth      │  │  Analytics   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Architectural Patterns

### 1. Atomic Design Pattern

Components are organized in a hierarchical structure:

```
Components
├── Atoms (Smallest Units)
│   ├── Button
│   ├── Input
│   ├── Card
│   └── Badge
│
├── Molecules (Simple Combinations)
│   ├── SearchBar (Input + Button)
│   └── StationCard (Card + Badge + Text)
│
└── Organisms (Complex Components)
    ├── Hero (Multiple atoms + molecules)
    ├── SearchSection (SearchBar + logic)
    └── FeaturesSection (Multiple cards)
```

### 2. Repository Pattern

Data access is abstracted through repositories:

```
Request → API Route → Service → Repository → External API
                         ↓
                    Transformation
                         ↓
                    Response ← ← ← ← ← ← ←
```

**Benefits:**
- Separation of concerns
- Easy to test
- Swappable data sources
- Consistent data access

### 3. Service Layer Pattern

Business logic is centralized in services:

```
Component → Hook → Service → Repository
                      ↓
              Business Rules
              Validation
              Transformation
```

**Benefits:**
- Reusable business logic
- Single source of truth
- Easy to maintain
- Testable

## 📊 Data Flow

### Client-Side Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook (useStations, etc.)
    ↓
React Query
    ↓
Service Function
    ↓
API Client (Axios)
    ↓
API Route (/api/stations)
    ↓
Repository
    ↓
External Service (Baserow)
    ↓
Response ← ← ← ← ← (reverse flow)
```

### Server-Side Data Flow

```
API Route Request
    ↓
Request Validation
    ↓
Service Layer
    ↓
Business Logic
    ↓
Repository Layer
    ↓
External API Call
    ↓
Data Transformation
    ↓
Response with Typed Data
```

## 🔐 Security Architecture

### Security Layers

```
┌─────────────────────────────────────┐
│     Request from Client             │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│     Next.js Middleware              │
│  • Security Headers                 │
│  • CORS Configuration               │
│  • Rate Limiting (future)           │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│     Authentication (NextAuth)       │
│  • Token Validation                 │
│  • Session Management               │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│     Authorization                   │
│  • Role Checking                    │
│  • Permission Validation            │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│     Input Validation                │
│  • Type Checking                    │
│  • Sanitization                     │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│     Business Logic                  │
└─────────────────────────────────────┘
```

## 🎨 Component Architecture

### Component Hierarchy

```
App Layout
│
├── Providers (Client)
│   ├── QueryClientProvider
│   └── ThemeProvider (future)
│
├── Page
│   ├── Hero (Organism)
│   │   ├── Heading
│   │   ├── Description
│   │   └── CTA Buttons (Atoms)
│   │
│   ├── SearchSection (Organism)
│   │   └── SearchBar (Molecule)
│   │       ├── Input (Atom)
│   │       └── Button (Atom)
│   │
│   └── FeaturesSection (Organism)
│       └── FeatureCard[] (Molecule)
│           ├── Icon
│           ├── Title
│           └── Description
│
├── Analytics
└── SpeedInsights
```

### Component Communication

```
Parent Component
    ↓ (props)
Child Component
    ↑ (callbacks)
Parent Component
```

For global state:
```
Component A → React Query Cache → Component B
```

## 🗄️ Data Architecture

### Type System

```typescript
Core Types (src/types/index.ts)
├── Domain Models
│   ├── PetrolStation
│   ├── FuelPrice
│   └── User
│
├── UI Models
│   ├── SelectOption
│   ├── Toast
│   └── GeolocationState
│
└── API Models
    ├── ApiResponse<T>
    ├── PaginatedResponse<T>
    └── ApiError

Baserow Types (src/types/baserow.ts)
├── BaserowPetrolStation
├── BaserowFuelPrice
└── Option ID Constants
```

### Data Transformation

```
External API Format (Baserow)
         ↓
    Mapping Layer
         ↓
Application Format (TypeScript Types)
         ↓
    Components
```

## 🚀 Performance Architecture

### Optimization Strategies

```
┌─────────────────────────────────────┐
│     Build Time                      │
│  • Code Splitting                   │
│  • Tree Shaking                     │
│  • Bundle Analysis                  │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│     Server Side                     │
│  • Server Components                │
│  • Static Generation                │
│  • ISR (Incremental Static Regen)   │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│     Client Side                     │
│  • React Query Caching              │
│  • Lazy Loading                     │
│  • Image Optimization               │
│  • Prefetching                      │
└─────────────────────────────────────┘
```

### Caching Strategy

```
Browser Cache (HTTP headers)
         ↓
React Query Cache (5 minutes)
         ↓
Server Cache (future: Redis)
         ↓
External API (Baserow)
```

## 🧪 Testing Architecture

### Testing Pyramid

```
        ┌─────┐
        │ E2E │  (Planned)
        └─────┘
      ┌─────────┐
      │Integration│ (API Routes)
      └─────────┘
    ┌─────────────┐
    │   Component  │ (React Components)
    └─────────────┘
  ┌─────────────────┐
  │   Unit Tests     │ (Utils, Hooks, Services)
  └─────────────────┘
```

### Test Structure

```
Component Tests
├── Rendering
├── User Interactions
├── Props Validation
└── Accessibility

Unit Tests
├── Pure Functions
├── Utility Functions
├── Validators
└── Formatters

Integration Tests
├── API Routes
├── Database Operations
└── Service Layer
```

## 📱 Responsive Architecture

### Breakpoint Strategy

```
Mobile First Approach

Base Styles (Mobile)
    ↓
sm: (640px)  Tablet Portrait
    ↓
md: (768px)  Tablet Landscape
    ↓
lg: (1024px) Desktop
    ↓
xl: (1280px) Large Desktop
    ↓
2xl: (1536px) Extra Large
```

### Component Responsiveness

```typescript
// Mobile-first Tailwind classes
className="
  flex flex-col           // Mobile: stack vertically
  md:flex-row            // Tablet+: side by side
  gap-4                  // Mobile: 1rem gap
  md:gap-6               // Tablet+: 1.5rem gap
"
```

## 🔄 State Management

### State Types & Solutions

```
┌─────────────────────────────────────┐
│     Server State                    │
│  Solution: React Query              │
│  • Station data                     │
│  • Fuel prices                      │
│  • User data                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     Local State                     │
│  Solution: useState/useReducer      │
│  • Form inputs                      │
│  • UI toggles                       │
│  • Component state                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     Global State                    │
│  Solution: Context API (future)     │
│  • Theme                            │
│  • User preferences                 │
│  • App settings                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     URL State                       │
│  Solution: Next.js Router           │
│  • Search params                    │
│  • Route params                     │
│  • Hash fragments                   │
└─────────────────────────────────────┘
```

## 🔌 API Architecture

### API Route Structure

```
/api
├── /health              # Health check
│   └── GET
│
├── /stations            # Stations CRUD
│   ├── GET             # List all
│   ├── POST            # Create new
│   ├── /[id]
│   │   ├── GET        # Get one
│   │   ├── PUT        # Update
│   │   └── DELETE     # Delete
│   ├── /nearby
│   │   └── GET        # Find nearby
│   └── /search
│       └── GET        # Search
│
└── /auth               # Authentication
    └── /[...nextauth]
        ├── GET
        └── POST
```

### API Response Format

```typescript
// Success Response
{
  data: T | T[],
  status: 200,
  message?: string
}

// Error Response
{
  message: string,
  status: 4xx | 5xx,
  errors?: Record<string, string[]>
}
```

## 🚢 Deployment Architecture

### Vercel Deployment

```
GitHub Repository
    ↓ (git push)
Vercel CI/CD
    ↓
┌─────────────────────────────────────┐
│     Build Process                   │
│  1. Install dependencies            │
│  2. Type checking                   │
│  3. Linting                         │
│  4. Build application               │
│  5. Generate optimized bundle       │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│     Deployment                      │
│  • Edge Network                     │
│  • Serverless Functions             │
│  • Static Assets (CDN)              │
└─────────────────────────────────────┘
    ↓
Production (Global)
```

## 🎯 Design Decisions

### Why Next.js 15?
- App Router for better performance
- Server Components for reduced JS
- Built-in optimization
- Excellent DX

### Why TypeScript?
- Type safety
- Better IDE support
- Fewer runtime errors
- Self-documenting code

### Why React Query?
- Excellent caching
- Automatic refetching
- Optimistic updates
- Reduced boilerplate

### Why Atomic Design?
- Reusable components
- Consistent UI
- Easy to scale
- Clear hierarchy

### Why Tailwind CSS?
- Utility-first approach
- Consistent design system
- Small bundle size
- Great DX

## 📈 Scalability Considerations

### Horizontal Scaling
- Serverless functions auto-scale
- CDN for static assets
- Database read replicas (future)

### Vertical Scaling
- Code splitting
- Lazy loading
- Image optimization
- Bundle size monitoring

### Code Scalability
- Modular architecture
- Clear separation of concerns
- Reusable utilities
- Type safety

## 🔮 Future Enhancements

### Planned Features
1. **Caching Layer** - Redis for server-side caching
2. **Real-time Updates** - WebSockets for live prices
3. **PWA** - Progressive Web App capabilities
4. **Mobile Apps** - React Native version
5. **Admin Dashboard** - Station management
6. **Analytics** - Enhanced tracking
7. **A/B Testing** - Feature experimentation
8. **Monitoring** - Error tracking & performance

---

This architecture is designed to be:
- **Maintainable** - Clear structure and patterns
- **Scalable** - Can handle growth
- **Testable** - Easy to test at all levels
- **Performant** - Optimized for speed
- **Secure** - Multiple security layers
- **Developer-Friendly** - Great DX


