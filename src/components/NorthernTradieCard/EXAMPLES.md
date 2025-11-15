# NorthernTradieCard Usage Examples

Real-world examples demonstrating various use cases for the NorthernTradieCard component.

## Table of Contents

1. [E-commerce Product Card](#e-commerce-product-card)
2. [Blog Post Card](#blog-post-card)
3. [User Profile Card](#user-profile-card)
4. [Statistics Dashboard Card](#statistics-dashboard-card)
5. [Notification Card](#notification-card)
6. [Pricing Card](#pricing-card)
7. [Image Gallery Card](#image-gallery-card)
8. [Status Card](#status-card)
9. [Call-to-Action Card](#call-to-action-card)
10. [Feature Card](#feature-card)

---

## E-commerce Product Card

Perfect for displaying products in an online store.

```tsx
import { NorthernTradieCard } from '@/components/NorthernTradieCard';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/outline';

function ProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    await addToCart(product.id);
    setIsLoading(false);
  };

  return (
    <NorthernTradieCard
      variant="elevated"
      hoverable
      animated
      state={isLoading ? 'loading' : 'idle'}
      loadingMessage="Adding to cart..."
    >
      <NorthernTradieCard.Media
        src={product.image}
        alt={product.name}
        aspectRatio="4/3"
      />

      <NorthernTradieCard.Header
        title={product.name}
        subtitle={product.category}
        action={
          <button className="hover:text-red-500 p-2 text-gray-500">
            <HeartIcon className="h-5 w-5" />
          </button>
        }
      />

      <NorthernTradieCard.Content>
        <p className="mb-3 text-sm text-gray-600">{product.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
              <span className="text-green-600 text-sm font-semibold">
                {product.discount}% OFF
              </span>
            </>
          )}
        </div>
        <div className="mt-2 flex items-center gap-1">
          <div className="text-yellow-400 flex">
            {'★'.repeat(product.rating)}
            {'☆'.repeat(5 - product.rating)}
          </div>
          <span className="text-sm text-gray-500">
            ({product.reviews} reviews)
          </span>
        </div>
      </NorthernTradieCard.Content>

      <NorthernTradieCard.Footer align="between">
        <span
          className={`text-sm font-medium ${
            product.inStock ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 rounded-lg px-4 py-2 text-white disabled:opacity-50"
        >
          <ShoppingCartIcon className="h-4 w-4" />
          Add to Cart
        </button>
      </NorthernTradieCard.Footer>
    </NorthernTradieCard>
  );
}
```

---

## Blog Post Card

Ideal for blog listings and article previews.

```tsx
function BlogPostCard({ post }) {
  return (
    <NorthernTradieCard
      variant="outlined"
      clickable
      hoverable
      onClick={() => navigate(`/blog/${post.slug}`)}
      animated
    >
      <NorthernTradieCard.Media
        src={post.coverImage}
        alt={post.title}
        aspectRatio="16/9"
      />

      <NorthernTradieCard.Header
        title={post.title}
        subtitle={
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{post.author}</span>
            <span>•</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{post.readTime} min read</span>
          </div>
        }
      />

      <NorthernTradieCard.Content>
        <p className="line-clamp-3 text-gray-700">{post.excerpt}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </NorthernTradieCard.Content>

      <NorthernTradieCard.Footer align="between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <HeartIcon className="h-4 w-4" />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <ChatIcon className="h-4 w-4" />
            {post.comments}
          </span>
        </div>
        <span className="text-blue-600 font-medium">Read More →</span>
      </NorthernTradieCard.Footer>
    </NorthernTradieCard>
  );
}
```

---

## User Profile Card

Great for team member showcases or user directories.

```tsx
function UserProfileCard({ user }) {
  return (
    <NorthernTradieCard variant="filled" size="lg" animated>
      <NorthernTradieCard.Content padded={false}>
        <div className="relative">
          {/* Cover Image */}
          <div className="from-blue-500 to-purple-600 h-24 bg-gradient-to-r" />

          {/* Profile Image */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 transform">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-24 w-24 rounded-full border-4 border-white"
            />
          </div>
        </div>

        <div className="px-6 pb-6 pt-16 text-center">
          <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
          <p className="mb-2 text-gray-600">{user.title}</p>
          <p className="mb-4 text-sm text-gray-500">{user.bio}</p>

          <div className="mb-4 flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {user.followers}
              </div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {user.following}
              </div>
              <div className="text-xs text-gray-500">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {user.posts}
              </div>
              <div className="text-xs text-gray-500">Posts</div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-2 text-white">
              Follow
            </button>
            <button className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50">
              Message
            </button>
          </div>
        </div>
      </NorthernTradieCard.Content>
    </NorthernTradieCard>
  );
}
```

---

## Statistics Dashboard Card

Perfect for analytics dashboards and data visualization.

```tsx
function StatsCard({ title, value, change, trend, icon: Icon }) {
  const isPositive = change >= 0;

  return (
    <NorthernTradieCard variant="elevated" hoverable animated>
      <NorthernTradieCard.Header
        title={title}
        icon={<Icon className="text-blue-600 h-5 w-5" />}
      />

      <NorthernTradieCard.Content>
        <div className="flex items-end justify-between">
          <div>
            <div className="mb-1 text-3xl font-bold text-gray-900">{value}</div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '↑' : '↓'}
              <span>{Math.abs(change)}%</span>
              <span className="font-normal text-gray-500">vs last month</span>
            </div>
          </div>

          {trend && (
            <div className="h-12 w-20">
              {/* Mini chart/sparkline component */}
              <Sparkline data={trend} color={isPositive ? 'green' : 'red'} />
            </div>
          )}
        </div>
      </NorthernTradieCard.Content>
    </NorthernTradieCard>
  );
}
```

---

## Notification Card

For displaying alerts, notifications, and messages.

```tsx
function NotificationCard({ notification, onDismiss, onAction }) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleDismiss = async () => {
    setIsRemoving(true);
    await onDismiss(notification.id);
  };

  const typeStyles = {
    info: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
    },
    success: {
      border: 'border-green-200',
      bg: 'bg-green-50',
      icon: 'text-green-600',
    },
    warning: {
      border: 'border-yellow-200',
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
    },
    error: { border: 'border-red-200', bg: 'bg-red-50', icon: 'text-red-600' },
  };

  const styles = typeStyles[notification.type];

  return (
    <NorthernTradieCard
      variant="outlined"
      className={`${styles.border} ${styles.bg}`}
      animated
      state={isRemoving ? 'loading' : 'idle'}
    >
      <NorthernTradieCard.Header
        icon={<notification.icon className={`h-6 w-6 ${styles.icon}`} />}
        title={notification.title}
        subtitle={formatRelativeTime(notification.timestamp)}
        action={
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-5 w-5" />
          </button>
        }
      />

      <NorthernTradieCard.Content>
        <p className="text-gray-700">{notification.message}</p>
      </NorthernTradieCard.Content>

      {notification.action && (
        <NorthernTradieCard.Footer align="right">
          <button
            onClick={() => onAction(notification)}
            className="text-blue-600 hover:text-blue-700 px-4 py-2 text-sm font-medium"
          >
            {notification.actionLabel}
          </button>
        </NorthernTradieCard.Footer>
      )}
    </NorthernTradieCard>
  );
}
```

---

## Pricing Card

For pricing tables and subscription plans.

```tsx
function PricingCard({ plan, isPopular }) {
  return (
    <NorthernTradieCard
      variant={isPopular ? 'featured' : 'elevated'}
      size="lg"
      shadow={isPopular ? 'xl' : 'md'}
      animated
      className="relative"
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
          <span className="from-blue-600 to-purple-600 rounded-full bg-gradient-to-r px-4 py-1 text-sm font-semibold text-white shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <NorthernTradieCard.Header
        title={plan.name}
        subtitle={plan.description}
      />

      <NorthernTradieCard.Content>
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              ${plan.price}
            </span>
            <span className="text-gray-500">/ {plan.period}</span>
          </div>
          {plan.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${plan.originalPrice}
            </span>
          )}
        </div>

        <ul className="mb-6 space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckIcon className="text-green-600 mt-0.5 h-5 w-5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {plan.limitations && plan.limitations.length > 0 && (
          <ul className="space-y-2 border-t border-gray-200 pt-4">
            {plan.limitations.map((limitation, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-500"
              >
                <XIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        )}
      </NorthernTradieCard.Content>

      <NorthernTradieCard.Footer>
        <button
          className={`w-full rounded-lg py-3 font-semibold transition-colors ${
            isPopular
              ? 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 bg-gradient-to-r text-white'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}
        >
          {plan.ctaText || 'Get Started'}
        </button>
      </NorthernTradieCard.Footer>
    </NorthernTradieCard>
  );
}
```

---

## Image Gallery Card

For image collections and photo galleries.

```tsx
function GalleryCard({ gallery }) {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <NorthernTradieCard variant="elevated" hoverable animated>
      <NorthernTradieCard.Media aspectRatio="4/3">
        <div className="relative h-full w-full">
          <img
            src={gallery.images[currentImage]}
            alt={`${gallery.title} - Image ${currentImage + 1}`}
            className="h-full w-full object-cover"
          />

          {/* Navigation buttons */}
          <button
            onClick={() =>
              setCurrentImage((prev) =>
                prev === 0 ? gallery.images.length - 1 : prev - 1
              )
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white/80 p-2 hover:bg-white"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <button
            onClick={() =>
              setCurrentImage((prev) =>
                prev === gallery.images.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-white/80 p-2 hover:bg-white"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-sm text-white">
            {currentImage + 1} / {gallery.images.length}
          </div>
        </div>
      </NorthernTradieCard.Media>

      <NorthernTradieCard.Header
        title={gallery.title}
        subtitle={`${gallery.images.length} photos`}
      />

      <NorthernTradieCard.Content>
        <p className="text-sm text-gray-600">{gallery.description}</p>

        {/* Thumbnail strip */}
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {gallery.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 ${
                index === currentImage
                  ? 'border-blue-600'
                  : 'border-transparent'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </NorthernTradieCard.Content>
    </NorthernTradieCard>
  );
}
```

---

## Status Card

For system status updates and service monitoring.

```tsx
function StatusCard({ service }) {
  const statusConfig = {
    operational: {
      color: 'text-green-600',
      bg: 'bg-green-100',
      label: 'Operational',
      icon: CheckCircleIcon,
    },
    degraded: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      label: 'Degraded Performance',
      icon: ExclamationIcon,
    },
    outage: {
      color: 'text-red-600',
      bg: 'bg-red-100',
      label: 'Outage',
      icon: XCircleIcon,
    },
  };

  const status = statusConfig[service.status];
  const StatusIcon = status.icon;

  return (
    <NorthernTradieCard variant="outlined" animated>
      <NorthernTradieCard.Header
        title={service.name}
        icon={<StatusIcon className={`h-6 w-6 ${status.color}`} />}
        action={
          <span
            className={`px-3 py-1 text-sm font-medium ${status.color} ${status.bg} rounded-full`}
          >
            {status.label}
          </span>
        }
      />

      <NorthernTradieCard.Content>
        <p className="mb-4 text-sm text-gray-600">{service.description}</p>

        <div className="grid grid-cols-3 gap-4 border-t border-gray-200 py-4">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {service.uptime}%
            </div>
            <div className="text-xs text-gray-500">Uptime</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {service.responseTime}ms
            </div>
            <div className="text-xs text-gray-500">Response Time</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {service.requests}k
            </div>
            <div className="text-xs text-gray-500">Requests/day</div>
          </div>
        </div>

        {service.lastIncident && (
          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            <div className="text-sm font-medium text-gray-900">
              Last Incident
            </div>
            <div className="mt-1 text-sm text-gray-600">
              {service.lastIncident.title}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {formatRelativeTime(service.lastIncident.date)}
            </div>
          </div>
        )}
      </NorthernTradieCard.Content>

      <NorthernTradieCard.Footer align="right">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View Details →
        </button>
      </NorthernTradieCard.Footer>
    </NorthernTradieCard>
  );
}
```

---

## Call-to-Action Card

For promotional content and conversion-focused cards.

```tsx
function CTACard({ title, description, imageSrc, ctaText, onAction }) {
  return (
    <NorthernTradieCard
      variant="featured"
      size="xl"
      shadow="xl"
      animated
      className="overflow-hidden"
    >
      <div className="relative">
        <NorthernTradieCard.Media
          src={imageSrc}
          alt={title}
          aspectRatio="21/9"
        />
        <div className="from-blue-600/90 to-purple-600/90 absolute inset-0 bg-gradient-to-r" />
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
          <div>
            <h2 className="mb-4 text-4xl font-bold text-white">{title}</h2>
            <p className="mb-8 max-w-2xl text-xl text-white/90">
              {description}
            </p>
            <button
              onClick={onAction}
              className="text-blue-600 transform rounded-lg bg-white px-8 py-4 text-lg font-semibold transition-transform hover:scale-105 hover:bg-gray-100"
            >
              {ctaText}
            </button>
          </div>
        </div>
      </div>
    </NorthernTradieCard>
  );
}
```

---

## Feature Card

For showcasing features and capabilities.

```tsx
function FeatureCard({ feature, index }) {
  return (
    <NorthernTradieCard
      variant="outlined"
      hoverable
      animated
      animationDelay={index * 100}
    >
      <NorthernTradieCard.Content>
        <div className="flex flex-col items-center text-center">
          <div className="from-blue-500 to-purple-600 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br">
            <feature.icon className="h-8 w-8 text-white" />
          </div>

          <h3 className="mb-2 text-xl font-bold text-gray-900">
            {feature.title}
          </h3>

          <p className="mb-4 text-gray-600">{feature.description}</p>

          <ul className="w-full space-y-2 text-left text-sm text-gray-700">
            {feature.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </NorthernTradieCard.Content>

      <NorthernTradieCard.Footer align="center">
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          Learn More →
        </button>
      </NorthernTradieCard.Footer>
    </NorthernTradieCard>
  );
}
```

---

These examples demonstrate the versatility and power of the NorthernTradieCard component across various use cases and industries.
