# Design System - Component Examples

Real-world examples of design system implementation.

## 📄 Page Layouts

### Landing Page

```jsx
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
        {/* Navigation */}
        <nav className="absolute left-0 right-0 top-0 z-sticky">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between md:h-20">
              <div className="flex items-center gap-8">
                <a href="/" className="text-2xl font-bold text-white">
                  PetrolPrices
                </a>
                <div className="hidden gap-6 md:flex">
                  <a
                    href="/directory"
                    className="text-white/90 transition-colors hover:text-white"
                  >
                    Directory
                  </a>
                  <a
                    href="/about"
                    className="text-white/90 transition-colors hover:text-white"
                  >
                    About
                  </a>
                  <a
                    href="/faq"
                    className="text-white/90 transition-colors hover:text-white"
                  >
                    FAQ
                  </a>
                </div>
              </div>
              <ThemeToggle variant="button" className="focus-ring-white" />
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 animate-fade-in text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
            Find the Best Petrol Prices Near You
          </h1>
          <p className="mx-auto mb-8 max-w-3xl animate-fade-in text-xl text-white/90 md:text-2xl">
            Compare fuel prices from thousands of stations across Australia
          </p>
          <div className="flex animate-fade-in flex-col justify-center gap-4 sm:flex-row">
            <button className="btn-lg btn bg-white text-primary-600 shadow-xl transition-all hover:-translate-y-1 hover:bg-gray-50 hover:shadow-2xl">
              Find Stations
            </button>
            <button className="btn-lg btn border-2 border-white bg-transparent text-white focus-ring-white hover:bg-white/10">
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="h-6 w-6 text-white/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 dark:bg-gray-900 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl">
              Why Choose Us?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              We help you save money with real-time fuel price comparisons
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: '📍',
                title: 'Location-Based',
                description:
                  'Find stations near you with accurate real-time locations',
              },
              {
                icon: '💰',
                title: 'Best Prices',
                description: 'Compare prices across all fuel types and brands',
              },
              {
                icon: '⚡',
                title: 'Real-Time Updates',
                description: 'Get the latest prices updated throughout the day',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="card transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="card-body text-center">
                  <div className="mb-4 text-5xl">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-secondary-600 to-secondary-700 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to Save Money?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
            Join thousands of Australians finding the best fuel prices
          </p>
          <button className="btn-lg btn bg-white text-secondary-600 shadow-xl hover:-translate-y-1 hover:bg-gray-50 hover:shadow-2xl">
            Get Started Now
          </button>
        </div>
      </section>
    </>
  );
}
```

### Directory Page

```jsx
export default function DirectoryPage() {
  const [selectedFuelType, setSelectedFuelType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
            Station Directory
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse all petrol stations across Australia
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-sticky border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search */}
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search stations
              </label>
              <input
                id="search"
                type="search"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus-ring dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            {/* Fuel Type Filter */}
            <div className="md:w-48">
              <label htmlFor="fuel-type" className="sr-only">
                Fuel type
              </label>
              <select
                id="fuel-type"
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 focus-ring dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="all">All Fuels</option>
                <option value="unleaded">Unleaded</option>
                <option value="diesel">Diesel</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Station Card Example */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card transition-all hover:shadow-xl">
              <div className="card-body">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Shell Station {i}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      123 Main Street, Sydney NSW
                    </p>
                  </div>
                  <span className="badge badge-success">Open</span>
                </div>

                {/* Fuel Prices */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Unleaded
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      $1.85/L
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Diesel
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      $1.92/L
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="btn-primary btn-sm btn flex-1">
                    View Details
                  </button>
                  <button
                    className="btn-ghost btn-sm btn"
                    aria-label="Get directions"
                  >
                    🗺️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <button className="btn-ghost btn-sm btn" disabled>
            Previous
          </button>
          <button className="btn-primary btn-sm btn">1</button>
          <button className="btn-ghost btn-sm btn">2</button>
          <button className="btn-ghost btn-sm btn">3</button>
          <button className="btn-ghost btn-sm btn">Next</button>
        </div>
      </div>
    </div>
  );
}
```

