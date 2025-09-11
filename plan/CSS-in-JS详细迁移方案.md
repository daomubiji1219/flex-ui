# Flexi-UI CSS-in-JS 详细迁移方案

## ✅ 可行性验证与修订（基于当前代码与配置）

- 依赖与打包：已安装 @emotion/react 与 @emotion/styled，且在打包配置中将其标记为 external，构建无阻碍；Rollup 与 TypeScript 工程结构可直接支持 Emotion 迁移，无需新增构建插件。
- 设计令牌：当前 src/theme/tokens.ts 定义较精简（primary 仅 50/500/900，semantic/spacing/typography 可用）；文档中“扩展 tokens”完全可行，但应采用“增量扩展”策略，可先按需补齐再逐步完善，避免一次性大改影响测试与对外 API。
- useTheme 兼容性：现有 useTheme 通过默认导出，并且被多处测试用例按路径 "src/hooks/useTheme" 进行 mock。为维持向后兼容：
  1. 保留 hooks/useTheme.ts 的默认导出，不改为仅具名导出；
  2. hooks/useTheme.ts 内部改为从 providers/ThemeProvider 读取上下文，且在未包裹 Provider 时回退到当前 designTokens 与 cssVars 生成逻辑；
  3. 可在 hooks/useTheme.ts 中“附加”导出 ThemeProvider（具名导出），以便使用方便捷接入，而不强制新增 package.json 子路径导出；这样测试 mock 与对外 API 均不受影响。
- 导出路径与命名：package.json 已提供 "./hooks/useTheme" 子路径导出，请保持该入口稳定；新增 Provider 时可以选择在 hooks/useTheme.ts 里具名 re-export ThemeProvider，或额外在 package.json 增加 "./providers/ThemeProvider"（可选）。
- 路径拼写：组件目录为 "src/compoents"（注意拼写），方案中的路径已与现状一致，不需改动。
- Tailwind 共存：项目仍以 Tailwind 为主，全局 index.css/App.css 均存在；迁移应按组件维度渐进推进，短期内允许两套样式共存，最后再统一清理残留的实心类名。

需要修订的文档步骤：

- 步骤1.3：Provider 不再导出 useTheme（避免与 hooks 层默认导出逻辑冲突）；仅导出 ThemeProvider 与 ThemeContext 即可。
- 步骤1.4：不要“直接改为从 Provider 重导出 useTheme（具名）”，而是“在 hooks/useTheme.ts 中实现向后兼容的默认导出，并额外具名导出 ThemeProvider”。本文件已在下方替换为兼容实现示例。

基于项目现状分析，制定详细的@emotion CSS-in-JS迁移实施方案。

## 📋 项目现状分析

### 当前技术栈

- ✅ 已安装 `@emotion/react@^11.14.0` 和 `@emotion/styled@^11.14.1`
- ✅ 已有基础主题系统 (`src/theme/tokens.ts`)
- ✅ 已有 `useTheme` hook
- ✅ Button组件已使用内联样式（部分CSS-in-JS思想）
- 🔄 主要使用 Tailwind CSS 进行样式管理
- 🔄 少量传统CSS文件（主要是全局样式）

### 迁移目标

1. 建立完整的@emotion主题系统
2. 逐步将组件迁移到CSS-in-JS
3. 保持向后兼容性
4. 优化开发体验和运行时性能

## 🚀 详细实施步骤

### 阶段一：基础设施搭建（预计1-2天）

#### 步骤1.1：扩展主题系统

**文件：`src/theme/tokens.ts`**

```typescript
// 完整的设计系统tokens
export const designTokens = {
  colors: {
    // 现有primary颜色保持不变
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6', // 保持现有值
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a', // 保持现有值
    },
    // 新增颜色系统
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    semantic: {
      success: '#10b981', // 保持现有值
      warning: '#f59e0b', // 保持现有值
      error: '#ef4444', // 保持现有值
      info: '#3b82f6',
    },
  },
  spacing: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96], // 保持现有值
  typography: {
    fonts: {
      body: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'Fira Code, Consolas, monospace',
    },
    sizes: [12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72], // 保持现有值
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  // 新增设计系统
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

// 类型定义
export type ColorToken = keyof typeof designTokens.colors.primary;
export type SpacingToken = (typeof designTokens.spacing)[number];
export type BreakpointToken = keyof typeof designTokens.breakpoints;
export type ShadowToken = keyof typeof designTokens.shadows;
export type RadiusToken = keyof typeof designTokens.radii;
export type TransitionToken = keyof typeof designTokens.transitions;

// 主题模式类型
export type ThemeMode = 'light' | 'dark';

// 完整主题类型
export interface Theme {
  tokens: typeof designTokens;
  mode: ThemeMode;
  isDark: boolean;
  colors: typeof designTokens.colors & {
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    border: string;
  };
}
```

