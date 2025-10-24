# Modal Popups & View Toggle Implementation Guide

## 🚀 Overview

This document provides a comprehensive guide to the modal popup implementation using Headless UI and the grid/list view toggle with seamless animated transitions using Framer Motion.

## 📋 Table of Contents

- [Modal Components](#modal-components)
- [View Toggle Components](#view-toggle-components)
- [Integration Guide](#integration-guide)
- [Animation Details](#animation-details)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🧩 Modal Components

### 1. Base Modal Component (`Modal`)

**Location**: `src/components/modals/Modal.tsx`

**Purpose**: Reusable modal component using Headless UI with Tailwind transitions.

**Key Features**:
- Headless UI Dialog integration
- Smooth backdrop blur and fade transitions
- Configurable sizes (sm, md, lg, xl, full)
- Customizable close behavior
- Accessibility compliant
- Dark mode support

**Usage**:
```typescript
import { Modal } from '@/components/modals/Modal';

<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Station Details"
  size="lg"
>
  <div>Modal content here</div>
</Modal>
```

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}
```

### 2. Station Details Modal (`StationDetailsModal`)

**Purpose**: Specialized modal for displaying comprehensive station information.

**Features**:
- Complete station information display
- Fuel prices with color coding
- Amenities listing
- Operating hours
- Contact information
- Social media links
- Action buttons (directions, full page)

**Usage**:
```typescript
import { StationDetailsModal } from '@/components/modals/Modal';

<StationDetailsModal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  station={selectedStation}
/>
```

## 🎨 View Toggle Components

### 1. View Toggle (`ViewToggle`)

**Location**: `src/components/toggle/ViewToggle.tsx`

**Purpose**: Toggle component for switching between grid and list views.

**Key Features**:
- Smooth animated toggle switch
- Configurable sizes (sm, md, lg)
- Optional labels
- Spring animations
- Accessibility support

**Usage**:
```typescript
import { ViewToggle } from '@/components/toggle/ViewToggle';

<ViewToggle
  currentView={currentView}
  onViewChange={setCurrentView}
  size="sm"
  showLabels={true}
/>
```

### 2. Directory View (`DirectoryView`)

**Purpose**: Container component that renders items in either grid or list layout.

**Features**:
- Seamless layout transitions
- Staggered item animations
- Layout animations with Framer Motion
- Responsive design

**Usage**:
```typescript
import { DirectoryView } from '@/components/toggle/ViewToggle';

<DirectoryView
  view={currentView}
  items={stations}
  renderItem={(station, index) => (
    currentView === 'grid' ? (
      <StationCardGrid station={station} />
    ) : (
      <StationCardList station={station} />
    )
  )}
/>
```

### 3. Station Card Variants

#### Grid Card (`StationCardGrid`)
- Vertical card layout
- Compact information display
- Hover animations
- Full-width action button

#### List Card (`StationCardList`)
- Horizontal card layout
- Side-by-side information
- Inline fuel prices
- Compact action button

## 🔧 Integration Guide

### 1. Adding Modal to Directory

```typescript
// In your directory component
const [selectedStation, setSelectedStation] = useState<Station | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleStationClick = useCallback((station: Station) => {
  setSelectedStation(station);
  setIsModalOpen(true);
}, []);

const handleCloseModal = useCallback(() => {
  setIsModalOpen(false);
  setSelectedStation(null);
}, []);

// In your JSX
<StationDetailsModal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  station={selectedStation}
/>
```

### 2. Adding View Toggle

```typescript
// In your directory component
const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');

// In your filter bar
<ViewToggle
  currentView={currentView}
  onViewChange={setCurrentView}
  size="sm"
/>

// In your content area
<DirectoryView
  view={currentView}
  items={stations}
  renderItem={(station, index) =>
    currentView === 'grid' ? (
      <StationCardGrid station={station} onCardClick={handleStationClick} />
    ) : (
      <StationCardList station={station} onCardClick={handleStationClick} />
    )
  }
/>
```

## 🎬 Animation Details

### Modal Animations

#### Backdrop Animation
```typescript
// Fade in/out with backdrop blur
enter="ease-out duration-300"
enterFrom="opacity-0"
enterTo="opacity-100"
leave="ease-in duration-200"
leaveFrom="opacity-100"
leaveTo="opacity-0"
```

#### Modal Panel Animation
```typescript
// Scale and fade animation
enter="ease-out duration-300"
enterFrom="opacity-0 scale-95"
enterTo="opacity-100 scale-100"
leave="ease-in duration-200"
leaveFrom="opacity-100 scale-100"
leaveTo="opacity-0 scale-95"
```

### View Toggle Animations

#### Toggle Switch Animation
```typescript
// Spring animation for smooth movement
animate={{
  x: currentView === 'grid' ? 0 : '100%',
}}
transition={{
  type: 'spring',
  stiffness: 500,
  damping: 30,
}}
```

#### Layout Transitions
```typescript
// Layout animation for smooth grid/list transitions
layout
transition={{
  duration: 0.4,
  ease: 'easeInOut',
}}
```

#### Item Animations
```typescript
// Staggered item animations
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.9 }}
transition={{
  duration: 0.3,
  delay: index * 0.05,
  ease: 'easeOut',
}}
```

## 📖 Usage Examples

### Basic Modal Implementation

```typescript
import { useState } from 'react';
import { Modal } from '@/components/modals/Modal';

export function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal"
        size="md"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}
