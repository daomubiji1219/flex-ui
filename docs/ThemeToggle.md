# ThemeToggle 主题切换组件

用于在亮色和暗色模式之间切换的按钮组件。

## 基本用法

最简单的用法是直接使用组件，它会根据当前主题显示相应的图标（太阳/月亮）。

```tsx
import { ThemeToggle } from '@daomu/flexi-ui';

function App() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}
```

## 自定义内容

你可以通过 `children` 属性自定义按钮的文本内容。

<DemoContainer title="自定义内容">
  <ReactDemo name="ThemeToggle" variant="custom" />
</DemoContainer>

```tsx
<ThemeToggle>点击切换主题</ThemeToggle>
```

## API

### Props

| 属性        | 类型        | 默认值 | 说明                             |
| ----------- | ----------- | ------ | -------------------------------- |
| `children`  | `ReactNode` | -      | 可选的子元素，用于自定义按钮内容 |
| `className` | `string`    | -      | 自定义 CSS 类名                  |

## 依赖

该组件依赖于 `ThemeProvider`。请确保你的应用包裹在 `ThemeProvider` 中。

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
