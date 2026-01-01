# 工具函数 API

本页面提供 Flexi-UI 实用工具函数的详细 API 说明。

## 节流

### throttle 节流函数

限制函数在指定时间间隔内只能执行一次。

```typescript
import { throttle } from '@daomu/flexi-ui';

const throttledHandler = throttle(event => {
  console.log('滚动事件', event);
}, 100);

window.addEventListener('scroll', throttledHandler);
```

#### 参数

| 参数      | 类型              | 必填 | 说明                 |
| --------- | ----------------- | ---- | -------------------- |
| `fn`      | `Function`        | 是   | 需要节流的函数       |
| `wait`    | `number`          | 是   | 节流间隔时间（毫秒） |
| `options` | `ThrottleOptions` | 否   | 节流选项             |

#### 选项

```typescript
interface ThrottleOptions {
  leading?: boolean; // 是否在开始时立即执行，默认 true
  trailing?: boolean; // 是否在结束时执行，默认 true
}
```

#### 返回值

返回节流后的函数，该函数具有以下方法：

- `cancel()`: 取消待执行的函数调用
- `flush()`: 立即执行待执行的函数调用
