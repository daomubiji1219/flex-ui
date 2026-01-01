# 测试指南

高质量的测试是 Flexi-UI 的基石。本指南介绍了如何编写和运行测试。

## 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试
pnpm test Button

# 查看覆盖率
pnpm test:coverage
```

## 测试类型

1. **单元测试**: 测试独立的函数或 hook。
2. **组件测试**: 测试组件的渲染和交互。
3. **集成测试**: 测试多个组件协同工作。

## 最佳实践

- **测试行为，而不是实现**: 关注用户看到什么，而不是组件内部状态。
- **使用 `screen` 查询**: 优先使用 `getByRole`, `getByText` 等语义化查询。
- **模拟用户操作**: 使用 `userEvent` 而不是 `fireEvent` 来模拟真实的用户交互。

```tsx
// 好的实践
test('submits form', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  expect(handleSubmit).toHaveBeenCalled();
});
```