#### 步骤1.2：创建Emotion类型增强

**创建文件：`src/types/emotion.d.ts`**

```typescript
import '@emotion/react';
import type { Theme } from '../theme/tokens';

declare module '@emotion/react' {
  export interface Theme extends import('../theme/tokens').Theme {}
}
```

#### 步骤1.3：创建ThemeProvider

**创建文件：`src/providers/ThemeProvider.tsx`**

```typescript
import React, { createContext, useContext, useMemo } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import type { ReactNode } from 'react';
import { designTokens, type Theme, type ThemeMode } from '../theme/tokens';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  mode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'light',
  mode: controlledMode,
  onModeChange,
}) => {
  const [internalMode, setInternalMode] = React.useState<ThemeMode>(defaultMode);
  const mode = controlledMode ?? internalMode;
  const isDark = mode === 'dark';

  // 计算主题值
  const theme = useMemo((): Theme => {
    const baseTheme = {
      tokens: designTokens,
      mode,
      isDark,
      colors: {
        ...designTokens.colors,
        // 根据模式动态计算颜色
        background: isDark ? designTokens.colors.neutral[900] : '#ffffff',
        surface: isDark ? designTokens.colors.neutral[800] : '#ffffff',
        text: {
          primary: isDark ? designTokens.colors.neutral[50] : designTokens.colors.neutral[900],
          secondary: isDark ? designTokens.colors.neutral[300] : designTokens.colors.neutral[600],
          disabled: isDark ? designTokens.colors.neutral[500] : designTokens.colors.neutral[400],
        },
        border: isDark ? designTokens.colors.neutral[700] : designTokens.colors.neutral[200],
      },
    };
    return baseTheme;
  }, [mode, isDark]);

  const toggleMode = React.useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    if (controlledMode) {
      onModeChange?.(newMode);
    } else {
      setInternalMode(newMode);
      onModeChange?.(newMode);
    }
  }, [mode, controlledMode, onModeChange]);

  const setMode = React.useCallback((newMode: ThemeMode) => {
    if (controlledMode) {
      onModeChange?.(newMode);
    } else {
      setInternalMode(newMode);
      onModeChange?.(newMode);
    }
  }, [controlledMode, onModeChange]);

  const contextValue = useMemo(() => ({
    theme,
    mode,
    toggleMode,
    setMode,
  }), [theme, mode, toggleMode, setMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <EmotionThemeProvider theme={theme}>
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};

// 更新useTheme hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

#### 步骤1.4：更新现有useTheme hook

**修改文件：`src/hooks/useTheme.ts`**

```typescript
// 重新导出新的useTheme
export { useTheme, ThemeProvider } from '../providers/ThemeProvider';
export type { Theme, ThemeMode } from '../theme/tokens';
```

#### 步骤1.5：在App中集成ThemeProvider

**修改文件：`src/App.tsx`**

```typescript
import { useState } from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import FileUploaderExample from './examples/FileUploaderExample';
import FileUploaderTExample from './examples/FileUploaderTExample';

