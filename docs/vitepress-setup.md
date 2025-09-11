# VitePress 文档站点搭建指南

## 1. 安装和配置

### 安装依赖

```bash
# 安装 VitePress
pnpm add -D vitepress

# 安装额外依赖
pnpm add -D @types/node vue
```

### 创建配置文件

#### VitePress 主配置

```typescript
// docs/.vitepress/config.ts
import { defineConfig } from 'vitepress';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  title: 'Flexi-UI',
  description: '现代化的 React 组件库 - 灵活、高效、易用',
  base: '/',
  lang: 'zh-CN',

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '指南', link: '/guide/', activeMatch: '/guide/' },
      { text: '组件', link: '/components/', activeMatch: '/components/' },
      { text: 'API 参考', link: '/api/', activeMatch: '/api/' },
      {
        text: '生态系统',
        items: [
          { text: 'GitHub', link: 'https://github.com/your-org/flexi-ui' },
          {
            text: 'NPM',
            link: 'https://www.npmjs.com/package/@daomu/flexi-ui',
          },
          { text: '更新日志', link: '/changelog' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          collapsed: false,
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
            { text: '主题定制', link: '/guide/theming' },
          ],
        },
        {
          text: '开发指南',
          collapsed: false,
          items: [
            { text: 'TDD 开发流程', link: '/guide/tdd-development' },
            { text: '组件开发规范', link: '/guide/component-standards' },
            { text: '测试指南', link: '/guide/testing' },
            { text: '贡献指南', link: '/guide/contributing' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          collapsed: false,
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'ThemeToggle 主题切换', link: '/components/theme-toggle' },
          ],
        },
        {
          text: '数据展示',
          collapsed: false,
          items: [
            { text: 'DataTable 数据表格', link: '/components/data-table' },
            { text: 'VirtualList 虚拟列表', link: '/components/virtual-list' },
          ],
        },
        {
          text: '数据录入',
          collapsed: false,
          items: [
            {
              text: 'FileUploader 文件上传',
              link: '/components/file-uploader',
            },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '组件 API', link: '/api/components' },
            { text: 'Hooks API', link: '/api/hooks' },
            { text: '工具函数', link: '/api/utils' },
            { text: '类型定义', link: '/api/types' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/flexi-ui' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Flexi-UI Team',
    },

    editLink: {
      pattern: 'https://github.com/your-org/flexi-ui/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },
  },

  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../../src'),
      },
    },
    server: {
      fs: {
        allow: ['..', '../..'],
      },
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
    config: md => {
      // 自定义 markdown 插件
    },
  },
});
```

#### 主题自定义配置

```typescript
// docs/.vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { h } from 'vue';

// 注意：不要在这里直接导入并注册 React 组件
// import { Button } from '../../../src/compoents/Button/Button'
// import { DataTable } from '../../../src/compoents/DataTable'
// import { FileUploader } from '../../../src/compoents/FileUploader/FileUploader'
// import { VirtualList } from '../../../src/compoents/VirtualList/VirtualList'

// 导入自定义样式
import './custom.css';
import '../../../src/index.css';

// 导入演示组件（Vue）
import DemoContainer from './components/DemoContainer.vue';
import ApiTable from './components/ApiTable.vue';
import ReactDemo from './components/ReactDemo.vue';

const theme: Theme = {
  ...DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 自定义布局插槽（可选）
    });
  },
  enhanceApp({ app }) {
    // 仅注册 Vue 演示组件
    app.component('DemoContainer', DemoContainer);
    app.component('ApiTable', ApiTable);
    app.component('ReactDemo', ReactDemo);
  },
};

export default theme;
```

> 说明：React 组件通过 `<ReactDemo name="ComponentName" :props="{...}" />` 在 Markdown 中渲染，底层在 ReactDemo 中使用 ReactDOM.createRoot 进行挂载；请确保在 docs/.vitepress/config.ts 中启用 @vitejs/plugin-react。

#### 自定义样式

