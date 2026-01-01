// 导入React核心库
import React from 'react';
// 导入ReactNode类型定义，用于指定子元素类型
import type { ReactNode } from 'react';
// 导入自定义的useTheme钩子，用于获取和切换主题模式
import { useTheme } from '../../hooks/useTheme';
// 导入ErrorBoundary相关hooks
import { useErrorBoundaryEnhanced } from '../../hooks/useErrorBoundaryEnhanced';
import { DefaultErrorFallback } from '../../hooks/useErrorBoundary';
// 导入Button组件，作为主题切换按钮的基础容器
import { Button } from '../Button/Button';

// 定义ThemeToggle组件的属性接口
interface ThemeToggleProps {
  children?: ReactNode; // 可选的子元素，用于自定义按钮内容
  className?: string; // 可选的CSS类名，用于自定义组件样式
}

// 导出ThemeToggle组件，指定其为React函数组件并使用ThemeToggleProps类型约束
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  children,
  className,
}) => {
  // ==================== 错误边界 ====================
  const { ErrorBoundary } = useErrorBoundaryEnhanced(DefaultErrorFallback, {
    maxRetries: 3,
    onError: (error, errorInfo) => {
      console.error('ThemeToggle 组件发生错误:', { error, errorInfo });
    },
  });

  // 从useTheme钩子中获取当前主题模式(mode)和切换主题的方法(toggleMode)
  const { mode, toggleMode } = useTheme();

  // 定义根据当前主题模式返回对应图标的函数
  const getIcon = () => {
    // 如果当前是亮色模式，返回月亮图标(表示可切换到暗色)
    if (mode === 'light') {
      return (
        // 月亮SVG图标，尺寸为4x4，使用当前文本颜色
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      // 如果当前是暗色模式，返回太阳图标(表示可切换到亮色)
      return (
        // 太阳SVG图标，尺寸为4x4，使用当前文本颜色
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      );
    }
  };

  // 组件返回一个按钮元素，用于切换主题
  return (
    <ErrorBoundary>
      <Button
        variant="outline" // 按钮样式为轮廓型
        size="md" // 按钮尺寸为中等
        onClick={toggleMode} // 点击时调用切换主题的方法
        icon={getIcon()} // 按钮图标为getIcon函数返回的SVG
        className={className} // 应用传入的自定义类名
      >
        {/* 按钮文本：优先使用传入的children，否则显示默认切换提示 */}
        {children || `切换到${mode === 'light' ? '暗色' : '亮色'}模式`}
      </Button>
    </ErrorBoundary>
  );
};

// 导出ThemeToggle作为默认导出
export default ThemeToggle;