```

### Custom Modal with Form

```typescript
import { Modal } from '@/components/modals/Modal';

export function ContactModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Us"
      size="lg"
      closeOnOverlayClick={false}
    >
      <form className="space-y-4">
        <input type="text" placeholder="Name" className="input w-full" />
        <input type="email" placeholder="Email" className="input w-full" />
        <textarea placeholder="Message" className="textarea w-full" />
        <button type="submit" className="btn btn-primary w-full">
          Send Message
        </button>
      </form>
    </Modal>
  );
}
```

### View Toggle with Custom Cards

```typescript
import { ViewToggle, DirectoryView } from '@/components/toggle/ViewToggle';

export function CustomDirectory({ items }) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const renderCustomItem = (item, index) => {
    if (view === 'grid') {
      return <CustomGridCard key={item.id} item={item} />;
    } else {
      return <CustomListCard key={item.id} item={item} />;
    }
  };

  return (
    <div>
      <ViewToggle
        currentView={view}
        onViewChange={setView}
        showLabels={true}
      />

      <DirectoryView
        view={view}
        items={items}
        renderItem={renderCustomItem}
      />
    </div>
  );
}
```

## 🎯 Best Practices

### 1. Modal Best Practices

- **Accessibility**: Always provide proper ARIA labels and focus management
- **Performance**: Use `AnimatePresence` for smooth enter/exit animations
- **UX**: Provide clear close actions (X button, ESC key, overlay click)
- **Responsive**: Test modal behavior on all screen sizes
- **Content**: Keep modal content focused and scannable

### 2. View Toggle Best Practices

- **State Management**: Use consistent state management for view preferences
- **Persistence**: Consider persisting user's view preference
- **Performance**: Use `layout` prop for smooth transitions
- **Accessibility**: Provide clear visual feedback for current view
- **Mobile**: Ensure toggle works well on touch devices

### 3. Animation Best Practices

- **Performance**: Use `transform` and `opacity` for smooth animations
- **Timing**: Keep animations under 300ms for UI interactions
- **Easing**: Use appropriate easing functions (ease-out for entrance, ease-in for exit)
- **Staggering**: Use staggered animations for list items
- **Reduced Motion**: Respect user's motion preferences

## 🐛 Troubleshooting

### Common Issues

#### 1. Modal Not Opening

**Symptoms**: Click doesn't open modal
**Solution**: Check state management and event handlers

```typescript
// Ensure proper state management
const [isOpen, setIsOpen] = useState(false);

// Check event handler
const handleOpen = () => setIsOpen(true);
```

#### 2. Animation Glitches

**Symptoms**: Jerky or incomplete animations
**Solution**: Check Framer Motion setup and CSS conflicts

```typescript
// Ensure proper Framer Motion imports
import { motion, AnimatePresence } from 'framer-motion';

// Check for CSS conflicts
// Remove conflicting transitions from CSS
```

#### 3. View Toggle Not Working

**Symptoms**: Toggle doesn't change view
**Solution**: Check state updates and render logic

```typescript
// Ensure state is properly updated
const [view, setView] = useState<'grid' | 'list'>('grid');

// Check render logic
{view === 'grid' ? <GridComponent /> : <ListComponent />}
```

#### 4. Layout Shift Issues

**Symptoms**: Content jumps during transitions
**Solution**: Use layout animations and consistent sizing

```typescript
// Add layout prop to animated elements
<motion.div layout>
  {/* content */}
</motion.div>

// Use consistent dimensions
<div className="h-64 w-full"> {/* fixed height */}
```

### Performance Optimization

#### 1. Reduce Animation Complexity

```typescript
// Simple animations perform better
animate={{ opacity: 1, y: 0 }}
// vs
animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
```

#### 2. Use `will-change` CSS Property

```css
.animated-element {
  will-change: transform, opacity;
}
```

#### 3. Optimize Re-renders

```typescript
// Use React.memo for expensive components
const StationCard = React.memo(({ station }) => {
  // component logic
});

// Use useCallback for event handlers
const handleClick = useCallback((station) => {
  // handler logic
}, []);
```

## 📊 Performance Metrics

### Target Values

- **Modal Open Time**: < 200ms
- **View Transition**: < 300ms
- **Animation FPS**: 60fps
- **Memory Usage**: < 10MB for 100 items

### Monitoring

```typescript
// Use React DevTools Profiler
// Monitor animation performance
// Check for layout thrashing
// Measure memory usage
```

## 🚀 Future Enhancements

### Planned Features

1. **Modal Stacking**: Support for multiple modals
2. **Custom Animations**: More animation presets
3. **View Persistence**: Save user preferences
4. **Keyboard Navigation**: Enhanced keyboard support
5. **Touch Gestures**: Swipe to close modals

### Performance Improvements

1. **Virtual Scrolling**: For large lists
2. **Lazy Loading**: Load content on demand
3. **Animation Caching**: Cache animation states
4. **Bundle Splitting**: Split animation code

## 📚 Additional Resources

- [Headless UI Documentation](https://headlessui.com/)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [React Modal Best Practices](https://reactjs.org/docs/accessibility.html)
- [Animation Performance Guide](https://web.dev/animations/)

---

**Implementation Status**: ✅ Complete
**Last Updated**: December 2024
**Version**: 1.0.0