```css
/* docs/.vitepress/theme/custom.css */
:root {
  --vp-c-brand-1: #646cff;
  --vp-c-brand-2: #747bff;
  --vp-c-brand-3: #535bf2;
  --vp-c-brand-soft: rgba(100, 108, 255, 0.14);
}

/* 暗色主题 */
.dark {
  --vp-c-brand-1: #a855f7;
  --vp-c-brand-2: #9333ea;
  --vp-c-brand-3: #7c3aed;
  --vp-c-brand-soft: rgba(168, 85, 247, 0.16);
}

/* 组件演示容器 */
.demo-container {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 24px;
  margin: 16px 0;
  background-color: var(--vp-c-bg-soft);
}

.demo-container .demo-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--vp-c-text-1);
}

.demo-container .demo-content {
  margin-bottom: 16px;
}

.demo-container .demo-code {
  border-top: 1px solid var(--vp-c-border);
  padding-top: 16px;
}

/* API 表格样式 */
.api-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.api-table th,
.api-table td {
  border: 1px solid var(--vp-c-border);
  padding: 12px;
  text-align: left;
}

.api-table th {
  background-color: var(--vp-c-bg-soft);
  font-weight: 600;
}

.api-table code {
  background-color: var(--vp-c-bg-mute);
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 0.875em;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-container {
    padding: 16px;
  }

  .api-table {
    font-size: 14px;
  }

  .api-table th,
  .api-table td {
    padding: 8px;
  }
}
```

## 2. 演示组件

### 通用演示容器

```vue
<!-- docs/.vitepress/theme/components/DemoContainer.vue -->
<template>
  <div class="demo-container">
    <div v-if="title" class="demo-title">{{ title }}</div>
    <div class="demo-content">
      <slot />
    </div>
    <div v-if="showCode" class="demo-code">
      <details>
        <summary>查看代码</summary>
        <div class="language-vue">
          <pre><code>{{ code }}</code></pre>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  code?: string;
  showCode?: boolean;
}

withDefaults(defineProps<Props>(), {
  showCode: true,
});
</script>
```

### API 表格组件

```vue
<!-- docs/.vitepress/theme/components/ApiTable.vue -->
<template>
  <table class="api-table">
    <thead>
      <tr>
        <th>属性</th>
        <th>说明</th>
        <th>类型</th>
        <th>默认值</th>
        <th>必填</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="prop in props" :key="prop.name">
        <td>
          <code>{{ prop.name }}</code>
        </td>
        <td>{{ prop.description }}</td>
        <td>
          <code>{{ prop.type }}</code>
        </td>
        <td>
          <code v-if="prop.default">{{ prop.default }}</code
          ><span v-else>-</span>
        </td>
        <td>{{ prop.required ? '是' : '否' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
interface PropItem {
  name: string;
  description: string;
  type: string;
  default?: string;
  required?: boolean;
}

interface Props {
  props: PropItem[];
}

defineProps<Props>();
</script>
```

## 3. 文档页面模板

### 首页

````markdown
## <!-- docs/index.md -->

layout: home

hero:
name: "Flexi-UI"
text: "现代化的 React 组件库"
tagline: "灵活、高效、易用 - 为现代 Web 应用而生"
image:
src: /logo.svg
alt: Flexi-UI
actions: - theme: brand
text: 快速开始
link: /guide/getting-started - theme: alt
text: 查看组件
link: /components/ - theme: alt
text: GitHub
link: https://github.com/your-org/flexi-ui

features:

- icon: ⚡️
  title: 高性能
  details: 基于 React 18 和现代浏览器 API，提供卓越的性能体验
- icon: 🎨
  title: 主题定制
  details: 支持深度主题定制，轻松适配各种设计系统
- icon: 📱
  title: 响应式设计
  details: 移动优先的响应式设计，完美适配各种设备
- icon: 🔧
  title: TypeScript
  details: 完整的 TypeScript 支持，提供优秀的开发体验
- icon: 🧪
  title: 测试驱动
  details: 基于 TDD 开发，确保组件的稳定性和可靠性
- icon: 📚
  title: 丰富文档
  details: 详细的文档和示例，快速上手和深度使用

---

## 快速体验

<DemoContainer title="Button 组件示例">
  <ReactDemo name="Button" :props="{ variant: 'primary', children: 'Hello Flexi-UI' }" />
</DemoContainer>

## 安装使用

```bash
# 使用 npm
npm install @daomu/flexi-ui

# 使用 pnpm
pnpm add @daomu/flexi-ui

# 使用 yarn
yarn add @daomu/flexi-ui
```
````

```tsx
import { Button, DataTable } from '@daomu/flexi-ui';
import '@daomu/flexi-ui/dist/style.css';

function App() {
  return (
    <div>
      <Button variant="primary">Hello Flexi-UI</Button>
    </div>
  );
}
```

## 特性亮点

### 🚀 现代化技术栈

- **React 18+**: 支持最新的 React 特性
- **TypeScript**: 完整的类型支持
- **Vite**: 快速的开发和构建体验
- **Tailwind CSS**: 原子化 CSS 框架

### 🎯 开发体验

- **TDD 开发**: 测试驱动开发，确保代码质量
- **Storybook**: 组件开发和调试工具
- **ESLint + Prettier**: 代码规范和格式化
- **Husky**: Git hooks 自动化