function App() {
  const [activeTab, setActiveTab] = useState<
    'datatable' | 'fileuploader' | 'fileuploadert'
  >('fileuploadert');

  return (
    <ThemeProvider defaultMode="light">
      <div className="min-h-screen bg-gray-50">
        {/* 现有内容保持不变 */}
        {/* ... */}
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### 阶段二：Button组件迁移（预计半天）

#### 步骤2.1：创建Button样式组件

**创建文件：`src/compoents/Button/Button.styled.ts`**

```typescript
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
```

#### 步骤2.2：重构Button组件

**修改文件：`src/compoents/Button/Button.tsx`**

```typescript
import React, { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { StyledButton, StyledSpinner, IconContainer } from './Button.styled';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <StyledButton
        ref={ref}
        type={type}
        variant={variant}
        size={size}
        fullWidth={props.fullWidth}
        disabled={loading || disabled}
        {...props}
      >
        {loading && <StyledSpinner size={size} />}
        {icon && (
          <IconContainer hasChildren={!!children}>
            {icon}
          </IconContainer>
        )}
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

export type { ButtonProps };
export default Button;
```

### 阶段三：DataTable组件迁移（预计1-2天）

#### 步骤3.1：创建DataTable样式组件

**创建文件：`src/compoents/DataTable/DataTable.styled.ts`**

```typescript
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import type { Theme } from '../../theme/tokens';

// 表格容器
export const TableContainer = styled.div`
  ${({ theme }) => css`
    background: ${theme.colors.surface};
    border-radius: ${theme.tokens.radii.lg};
    box-shadow: ${theme.tokens.shadows.md};
    overflow: hidden;
    border: 1px solid ${theme.colors.border};
  `}
`;

// 表格主体
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

// 表头
export const TableHead = styled.thead`
  ${({ theme }) => css`
    background-color: ${theme.isDark
      ? theme.tokens.colors.neutral[800]
      : theme.tokens.colors.neutral[50]};
    border-bottom: 1px solid ${theme.colors.border};
  `}
`;

// 表头行
export const TableHeaderRow = styled.tr`
  ${({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.border};
  `}
`;

// 表头单元格
export const TableHeaderCell = styled.th<{
  sortable?: boolean;
  width?: number;
}>`
  ${({ theme, sortable, width }) => css`
    padding: ${theme.tokens.spacing[3]}px ${theme.tokens.spacing[4]}px;
    text-align: left;
    font-weight: ${theme.tokens.typography.weights.semibold};
    font-size: ${theme.tokens.typography.sizes[1]}px;
    color: ${theme.colors.text.primary};
    cursor: ${sortable ? 'pointer' : 'default'};
    user-select: none;
    position: relative;
    ${width && `width: ${width}px;`}

    &:hover {
      ${sortable &&
      `background-color: ${theme.isDark ? theme.tokens.colors.neutral[700] : theme.tokens.colors.neutral[100]};`}
    }

    &:not(:last-child) {
      border-right: 1px solid ${theme.colors.border};
    }
  `}
`;

// 排序图标
export const SortIcon = styled.span<{ direction?: 'asc' | 'desc' }>`
  ${({ theme, direction }) => css`
    display: inline-flex;
    align-items: center;
    margin-left: ${theme.tokens.spacing[1]}px;
    opacity: ${direction ? 1 : 0.3};
    transition: opacity ${theme.tokens.transitions.fast};

    &::after {
      content: '${direction === 'asc'
        ? '↑'
        : direction === 'desc'
          ? '↓'
          : '↕'}';
      font-size: 12px;
    }
  `}
`;

// 表格主体
export const TableBody = styled.tbody``;

// 表格行
export const TableRow = styled.tr<{ selected?: boolean; clickable?: boolean }>`
  ${({ theme, selected, clickable }) => css`
    border-bottom: 1px solid ${theme.colors.border};
    transition: background-color ${theme.tokens.transitions.fast};
    cursor: ${clickable ? 'pointer' : 'default'};

    ${selected &&
    css`
      background-color: ${theme.tokens.colors.primary[50]};
    `}

    &:hover {
      background-color: ${theme.isDark
        ? theme.tokens.colors.neutral[800]
        : theme.tokens.colors.neutral[50]};
    }

    &:last-child {
      border-bottom: none;
    }
  `}
`;

// 表格单元格
export const TableCell = styled.td`
  ${({ theme }) => css`
    padding: ${theme.tokens.spacing[3]}px ${theme.tokens.spacing[4]}px;
    font-size: ${theme.tokens.typography.sizes[1]}px;
    color: ${theme.colors.text.primary};

    &:not(:last-child) {
      border-right: 1px solid ${theme.colors.border};
    }
  `}
`;

// 复选框单元格
export const CheckboxCell = styled(TableCell)`
  width: 48px;
  text-align: center;
`;

// 加载状态容器
export const LoadingContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.tokens.spacing[8]}px;
    color: ${theme.colors.text.secondary};
  `}
`;

// 空状态容器
export const EmptyContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.tokens.spacing[8]}px;
    color: ${theme.colors.text.secondary};

    svg {
      width: 48px;
      height: 48px;
      margin-bottom: ${theme.tokens.spacing[4]}px;
      opacity: 0.5;
    }
  `}
`;

// 分页容器
export const PaginationContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.tokens.spacing[4]}px ${theme.tokens.spacing[6]}px;
    border-top: 1px solid ${theme.colors.border};
    background-color: ${theme.colors.surface};
  `}
`;
```

#### 步骤3.2：重构DataTable组件

**修改文件：`src/compoents/DataTable/DataTable.tsx`**

```typescript
import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { VirtualList } from '../VirtualList/VirtualList';
import { TableSkeleton } from './TableSkeleton';
import { Pagination } from './Pagination';
import {
  TableContainer,
  Table,
  TableHead,
  TableHeaderRow,
  TableHeaderCell,
  SortIcon,
  TableBody,
  TableRow,
  TableCell,
  CheckboxCell,
  LoadingContainer,
  EmptyContainer,
  PaginationContainer,
} from './DataTable.styled';

