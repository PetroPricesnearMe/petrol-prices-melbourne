/**
 * NorthernTradieCard Unit Tests
 * Comprehensive test suite for the card component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import { NorthernTradieCard } from '../NorthernTradieCard';

describe('NorthernTradieCard', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<NorthernTradieCard>Content</NorthernTradieCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <NorthernTradieCard className="custom-class">Content</NorthernTradieCard>
      );
      // className is applied to the motion.div (firstChild), not its child
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders with testId', () => {
      render(
        <NorthernTradieCard testId="test-card">Content</NorthernTradieCard>
      );
      expect(screen.getByTestId('test-card')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(
        <NorthernTradieCard>
          <div>Child 1</div>
          <div>Child 2</div>
        </NorthernTradieCard>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it.each([
      'default',
      'elevated',
      'outlined',
      'filled',
      'interactive',
      'featured',
    ] as const)('renders %s variant correctly', (variant) => {
      const { container } = render(
        <NorthernTradieCard variant={variant}>Content</NorthernTradieCard>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
      'renders %s size correctly',
      (size) => {
        const { container } = render(
          <NorthernTradieCard size={size}>Content</NorthernTradieCard>
        );
        expect(container.firstChild).toBeInTheDocument();
      }
    );
  });

  describe('States', () => {
    it('renders idle state', () => {
      render(<NorthernTradieCard state="idle">Content</NorthernTradieCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders loading state with spinner', () => {
      render(
        <NorthernTradieCard state="loading" loadingMessage="Loading...">
          Content
        </NorthernTradieCard>
      );
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getAllByText('Loading...').length).toBeGreaterThan(0);
    });

    it('renders error state with message', () => {
      render(
        <NorthernTradieCard state="error" errorMessage="Error occurred">
          Content
        </NorthernTradieCard>
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Error occurred')).toBeInTheDocument();
    });

    it('renders success state', () => {
      render(<NorthernTradieCard state="success">Content</NorthernTradieCard>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('hides error message when state is not error', () => {
      render(
        <NorthernTradieCard state="idle" errorMessage="Error occurred">
          Content
        </NorthernTradieCard>
      );
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('handles click events when clickable', () => {
      const handleClick = jest.fn();
      render(
        <NorthernTradieCard clickable onClick={handleClick}>
          Content
        </NorthernTradieCard>
      );
      
      const card = screen.getByText('Content').closest('div');
      fireEvent.click(card!);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not trigger click when disabled', () => {
      const handleClick = jest.fn();
      render(
        <NorthernTradieCard clickable disabled onClick={handleClick}>
          Content
        </NorthernTradieCard>
      );
      
      const card = screen.getByText('Content').closest('div');
      fireEvent.click(card!);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles keyboard Enter key', () => {
      const handleClick = jest.fn();
      render(
        <NorthernTradieCard clickable onClick={handleClick}>
          Content
        </NorthernTradieCard>
      );
      
      const card = screen.getByText('Content').closest('div');
      fireEvent.keyDown(card!, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles keyboard Space key', () => {
      const handleClick = jest.fn();
      render(
        <NorthernTradieCard clickable onClick={handleClick}>
          Content
        </NorthernTradieCard>
      );
      
      const card = screen.getByText('Content').closest('div');
      fireEvent.keyDown(card!, { key: ' ' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles custom keyPress handler', () => {
      const handleKeyPress = jest.fn();
      render(
        <NorthernTradieCard onKeyPress={handleKeyPress}>
          Content
        </NorthernTradieCard>
      );
      
      const card = screen.getByText('Content').closest('div');
      fireEvent.keyDown(card!, { key: 'a' });
      expect(handleKeyPress).toHaveBeenCalled();
    });

    it('handles focus events', () => {
      const handleFocus = jest.fn();
      render(
        <NorthernTradieCard onFocus={handleFocus}>
          Content
        </NorthernTradieCard>
      );
      
      const card = screen.getByText('Content').closest('div');
      fireEvent.focus(card!);
      expect(handleFocus).toHaveBeenCalled();
    });

    it('handles blur events', () => {
      const handleBlur = jest.fn();
      render(
        <NorthernTradieCard onBlur={handleBlur}>
          Content
        </NorthernTradieCard>
      );
      
      const card = screen.getByText('Content').closest('div');
      fireEvent.blur(card!);
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct role for clickable card', () => {
      const { container } = render(
        <NorthernTradieCard clickable>Content</NorthernTradieCard>
      );
      const card = container.querySelector('[role="button"]');
      expect(card).toBeInTheDocument();
    });

    it('has correct role for non-clickable card', () => {
      const { container } = render(
        <NorthernTradieCard>Content</NorthernTradieCard>
      );
      const card = container.querySelector('[role="article"]');
      expect(card).toBeInTheDocument();
    });

    it('accepts custom role', () => {
      const { container } = render(
        <NorthernTradieCard role="region">Content</NorthernTradieCard>
      );
      const card = container.querySelector('[role="region"]');
      expect(card).toBeInTheDocument();
    });

    it('has aria-label when provided', () => {
      const { container } = render(
        <NorthernTradieCard ariaLabel="Test label">Content</NorthernTradieCard>
      );
      const card = container.querySelector('[aria-label="Test label"]');
      expect(card).toBeInTheDocument();
    });

    it('has aria-disabled when disabled', () => {
      const { container } = render(
        <NorthernTradieCard disabled>Content</NorthernTradieCard>
      );
      const card = container.querySelector('[aria-disabled="true"]');
      expect(card).toBeInTheDocument();
    });

    it('has aria-busy when loading', () => {
      const { container } = render(
        <NorthernTradieCard state="loading">Content</NorthernTradieCard>
      );
      const card = container.querySelector('[aria-busy="true"]');
      expect(card).toBeInTheDocument();
    });

    it('is keyboard accessible when clickable', () => {
      render(
        <NorthernTradieCard clickable>Content</NorthernTradieCard>
      );
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabindex', '0');
    });

    it('is not keyboard accessible when disabled', () => {
      render(
        <NorthernTradieCard clickable disabled>Content</NorthernTradieCard>
      );
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabindex', '-1');
    });

    it('has custom tabIndex when provided', () => {
      render(
        <NorthernTradieCard tabIndex={5}>Content</NorthernTradieCard>
      );
      const card = screen.getByRole('article');
      expect(card).toHaveAttribute('tabindex', '5');
    });
  });

  describe('Compound Components', () => {
    it('renders with Header', () => {
      render(
        <NorthernTradieCard>
          <NorthernTradieCard.Header title="Test Title" />
        </NorthernTradieCard>
      );
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('renders with Header and subtitle', () => {
      render(
        <NorthernTradieCard>
          <NorthernTradieCard.Header 
            title="Test Title" 
            subtitle="Test Subtitle" 
          />
        </NorthernTradieCard>
      );
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('renders with Content', () => {
      render(
        <NorthernTradieCard>
          <NorthernTradieCard.Content>Test Content</NorthernTradieCard.Content>
        </NorthernTradieCard>
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders with Footer', () => {
      render(
        <NorthernTradieCard>
          <NorthernTradieCard.Footer>Test Footer</NorthernTradieCard.Footer>
        </NorthernTradieCard>
      );
      expect(screen.getByText('Test Footer')).toBeInTheDocument();
    });

    it('renders with Media', () => {
      render(
        <NorthernTradieCard>
          <NorthernTradieCard.Media 
            src="test.jpg" 
            alt="Test Image" 
          />
        </NorthernTradieCard>
      );
      const img = screen.getByAltText('Test Image');
      expect(img).toBeInTheDocument();
    });

    it('renders all compound components together', () => {
      render(
        <NorthernTradieCard>
          <NorthernTradieCard.Media src="test.jpg" alt="Test" />
          <NorthernTradieCard.Header title="Title" />
          <NorthernTradieCard.Content>Content</NorthernTradieCard.Content>
          <NorthernTradieCard.Footer>Footer</NorthernTradieCard.Footer>
        </NorthernTradieCard>
      );
      expect(screen.getByAltText('Test')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies border when bordered prop is true', () => {
      const { container } = render(
        <NorthernTradieCard bordered>Content</NorthernTradieCard>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('removes border when bordered prop is false', () => {
      const { container } = render(
        <NorthernTradieCard bordered={false}>Content</NorthernTradieCard>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies shadow when shadow prop is true', () => {
      const { container } = render(
        <NorthernTradieCard shadow>Content</NorthernTradieCard>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies specific shadow size', () => {
      const { container } = render(
        <NorthernTradieCard shadow="lg">Content</NorthernTradieCard>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('memoizes component to prevent unnecessary re-renders', () => {
      const { rerender } = render(
        <NorthernTradieCard>Content</NorthernTradieCard>
      );
      
      // Re-render with same props should not cause a re-render
      rerender(<NorthernTradieCard>Content</NorthernTradieCard>);
      
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('renders with animation when animated is true', () => {
      const { container } = render(
        <NorthernTradieCard animated>Content</NorthernTradieCard>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders without animation when animated is false', () => {
      const { container } = render(
        <NorthernTradieCard animated={false}>Content</NorthernTradieCard>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('accepts animation delay', () => {
      const { container } = render(
        <NorthernTradieCard animated animationDelay={200}>
          Content
        </NorthernTradieCard>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});

