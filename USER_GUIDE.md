# Daomu Flexi UI 用户使用指南

一个现代化的 React UI 组件库，支持按需导入、Tree Shaking 优化和零运行时 CSS-in-JS。

## 🚀 快速开始

### 安装

```bash
# 使用 npm
npm install @daomu/flexi-ui

# 使用 pnpm
pnpm add @daomu/flexi-ui

# 使用 yarn
yarn add @daomu/flexi-ui
```

### 安装依赖

确保你的项目中已安装以下对等依赖：

```bash
pnpm add react react-dom @emotion/react @emotion/styled framer-motion
```

## 📦 按需导入

### 完整导入

```tsx
import { Button, DataTable, useTheme, lightTheme } from 'daomu-flexi-ui';
```

### 按需导入（推荐）

得益于现代打包工具的 Tree Shaking 特性，你可以直接从主入口导入所需组件，未使用的代码会被自动移除：

```tsx
// 只导入需要的组件
import { Button } from 'daomu-flexi-ui';
import { DataTable } from 'daomu-flexi-ui';
import { useTheme } from 'daomu-flexi-ui';
```

### 精确路径导入

如果你需要更精确的控制，也可以直接从具体路径导入：

```tsx
// 组件
import { Button } from 'daomu-flexi-ui/components/Button';
import { DataTable } from 'daomu-flexi-ui/components/DataTable';

// Hooks
import { useTheme } from 'daomu-flexi-ui/hooks/useTheme';
import { useForm } from 'daomu-flexi-ui/hooks/useForm';

// 主题
import { lightTheme, darkTheme } from 'daomu-flexi-ui/theme/tokens';
```

## 🎨 主题配置

### 基础使用

```tsx
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { Button, lightTheme } from 'daomu-flexi-ui';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Button variant="primary">Hello World</Button>
    </ThemeProvider>
  );
}
```

### 主题切换

```tsx
import React, { useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { Button, lightTheme, darkTheme, useTheme } from 'daomu-flexi-ui';

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const currentTheme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <div>
        <Button variant="outline" onClick={() => setIsDark(!isDark)}>
          切换到 {isDark ? '浅色' : '深色'} 主题
        </Button>
      </div>
    </ThemeProvider>
  );
}
```

## 🧩 组件使用

### Button 按钮

```tsx
import { Button } from 'daomu-flexi-ui';

// 基础用法
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="outline">边框按钮</Button>
<Button variant="ghost">幽灵按钮</Button>

// 不同尺寸
<Button size="sm">小按钮</Button>
<Button size="md">中等按钮</Button>
<Button size="lg">大按钮</Button>

// 加载状态
<Button loading>加载中...</Button>

// 全宽按钮
<Button fullWidth>全宽按钮</Button>

// 禁用状态
<Button disabled>禁用按钮</Button>
```

### DataTable 数据表格

```tsx
import { DataTable } from 'daomu-flexi-ui';

const columns = [
  { key: 'name', title: '姓名', sortable: true },
  { key: 'age', title: '年龄', sortable: true },
  { key: 'email', title: '邮箱' },
];

const data = [
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
];

<DataTable
  columns={columns}
  data={data}
  pagination={{
    current: 1,
    pageSize: 10,
    total: 100,
  }}
  loading={false}
  onSort={(key, direction) => console.log('排序:', key, direction)}
  onPageChange={(page, pageSize) => console.log('分页:', page, pageSize)}
/>;
```

### FileUploader 文件上传

```tsx
import { FileUploader } from 'daomu-flexi-ui';

<FileUploader
  accept="image/*"
  multiple
  maxSize={5 * 1024 * 1024} // 5MB
  onUpload={files => {
    console.log('上传文件:', files);
  }}
  onError={error => {
    console.error('上传错误:', error);
  }}
/>;
```

### VirtualList 虚拟列表

```tsx
import { VirtualList } from 'daomu-flexi-ui';

const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
}));

<VirtualList
  items={items}
  itemHeight={50}
  height={400}
  renderItem={({ item, index }) => (
    <div key={item.id}>
      {index}: {item.name}
    </div>
  )}
/>;
```

## 🪝 Hooks 使用

### useTheme

```tsx
import { useTheme } from 'daomu-flexi-ui';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <p>当前主题: {theme.mode}</p>
      <button onClick={toggleTheme}>切换主题</button>
      <button onClick={() => setTheme('light')}>设置浅色主题</button>
    </div>
  );
}
```

### useForm

```tsx
import { useForm } from 'daomu-flexi-ui';

function LoginForm() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useForm({
    initialValues: { email: '', password: '' },
    validate: values => {
      const errors = {};
      if (!values.email) {
        errors.email = '邮箱不能为空';
      }
      if (!values.password) {
        errors.password = '密码不能为空';
      }
      return errors;
    },
    onSubmit: async values => {
      // 提交逻辑
      console.log('提交:', values);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="邮箱"
      />
      {touched.email && errors.email && <span>{errors.email}</span>}

      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="密码"
      />
      {touched.password && errors.password && <span>{errors.password}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '登录中...' : '登录'}
      </button>
    </form>
  );
}
```

### useLocalStorage

```tsx
import { useLocalStorage } from 'daomu-flexi-ui';

function Settings() {
  const [settings, setSettings] = useLocalStorage('app-settings', {
    theme: 'light',
    language: 'zh-CN',
  });

  return (
    <div>
      <select
        value={settings.theme}
        onChange={e => setSettings({ ...settings, theme: e.target.value })}
      >
        <option value="light">浅色</option>
        <option value="dark">深色</option>
      </select>
    </div>
  );
}
```

## 🎯 性能优化

### Tree Shaking

本库完全支持 Tree Shaking，只有你实际使用的组件和功能会被打包到最终的 bundle 中。

### 零运行时 CSS

通过 Emotion 的编译时优化，CSS 样式在构建时被提取，运行时性能更佳。

### 代码分割

每个组件都可以独立导入，支持代码分割和懒加载：

```tsx
import { lazy } from 'react';

// 懒加载组件
const DataTable = lazy(() =>
  import('daomu-flexi-ui').then(module => ({ default: module.DataTable }))
);
```

## 🔧 TypeScript 支持

本库完全使用 TypeScript 编写，提供完整的类型定义：

```tsx
import type { ButtonProps, DataTableColumn } from 'daomu-flexi-ui';

// 自定义按钮组件
const CustomButton: React.FC<ButtonProps> = props => {
  return <Button {...props} />;
};

// 表格列定义
const columns: DataTableColumn[] = [
  { key: 'name', title: '姓名', sortable: true },
];
```

## 🎨 自定义主题

你可以扩展或覆盖默认主题：

```tsx
import { lightTheme } from 'daomu-flexi-ui';

const customTheme = {
  ...lightTheme,
  tokens: {
    ...lightTheme.tokens,
    colors: {
      ...lightTheme.tokens.colors,
      primary: {
        ...lightTheme.tokens.colors.primary,
        500: '#your-custom-color',
      },
    },
  },
};
```

## 📱 响应式设计

所有组件都支持响应式设计，自动适配不同屏幕尺寸。

## 🌐 浏览器兼容性

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如果你在使用过程中遇到问题，请：

1. 查看本文档
2. 搜索已有的 Issues
3. 创建新的 Issue

---

**享受使用 Daomu Flexi UI！** 🎉
