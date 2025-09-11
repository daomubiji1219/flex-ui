# Flexi-UI CSS-in-JS 迁移方案

基于当前项目实际情况（已安装 @emotion/react 和 @emotion/styled，存在传统 CSS 文件，现有 useTheme hook），制定渐进式 CSS-in-JS 迁移策略。

## 0. 总体目标

- 渐进式迁移，不强制一次性替换所有样式方案
- 保持现有组件功能不变，确保向后兼容
- 建立统一的主题系统，支持动态主题切换
- 优化运行时性能，减少样式冲突

## 1. 迁移策略（三阶段推进）

### 阶段一：基础设施

- 集成 Emotion ThemeProvider 到应用根部
- 扩展现有 tokens.ts，支持完整的设计系统
- 建立 CSS-in-JS 组件开发规范
- 选择 1-2 个简单组件进行试点迁移

### 阶段二：核心组件迁移

- 迁移 Button、DataTable 等核心组件
- 建立样式变体系统（variants、sizes、states）
- 保持 CSS 文件与 CSS-in-JS 并存，确保稳定性
- 验证主题切换功能完整性

### 阶段三：全面优化

- 迁移剩余组件（FileUploader、VirtualList 等）
- 移除冗余 CSS 文件
- 优化构建产物，减少样式重复
- 建立完整的样式测试覆盖

## 2. 技术架构设计

### 2.1 主题系统扩展

```typescript
// src/theme/tokens.ts 扩展
export const designTokens = {
  colors: {
    primary: {
      /* 现有配置 */
    },
    secondary: {
      /* 新增 */
    },
    neutral: {
      /* 新增 */
    },
    semantic: {
      /* 现有配置 */
    },
  },
  spacing: [
    /* 现有配置 */
  ],
  typography: {
    /* 现有配置 */
  },
  // 新增配置
  breakpoints: ['480px', '768px', '1024px', '1280px'],
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
} as const;
```

### 2.2 ThemeProvider 集成

```typescript
// src/providers/ThemeProvider.tsx
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import type { ReactNode } from 'react';
import { designTokens } from '../theme/tokens';

interface ThemeProviderProps {
  children: ReactNode;
  mode?: 'light' | 'dark';
}

export const ThemeProvider = ({ children, mode = 'light' }: ThemeProviderProps) => {
  const theme = {
    ...designTokens,
    mode,
    // 动态主题计算逻辑
  };

  return (
    <EmotionThemeProvider theme={theme}>
      {children}
    </EmotionThemeProvider>
  );
};
```

### 2.3 样式组件规范