## 🎨 Component Patterns

### Price Display Card

```jsx
function PriceCard({ fuelType, price, trend, lastUpdated }) {
  return (
    <div className="card bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="card-body">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {fuelType}
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ${price}
              </span>
              <span className="text-lg text-gray-600 dark:text-gray-400">
                /L
              </span>
            </div>
          </div>
          {trend === 'down' ? (
            <span className="badge badge-success">↓ Decreased</span>
          ) : trend === 'up' ? (
            <span className="badge badge-error">↑ Increased</span>
          ) : (
            <span className="badge badge-primary">→ Stable</span>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500">
          Updated {lastUpdated}
        </div>
      </div>
    </div>
  );
}
```

### Station Card with Map

```jsx
function StationCard({ station }) {
  return (
    <div className="card overflow-hidden">
      {/* Map Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={station.mapThumbnail}
          alt={`Map location of ${station.name}`}
          className="h-full w-full object-cover"
        />
        <button
          className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-lg transition-shadow focus-ring hover:shadow-xl dark:bg-gray-800"
          aria-label="Add to favorites"
        >
          ❤️
        </button>
      </div>

      {/* Card Content */}
      <div className="card-body">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {station.name}
            </h3>
            <p className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <span>📍</span>
              {station.address}
            </p>
          </div>
          <span
            className={`badge ${station.isOpen ? 'badge-success' : 'badge-error'}`}
          >
            {station.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        {/* Amenities */}
        <div className="mb-4 flex flex-wrap gap-2">
          {station.amenities.map((amenity, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-primary btn-sm btn">View Prices</button>
          <button className="btn-outline btn-sm btn">Directions</button>
        </div>
      </div>
    </div>
  );
}
```

### Loading Skeleton

```jsx
function LoadingSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="card-body">
        <div className="mb-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-3 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="space-y-2">
          <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
}
```

### Toast Notification

```jsx
function Toast({ type = 'info', message, onClose }) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const styles = {
    success:
      'bg-success-50 dark:bg-success-900/20 border-success-500 text-success-700 dark:text-success-300',
    error:
      'bg-error-50 dark:bg-error-900/20 border-error-500 text-error-700 dark:text-error-300',
    warning:
      'bg-warning-50 dark:bg-warning-900/20 border-warning-500 text-warning-700 dark:text-warning-300',
    info: 'bg-info-50 dark:bg-info-900/20 border-info-500 text-info-700 dark:text-info-300',
  };

  return (
    <div
      className={`backdrop-blur-glass fixed right-4 top-4 z-toast w-full max-w-sm animate-slide-in rounded-lg border-l-4 px-4 py-3 shadow-xl ${styles[type]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">
          {icons[type]}
        </span>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="text-current transition-opacity focus-ring hover:opacity-70"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
```

### Modal Dialog

```jsx
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-modal-backdrop flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-lg animate-scale-in rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <h2
            id="modal-title"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors focus-ring hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close modal"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
          <button className="btn-ghost btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary btn" onClick={onClose}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
```

## 🎯 Form Examples

### Login Form

```jsx
function LoginForm() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="card w-full max-w-md">
        <div className="card-body">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            Sign In
          </h2>

          <form className="space-y-4">
            {/* Email */}
            <div className="input-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="focus-ring"
                required
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password">Password</label>
                <a href="/forgot-password" className="link text-sm">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="focus-ring"
                required
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="rounded focus-ring"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-600 dark:text-gray-400"
              >
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary btn w-full">
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="divider" />

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <a href="/signup" className="link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 💡 Tips

1. **Consistency**: Use the same patterns across your application
2. **Accessibility**: Always include ARIA labels and keyboard navigation
3. **Performance**: Lazy load images and heavy components
4. **Responsive**: Test on multiple screen sizes
5. **Dark Mode**: Always define dark mode variants
6. **Loading States**: Show skeleton loaders while fetching data
7. **Error States**: Provide clear error messages
8. **Empty States**: Design for no-content scenarios

---

For more examples, check the [full Design System documentation](./DESIGN_SYSTEM.md).