### 📦 生产就绪

- **Tree Shaking**: 按需加载，减小包体积
- **SSR 支持**: 服务端渲染友好
- **CDN 分发**: 全球 CDN 加速
- **版本管理**: 语义化版本控制

````

### 组件文档模板

```markdown
<!-- docs/components/button.md -->
# Button 按钮

按钮用于触发一个操作，如提交表单、打开对话框、取消操作等。

## 何时使用

- 标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑
- 通过鼠标或键盘，让用户能够触发一个操作

## 基础用法

<DemoContainer title="基础按钮">
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <ReactDemo name="Button" :props="{ children: '默认按钮' }" />
    <ReactDemo name="Button" :props="{ variant: 'primary', children: '主要按钮' }" />
    <ReactDemo name="Button" :props="{ variant: 'secondary', children: '次要按钮' }" />
  </div>
</DemoContainer>

## 按钮状态

<DemoContainer title="按钮状态">
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <ReactDemo name="Button" :props="{ children: '正常状态' }" />
    <ReactDemo name="Button" :props="{ disabled: true, children: '禁用状态' }" />
    <ReactDemo name="Button" :props="{ loading: true, children: '加载状态' }" />
  </div>
</DemoContainer>

## 按钮尺寸

<DemoContainer title="按钮尺寸">
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
    <ReactDemo name="Button" :props="{ size: 'small', children: '小号按钮' }" />
    <ReactDemo name="Button" :props="{ size: 'medium', children: '中号按钮' }" />
    <ReactDemo name="Button" :props="{ size: 'large', children: '大号按钮' }" />
  </div>
</DemoContainer>

## API

<ApiTable :props="buttonProps" />

<script setup>
const buttonProps = [
  {
    name: 'variant',
    description: '按钮类型',
    type: "'default' | 'primary' | 'secondary' | 'danger'",
    default: "'default'",
    required: false
  },
  {
    name: 'size',
    description: '按钮尺寸',
    type: "'small' | 'medium' | 'large'",
    default: "'medium'",
    required: false
  },
  {
    name: 'disabled',
    description: '是否禁用',
    type: 'boolean',
    default: 'false',
    required: false
  },
  {
    name: 'loading',
    description: '是否显示加载状态',
    type: 'boolean',
    default: 'false',
    required: false
  },
  {
    name: 'onClick',
    description: '点击事件处理函数',
    type: '(event: MouseEvent) => void',
    required: false
  },
  {
    name: 'children',
    description: '按钮内容',
    type: 'ReactNode',
    required: true
  }
]
</script>

## 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| onClick | 点击按钮时触发 | `(event: MouseEvent) => void` |
| onFocus | 获得焦点时触发 | `(event: FocusEvent) => void` |
| onBlur | 失去焦点时触发 | `(event: FocusEvent) => void` |

## 样式变量

组件提供了以下 CSS 变量用于自定义样式：

```css
.flexi-button {
  --button-height: 32px;
  --button-padding: 0 16px;
  --button-border-radius: 6px;
  --button-font-size: 14px;
  --button-font-weight: 500;

  /* 主题色 */
  --button-primary-bg: #1890ff;
  --button-primary-border: #1890ff;
  --button-primary-color: #fff;

  /* 悬停状态 */
  --button-primary-hover-bg: #40a9ff;
  --button-primary-hover-border: #40a9ff;
}
````

## 无障碍访问

- 按钮具有适当的 `role` 和 `aria-*` 属性
- 支持键盘导航（Enter 和 Space 键）
- 禁用状态下会设置 `aria-disabled` 属性
- 加载状态下会设置 `aria-busy` 属性

````

## 4. 构建和部署脚本

### package.json 脚本配置

```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs --port 3000",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs --port 4173",
    "docs:serve": "vitepress serve docs"
  }
}
````

> 提示：库构建（如 build:lib）与文档构建请在 PowerShell 中分步执行，例如先运行 `pnpm run build:lib`，完成后再运行 `pnpm run docs:build`；避免使用 `&&` 串联。

## 依赖版本建议（与 Vite 7 兼容）

- vite: ^5.4.x
- vitepress: ^1.4.x
- @vitejs/plugin-react: ^4.3.x
- vue: ^3.4.x
- react: ^18.2.x
- react-dom: ^18.2.x
- typescript: ^5.4.x
- vitest: ^1.6.x
- jsdom: ^24.x
- @types/node: ^20.11.x

提示：

- 使用 pnpm 管理依赖与脚本。
- 在 PowerShell 中请分步顺序执行命令，避免使用 && 进行串联。
