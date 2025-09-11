import { useContext } from 'react';
import { ThemeContext } from '../providers/ThemeProvider';
import type { Theme, ThemeMode } from '../theme/tokens';

// 重新导出ThemeProvider和相关类型
export { ThemeProvider } from '../providers/ThemeProvider';
export type { Theme, ThemeMode } from '../theme/tokens';

// 定义ThemeContextValue类型（与ThemeProvider中的定义保持一致）
export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

// useTheme hook实现
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 默认导出useTheme
export default useTheme;
