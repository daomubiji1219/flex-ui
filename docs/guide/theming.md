# 主题定制

Flexi-UI 提供了一个灵活的 CSS-in-JS 主题系统，允许你轻松定制应用的外观。

## 默认主题

Flexi-UI 内置了一套基于现代设计规范的默认主题，包含：

- 颜色系统 (Colors)
- 字体排版 (Typography)
- 间距 (Spacing)
- 圆角 (Border Radius)
- 阴影 (Shadows)

## 定制主题

你可以通过 `ThemeProvider` 的 `theme` 属性覆盖默认主题配置：

```tsx
import { ThemeProvider, type Theme } from 'flexi-ui';

const customTheme: Partial<Theme> = {
  tokens: {
    colors: {
      primary: {
        500: '#e11d48', // 修改主色调为玫瑰红
      },
    },
    borderRadius: {
      md: '8px',
    },
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <AppContent />
    </ThemeProvider>
  );
}
```

## 暗色模式

Flexi-UI 内置了暗色模式支持。你可以通过 `defaultMode` 属性设置初始模式，或使用 `useTheme` Hook 动态切换。

```tsx
<ThemeProvider defaultMode="dark">
  <App />
</ThemeProvider>
```

### 切换主题

使用 `useTheme` Hook 在组件内部切换主题：

```tsx
import { useTheme, Button } from 'flexi-ui';

function ThemeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <Button onClick={toggleMode}>
      当前模式: {mode === 'light' ? '🌞' : '🌙'}
    </Button>
  );
}
```

## 类型定义

Flexi-UI 导出了完整的主题类型定义，配合 TypeScript 使用可以获得极佳的开发体验。

```tsx
import type { Theme, ThemeMode } from 'flexi-ui';
```
