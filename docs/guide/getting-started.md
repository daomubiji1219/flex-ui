# 快速开始

只需几分钟，你就可以开始使用 Flexi-UI 构建现代化的 React 应用。

## 1. 安装

使用你喜欢的包管理器安装 Flexi-UI：

```bash
# pnpm (推荐)
pnpm add flexi-ui

# npm
npm install flexi-ui

# yarn
yarn add flexi-ui
```

## 2. 引入样式和主题

在你的应用入口文件（如 `main.tsx` 或 `App.tsx`）中引入 `ThemeProvider`：

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, Button } from 'flexi-ui';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

## 3. 使用组件

现在你可以在任何地方使用 Flexi-UI 组件了：

```tsx
import { Button } from 'flexi-ui';

function App() {
  return (
    <div>
      <Button variant="primary">Hello Flexi-UI</Button>
    </div>
  );
}
```

## 下一步

- [了解主题定制](./theming)
- [查看组件列表](/Button)
- [浏览 API 文档](/api/hooks)
