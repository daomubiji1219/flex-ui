# 实施步骤（修正版）

以下步骤基于当前仓库现状，确保最小可运行闭环（Vitest+TDD、VitePress 文档、Vercel 部署）。

## 1. 测试环境（Vitest + React Testing Library）

- 确认 vitest 配置：
  - 文件：packages/flexi-ui/vitest.config.ts
  - 要点：
    - globals: true
    - environment: jsdom
    - setupFiles: ['./src/test/setup.ts']  // 若不存在需创建
    - include: ['src/**/*.{test,spec}.{ts,tsx}']
    - alias: '@' -> './src'

- 新建测试初始化文件：
  - 路径：packages/flexi-ui/src/test/setup.ts
  - 内容要点：
    - 引入 @testing-library/jest-dom 扩展
    - 为 RTL 配置 cleanup、vi.mock 兼容等
    - 避免 any，使用精确类型

- 推荐依赖（与 Vite 7 兼容）：
  - vitest ^1.6.0
  - jsdom ^24.0.0
  - @testing-library/react ^14.1.2
  - @testing-library/jest-dom ^6.4.2
  - @types/jsdom ^21.1.7

> 提示：如需快照测试可加 @vitest/snapshot。

## 2. 文档站点（VitePress + React 包装器）

- 安装依赖（开发环境）：
  - pnpm add -D vitepress @types/node vue @vitejs/plugin-react

- 目录结构（片段）：
  - docs/
    - .vitepress/
      - config.ts
      - theme/
        - index.ts
        - components/
          - DemoContainer.vue
          - ApiTable.vue
          - ReactDemo.vue // 使用该包装器渲染 React 组件

- VitePress 主配置（关键信息）：
  - base: '/'
  - vite.plugins: [react()]
  - vite.resolve.alias: { '@': path.resolve(__dirname, '../../src') }
  - server.fs.allow: ['..', '../..']

- 主题配置（关键信息）：
  - 不要直接注册 React 组件到 app.component
  - 在 enhanceApp 中注册 DemoContainer、ApiTable、ReactDemo 等 Vue 组件
  - ReactDemo.vue 内使用 ReactDOM.createRoot 进行挂载

- 文档示例页：
  - 将 `<Button>` 等直接 JSX 替换为：
    - `<ReactDemo name="Button" :props="{ children: '默认按钮' }" />`
    - `<ReactDemo name="Button" :props="{ variant: 'primary', children: '主要按钮' }" />`

- package.json 脚本：
  - docs:dev => vitepress dev docs --port 3000
  - docs:build => vitepress build docs
  - docs:preview => vitepress preview docs --port 4173
  - build:all => 先执行 build:lib 再执行 docs:build（PowerShell 请分两条执行）

> PowerShell 提示：在交互式终端中，依次执行 `pnpm run build:lib` 与 `pnpm run docs:build`，避免使用 `&&`。

## 3. 部署（Vercel）

- vercel.json 建议：
  - buildCommand: "pnpm docs:build"
  - outputDirectory: "docs/.vitepress/dist"
  - devCommand: "pnpm docs:dev"
  - installCommand: "pnpm install"
  - env: { NODE_VERSION: "18" }

- 基础路径说明：
  - 本方案统一使用 base: '/'，适配 Vercel 根域名或自定义域

## 4. 组件开发与测试流程（TDD）

- 新建组件时：
  1) 先编写失败的测试（组件的可访问性、属性、事件、样式快照等）
  2) 实现最小功能使测试通过
  3) 重构与补充边界测试

- 基础测试模板建议（tsx）：
  - render、screen、within、userEvent
  - getByRole、getByText、findBy* 的合理选择
  - 断言使用 jest-dom 匹配器（toBeInTheDocument, toHaveClass 等）

## 5. 依赖版本建议（与 Vite 7 兼容）

- vite ^5.4.x（仓库已定）
- vitepress ^1.4.x
- @vitejs/plugin-react ^4.3.x
- react ^18.2.x
- react-dom ^18.2.x
- typescript ^5.4.x
- eslint ^9.x（如使用）

## 6. 常见问题修正

- React 在 VitePress 中无法渲染：确保已安装 @vitejs/plugin-react，且通过 ReactDemo 包装器挂载
- 文档路径 404：确认 base 为 '/'，vercel.json routes 指向 index.html 或使用静态导出默认路由
- PowerShell 脚本串联失败：避免使用 &&，改为分步执行
- vitest setup 文件缺失：创建 packages/flexi-ui/src/test/setup.ts 并在 vitest.config.ts 中保持路径一致

## 版本与环境建议（补充）

- 统一使用 pnpm 管理依赖与脚本
- Node.js: 18.x LTS
- 在 PowerShell 环境中，串行执行命令请分步运行，避免使用 &&

## VitePress 关键确认（补充）

- base: '/'
- vite.plugins: [react()]
- 通过 ReactDemo.vue 作为包装器渲染 React 组件，不要直接 app.component 注册 React 组件

## Vitest 设置文件路径确认（补充）

- vitest.config.ts 中的 setupFiles 配置为 ['./src/test/setup.ts']，如路径不存在请创建该文件