# Button 组件

一个功能丰富的按钮组件，支持多种样式、尺寸、加载状态和图标。

## 特性

- 🎨 多种样式变体（primary、secondary、outline、ghost）
- 📏 三种尺寸（sm、md、lg）
- ⏳ 内置加载状态和 Spinner
- 🖼️ 支持图标
- 🎯 完全的 TypeScript 支持
- 🎭 主题适配
- ♿ 无障碍支持

## 基础用法

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

### ButtonProps

| 属性      | 类型                                               | 默认值      | 描述             |
| --------- | -------------------------------------------------- | ----------- | ---------------- |
| variant   | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | 按钮样式变体     |
| size      | `'sm' \| 'md' \| 'lg'`                             | `'md'`      | 按钮尺寸         |
| loading   | `boolean`                                          | `false`     | 是否显示加载状态 |
| icon      | `React.ReactNode`                                  | -           | 按钮图标         |
| fullWidth | `boolean`                                          | `false`     | 是否占满容器宽度 |
| disabled  | `boolean`                                          | `false`     | 是否禁用         |
| onClick   | `(event: React.MouseEvent) => void`                | -           | 点击事件处理函数 |
| children  | `React.ReactNode`                                  | -           | 按钮内容         |
| className | `string`                                           | -           | 自定义 CSS 类名  |
| style     | `React.CSSProperties`                              | -           | 自定义样式       |

### 样式变体说明

- **primary**: 主要按钮，使用主题色背景
- **secondary**: 次要按钮，使用灰色背景
- **outline**: 边框按钮，透明背景带边框
- **ghost**: 幽灵按钮，完全透明背景

### 尺寸说明

- **sm**: 小尺寸 (padding: 6px 12px, fontSize: 14px)
- **md**: 中等尺寸 (padding: 8px 16px, fontSize: 16px)
- **lg**: 大尺寸 (padding: 12px 24px, fontSize: 18px)

## 高级用法

### 自定义样式

```tsx
<Button
  style={{
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  }}
>
  自定义样式按钮
</Button>
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