```typescript
// 组件样式定义规范
import styled from '@emotion/styled';
import type { Theme } from '../theme/types';

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  /* 基础样式 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: ${({ theme }) => theme.transitions.normal};

  /* 尺寸变体 */
  ${({ size, theme }) => {
    const sizeMap = {
      sm: { padding: theme.spacing[1], fontSize: theme.typography.sizes[1] },
      md: { padding: theme.spacing[2], fontSize: theme.typography.sizes[2] },
      lg: { padding: theme.spacing[3], fontSize: theme.typography.sizes[3] },
    };
    return sizeMap[size];
  }}

  /* 颜色变体 */
  ${({ variant, theme }) => {
    const variantMap = {
      primary: {
        backgroundColor: theme.colors.primary[500],
        color: 'white',
        '&:hover': {
          backgroundColor: theme.colors.primary[600],
        },
      },
      // 其他变体...
    };
    return variantMap[variant];
  }}
  
  /* 全宽样式 */
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
`;
```

## 3. 迁移实施步骤

### 步骤 1：基础设施准备

1. 扩展 `src/theme/tokens.ts`，添加完整设计系统
2. 创建 `src/providers/ThemeProvider.tsx`
3. 在 `src/App.tsx` 中集成 ThemeProvider
4. 创建样式组件开发规范文档
5. 添加 Emotion Theme 类型增强文件（`src/types/emotion.d.ts`），通过模块扩展将 `@emotion/react` 的 `Theme` 接口与 `tokens` 对齐，并包含 `mode`

### 步骤 2：试点组件迁移（Button）

1. 创建 `src/components/Button/Button.styled.ts`
2. 重构 Button 组件，使用 @emotion/styled
3. 保持原有 props 接口不变
4. 添加样式变体支持
5. 验证主题切换功能

### 步骤 3：扩展迁移（DataTable）

1. 分析 DataTable 样式复杂度
2. 创建对应的 styled 组件
3. 处理表格特有样式（排序、分页等）
4. 确保响应式设计不受影响

### 步骤 4：复杂组件迁移（FileUploader）

1. 处理文件上传组件的交互状态样式
2. 迁移拖拽区域、进度条等复杂样式
3. 保持现有 CSS 文件作为备选方案
4. 逐步验证各种边界情况

### 步骤 5：构建优化

1. 更新 Rollup 配置，优化 CSS-in-JS 产物
2. 配置 Emotion babel 插件（如需要）
3. 验证按需导入不受影响
4. 测试构建产物大小变化

## 4. 兼容性策略

### 4.1 渐进迁移

- 新组件优先使用 CSS-in-JS
- 现有组件保持 CSS 文件，逐步迁移
- 支持混合使用，确保稳定性

### 4.2 API 兼容

- 保持现有组件 props 接口不变
- 新增主题相关 props（如 `themeVariant`）
- 向后兼容现有样式覆盖方式

### 4.3 构建兼容

- 保持 `sideEffects: ["**/*.css"]` 配置
- CSS 文件与 CSS-in-JS 并存期间的构建策略
- 确保按需导入正常工作

## 5. 性能考虑

### 5.1 运行时优化

- 使用 Emotion 的样式缓存机制
- 避免在 render 中创建样式对象
- 合理使用 `shouldForwardProp` 优化

### 5.2 构建优化

- 配置 Emotion babel 插件进行编译时优化
- 使用 CSS 提取（如需要）
- 监控构建产物大小变化

## 6. 测试策略

### 6.1 视觉回归测试

- 使用 Storybook 进行组件视觉测试
- 对比迁移前后的视觉效果
- 测试不同主题下的表现

### 6.2 功能测试

- 确保组件功能不受影响
- 测试主题切换功能
- 验证响应式设计

### 6.3 性能测试

- 对比迁移前后的运行时性能
- 测试首屏渲染时间
- 监控内存使用情况

## 7. 风险评估与对策

### 7.1 主要风险

- **样式冲突**：CSS 文件与 CSS-in-JS 样式冲突
- **性能影响**：运行时样式计算可能影响性能
- **构建复杂度**：增加构建配置复杂度
- **学习成本**：团队需要学习 CSS-in-JS 最佳实践

### 7.2 对策

- **渐进迁移**：分阶段进行，降低风险
- **充分测试**：每个阶段都进行充分的测试验证
- **回滚机制**：保持 CSS 文件作为备选方案
- **文档完善**：提供详细的开发指南和最佳实践

## 8. 成功指标

### 8.1 技术指标

- 构建产物大小变化在可接受范围内（±20%）
- 运行时性能不低于现有水平
- 主题切换响应时间 < 100ms
- 组件渲染性能提升或持平

### 8.2 开发体验指标

- 样式开发效率提升
- 主题定制更加灵活
- 样式冲突问题减少
- 代码维护性提升

## 9. 后续规划

### 9.1 短期目标（1-2 个月）

- 完成基础设施
- 迁移 2-3 个核心组件
- 建立开发规范

### 9.2 中期目标（3-6 个月）

- 完成所有组件迁移
- 优化构建配置
- 完善测试覆盖

### 9.3 长期目标（6 个月以上）

- 建立完整的设计系统
- 支持高级主题定制
- 探索更多性能优化方案

---

本方案采用渐进式迁移策略，确保在提升开发体验的同时，保持系统稳定性和向后兼容性。通过分阶段实施，可以有效控制风险，确保迁移成功。
