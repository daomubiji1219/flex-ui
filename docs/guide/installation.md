# 安装指南

Flexi-UI 作为一个标准的 NPM 包发布，支持所有现代包管理器。

## 环境要求

- React 18+
- ReactDOM 18+
- Node.js 16+

## 包管理器安装

### pnpm (推荐)

```bash
pnpm add flexi-ui
```

### npm

```bash
npm install flexi-ui
```

### yarn

```bash
yarn add flexi-ui
```

## 字体与图标

Flexi-UI 默认使用系统字体，不依赖外部字体文件。
如果需要使用图标组件，建议安装 `@heroicons/react` 或其他图标库。

```bash
pnpm add @heroicons/react
```

## TypeScript 支持

Flexi-UI 使用 TypeScript 编写，自带完整的类型定义文件，无需单独安装 `@types/flexi-ui`。

## CDN 引入

目前暂未提供官方 CDN 构建版本，建议通过构建工具（如 Vite, Webpack）使用。
