# 开发指南（修正版）

本文档说明如何以 TDD 模式开发 Flexi-UI 组件，并基于 VitePress 搭建文档与 Vercel 部署。

## 1. 测试驱动开发（TDD）

- 流程要点：先写失败测试 -> 实现最小功能 -> 重构与补充测试
- 工具链：Vitest + React Testing Library + Jest-DOM
- vitest.config.ts 关键配置：
  - globals: true
  - environment: 'jsdom'
  - setupFiles: ['./src/test/setup.ts']（如文件不存在需要创建）
  - include: ['src/**/*.{test,spec}.{ts,tsx}']
  - resolve.alias: '@' -> './src'

- 测试初始化文件建议（packages/flexi-ui/src/test/setup.ts）：
  - 引入 @testing-library/jest-dom
  - afterEach(cleanup)
  - polyfill: matchMedia、ResizeObserver、IntersectionObserver（按需）

## 2. 文档站点（VitePress）

- 依赖安装：
  - pnpm add -D vitepress vue @types/node @vitejs/plugin-react

- 主配置（docs/.vitepress/config.ts）要点：
  - base: '/'
  - vite.plugins: [react()]
  - vite.resolve.alias: { '@': path.resolve(__dirname, '../../src') }

- 主题（docs/.vitepress/theme/index.ts）要点：
  - 不要直接注册 React 组件到 app.component
  - 通过 Vue 组件 ReactDemo.vue 包装，在挂载时用 ReactDOM.createRoot 渲染 React 组件
  - 在 enhanceApp 中注册 DemoContainer、ApiTable、ReactDemo

- 示例文档中使用：
  - <ReactDemo name="Button" :props="{ children: '默认按钮' }" />
  - <ReactDemo name="Button" :props="{ variant: 'primary', children: '主要按钮' }" />

- package.json 脚本：
  - docs:dev => vitepress dev docs --port 3000
  - docs:build => vitepress build docs
  - docs:preview => vitepress preview docs --port 4173

> PowerShell 提示：需要顺序执行命令时，请分步运行，避免使用 &&。

## 3. 部署（Vercel）

- vercel.json 建议：
  - buildCommand: "pnpm docs:build"
  - outputDirectory: "docs/.vitepress/dist"
  - installCommand: "pnpm install"
  - devCommand: "pnpm docs:dev"
  - env: { NODE_VERSION: "18" }

- base 统一为 '/'：适配根域名部署

## 4. 组件开发最佳实践

- 类型：在 ts/tsx 中尽量避免 any，使用明确的类型定义；导入 React 类型时使用 `import type { ReactNode } from 'react'`
- 无障碍：使用语义化标签与 aria-* 属性；键盘可访问性
- 样式：遵循 BEM 或原子化方案；主题变量统一管理
- 测试：关注可访问性（getByRole）、关键交互、边界条件与回归

## 5. 依赖版本建议（与 Vite 7 兼容）

- vite: ^5.4.x
- vitepress: ^1.4.x
- @vitejs/plugin-react: ^4.3.x
- react: ^18.2.x
- react-dom: ^18.2.x
- typescript: ^5.4.x
- vitest: ^1.6.x, jsdom: ^24.x
- @testing-library/react: ^14.1.x, @testing-library/jest-dom: ^6.4.x

## 6. CI/CD 概览

- CI：安装 -> Lint -> TypeCheck -> Test -> Build
- CD：main 分支合并后触发 Vercel 部署
- 建议在 CI 中加入覆盖率门槛（如 lines >= 80%）

## 7. 常见问题

- React 示例不显示：确认安装 @vitejs/plugin-react，并通过 ReactDemo 包装器渲染
- 文档资源路径异常：确认 base 为 '/'，并检查公开资源路径
- PowerShell 串联命令失败：分步顺序执行
- 测试初始化缺失：创建 packages/flexi-ui/src/test/setup.ts 并在 vitest.config.ts 指定