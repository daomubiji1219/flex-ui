# 组件开发规范

为了保持代码风格一致和高质量，我们制定了以下组件开发规范。

## 目录结构

每个组件应包含在一个独立的目录中：

```
Button/
├── Button.tsx          # 组件实现
├── Button.styled.ts    # 样式定义 (CSS-in-JS)
├── index.ts           # 导出文件
├── README.md          # 组件文档
└── __tests__/         # 测试文件
    └── Button.test.tsx
```

## 命名规范

- **组件名**: PascalCase (e.g., `DataTable`)
- **文件名**: PascalCase (e.g., `DataTable.tsx`)
- **接口名**: PascalCase (e.g., `DataTableProps`)
- **样式组件**: 以 Styled 结尾或具名 (e.g., `StyledButton`, `TableContainer`)

## Props 定义

必须定义 TypeScript 接口，并包含详细的 JSDoc 注释：

```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 按钮样式变体
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}
```

## 样式处理

使用 `@emotion/styled` 进行样式定义，避免使用内联样式。

```tsx
import styled from '@emotion/styled';

export const StyledButton = styled.button`
  /* 样式代码 */
`;
```
