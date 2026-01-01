# 测试驱动开发 (TDD)

Flexi-UI 坚持使用测试驱动开发 (TDD) 方法论，这是保证代码质量和可维护性的核心。

## TDD 流程

1. **编写测试 (Red)**: 根据需求编写一个失败的测试用例。
2. **实现功能 (Green)**: 编写最少量的代码让测试通过。
3. **重构代码 (Refactor)**: 在测试保护下优化代码结构。

## 测试工具

我们使用以下工具栈：

- **Vitest**: 极速的单元测试框架
- **React Testing Library**: 组件测试工具
- **User Event**: 模拟用户交互

## 示例

```tsx
// 1. 编写测试
test('Button renders with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

// 2. 实现组件
const Button = ({ children }) => <button>{children}</button>;
```

## 覆盖率要求

我们追求高测试覆盖率，特别是对于核心逻辑和工具函数，力求达到 100% 的分支覆盖率。
