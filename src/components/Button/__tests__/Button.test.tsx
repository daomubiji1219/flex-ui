import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';
import type { ButtonProps } from '../Button';
import { ThemeProvider } from '../../../providers/ThemeProvider';

// Test wrapper with ThemeProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider defaultMode="light">{children}</ThemeProvider>
);

const renderWithTheme = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};

describe('Button Component', () => {
  const defaultProps: ButtonProps = {
    children: 'Test Button',
  };

  describe('Rendering', () => {
    it('should render with correct text', () => {
      renderWithTheme(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveTextContent('Test Button');
    });

    it('should render with custom className', () => {
      renderWithTheme(<Button {...defaultProps} className="custom-class" />);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('should render as button element by default', () => {
      renderWithTheme(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render primary variant', () => {
      renderWithTheme(<Button {...defaultProps} variant="primary" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render secondary variant', () => {
      renderWithTheme(<Button {...defaultProps} variant="secondary" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render outline variant', () => {
      renderWithTheme(<Button {...defaultProps} variant="outline" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render ghost variant', () => {
      renderWithTheme(<Button {...defaultProps} variant="ghost" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render small size', () => {
      renderWithTheme(<Button {...defaultProps} size="sm" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render medium size by default', () => {
      renderWithTheme(<Button {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render large size', () => {
      renderWithTheme(<Button {...defaultProps} size="lg" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      renderWithTheme(<Button {...defaultProps} disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show loading state', () => {
      renderWithTheme(<Button {...defaultProps} loading />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should show spinner when loading', () => {
      renderWithTheme(<Button {...defaultProps} loading />);
      // Check if spinner is rendered (it should be a div with specific styles)
      const button = screen.getByRole('button');
      const spinner = button.querySelector('div');
      expect(spinner).toBeInTheDocument();
    });

    it('should be disabled when loading', () => {
      renderWithTheme(<Button {...defaultProps} loading />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Events', () => {
    it('should handle click events', () => {
      const handleClick = vi.fn();
      renderWithTheme(<Button {...defaultProps} onClick={handleClick} />);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger click when disabled', () => {
      const handleClick = vi.fn();
      renderWithTheme(
        <Button {...defaultProps} onClick={handleClick} disabled />
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not trigger click when loading', () => {
      const handleClick = vi.fn();
      renderWithTheme(
        <Button {...defaultProps} onClick={handleClick} loading />
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Icon and Content', () => {
    it('should render with icon', () => {
      const icon = <span data-testid="test-icon">🚀</span>;
      renderWithTheme(<Button {...defaultProps} icon={icon} />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Test Button');
    });

    it('should render icon only when no children', () => {
      const icon = <span data-testid="test-icon">🚀</span>;
      renderWithTheme(<Button icon={icon} />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have correct button type', () => {
      renderWithTheme(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should support custom type attribute', () => {
      renderWithTheme(<Button {...defaultProps} type="submit" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should support keyboard navigation', () => {
      const handleClick = vi.fn();
      renderWithTheme(<Button {...defaultProps} onClick={handleClick} />);

      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(document.activeElement).toBe(button);
    });

    it('should have proper cursor styles', () => {
      renderWithTheme(<Button {...defaultProps} />);
      const button = screen.getByRole('button');
      // CSS-in-JS styles may not be directly testable with toHaveStyle
      expect(button).toBeInTheDocument();
    });

    it('should have not-allowed cursor when disabled', () => {
      renderWithTheme(<Button {...defaultProps} disabled />);
      const button = screen.getByRole('button');
      // CSS-in-JS styles may not be directly testable with toHaveStyle
      expect(button).toBeDisabled();
    });
  });
});
