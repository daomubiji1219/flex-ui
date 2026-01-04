# ThemeToggle 主题切换

用于在明亮模式和暗黑模式之间切换的组件。

## 基本用法

```tsx
import { ThemeToggle } from '@daomu/flexi-ui';

function App() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}
```

## 自定义内容

你可以通过 `children` 属性自定义按钮内容，或者使用 `className` 自定义样式。

```tsx
import { ThemeToggle } from '@daomu/flexi-ui';

function CustomToggle() {
  return (
    <ThemeToggle className="my-custom-class">
      <span>切换主题</span>
    </ThemeToggle>
  );
}
```

## API

| 属性        | 类型        | 默认值 | 说明            |
| ----------- | ----------- | ------ | --------------- |
| `children`  | `ReactNode` | -      | 自定义按钮内容  |
| `className` | `string`    | -      | 自定义 CSS 类名 |

## 依赖

此组件依赖 `ThemeProvider`，请确保你的应用包裹在 `ThemeProvider` 中。

```tsx
import { ThemeProvider, ThemeToggle } from '@daomu/flexi-ui';

function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
```
