/**
 * NorthernTradieCard Storybook Stories
 * Comprehensive documentation and examples for the component
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NorthernTradieCard } from './NorthernTradieCard';

const meta: Meta<typeof NorthernTradieCard> = {
  title: 'Components/NorthernTradieCard',
  component: NorthernTradieCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'filled', 'interactive', 'featured'],
      description: 'Visual variant of the card',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the card',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    state: {
      control: 'select',
      options: ['idle', 'loading', 'error', 'success'],
      description: 'Current state of the card',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'idle' },
      },
    },
    hoverable: {
      control: 'boolean',
      description: 'Enable hover effects',
    },
    clickable: {
      control: 'boolean',
      description: 'Make the card clickable',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the card',
    },
    animated: {
      control: 'boolean',
      description: 'Enable entrance animation',
    },
    bordered: {
      control: 'boolean',
      description: 'Show border',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
# NorthernTradieCard

A highly reusable, accessible, and performant card component with multiple variants, sizes, and compound pattern support.

## Features
- 🎨 Multiple variants and sizes
- ♿ Full accessibility (ARIA, keyboard navigation)
- 🎭 Loading and error states
- ✨ Smooth animations
- 📱 Responsive design
- ⚡ Performance optimized (React.memo, useMemo)
- 🧩 Compound component pattern

## Installation
\`\`\`tsx
import { NorthernTradieCard } from '@/components/NorthernTradieCard';
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NorthernTradieCard>;

/**
 * Default Card
 */
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: (
      <>
        <NorthernTradieCard.Header title="Default Card" subtitle="This is a subtitle" />
        <NorthernTradieCard.Content>
          This is the default card variant with standard styling.
        </NorthernTradieCard.Content>
        <NorthernTradieCard.Footer align="between">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            Action
          </button>
        </NorthernTradieCard.Footer>
      </>
    ),
  },
};

/**
 * All Variants
 */
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(['default', 'elevated', 'outlined', 'filled', 'interactive', 'featured'] as const).map(
        (variant) => (
          <NorthernTradieCard key={variant} variant={variant}>
            <NorthernTradieCard.Header title={`${variant} variant`} />
            <NorthernTradieCard.Content>
              This card uses the {variant} variant.
            </NorthernTradieCard.Content>
          </NorthernTradieCard>
        )
      )}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all available card variants.',
      },
    },
  },
};

/**
 * All Sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <NorthernTradieCard key={size} size={size} variant="outlined">
          <NorthernTradieCard.Header title={`Size: ${size}`} />
          <NorthernTradieCard.Content>
            This card uses the {size} size.
          </NorthernTradieCard.Content>
        </NorthernTradieCard>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all available sizes.',
      },
    },
  },
};

/**
 * With Media
 */
export const WithMedia: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <NorthernTradieCard.Media
          src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
          alt="Sample image"
          aspectRatio="16/9"
        />
        <NorthernTradieCard.Header 
          title="Card with Media" 
          subtitle="Beautiful imagery"
        />
        <NorthernTradieCard.Content>
          Cards can include media content like images or custom components.
        </NorthernTradieCard.Content>
      </>
    ),
  },
};

/**
 * Loading State
 */
export const Loading: Story = {
  args: {
    state: 'loading',
    loadingMessage: 'Loading data...',
    children: (
      <>
        <NorthernTradieCard.Header title="Loading Card" />
        <NorthernTradieCard.Content>
          This content is being loaded...
        </NorthernTradieCard.Content>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Card in loading state with spinner overlay.',
      },
    },
  },
};

/**
 * Error State
 */
export const Error: Story = {
  args: {
    state: 'error',
    errorMessage: 'Failed to load data. Please try again.',
    variant: 'outlined',
    children: (
      <>
        <NorthernTradieCard.Header title="Error Card" />
        <NorthernTradieCard.Content>
          Something went wrong...
        </NorthernTradieCard.Content>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Card in error state with error message.',
      },
    },
  },
};

/**
 * Interactive Card
 */
export const Interactive: Story = {
  args: {
    variant: 'interactive',
    clickable: true,
    hoverable: true,
    onClick: () => alert('Card clicked!'),
    children: (
      <>
        <NorthernTradieCard.Header 
          title="Interactive Card" 
          subtitle="Click me!"
          icon={
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          }
        />
        <NorthernTradieCard.Content>
          This card is clickable and will trigger an action when clicked.
        </NorthernTradieCard.Content>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive card with hover effects and click handler. Fully keyboard accessible (Tab + Enter/Space).',
      },
    },
  },
};

/**
 * Disabled Card
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    clickable: true,
    onClick: () => alert('This should not fire'),
    children: (
      <>
        <NorthernTradieCard.Header title="Disabled Card" />
        <NorthernTradieCard.Content>
          This card is disabled and cannot be interacted with.
        </NorthernTradieCard.Content>
      </>
    ),
  },
};

/**
 * Featured Card
 */
export const Featured: Story = {
  args: {
    variant: 'featured',
    size: 'lg',
    shadow: 'xl',
    children: (
      <>
        <NorthernTradieCard.Header
          title="Featured Card"
          subtitle="Premium content"
          icon={
            <span className="text-2xl">⭐</span>
          }
          action={
            <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
              New
            </span>
          }
        />
        <NorthernTradieCard.Content>
          Featured cards stand out with special styling to highlight important content.
        </NorthernTradieCard.Content>
        <NorthernTradieCard.Footer align="right">
          <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
            Learn More
          </button>
        </NorthernTradieCard.Footer>
      </>
    ),
  },
};

/**
 * Complex Layout
 */
export const ComplexLayout: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <NorthernTradieCard variant="elevated" size="lg">
        <NorthernTradieCard.Media
          src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"
          alt="Complex layout"
          aspectRatio="21/9"
        />
        <NorthernTradieCard.Header
          title="Complex Card Layout"
          subtitle="Demonstrating full capabilities"
          icon={
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          }
          action={
            <div className="flex gap-2">
              <button 
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="More options"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
          }
        />
        <NorthernTradieCard.Content>
          <div className="space-y-4">
            <p className="text-gray-700">
              This card demonstrates the full capabilities of the NorthernTradieCard component,
              including media, complex header with actions, structured content, and a feature-rich footer.
            </p>
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1.2k</div>
                <div className="text-sm text-gray-500">Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-500">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4.8</div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
            </div>
          </div>
        </NorthernTradieCard.Content>
        <NorthernTradieCard.Footer align="between">
          <div className="flex gap-2">
            <span className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
              Technology
            </span>
            <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
              Featured
            </span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              Share
            </button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              View Details
            </button>
          </div>
        </NorthernTradieCard.Footer>
      </NorthernTradieCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complex card layout demonstrating all component capabilities combined.',
      },
    },
  },
};

/**
 * Grid Layout
 */
export const GridLayout: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item, index) => (
        <NorthernTradieCard
          key={item}
          variant="elevated"
          hoverable
          animated
          animationDelay={index * 0.1}
        >
          <NorthernTradieCard.Media
            src={`https://images.unsplash.com/photo-${1682687220742 + item}`}
            alt={`Card ${item}`}
            aspectRatio="4/3"
          />
          <NorthernTradieCard.Header title={`Card ${item}`} subtitle={`Item #${item}`} />
          <NorthernTradieCard.Content>
            <p className="text-gray-600">
              Content for card {item}. Each card animates in with a staggered delay.
            </p>
          </NorthernTradieCard.Content>
        </NorthernTradieCard>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive grid layout with staggered animations.',
      },
    },
  },
};

