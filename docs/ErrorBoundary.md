# ErrorBoundary 错误边界

一个强大的错误捕获组件，用于处理 React 组件树中的运行时错误，防止整个应用崩溃，并提供优雅的降级 UI 和重试机制。

## 特性

- ✅ **自动捕获**: 捕获子组件渲染过程中的错误
- ✅ **优雅降级**: 提供默认或自定义的错误提示 UI
- ✅ **自动重试**: 支持配置最大重试次数
- ✅ **错误日志**: 详细的错误日志记录和回调
- ✅ **Hook 支持**: 提供 `useErrorBoundaryEnhanced` hook 用于更灵活的控制
- ✅ **TypeScript**: 完整的类型定义

## 安装

```bash
pnpm add flexi-ui
```

## 基础用法

最简单的用法是直接使用 `ErrorBoundary` 包裹可能出错的组件。

```tsx
import { ErrorBoundary, DefaultErrorFallback } from 'flexi-ui';

function App() {
  return (
    <ErrorBoundary fallback={DefaultErrorFallback}>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

## 演示

<DemoContainer title="错误边界演示">
  <ReactDemo name="ErrorBoundary" />
</DemoContainer>

### 模拟错误组件

```tsx
function BuggyComponent() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error('这是一个模拟的渲染错误！');
  }

  return <button onClick={() => setShouldCrash(true)}>点击触发错误</button>;
}

function App() {
  return (
    <ErrorBoundary
      fallback={DefaultErrorFallback}
      onError={(error, info) => console.error(error)}
    >
      <BuggyComponent />
    </ErrorBoundary>
  );
}
```

## 高级用法

### 使用 useErrorBoundaryEnhanced Hook

如果你需要更细粒度的控制，可以使用 `useErrorBoundaryEnhanced` hook。

```tsx
import { useErrorBoundaryEnhanced, DefaultErrorFallback } from 'flexi-ui';

function ComplexFeature() {
  const { ErrorBoundary, errorLogs, resetError } = useErrorBoundaryEnhanced(
    DefaultErrorFallback,
    {
      maxRetries: 3,
      onError: (error, info) => {
        // 发送错误报告到监控服务
        reportErrorToService(error, info);
      },
    }
  );

  return (
    <div>
      <h3>复杂功能区</h3>
      <ErrorBoundary>
        <RiskySubComponent />
      </ErrorBoundary>

      {/* 显示错误日志（仅开发模式） */}
      {process.env.NODE_ENV === 'development' && errorLogs.length > 0 && (
        <div className="debug-logs">
          <h4>错误日志 ({errorLogs.length})</h4>
          {errorLogs.map((log, i) => (
            <pre key={i}>{log.error.message}</pre>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 自定义 Fallback UI

你可以完全自定义错误发生时显示的 UI。

```tsx
const CustomFallback = (
  error: Error,
  resetError: () => void,
  retryCount: number
) => (
  <div className="custom-error-alert">
    <h3>哎呀，出错了！</h3>
    <p>{error.message}</p>
    {retryCount < 3 ? (
      <button onClick={resetError}>重试 ({retryCount}/3)</button>
    ) : (
      <p>请联系技术支持。</p>
    )}
  </div>
);

<ErrorBoundary fallback={CustomFallback}>
  <MyComponent />
</ErrorBoundary>;
```

## API

### ErrorBoundary Props

| 属性         | 类型                                      | 默认值 | 说明                 |
| ------------ | ----------------------------------------- | ------ | -------------------- |
| `children`   | `ReactNode`                               | -      | 子组件               |
| `fallback`   | `(error, reset, retryCount) => ReactNode` | -      | 错误回退组件渲染函数 |
| `onError`    | `(error: Error, info: ErrorInfo) => void` | -      | 错误捕获回调         |
| `maxRetries` | `number`                                  | `3`    | 最大重试次数         |

### useErrorBoundaryEnhanced 返回值

| 属性            | 类型                     | 说明                     |
| --------------- | ------------------------ | ------------------------ |
| `ErrorBoundary` | `Component`              | 绑定了状态的错误边界组件 |
| `error`         | `Error \| null`          | 当前错误对象             |
| `errorLogs`     | `ErrorLog[]`             | 历史错误日志数组         |
| `resetError`    | `() => void`             | 重置错误状态（触发重试） |
| `triggerError`  | `(error: Error) => void` | 手动触发错误（用于测试） |

### ErrorLog 类型

```typescript
interface ErrorLog {
  error: Error;
  errorInfo: ErrorInfo;
  timestamp: Date;
  componentStack: string | undefined | null;
}
```
