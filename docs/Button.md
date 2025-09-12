# Button 按钮组件

一个功能丰富、高度可定制的 React 按钮组件，基于 CSS-in-JS 技术构建，支持多种样式变体、尺寸和状态。

## 特性

- ✅ 多种样式变体（primary、secondary、outline、ghost）
- ✅ 多种尺寸选择（sm、md、lg）
- ✅ 加载状态支持
- ✅ 图标支持
- ✅ 禁用状态
- ✅ 全宽度显示
- ✅ TypeScript 完整类型支持
- ✅ forwardRef 支持
- ✅ CSS-in-JS 样式系统（基于 @emotion）
- ✅ 完整的主题系统集成
- ✅ 动画过渡效果
- ✅ 运行时样式优化
- ✅ 类型安全的样式属性

## 安装

```bash
pnpm add flexi-ui
```

## 基础用法

### 简单使用

```tsx
import { Button } from 'flexi-ui';

function App() {
  return <Button onClick={() => alert('Hello!')}>点击我</Button>;
}
```

### 配合主题系统使用

```tsx
import { Button, ThemeProvider } from 'flexi-ui';

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <Button onClick={() => alert('Hello!')}>点击我</Button>
    </ThemeProvider>
  );
}
```

> **注意**: Button 组件需要在 `ThemeProvider` 内部使用以获得完整的主题支持。如果未使用 `ThemeProvider`，组件将抛出错误。

<DemoContainer title="基础按钮">
  <ReactDemo name="Button" :props="{ children: '默认按钮' }" />
  <ReactDemo name="Button" :props="{ variant: 'secondary', children: '次要按钮' }" />
  <ReactDemo name="Button" :props="{ variant: 'outline', children: '边框按钮' }" />
  <ReactDemo name="Button" :props="{ variant: 'ghost', children: '幽灵按钮' }" />
</DemoContainer>

## 不同尺寸

<DemoContainer title="尺寸">
  <ReactDemo name="Button" :props="{ size: 'sm', children: '小按钮' }" />
  <ReactDemo name="Button" :props="{ size: 'md', children: '中等按钮' }" />
  <ReactDemo name="Button" :props="{ size: 'lg', children: '大按钮' }" />
</DemoContainer>

## 加载状态

<DemoContainer title="加载状态">
  <ReactDemo name="Button" :props="{ loading: true, children: '加载中...' }" />
  <ReactDemo name="Button" :props="{ loading: true, size: 'sm', children: '小按钮加载' }" />
  <ReactDemo name="Button" :props="{ loading: true, variant: 'outline', children: '边框按钮加载' }" />
</DemoContainer>

## 带图标

```tsx
import { Button } from '@flexi-ui/components';
import { PlusIcon, DownloadIcon } from '@heroicons/react/24/outline';

<div>
  <Button icon={<PlusIcon />}>添加</Button>
  <Button icon={<DownloadIcon />} variant="outline">
    下载
  </Button>
  <Button icon={<PlusIcon />} /> {/* 仅图标 */}
</div>;
```

## 禁用状态

<DemoContainer title="禁用状态">
  <ReactDemo name="Button" :props="{ disabled: true, children: '禁用按钮' }" />
  <ReactDemo name="Button" :props="{ disabled: true, variant: 'outline', children: '禁用边框按钮' }" />
</DemoContainer>

## API

### Props

| 属性      | 类型                                               | 默认值      | 说明                 |
| --------- | -------------------------------------------------- | ----------- | -------------------- |
| variant   | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | 按钮样式变体         |
| size      | `'sm' \| 'md' \| 'lg'`                             | `'md'`      | 按钮尺寸             |
| loading   | `boolean`                                          | `false`     | 是否显示加载状态     |
| icon      | `React.ReactNode`                                  | -           | 按钮图标             |
| fullWidth | `boolean`                                          | `false`     | 是否全宽度显示       |
| disabled  | `boolean`                                          | `false`     | 是否禁用             |
| children  | `React.ReactNode`                                  | -           | 按钮内容             |
| onClick   | `(event: MouseEvent<HTMLButtonElement>) => void`   | -           | 点击事件处理函数     |
| ...rest   | `ButtonHTMLAttributes<HTMLButtonElement>`          | -           | 其他原生 button 属性 |

### Ref

组件使用 `forwardRef` 包装，可以直接获取到 `HTMLButtonElement` 的引用：

```tsx
const buttonRef = useRef<HTMLButtonElement>(null);

<Button ref={buttonRef}>按钮</Button>;
```

### 样式变体说明

- **primary**: 主要按钮，使用主题色背景
- **secondary**: 次要按钮，使用灰色背景
- **outline**: 边框按钮，透明背景带边框
- **ghost**: 幽灵按钮，完全透明背景

### 尺寸说明

- **sm**: 小尺寸 (padding: 6px 12px, fontSize: 14px)
- **md**: 中等尺寸 (padding: 8px 16px, fontSize: 16px)
- **lg**: 大尺寸 (padding: 12px 24px, fontSize: 18px)

## 样式定制

### 主题系统定制

Button 组件基于 CSS-in-JS 技术构建，完全集成了主题系统。你可以通过修改主题令牌来定制按钮样式：

```tsx
import { ThemeProvider } from 'flexi-ui';
import type { Theme } from 'flexi-ui';

// 自定义主题
const customTheme: Partial<Theme> = {
  tokens: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6', // 自定义主色调
        900: '#1e3a8a',
      },
    },
    borderRadius: {
      md: '8px', // 自定义圆角
    },
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Button variant="primary">自定义主题按钮</Button>
    </ThemeProvider>
  );
}
```

## 高级用法

### 条件渲染

```tsx
function ConditionalButton({ canEdit }: { canEdit: boolean }) {
  return (
    <Button variant={canEdit ? 'primary' : 'outline'} disabled={!canEdit}>
      {canEdit ? '编辑' : '只读'}
    </Button>
  );
}
```

### 表单集成

```tsx
function FormButton() {
  return (
    <form onSubmit={handleSubmit}>
      {/* 其他表单字段 */}
      <Button type="submit" variant="primary">
        提交表单
      </Button>
    </form>
  );
}
```

### 异步操作

```tsx
function AsyncButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await someAsyncOperation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button loading={loading} onClick={handleClick}>
      提交数据
    </Button>
  );
}
```

## 主题适配

按钮组件会自动适配当前主题，使用 `useTheme` hook 获取主题色彩。主要颜色会根据主题动态调整。

## 无障碍支持

- 支持键盘导航
- 正确的 ARIA 属性
- 加载状态时自动禁用交互
- 语义化的 HTML 结构

## 注意事项

1. 加载状态时按钮会自动禁用，无需手动设置 `disabled`
2. 图标和文本之间会自动添加适当的间距
3. 组件使用 `forwardRef` 包装，支持 ref 传递
4. 所有原生 button 属性都会透传到底层元素

## 性能优化

- 使用 `useMemo` 缓存样式计算
- 避免不必要的重新渲染
- 内置的 Spinner 组件轻量高效
