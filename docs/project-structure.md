# Flexi-UI 项目目录结构

本文档描述了 Flexi-UI 项目的完整目录结构。

## 项目根目录

```
flexi-ui/
├── .gitignore                    # Git 忽略文件配置
├── .turbo/                       # Turbo 缓存目录
├── README.md                     # 项目说明文档
├── ROLLUP-GUIDE.md              # Rollup 构建指南
├── docs/                        # 文档目录
│   ├── .vitepress/              # VitePress 配置
│   │   ├── cache/               # VitePress 缓存
│   │   │   └── deps/            # 依赖缓存文件
│   │   ├── config.ts            # VitePress 配置文件
│   │   └── theme/               # 自定义主题
│   │       ├── components/      # 主题组件
│   │       │   ├── ApiTable.vue
│   │       │   ├── DemoContainer.vue
│   │       │   └── ReactDemo.vue
│   │       └── index.ts         # 主题入口文件
│   ├── Button.md                # Button 组件文档
│   ├── DataTable.md             # DataTable 组件文档
│   ├── FileUploader.md          # FileUploader 组件文档
│   ├── VirtualList.md           # VirtualList 组件文档
│   ├── components/              # 组件文档目录
│   ├── development-guide.md     # 开发指南
│   ├── guide/                   # 使用指南
│   │   └── index.md
│   ├── implementation-steps.md  # 实现步骤文档
│   ├── index.md                 # 文档首页
│   ├── project-structure.md     # 项目结构文档（本文档）
│   └── vitepress-setup.md       # VitePress 设置文档
├── eslint.config.js             # ESLint 配置
├── examples/                    # 示例目录
├── index.html                   # HTML 入口文件
├── llm/                         # LLM 相关文件
├── package.json                 # 项目依赖配置
├── pnpm-lock.yaml              # pnpm 锁定文件
├── postcss.config.js           # PostCSS 配置
├── public/                      # 静态资源目录
│   └── vite.svg                # Vite 图标
├── rollup.config.js            # Rollup 构建配置
├── src/                        # 源代码目录
│   ├── App.css                 # 应用样式
│   ├── App.tsx                 # 应用主组件
│   ├── assets/                 # 静态资源
│   │   └── react.svg
│   ├── compoents/              # 组件目录
│   │   ├── Button/             # Button 组件
│   │   │   ├── Button.tsx
│   │   │   ├── README.md
│   │   │   └── __tests__/
│   │   │       └── Button.test.tsx
│   │   ├── DataTable/          # DataTable 组件
│   │   │   ├── DataTable.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── README.md
│   │   │   ├── TableHeader.tsx
│   │   │   ├── TableRow.tsx
│   │   │   ├── TableSkeleton.tsx
│   │   │   └── index.ts
│   │   ├── FileUploader/       # FileUploader 组件
│   │   │   ├── FileUploader.css
│   │   │   ├── FileUploader.tsx
│   │   │   ├── README.md
│   │   │   ├── t.tsx
│   │   │   └── utils.ts
│   │   ├── ThemeToggle/        # 主题切换组件
│   │   └── VirtualList/        # VirtualList 组件
│   │       ├── README.md
│   │       └── VirtualList.tsx
│   ├── examples/               # 示例组件
│   │   ├── DataTableExample.tsx
│   │   ├── FileUploaderExample.tsx
│   │   ├── FileUploaderTExample.tsx
│   │   ├── FormExample.css
│   │   └── FormExample.tsx
│   ├── hooks/                  # React Hooks
│   │   ├── form/               # 表单相关 Hooks
│   │   │   ├── README.md
│   │   │   ├── index.ts
│   │   │   ├── observers/      # 观察者模式
│   │   │   │   └── FormObserver.ts
│   │   │   ├── state/          # 状态管理
│   │   │   │   └── FormStateManager.ts
│   │   │   ├── types.ts        # 类型定义
│   │   │   ├── useFormRefactored.ts
│   │   │   ├── utils/          # 工具函数
│   │   │   │   └── index.ts
│   │   │   └── validation/     # 验证相关
│   │   │       ├── strategies.ts
│   │   │       └── validators.ts
│   │   ├── use.ts
│   │   ├── useForm.ts
│   │   ├── useLocalStorage.ts
│   │   └── useTheme.ts
│   ├── index.css               # 全局样式
│   ├── index.ts                # 库入口文件
│   ├── main.tsx                # 应用入口
│   ├── styles/                 # 样式文件目录
│   ├── test/                   # 测试配置
│   │   └── setup.ts
│   ├── theme/                  # 主题相关
│   │   └── tokens.ts
│   ├── types/                  # 类型定义目录
│   ├── utils/                  # 工具函数
│   │   └── throttle.js
│   └── vite-env.d.ts          # Vite 环境类型定义
├── tailwind.config.js          # Tailwind CSS 配置
├── tests/                      # 测试目录
├── tsconfig.app.json           # 应用 TypeScript 配置
├── tsconfig.json               # 主 TypeScript 配置
├── tsconfig.lib.json           # 库 TypeScript 配置
├── tsconfig.node.json          # Node.js TypeScript 配置
├── vite.config.ts              # Vite 配置
├── vitest.config.ts            # Vitest 测试配置
└── vitest.shims.d.ts           # Vitest 类型声明
```

## 目录说明

### 核心目录

- **`src/`**: 源代码目录，包含所有组件、hooks、工具函数等
- **`docs/`**: 项目文档，使用 VitePress 构建
- **`tests/`**: 测试文件目录
- **`public/`**: 静态资源目录

### 组件结构

每个组件都遵循以下结构：

- 主组件文件（`.tsx`）
- 样式文件（`.css` 或内联样式）
- 说明文档（`README.md`）
- 测试文件（`__tests__/` 目录）
- 工具函数（`utils.ts` 或 `index.ts`）

### 配置文件

- **构建配置**: `vite.config.ts`, `rollup.config.js`
- **TypeScript 配置**: 多个 `tsconfig.*.json` 文件用于不同环境
- **代码质量**: `eslint.config.js`
- **样式配置**: `tailwind.config.js`, `postcss.config.js`
- **测试配置**: `vitest.config.ts`

### 文档系统

使用 VitePress 构建的文档系统，包含：

- 组件 API 文档
- 使用指南
- 开发指南
- 实现步骤说明

这个结构支持现代前端开发的最佳实践，包括组件化开发、类型安全、测试驱动开发和完善的文档系统。
