// src/theme/tokens.ts
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b', 
      error: '#ef4444'
    }
  },
  spacing: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96],
  typography: {
    fonts: {
      body: 'Inter, sans-serif',
      mono: 'Fira Code, monospace'
    },
    sizes: [12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72]
  }
} as const

// 类型推导
export type ColorToken = keyof typeof designTokens.colors.primary
export type SpacingToken = typeof designTokens.spacing[number]
