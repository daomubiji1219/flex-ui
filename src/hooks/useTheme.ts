// src/hooks/useTheme.ts - 面试重点展示
import { createContext, useContext, useMemo } from 'react'
import { designTokens } from '../theme/tokens'

interface Theme {
  tokens: typeof designTokens
  mode: 'light' | 'dark'
  cssVars: Record<string, string>
}

// 创建ThemeContext
const ThemeContext = createContext<Theme>({
  tokens: designTokens,
  mode: 'light',
  cssVars: {}
})

export const useTheme = () => {
  const theme = useContext(ThemeContext)
  
  // 动态CSS变量生成 - 技术亮点
  const cssVars = useMemo(() => {
    const vars: Record<string, string> = {}
    
    Object.entries(theme.tokens.colors.primary).forEach(([key, value]: [string, string]) => {
      vars[`--color-primary-${key}`] = value
    })
    
    theme.tokens.spacing.forEach((value: number, index: number) => {
      vars[`--spacing-${index}`] = `${value}px`
    })
    
    return vars
  }, [theme])
  
  return { ...theme, cssVars }
}

// 导出ThemeContext供Provider使用
export { ThemeContext }
export default useTheme