export interface Column<T> {
  key: keyof T;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: T, index: number) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T;
  pagination?: {
    pageSize: number;
    showSizeChanger?: boolean;
  };
  loading?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  virtualScroll?: boolean;
  selectable?: boolean;
}

export const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  pagination,
  loading,
  onRowSelect,
  virtualScroll = false,
  selectable = false,
}: DataTableProps<T>) => {
  // 状态管理保持不变
  const [sorting, setSorting] = useState<
    Array<{ key: keyof T; direction: 'asc' | 'desc' }>
  >([]);
  const [filters, setFilters] = useState<Partial<Record<keyof T, unknown>>>({});
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // 数据处理逻辑保持不变
  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = String(item[key as keyof T]).toLowerCase();
        return itemValue.includes(String(value).toLowerCase());
      });
    });
  }, [data, filters]);

  const sortedData = useMemo(() => {
    if (sorting.length === 0) return filteredData;

    return [...filteredData].sort((a, b) => {
      for (const sort of sorting) {
        const aVal = a[sort.key];
        const bVal = b[sort.key];
        if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sorting]);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pagination]);

  // 操作函数
  const handleSort = (key: keyof T) => {
    const currentSort = sorting.find(s => s.key === key);
    if (!currentSort) {
      setSorting([{ key, direction: 'asc' }]);
    } else if (currentSort.direction === 'asc') {
      setSorting([{ key, direction: 'desc' }]);
    } else {
      setSorting([]);
    }
  };

  const handleRowSelect = (row: T, selected: boolean) => {
    if (selected) {
      setSelectedRows(prev => [...prev, row]);
    } else {
      setSelectedRows(prev => prev.filter(r => r[rowKey] !== row[rowKey]));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(paginatedData);
    } else {
      setSelectedRows([]);
    }
  };

  React.useEffect(() => {
    onRowSelect?.(selectedRows);
  }, [selectedRows, onRowSelect]);

  if (loading) {
    return (
      <TableContainer>
        <LoadingContainer>
          <TableSkeleton />
        </LoadingContainer>
      </TableContainer>
    );
  }

  if (data.length === 0) {
    return (
      <TableContainer>
        <EmptyContainer>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
          </svg>
          <p>暂无数据</p>
        </EmptyContainer>
      </TableContainer>
    );
  }

  const renderTable = () => (
    <Table>
      <TableHead>
        <TableHeaderRow>
          {selectable && (
            <CheckboxCell as="th">
              <input
                type="checkbox"
                checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </CheckboxCell>
          )}
          {columns.map((column) => {
            const currentSort = sorting.find(s => s.key === column.key);
            return (
              <TableHeaderCell
                key={String(column.key)}
                sortable={column.sortable}
                width={column.width}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                {column.title}
                {column.sortable && (
                  <SortIcon direction={currentSort?.direction} />
                )}
              </TableHeaderCell>
            );
          })}
        </TableHeaderRow>
      </TableHead>
      <TableBody>
        {paginatedData.map((row, index) => {
          const isSelected = selectedRows.some(r => r[rowKey] === row[rowKey]);
          return (
            <TableRow
              key={String(row[rowKey])}
              selected={isSelected}
              clickable={selectable}
            >
              {selectable && (
                <CheckboxCell>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => handleRowSelect(row, e.target.checked)}
                  />
                </CheckboxCell>
              )}
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render
                    ? column.render(row[column.key], row, index)
                    : String(row[column.key] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  return (
    <TableContainer>
      {virtualScroll ? (
        <VirtualList
          items={paginatedData}
          itemHeight={48}
          renderItem={({ item, index }) => (
            <TableRow key={String(item[rowKey])}>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render
                    ? column.render(item[column.key], item, index)
                    : String(item[column.key] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          )}
        />
      ) : (
        renderTable()
      )}

      {pagination && (
        <PaginationContainer>
          <Pagination
            current={currentPage}
            pageSize={pagination.pageSize}
            total={sortedData.length}
            onChange={setCurrentPage}
            showSizeChanger={pagination.showSizeChanger}
          />
        </PaginationContainer>
      )}
    </TableContainer>
  );
};

export default DataTable;
```

### 阶段四：FileUploader组件迁移（预计1天）

#### 步骤4.1：创建FileUploader样式组件

**创建文件：`src/compoents/FileUploader/FileUploader.styled.ts`**

```typescript
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import type { Theme } from '../../theme/tokens';

// 动画定义
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 主容器
export const UploaderContainer = styled.div`
  ${({ theme }) => css`
    width: 100%;
    font-family: ${theme.tokens.typography.fonts.body};
  `}
`;

// 拖拽区域
export const DropZone = styled.div<{ isDragOver: boolean; disabled: boolean }>`
  ${({ theme, isDragOver, disabled }) => css`
    border: 2px dashed
      ${isDragOver ? theme.tokens.colors.primary[500] : theme.colors.border};
    border-radius: ${theme.tokens.radii.lg};
    padding: ${theme.tokens.spacing[8]}px;
    text-align: center;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    transition: all ${theme.tokens.transitions.normal};
    background-color: ${isDragOver
      ? theme.tokens.colors.primary[50]
      : theme.colors.surface};
    opacity: ${disabled ? 0.6 : 1};

    &:hover:not([disabled]) {
      border-color: ${theme.tokens.colors.primary[400]};
      background-color: ${theme.tokens.colors.primary[25]};
    }

    &:focus-within {
      outline: 2px solid ${theme.tokens.colors.primary[500]};
      outline-offset: 2px;
    }
  `}
`;

// 上传图标
export const UploadIcon = styled.div`
  ${({ theme }) => css`
    width: 48px;
    height: 48px;
    margin: 0 auto ${theme.tokens.spacing[4]}px;
    color: ${theme.colors.text.secondary};

    svg {
      width: 100%;
      height: 100%;
    }
  `}
`;

// 上传文本
export const UploadText = styled.div`
  ${({ theme }) => css`
    margin-bottom: ${theme.tokens.spacing[2]}px;

    .primary {
      color: ${theme.colors.text.primary};
      font-weight: ${theme.tokens.typography.weights.medium};
      font-size: ${theme.tokens.typography.sizes[2]}px;
    }

    .secondary {
      color: ${theme.colors.text.secondary};
      font-size: ${theme.tokens.typography.sizes[1]}px;
      margin-top: ${theme.tokens.spacing[1]}px;
    }
  `}
`;

// 隐藏的文件输入
export const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// 文件列表容器
export const FileListContainer = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.tokens.spacing[6]}px;
  `}
`;

// 文件项
export const FileItem = styled.div<{ status: string }>`
  ${({ theme, status }) => css`
    display: flex;
    align-items: center;
    padding: ${theme.tokens.spacing[3]}px ${theme.tokens.spacing[4]}px;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.tokens.radii.md};
    margin-bottom: ${theme.tokens.spacing[2]}px;
    background-color: ${theme.colors.surface};
    animation: ${slideIn} ${theme.tokens.transitions.normal};

    ${status === 'error' &&
    css`
      border-color: ${theme.tokens.colors.semantic.error};
      background-color: ${theme.tokens.colors.semantic.error}10;
    `}

    ${status === 'success' &&
    css`
      border-color: ${theme.tokens.colors.semantic.success};
      background-color: ${theme.tokens.colors.semantic.success}10;
    `}
    
    &:last-child {
      margin-bottom: 0;
    }
  `}
`;

// 文件图标
export const FileIcon = styled.div<{ status: string }>`
  ${({ theme, status }) => css`
    width: 32px;
    height: 32px;
    margin-right: ${theme.tokens.spacing[3]}px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.tokens.radii.sm};

    ${status === 'uploading' &&
    css`
      animation: ${pulse} 2s infinite;
    `}

    svg {
      width: 20px;
      height: 20px;
      color: ${status === 'error'
        ? theme.tokens.colors.semantic.error
        : status === 'success'
          ? theme.tokens.colors.semantic.success
          : theme.colors.text.secondary};
    }
  `}
`;

// 文件信息
export const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

// 文件名
export const FileName = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.tokens.typography.sizes[1]}px;
    font-weight: ${theme.tokens.typography.weights.medium};
    color: ${theme.colors.text.primary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`;

// 文件大小和状态
export const FileStatus = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.tokens.typography.sizes[0]}px;
    color: ${theme.colors.text.secondary};
    margin-top: ${theme.tokens.spacing[1]}px;
    display: flex;
    align-items: center;
    gap: ${theme.tokens.spacing[2]}px;
  `}
`;

// 进度条容器
export const ProgressContainer = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.tokens.spacing[2]}px;
  `}
`;

// 进度条
export const ProgressBar = styled.div`
  ${({ theme }) => css`
    width: 100%;
    height: 4px;
    background-color: ${theme.colors.border};
    border-radius: ${theme.tokens.radii.full};
    overflow: hidden;
  `}
`;

// 进度条填充
export const ProgressFill = styled.div<{ progress: number }>`
  ${({ theme, progress }) => css`
    height: 100%;
    background-color: ${theme.tokens.colors.primary[500]};
    border-radius: ${theme.tokens.radii.full};
    transition: width ${theme.tokens.transitions.normal};
    width: ${progress}%;
  `}
`;

// 操作按钮容器
export const ActionButtons = styled.div`
  ${({ theme }) => css`
    display: flex;
    gap: ${theme.tokens.spacing[2]}px;
    margin-left: ${theme.tokens.spacing[3]}px;
  `}
`;

// 操作按钮
export const ActionButton = styled.button<{ variant?: 'danger' }>`
  ${({ theme, variant }) => css`
    width: 24px;
    height: 24px;
    border: none;
    border-radius: ${theme.tokens.radii.sm};
    background-color: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all ${theme.tokens.transitions.fast};

    svg {
      width: 14px;
      height: 14px;
      color: ${variant === 'danger'
        ? theme.tokens.colors.semantic.error
        : theme.colors.text.secondary};
    }

    &:hover {
      background-color: ${variant === 'danger'
        ? theme.tokens.colors.semantic.error + '20'
        : theme.colors.border};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}
`;
```

### 阶段五：构建配置优化（预计半天）

#### 步骤5.1：更新Rollup配置

**修改文件：`rollup.config.js`**

```javascript
// 在external数组中确保@emotion依赖被正确排除
external: [
  'react',
  'react-dom',
  '@emotion/react',
  '@emotion/styled',
  '@emotion/css', // 新增
  'framer-motion',
  'clsx',
  'crypto-js',
  'lodash-es',
],
```

#### 步骤5.2：更新TypeScript配置

**修改文件：`tsconfig.lib.json`**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "dist/types",
    "declaration": true,
    "emitDeclarationOnly": true,
    "jsx": "react-jsx",
    "jsxImportSource": "@emotion/react"
  },
  "include": ["src/**/*"],
  "exclude": [
    "src/**/*.test.tsx",
    "src/**/*.test.ts",
    "src/**/*.stories.tsx",
    "src/examples/**",
    "src/stories/**",
    "src/test/**",
    "src/tests/**",
    "src/main.tsx",
    "src/App.tsx"
  ]
}
```

### 阶段六：测试和验证（预计半天）

#### 步骤6.1：创建测试用例

**创建文件：`src/compoents/Button/__tests__/Button.emotion.test.tsx`**

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../../../providers/ThemeProvider';
import { Button } from '../Button';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider defaultMode="light">
      {component}
    </ThemeProvider>
  );
};

