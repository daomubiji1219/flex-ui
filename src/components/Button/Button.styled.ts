import styled from '@emotion/styled';
import { css } from '@emotion/react';
import type { Theme } from '../../theme/tokens';

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

// 基础按钮样式
const baseButtonStyles = (theme: Theme) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${theme.tokens.radii.md};
  font-family: ${theme.tokens.typography.fonts.body};
  font-weight: ${theme.tokens.typography.weights.medium};
  cursor: pointer;
  transition: all ${theme.tokens.transitions.fast};
  outline: none;
  text-decoration: none;
  user-select: none;

  &:focus-visible {
    outline: 2px solid ${theme.tokens.colors.primary[500]};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// 尺寸变体
const sizeStyles = (theme: Theme) => ({
  sm: css`
    padding: ${theme.tokens.spacing[1]}px ${theme.tokens.spacing[3]}px;
    font-size: ${theme.tokens.typography.sizes[1]}px;
    min-height: 32px;
  `,
  md: css`
    padding: ${theme.tokens.spacing[2]}px ${theme.tokens.spacing[4]}px;
    font-size: ${theme.tokens.typography.sizes[2]}px;
    min-height: 40px;
  `,
  lg: css`
    padding: ${theme.tokens.spacing[3]}px ${theme.tokens.spacing[6]}px;
    font-size: ${theme.tokens.typography.sizes[3]}px;
    min-height: 48px;
  `,
});

// 颜色变体
const variantStyles = (theme: Theme) => ({
  primary: css`
    background-color: ${theme.tokens.colors.primary[500]};
    color: white;

    &:hover:not(:disabled) {
      background-color: ${theme.tokens.colors.primary[600]};
    }

    &:active:not(:disabled) {
      background-color: ${theme.tokens.colors.primary[700]};
    }
  `,
  secondary: css`
    background-color: ${theme.tokens.colors.secondary[500]};
    color: white;

    &:hover:not(:disabled) {
      background-color: ${theme.tokens.colors.secondary[600]};
    }

    &:active:not(:disabled) {
      background-color: ${theme.tokens.colors.secondary[700]};
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${theme.tokens.colors.primary[500]};
    border: 1px solid ${theme.tokens.colors.primary[500]};

    &:hover:not(:disabled) {
      background-color: ${theme.tokens.colors.primary[50]};
    }

    &:active:not(:disabled) {
      background-color: ${theme.tokens.colors.primary[100]};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${theme.tokens.colors.primary[500]};

    &:hover:not(:disabled) {
      background-color: ${theme.tokens.colors.primary[50]};
    }

    &:active:not(:disabled) {
      background-color: ${theme.tokens.colors.primary[100]};
    }
  `,
});

export const StyledButton = styled.button<StyledButtonProps>`
  ${({ theme }) => baseButtonStyles(theme)}
  ${({ theme, size }) => sizeStyles(theme)[size]}
  ${({ theme, variant }) => variantStyles(theme)[variant]}
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`;

// Spinner组件样式
export const StyledSpinner = styled.div<{ size: 'sm' | 'md' | 'lg' }>`
  ${({ size }) => {
    const sizeMap = { sm: '14px', md: '16px', lg: '20px' };
    return css`
      width: ${sizeMap[size]};
      height: ${sizeMap[size]};
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    `;
  }}

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// 图标容器
export const IconContainer = styled.span<{ hasChildren: boolean }>`
  display: inline-flex;
  align-items: center;
  ${({ hasChildren }) =>
    hasChildren &&
    css`
      margin-right: 8px;
    `}
`;
