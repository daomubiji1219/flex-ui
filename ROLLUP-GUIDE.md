# Flexi-UI 组件库 Rollup 打包指南

## 简介

本文档介绍了如何使用 Rollup 对 Flexi-UI 组件库进行打包，以便将其作为一个独立的 npm 包发布或在其他项目中使用。

## 打包配置

我们使用 Rollup 作为打包工具，主要配置如下：

- 输出格式：同时支持 CommonJS (CJS) 和 ES Module (ESM) 两种格式
- 源码映射：生成 sourcemap 文件，方便调试
- 外部依赖：React、React DOM 等库被标记为外部依赖，不会被打包进最终的产物中

## 打包命令

```bash
# 使用 pnpm 构建库
pnpm run build:lib
```

## 打包产物

打包后的文件位于 `dist` 目录下：

- `index.cjs.js`：CommonJS 格式的库文件，适用于 Node.js 环境
- `index.esm.js`：ES Module 格式的库文件，适用于现代浏览器和打包工具
- 对应的 `.map` 文件：源码映射文件，用于调试

## 在项目中使用

### 作为本地依赖使用

1. 在你的项目中，可以通过相对路径引用这个库：

```json
// package.json
{
  "dependencies": {
    "flexi-ui": "file:../path/to/flexi-ui"
  }
}
```

2. 然后在代码中导入组件：

```jsx
import { Button, DataTable } from 'flexi-ui';

function App() {
  return (
    <div>
      <Button variant="primary">点击我</Button>
      <DataTable
        data={[...]}
        columns={[...]}
        rowKey="id"
      />
    </div>
  );
}
```

### 发布为 npm 包

如果你想将组件库发布为 npm 包，需要进行以下步骤：

1. 更新 `package.json` 中的版本号和其他信息
2. 运行 `pnpm run build:lib` 构建库
3. 使用 `npm publish` 发布包

## 自定义打包配置

如果需要自定义打包配置，可以修改 `rollup.config.js` 文件。常见的自定义需求包括：

- 添加更多的输出格式
- 配置 CSS 处理方式
- 添加代码压缩
- 调整外部依赖列表

## 注意事项

- 确保所有组件都正确导出
- 外部依赖需要在 `peerDependencies` 中声明
- 测试文件和示例文件不会被打包到最终产物中
