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
          <button className="p-2 text-gray-500 hover:text-red-500">
            <HeartIcon className="w-5 h-5" />
          </button>
        }
      />
      
      <NorthernTradieCard.Content>
        <p className="text-gray-600 text-sm mb-3">
          {product.description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
              <span className="text-sm font-semibold text-green-600">
                {product.discount}% OFF
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 mt-2">
          <div className="flex text-yellow-400">
            {'★'.repeat(product.rating)}
            {'☆'.repeat(5 - product.rating)}
          </div>
          <span className="text-sm text-gray-500">
            ({product.reviews} reviews)
          </span>
        </div>
      </NorthernTradieCard.Content>
      
      <NorthernTradieCard.Footer align="between">
        <span className={`text-sm font-medium ${
          product.inStock ? 'text-green-600' : 'text-red-600'
        }`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <ShoppingCartIcon className="w-4 h-4" />
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
        <p className="text-gray-700 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </NorthernTradieCard.Content>
      
      <NorthernTradieCard.Footer align="between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <HeartIcon className="w-4 h-4" />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <ChatIcon className="w-4 h-4" />
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
    <NorthernTradieCard
      variant="filled"
      size="lg"
      animated
    >
      <NorthernTradieCard.Content padded={false}>
        <div className="relative">
          {/* Cover Image */}
          <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600" />
          
          {/* Profile Image */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
          </div>
        </div>
        
        <div className="pt-16 px-6 pb-6 text-center">
          <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
          <p className="text-gray-600 mb-2">{user.title}</p>
          <p className="text-sm text-gray-500 mb-4">{user.bio}</p>
          
          <div className="flex justify-center gap-6 mb-4">
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
          
          <div className="flex gap-2 justify-center">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Follow
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
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
    <NorthernTradieCard
      variant="elevated"
      hoverable
      animated
    >
      <NorthernTradieCard.Header
        title={title}
        icon={<Icon className="w-5 h-5 text-blue-600" />}
      />
      
      <NorthernTradieCard.Content>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {value}
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? '↑' : '↓'}
              <span>{Math.abs(change)}%</span>
              <span className="text-gray-500 font-normal">vs last month</span>
            </div>
          </div>
          
          {trend && (
            <div className="w-20 h-12">
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
    info: { border: 'border-blue-200', bg: 'bg-blue-50', icon: 'text-blue-600' },
    success: { border: 'border-green-200', bg: 'bg-green-50', icon: 'text-green-600' },
    warning: { border: 'border-yellow-200', bg: 'bg-yellow-50', icon: 'text-yellow-600' },
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
        icon={
          <notification.icon className={`w-6 h-6 ${styles.icon}`} />
        }
        title={notification.title}
        subtitle={formatRelativeTime(notification.timestamp)}
        action={
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <XIcon className="w-5 h-5" />
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
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
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
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
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
        
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        {plan.limitations && plan.limitations.length > 0 && (
          <ul className="space-y-2 pt-4 border-t border-gray-200">
            {plan.limitations.map((limitation, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-500">
                <XIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        )}
      </NorthernTradieCard.Content>
      
      <NorthernTradieCard.Footer>
        <button
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            isPopular
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
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
    <NorthernTradieCard
      variant="elevated"
      hoverable
      animated
    >
      <NorthernTradieCard.Media aspectRatio="4/3">
        <div className="relative w-full h-full">
          <img
            src={gallery.images[currentImage]}
            alt={`${gallery.title} - Image ${currentImage + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation buttons */}
          <button
            onClick={() => setCurrentImage((prev) => 
              prev === 0 ? gallery.images.length - 1 : prev - 1
            )}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentImage((prev) => 
              prev === gallery.images.length - 1 ? 0 : prev + 1
            )}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
          
          {/* Image counter */}
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-sm rounded">
            {currentImage + 1} / {gallery.images.length}
          </div>
        </div>
      </NorthernTradieCard.Media>
      
      <NorthernTradieCard.Header
        title={gallery.title}
        subtitle={`${gallery.images.length} photos`}
      />
      
      <NorthernTradieCard.Content>
        <p className="text-gray-600 text-sm">{gallery.description}</p>
        
        {/* Thumbnail strip */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {gallery.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                index === currentImage
                  ? 'border-blue-600'
                  : 'border-transparent'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
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
    <NorthernTradieCard
      variant="outlined"
      animated
    >
      <NorthernTradieCard.Header
        title={service.name}
        icon={<StatusIcon className={`w-6 h-6 ${status.color}`} />}
        action={
          <span className={`px-3 py-1 text-sm font-medium ${status.color} ${status.bg} rounded-full`}>
            {status.label}
          </span>
        }
      />
      
      <NorthernTradieCard.Content>
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
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
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">
              Last Incident
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {service.lastIncident.title}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatRelativeTime(service.lastIncident.date)}
            </div>
          </div>
        )}
      </NorthernTradieCard.Content>
      
      <NorthernTradieCard.Footer align="right">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
        <div className="absolute inset-0 flex items-center justify-center text-center p-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              {description}
            </p>
            <button
              onClick={onAction}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transform transition-transform hover:scale-105"
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
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <feature.icon className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {feature.title}
          </h3>
          
          <p className="text-gray-600 mb-4">
            {feature.description}
          </p>
          
          <ul className="space-y-2 text-sm text-gray-700 text-left w-full">
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

