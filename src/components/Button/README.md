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

````

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
| className | `string`                                           | -           | 自定义 CSS 类名      |
| onClick   | `(event: MouseEvent<HTMLButtonElement>) => void`   | -           | 点击事件处理函数     |
| ...rest   | `ButtonHTMLAttributes<HTMLButtonElement>`          | -           | 其他原生 button 属性 |

### Ref

组件使用 `forwardRef` 包装，可以直接获取到 `HTMLButtonElement` 的引用：

```tsx
const buttonRef = useRef<HTMLButtonElement>(null);

<Button ref={buttonRef}>按钮</Button>;
````

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

## 自定义样式

### 使用 className

你可以通过 `className` 属性为按钮添加自定义样式：

```tsx
// 基础用法
<Button className="my-custom-button">自定义按钮</Button>

// 结合 CSS 模块
<Button className={styles.specialButton}>特殊样式按钮</Button>

// 结合 styled-components 或其他 CSS-in-JS 库
const CustomStyledButton = styled.div`
  .custom-button {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
  }
`;

function MyComponent() {
  return (
    <CustomStyledButton>
      <Button className="custom-button" variant="primary">
        悬浮效果按钮
      </Button>
    </CustomStyledButton>
  );
}
```

### 响应式样式

```tsx
<Button className="w-full md:w-auto lg:w-48">响应式宽度按钮</Button>
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

### 运行时样式定制

```tsx
// 使用 css prop（需要 @emotion/react）
import { css } from '@emotion/react';

<Button
  css={css`
    background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
    border: 0;
    border-radius: 3px;
    box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
    color: white;
    height: 48px;
    padding: 0 30px;
  `}
>
  渐变按钮
</Button>;
```

### 传统样式覆盖

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

### 主题模式切换

```tsx
import { ThemeProvider, useTheme } from 'flexi-ui';

function ThemeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <Button onClick={toggleMode}>
      切换到 {mode === 'light' ? '暗色' : '亮色'} 模式
    </Button>
  );
}

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <ThemeToggle />
    </ThemeProvider>
  );
}
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

## CSS-in-JS 技术说明

### 技术架构

Button 组件采用 `@emotion/styled` 构建，具有以下技术特点：

- **运行时样式生成**: 根据 props 动态生成样式
- **主题感知**: 自动响应主题变化
- **类型安全**: 完整的 TypeScript 类型支持
- **性能优化**: 样式缓存和最小化重渲染
- **零运行时**: 构建时优化，减少运行时开销

### 样式组织

```typescript
// Button.styled.ts - 样式组件定义
import styled from '@emotion/styled';
import type { Theme } from '../../theme/tokens';

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  /* 基础样式 */
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* 动态样式 */
  ${({ theme, variant }) => getVariantStyles(theme, variant)}
  ${({ theme, size }) => getSizeStyles(theme, size)}
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
`;
```

### 最佳实践

1. **主题优先**: 优先使用主题令牌而非硬编码值
2. **性能考虑**: 避免在渲染函数中创建样式对象
3. **类型安全**: 充分利用 TypeScript 类型检查
4. **可维护性**: 将复杂样式逻辑提取到独立函数

## 更新日志

### v2.0.0

- 🎉 **重大更新**: 迁移到 CSS-in-JS 架构
- ✨ 完整的主题系统支持
- ⚡ 性能优化和运行时样式缓存
- 🔧 改进的 TypeScript 类型定义
- 🎨 更灵活的样式定制能力

### v1.2.0

- 添加全宽度支持
- 优化性能
- 修复样式问题

### v1.1.0

- 添加图标支持
- 优化加载状态动画
- 改进可访问性

### v1.0.0

- 初始版本发布
- 支持基础功能和样式变体

## 相关组件

- [ButtonGroup](../ButtonGroup/README.md) - 按钮组组件
- [IconButton](../IconButton/README.md) - 图标按钮组件
- [FloatingActionButton](../FloatingActionButton/README.md) - 悬浮操作按钮

## 许可证

MIT License
