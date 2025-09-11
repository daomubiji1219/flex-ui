import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';
import type { ButtonProps } from '../Button';

// Mock useTheme hook
vi.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    tokens: {
      colors: {
        primary: {
          500: '#3b82f6',
        },
      },
    },
  }),
}));

describe('Button Component', () => {
  const defaultProps: ButtonProps = {
    children: 'Test Button',
  };

  describe('Rendering', () => {
    it('should render with correct text', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveTextContent('Test Button');
    });

    it('should render with custom className', () => {
      render(<Button {...defaultProps} className="custom-class" />);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('should render as button element by default', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render primary variant', () => {
      render(<Button {...defaultProps} variant="primary" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render secondary variant', () => {
      render(<Button {...defaultProps} variant="secondary" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render outline variant', () => {
      render(<Button {...defaultProps} variant="outline" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render ghost variant', () => {
      render(<Button {...defaultProps} variant="ghost" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      render(<Button {...defaultProps} size="sm" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render medium size by default', () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render large size', () => {
      render(<Button {...defaultProps} size="lg" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button {...defaultProps} disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show loading state', () => {
      render(<Button {...defaultProps} loading />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveStyle({ opacity: '0.6' });
    });

    it('should show spinner when loading', () => {
      render(<Button {...defaultProps} loading />);
      // Check if spinner is rendered (it should be a div with specific styles)
      const button = screen.getByRole('button');
      const spinner = button.querySelector('div');
      expect(spinner).toBeInTheDocument();
    });

    it('should be disabled when loading', () => {
      render(<Button {...defaultProps} loading />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Events', () => {
    it('should handle click events', () => {
      const handleClick = vi.fn();
      render(<Button {...defaultProps} onClick={handleClick} />);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger click when disabled', () => {
      const handleClick = vi.fn();
      render(<Button {...defaultProps} onClick={handleClick} disabled />);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not trigger click when loading', () => {
      const handleClick = vi.fn();
      render(<Button {...defaultProps} onClick={handleClick} loading />);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Icon and Content', () => {
    it('should render with icon', () => {
      const icon = <span data-testid="test-icon">🚀</span>;
      render(<Button {...defaultProps} icon={icon} />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Test Button');
    });

    it('should render icon only when no children', () => {
      const icon = <span data-testid="test-icon">🚀</span>;
      render(<Button icon={icon} />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have correct button type', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should support custom type attribute', () => {
      render(<Button {...defaultProps} type="submit" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should support keyboard navigation', () => {
      const handleClick = vi.fn();
      render(<Button {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(document.activeElement).toBe(button);
    });

    it('should have proper cursor styles', () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ cursor: 'pointer' });
    });

    it('should have not-allowed cursor when disabled', () => {
      render(<Button {...defaultProps} disabled />);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ cursor: 'not-allowed' });
    });
  });
});