describe('Button with Emotion', () => {
  it('renders with correct styles', () => {
    renderWithTheme(<Button>Test Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies variant styles correctly', () => {
    renderWithTheme(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('handles loading state', () => {
    renderWithTheme(<Button loading>Loading Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

#### 步骤6.2：运行测试

```bash
# 运行测试
pnpm test

# 运行构建测试
pnpm run build:lib

# 检查构建产物
ls -la dist/
```

## 🔧 开发规范和最佳实践

### 1. 样式组件命名规范

- 使用 `Styled` 前缀：`StyledButton`、`StyledContainer`
- 使用语义化命名：`PrimaryButton`、`ErrorMessage`
- 避免过于具体的样式名：避免 `RedButton`，使用 `DangerButton`

### 2. 主题使用规范

```typescript
// ✅ 正确：使用主题tokens
const StyledButton = styled.button`
  color: ${({ theme }) => theme.tokens.colors.primary[500]};
  padding: ${({ theme }) => theme.tokens.spacing[2]}px;
`;

// ❌ 错误：硬编码值
const StyledButton = styled.button`
  color: #3b82f6;
  padding: 8px;
`;
```

### 3. 响应式设计

```typescript
// 使用主题断点
const ResponsiveContainer = styled.div`
  padding: ${({ theme }) => theme.tokens.spacing[4]}px;

  @media (min-width: ${({ theme }) => theme.tokens.breakpoints.md}) {
    padding: ${({ theme }) => theme.tokens.spacing[6]}px;
  }
`;
```

### 4. 性能优化

```typescript
// ✅ 正确：将样式对象提取到组件外部
const baseStyles = (theme: Theme) => css`
  color: ${theme.colors.text.primary};
`;

const MyComponent = styled.div`
  ${({ theme }) => baseStyles(theme)}
`;

// ❌ 错误：在render中创建样式对象
const MyComponent = () => {
  const styles = css`
    color: red;
  `;
  return <div css={styles}>Content</div>;
};
```

## 📝 迁移检查清单

### 阶段一完成检查

- [ ] `src/theme/tokens.ts` 已扩展完整设计系统
- [ ] `src/types/emotion.d.ts` 类型增强文件已创建
- [ ] `src/providers/ThemeProvider.tsx` 已创建并集成
- [ ] `src/hooks/useTheme.ts` 已更新
- [ ] `src/App.tsx` 已集成ThemeProvider
- [ ] 主题切换功能正常工作

### 阶段二完成检查

- [ ] `src/compoents/Button/Button.styled.ts` 已创建
- [ ] Button组件已重构使用styled-components
- [ ] 所有Button变体样式正确
- [ ] Button组件测试通过
- [ ] 向后兼容性保持

### 阶段三完成检查

- [ ] `src/compoents/DataTable/DataTable.styled.ts` 已创建
- [ ] DataTable组件已重构
- [ ] 表格样式在不同主题下正确显示
- [ ] 排序、分页功能正常
- [ ] 响应式设计保持

### 阶段四完成检查

- [ ] `src/compoents/FileUploader/FileUploader.styled.ts` 已创建
- [ ] FileUploader组件已重构
- [ ] 拖拽交互样式正确
- [ ] 上传进度样式正确
- [ ] 错误状态样式正确

### 阶段五完成检查

- [ ] Rollup配置已更新
- [ ] TypeScript配置已更新
- [ ] 构建产物正确生成
- [ ] 按需导入功能正常

### 阶段六完成检查

- [ ] 所有组件测试通过
- [ ] 视觉回归测试通过
- [ ] 性能测试通过
- [ ] 文档已更新

## 🚨 注意事项

1. **渐进迁移**：不要一次性替换所有组件，按阶段进行
2. **向后兼容**：确保现有API不变，新功能通过新props添加
3. **性能监控**：关注构建产物大小和运行时性能
4. **测试覆盖**：每个阶段都要有充分的测试
5. **文档更新**：及时更新组件文档和使用示例

## 🎯 预期收益

1. **开发体验提升**：更好的TypeScript支持，主题系统集成
2. **维护性提升**：统一的样式管理，减少样式冲突
3. **性能优化**：运行时样式计算，按需加载
4. **主题系统**：完整的明暗主题支持，动态主题切换
5. **设计系统**：统一的设计tokens，更好的设计一致性

---

本方案提供了详细的实施步骤，你可以按照每个阶段逐步执行。每个步骤都包含了具体的代码示例和文件路径，确保迁移过程顺利进行。
