// src/components/Button/Button.tsx
import React, { forwardRef, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme';

// Spinner组件
const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: '14px',
    md: '16px',
    lg: '20px',
  };

  return (
    <div
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: '2px solid transparent',
        borderTop: '2px solid currentColor',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginRight: '8px',
      }}
    />
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', loading, icon, children, ...props },
    ref
  ) => {
    const theme = useTheme();

    // 动态样式计算 - 面试亮点
    const buttonStyles = useMemo(
      () => ({
        base: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
          fontFamily: 'inherit',
        },
        variants: {
          primary: {
            backgroundColor: theme.tokens.colors.primary[500],
            color: 'white',
          },
          secondary: {
            backgroundColor: '#6b7280',
            color: 'white',
          },
          outline: {
            backgroundColor: 'transparent',
            color: theme.tokens.colors.primary[500],
            border: `1px solid ${theme.tokens.colors.primary[500]}`,
          },
          ghost: {
            backgroundColor: 'transparent',
            color: theme.tokens.colors.primary[500],
          },
        },
        sizes: {
          sm: { padding: '6px 12px', fontSize: '14px' },
          md: { padding: '8px 16px', fontSize: '16px' },
          lg: { padding: '12px 24px', fontSize: '18px' },
        },
      }),
      [theme]
    );

    const combinedStyles = {
      ...buttonStyles.base,
      ...buttonStyles.variants[variant],
      ...buttonStyles.sizes[size],
      opacity: loading || props.disabled ? 0.6 : 1,
      cursor: loading || props.disabled ? 'not-allowed' : 'pointer',
    };

    return (
      <button
        ref={ref}
        style={combinedStyles}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Spinner size={size} />}
        {icon && (
          <span style={{ marginRight: children ? '8px' : '0' }}>{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

export type { ButtonProps };
export default Button;
