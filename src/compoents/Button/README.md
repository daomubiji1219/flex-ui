# Button 按钮组件
ok
一个功能丰富、高度可定制的 React 按钮组件，支持多种样式变体、尺寸和状态。

## 特性

- ✅ 多种样式变体（primary、secondary、outline、ghost）
- ✅ 多种尺寸选择（sm、md、lg）
- ✅ 加载状态支持
- ✅ 图标支持
- ✅ 禁用状态
- ✅ 全宽度显示
- ✅ TypeScript 完整类型支持
- ✅ forwardRef 支持
- ✅ 主题系统集成
- ✅ 动画过渡效果

## 安装

```bash
pnpm add flexi-ui
```

## 基础用法

```tsx
import { Button } from 'flexi-ui';

function App() {
  return <Button onClick={() => alert('Hello!')}>点击我</Button>;
}
```

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

## 样式变体

### Primary（主要按钮）

```tsx
<Button variant="primary">主要按钮</Button>
```

默认的主要操作按钮，使用主题色背景。

### Secondary（次要按钮）

```tsx
<Button variant="secondary">次要按钮</Button>
```

次要操作按钮，使用灰色背景。

### Outline（边框按钮）

```tsx
<Button variant="outline">边框按钮</Button>
```

透明背景，带有彩色边框的按钮。

### Ghost（幽灵按钮）

```tsx
<Button variant="ghost">幽灵按钮</Button>
```

完全透明背景的按钮，只有文字颜色。

## 尺寸

```tsx
<Button size="sm">小按钮</Button>
<Button size="md">中等按钮</Button>
<Button size="lg">大按钮</Button>
```

## 状态

### 加载状态

```tsx
<Button loading>加载中...</Button>
```

加载状态下按钮会显示旋转的加载图标，并自动禁用点击。

### 禁用状态

```tsx
<Button disabled>禁用按钮</Button>
```

## 图标支持

```tsx
import { PlusIcon } from '@heroicons/react/24/outline';

// 带图标的按钮
<Button icon={<PlusIcon className="w-4 h-4" />}>
  添加项目
</Button>

// 只有图标的按钮
<Button icon={<PlusIcon className="w-4 h-4" />} />
```

## 全宽度

```tsx
<Button fullWidth>全宽度按钮</Button>
```

## 高级用法

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

## 样式定制

### CSS 变量

```css
:root {
  --button-primary-bg: #1890ff;
  --button-primary-hover: #40a9ff;
  --button-border-radius: 6px;
  --button-transition: all 0.2s ease-in-out;
}
```

### 自定义样式

```tsx
<Button
  style={{
    backgroundColor: '#ff4d4f',
    borderColor: '#ff4d4f',
  }}
>
  自定义颜色
</Button>
```

## 可访问性

组件遵循 WAI-ARIA 标准：

- 支持键盘导航（Tab、Enter、Space）
- 正确的 `role` 和 `aria-*` 属性
- 加载状态下的 `aria-disabled` 属性
- 语义化的 HTML 结构

```tsx
<Button aria-label="删除项目" aria-describedby="delete-help">
  删除
</Button>
```

## 性能优化

### 避免不必要的重渲染

```tsx
// ❌ 每次渲染都会创建新的函数
<Button onClick={() => handleClick(id)}>点击</Button>;

// ✅ 使用 useCallback 优化
const handleButtonClick = useCallback(() => {
  handleClick(id);
}, [id]);

<Button onClick={handleButtonClick}>点击</Button>;
```

### 大量按钮的场景

```tsx
// ✅ 使用事件委托
function ButtonList({ items }: { items: Item[] }) {
  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const id = target.dataset.id;
    if (id) {
      handleItemClick(id);
    }
  };

  return (
    <div onClick={handleClick}>
      {items.map(item => (
        <Button key={item.id} data-id={item.id}>
          {item.name}
        </Button>
      ))}
    </div>
  );
}
```

## 测试

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('shows loading state', () => {
  render(<Button loading>Loading</Button>);
  const button = screen.getByRole('button');

  expect(button).toBeDisabled();
  expect(button).toHaveStyle({ opacity: '0.6' });
});
```

## 故障排除

### 常见问题

**Q: 按钮点击没有反应？**
A: 检查是否设置了 `disabled` 或 `loading` 属性，这些状态下按钮会被禁用。

**Q: 样式不生效？**
A: 确保正确导入了组件库的 CSS 文件，或者检查 CSS 优先级。

**Q: TypeScript 类型错误？**
A: 确保使用的 props 类型正确，参考 `ButtonProps` 接口定义。

### 调试技巧

```tsx
// 添加调试信息
<Button
  onClick={e => {
    console.log('Button clicked:', e);
    handleClick(e);
  }}
>
  调试按钮
</Button>
```

## 更新日志

### v1.0.0

- 初始版本发布
- 支持基础功能和样式变体

### v1.1.0

- 添加图标支持
- 优化加载状态动画
- 改进可访问性

### v1.2.0

- 添加全宽度支持
- 优化性能
- 修复样式问题

## 相关组件

- [ButtonGroup](../ButtonGroup/README.md) - 按钮组组件
- [IconButton](../IconButton/README.md) - 图标按钮组件
- [FloatingActionButton](../FloatingActionButton/README.md) - 悬浮操作按钮

## 许可证

MIT License
