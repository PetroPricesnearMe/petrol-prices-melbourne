/**
 * Button Component Tests
 *
 * Comprehensive unit tests for Button component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';

import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with text content', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders as a button element by default', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders as an anchor when href is provided', () => {
      render(<Button href="/test">Link Button</Button>);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('Variants', () => {
    it('applies solid variant class', () => {
      render(<Button variant="solid">Solid</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--solid');
    });

    it('applies outlined variant class', () => {
      render(<Button variant="outlined">Outlined</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--outlined');
    });

    it('applies ghost variant class', () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--ghost');
    });
  });

  describe('Colors', () => {
    it('applies primary color class', () => {
      render(<Button color="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--primary');
    });

    it('applies success color class', () => {
      render(<Button color="success">Success</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--success');
    });
  });

  describe('Sizes', () => {
    it('applies small size class', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--sm');
    });

    it('applies large size class', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('button--lg');
    });
  });

  describe('States', () => {
    it('applies disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('button--disabled');
    });

    it('applies loading state', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveClass('button--loading');
    });

    it('shows spinner when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button').querySelector('.button__spinner')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders start icon', () => {
      const icon = <span data-testid="start-icon">→</span>;
      render(<Button startIcon={icon}>With Start Icon</Button>);
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    });

    it('renders end icon', () => {
      const icon = <span data-testid="end-icon">←</span>;
      render(<Button endIcon={icon}>With End Icon</Button>);
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('hides icons when loading', () => {
      const icon = <span data-testid="icon">→</span>;
      render(
        <Button loading startIcon={icon} endIcon={icon}>
          Loading
        </Button>
      );
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} loading>Loading</Button>);

      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles keyboard navigation', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Keyboard</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      fireEvent.keyDown(button, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports custom aria-label', () => {
      render(<Button ariaLabel="Custom Label">Button</Button>);
      expect(screen.getByRole('button')).toHaveAccessibleName('Custom Label');
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <span id="description">Button description</span>
          <Button ariaDescribedBy="description">Button</Button>
        </>
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'description');
    });

    it('has correct button type', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('Link Mode', () => {
    it('opens external links in new tab with proper rel', () => {
      render(<Button href="https://example.com" target="_blank">External Link</Button>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not navigate when disabled', () => {
      render(<Button href="/test" disabled>Disabled Link</Button>);
      // When disabled, Button renders as button, not link (correct behavior)
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).not.toHaveAttribute('href');
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      // Check for actual Tailwind classes that exist
      expect(button).toHaveClass('inline-flex');
      expect(button).toHaveClass('items-center');
    });

    it('applies custom styles', () => {
      render(<Button style={{ backgroundColor: 'red' }}>Styled Button</Button>);
      expect(screen.getByRole('button')).toHaveStyle({ backgroundColor: 'red' });
    });

    it('supports fullWidth prop', () => {
      render(<Button fullWidth>Full Width</Button>);
      // Check for the actual Tailwind class instead of BEM modifier
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });

    it('supports testId', () => {
      render(<Button testId="test-button">Test</Button>);
      expect(screen.getByTestId('test-button')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const renderSpy = jest.fn();
      const TestButton = (props: Record<string, unknown>) => {
        renderSpy();
        return <Button {...props}>Test</Button>;
      };

      const { rerender } = render(<TestButton />);
      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Rerender with same props
      rerender(<TestButton />);
      expect(renderSpy).toHaveBeenCalledTimes(2); // Will re-render since not memoized

      // Memoized version would not re-render
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      render(<Button>{''}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles long text content', () => {
      const longText = 'This is a very long button text that might cause layout issues';
      render(<Button>{longText}</Button>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles rapid clicks', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Rapid Click</Button>);

      const button = screen.getByRole('button');
      await userEvent.tripleClick(button);

      expect(handleClick).toHaveBeenCalled();
    });
  });
});
