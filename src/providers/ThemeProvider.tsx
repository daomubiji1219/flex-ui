import React, {
  createContext,
  // useContext,
  useMemo,
  useCallback,
  useState,
} from 'react';
// 导入Emotion库的主题提供者，用于将主题注入到样式系统中
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import type { ReactNode } from 'react';
// 导入设计令牌（基础样式变量）和主题相关类型定义
import { designTokens, type Theme, type ThemeMode } from '../theme/tokens';

// 定义主题上下文的值类型，包含主题数据和操作方法
interface ThemeContextValue {
  theme: Theme; // 当前主题对象
  mode: ThemeMode; // 当前主题模式（亮色/暗色）
  toggleMode: () => void; // 切换主题模式的方法
  setMode: (mode: ThemeMode) => void; // 直接设置主题模式的方法
}

// 创建主题上下文，初始值为null（要求必须在ThemeProvider内部使用）
const ThemeContext = createContext<ThemeContextValue | null>(null);

// 定义主题提供者组件的属性类型
interface ThemeProviderProps {
  children: ReactNode; // 子组件
  defaultMode?: ThemeMode; // 默认主题模式（非受控模式使用）
  mode?: ThemeMode; // 受控模式下的主题模式
  onModeChange?: (mode: ThemeMode) => void; // 主题模式变化时的回调
}

// 主题提供者组件：管理主题状态并提供上下文
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'light', // 默认使用亮色模式
  mode: controlledMode, // 受控模式的模式值（由父组件控制）
  onModeChange, // 模式变化回调
}) => {
  // 内部状态管理非受控模式下的主题模式
  const [internalMode, setInternalMode] = useState<ThemeMode>(defaultMode);

  // 确定当前使用的模式：优先使用受控模式的值，否则使用内部状态
  const mode = controlledMode ?? internalMode;
  // 判断是否为暗色模式
  const isDark = mode === 'dark';

  // 计算当前主题对象（使用useMemo避免不必要的重新计算）
  const theme = useMemo((): Theme => {
    const baseTheme = {
      tokens: designTokens, // 基础设计令牌（原始样式变量）
      mode, // 当前主题模式
      isDark, // 是否为暗色模式的布尔值
      colors: {
        ...designTokens.colors, // 继承基础颜色
        // 根据当前模式动态计算的颜色（覆盖基础颜色）
        background: isDark ? designTokens.colors.neutral[900] : '#ffffff',
        surface: isDark ? designTokens.colors.neutral[800] : '#ffffff',
        text: {
          primary: isDark
            ? designTokens.colors.neutral[50]
            : designTokens.colors.neutral[900],
          secondary: isDark
            ? designTokens.colors.neutral[300]
            : designTokens.colors.neutral[600],
          disabled: isDark
            ? designTokens.colors.neutral[500]
            : designTokens.colors.neutral[400],
        },
        border: isDark
          ? designTokens.colors.neutral[700]
          : designTokens.colors.neutral[200],
      },
    };
    return baseTheme;
  }, [mode, isDark]); // 当mode或isDark变化时重新计算

  // 切换主题模式的方法（使用useCallback缓存函数引用）
  const toggleMode = useCallback(() => {
    // 计算新的主题模式（亮色<->暗色切换）
    const newMode = mode === 'light' ? 'dark' : 'light';
    if (controlledMode) {
      // 受控模式：通过回调通知父组件更新
      onModeChange?.(newMode);
    } else {
      // 非受控模式：直接更新内部状态
      setInternalMode(newMode);
      onModeChange?.(newMode);
    }
  }, [mode, controlledMode, onModeChange]); // 依赖变化时重新生成函数

  // 直接设置主题模式的方法
  const setMode = useCallback(
    (newMode: ThemeMode) => {
      if (controlledMode) {
        // 受控模式：通过回调通知父组件
        onModeChange?.(newMode);
      } else {
        // 非受控模式：更新内部状态
        setInternalMode(newMode);
        onModeChange?.(newMode);
      }
    },
    [controlledMode, onModeChange] // 依赖变化时重新生成函数
  );

  // 准备上下文值（使用useMemo避免不必要的对象创建）
  const contextValue = useMemo(
    () => ({
      theme,
      mode,
      toggleMode,
      setMode,
    }),
    [theme, mode, toggleMode, setMode] // 依赖变化时更新上下文
  );

  return (
    // 提供主题上下文给子组件
    <ThemeContext.Provider value={contextValue}>
      {/* 将主题提供给Emotion样式系统 */}
      <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};

// 导出ThemeContext供useTheme hook使用
export { ThemeContext };
