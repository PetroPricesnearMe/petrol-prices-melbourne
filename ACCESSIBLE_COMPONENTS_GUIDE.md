# Accessible Components Guide

## Overview
This guide documents the fully accessible, WCAG 2.1 AA compliant components created for the application.

## Components

### 1. AccessibleForm
**Location**: `src/components/dynamic/AccessibleForm.tsx`

A fully accessible form component with:
- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Error handling with clear messages
- ✅ Focus management
- ✅ Color contrast compliance
- ✅ Touch-friendly targets (minimum 48x48px)

**Features**:
- Field validation with inline error messages
- Real-time error clearing
- Automatic focus management on errors
- Success/error state messages
- Multiple field types: text, email, tel, textarea, select, radio, checkbox
- Custom validation support
- Dark mode support

**Usage**:
```tsx
import { AccessibleForm, FormField } from '@/components/dynamic/AccessibleForm';

const fields: FormField[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your name',
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'example@email.com',
    validation: (value) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email';
      }
      return null;
    },
  },
];

function MyForm() {
  return (
    <AccessibleForm
      fields={fields}
      onSubmit={async (data) => {
        console.log('Form submitted:', data);
      }}
      submitLabel="Submit Form"
    />
  );
}
```

### 2. SearchableDropdown
**Location**: `src/components/dynamic/SearchableDropdown.tsx`

A fully accessible searchable dropdown with:
- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Screen reader support
- ✅ Search functionality
- ✅ Focus management
- ✅ Dark mode support

**Features**:
- Search/filter options
- Keyboard navigation
- Click outside to close
- Visual focus indicators
- Selected state indication
- Empty state handling

**Usage**:
```tsx
import { SearchableDropdown, DropdownOption } from '@/components/dynamic/SearchableDropdown';

const options: DropdownOption[] = [
  { value: '1', label: 'Option 1', description: 'First option' },
  { value: '2', label: 'Option 2', description: 'Second option' },
  { value: '3', label: 'Option 3', description: 'Third option' },
];

function MyDropdown() {
  const [value, setValue] = useState<string>();

  return (
    <SearchableDropdown
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Select an option"
      label="Choose Option"
    />
  );
}
```

### 3. StationListCMS
**Location**: `src/components/dynamic/StationListCMS.tsx`

A dynamic, accessible station list component with:
- ✅ CMS integration
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Touch-friendly targets
- ✅ Loading and error states
- ✅ Dark mode support

**Usage**:
```tsx
import StationListCMS from '@/components/dynamic/StationListCMS';

function StationsPage() {
  return (
    <StationListCMS
      loadingMessage="Loading stations..."
      errorMessage="Failed to load stations"
    />
  );
}
```

## Accessibility Features

### Keyboard Navigation
All components support full keyboard navigation:
- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and select options
- **Arrow Keys**: Navigate dropdown options
- **Escape**: Close modals and dropdowns

### Screen Reader Support
- Semantic HTML elements (`<nav>`, `<button>`, `<form>`, etc.)
- Proper ARIA attributes:
  - `aria-label` for descriptive labels
  - `aria-expanded` for expandable sections
  - `aria-selected` for selected items
  - `aria-live` for dynamic content
  - `aria-describedby` for form field descriptions
  - `aria-required` for required fields
- Focus management for better navigation flow

### Visual Accessibility
- **Color Contrast**: All text meets WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text)
- **Focus Indicators**: Clear, high-contrast focus rings on all interactive elements
- **Touch Targets**: Minimum 48x48px for all clickable elements
- **Visual Feedback**: Hover, active, and disabled states for all interactive elements

### Responsive Design
- Mobile-first approach
- Fluid typography and spacing
- Touch-friendly interface on mobile devices
- Optimized layouts for all screen sizes

## Best Practices

### Form Validation
```tsx
// Always provide clear, specific error messages
{
  name: 'email',
  label: 'Email',
  type: 'email',
  required: true,
  validation: (value) => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },
}
```

### Error Handling
```tsx
// Always handle errors gracefully
const handleSubmit = async (data) => {
  try {
    await submitForm(data);
  } catch (error) {
    // Error is automatically displayed by the component
    console.error('Submission failed:', error);
  }
};
```

### Loading States
```tsx
// Provide feedback during async operations
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (data) => {
  setIsSubmitting(true);
  try {
    await submitForm(data);
  } finally {
    setIsSubmitting(false);
  }
};
```

## Performance Optimization

All components are optimized for performance:
- ✅ Memoization for expensive computations
- ✅ Efficient re-render patterns
- ✅ Lazy loading for large lists
- ✅ Debounced search inputs
- ✅ Minimal bundle size

## Testing

### Manual Testing Checklist
- [ ] Navigate using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify color contrast with tools (WebAIM, Lighthouse)
- [ ] Test on mobile devices (touch targets)
- [ ] Verify responsive layouts at different breakpoints
- [ ] Test with browser zoom at 200%

### Automated Testing
```bash
# Run accessibility tests
npm run test:a11y

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Support

For accessibility issues or questions:
1. Check this guide first
2. Review WCAG 2.1 guidelines
3. Test with actual assistive technologies
4. Consult with accessibility experts

---

**Version**: 1.0.0
**Last Updated**: January 2025
**Status**: Production Ready ✅
