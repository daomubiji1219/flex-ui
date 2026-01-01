# Hooks API

本页面提供 Flexi-UI 自定义 React Hooks 的详细 API 说明。

## useForm 表单管理

用于管理表单状态、验证和提交的 Hook。该 Hook 经过重构，采用了外观模式、状态模式、观察者模式和命令模式，提供了强大的表单状态管理能力。

### 基本用法

```typescript
import { useForm } from '@daomu/flexi-ui';

// 定义验证器
const requiredValidator = {
  validate: (value: any) => ({
    isValid: !!value,
    message: '此项必填'
  })
};

const MyForm = () => {
  const {
    values,
    errors,
    setFieldValue,
    handleSubmit,
    undo,
    redo,
    canUndo,
    canRedo
  } = useForm({
    initialValues: { name: '', email: '' },
    validationSchema: {
      name: requiredValidator,
      email: requiredValidator
    },
    debounceMs: 300,
    validateOnChange: true
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    // 提交逻辑
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={values.name}
        onChange={(e) => setFieldValue('name', e.target.value)}
      />
      {errors.name && <span>{errors.name}</span>}

      {/* 撤销/重做按钮 */}
      <button type="button" onClick={undo} disabled={!canUndo()}>撤销</button>
      <button type="button" onClick={redo} disabled={!canRedo()}>重做</button>
    </form>
  );
};
```

### 参数

| 参数               | 类型                          | 必填 | 说明                                           |
| ------------------ | ----------------------------- | ---- | ---------------------------------------------- |
| `initialValues`    | `T`                           | 是   | 表单初始值                                     |
| `validationSchema` | `Record<keyof T, IValidator>` | 否   | 验证规则 Schema                                |
| `debounceMs`       | `number`                      | 否   | 验证防抖时间（毫秒），默认 300ms               |
| `validateOnChange` | `boolean`                     | 否   | 是否在值变化时触发验证，默认 true              |
| `validateOnBlur`   | `boolean`                     | 否   | 是否在失焦时触发验证（需配合 handleBlur 使用） |

### 返回值

#### 状态属性

| 属性           | 类型                                | 说明           |
| -------------- | ----------------------------------- | -------------- |
| `values`       | `T`                                 | 当前表单值     |
| `errors`       | `Partial<Record<keyof T, string>>`  | 验证错误信息   |
| `touched`      | `Partial<Record<keyof T, boolean>>` | 字段是否被触摸 |
| `isSubmitting` | `boolean`                           | 是否正在提交   |
| `isDirty`      | `boolean`                           | 表单是否被修改 |

#### 核心方法

| 方法                          | 说明                                                       |
| ----------------------------- | ---------------------------------------------------------- |
| `setFieldValue(name, value)`  | 设置字段值，会自动触发验证和状态更新，并记录历史以支持撤销 |
| `batchSetFieldValues(values)` | 批量设置字段值                                             |
| `setFieldError(name, error)`  | 手动设置字段错误                                           |
| `clearFieldError(name)`       | 清除字段错误                                               |
| `validateField(name)`         | 触发单个字段验证                                           |
| `validateForm()`              | 触发整个表单验证                                           |
| `resetForm()`                 | 重置表单到初始状态                                         |
| `setSubmitting(isSubmitting)` | 设置提交状态                                               |

#### 高级特性（命令模式）

| 方法        | 说明                                   |
| ----------- | -------------------------------------- |
| `undo()`    | 撤销上一次操作（仅支持 setFieldValue） |
| `redo()`    | 重做上一次撤销的操作                   |
| `canUndo()` | 是否可以撤销                           |
| `canRedo()` | 是否可以重做                           |

#### 统计与订阅

| 方法                  | 说明                                 |
| --------------------- | ------------------------------------ |
| `getFormStats()`      | 获取表单统计信息（完成率、错误率等） |
| `subscribe(observer)` | 订阅表单变化事件                     |

### 类型定义

```typescript
interface IValidator {
  validate(value: unknown): Promise<ValidationResult> | ValidationResult;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

interface FormConfig<T> {
  initialValues: T;
  validationSchema?: Record<keyof T, IValidator>;
  debounceMs?: number;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}
```

---

## useLocalStorage 本地存储

用于在 localStorage 中持久化状态的 Hook。

### 基本用法

```typescript
import { useLocalStorage } from '@daomu/flexi-ui';

const [value, setValue] = useLocalStorage('my-key', 'default-value');
```

### 参数

| 参数           | 类型     | 必填 | 说明              |
| -------------- | -------- | ---- | ----------------- |
| `key`          | `string` | 是   | localStorage 键名 |
| `initialValue` | `T`      | 是   | 初始值            |

### 返回值

返回一个包含两个元素的数组（类似 `useState`）：

| 索引 | 类型                                    | 说明         |
| ---- | --------------------------------------- | ------------ |
| `0`  | `T`                                     | 当前存储的值 |
| `1`  | `(value: T \| ((val: T) => T)) => void` | 设置值的函数 |

---

## useTheme 主题管理

用于管理应用主题的 Hook。

### 基本用法

```typescript
import { useTheme } from '@daomu/flexi-ui';

const { theme, mode, toggleMode, setMode } = useTheme();
```

### 返回值

| 属性         | 类型                        | 说明                             |
| ------------ | --------------------------- | -------------------------------- |
| `theme`      | `Theme`                     | 完整的主题对象（包含 tokens 等） |
| `mode`       | `ThemeMode`                 | 当前主题模式 ('light' \| 'dark') |
| `toggleMode` | `() => void`                | 切换主题模式                     |
| `setMode`    | `(mode: ThemeMode) => void` | 设置特定主题模式                 |

### 类型定义

```typescript
type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}
```

---

## useErrorBoundaryEnhanced 增强版错误边界

用于在函数组件中访问错误边界功能的高级 Hook。

### 基本用法

```tsx
import { useErrorBoundaryEnhanced, DefaultErrorFallback } from 'flexi-ui';

function MyComponent() {
  const { ErrorBoundary, error, resetError } = useErrorBoundaryEnhanced(
    DefaultErrorFallback,
    { maxRetries: 3 }
  );

  return (
    <ErrorBoundary>
      <SubComponent />
    </ErrorBoundary>
  );
}
```

### 参数

| 参数       | 类型                                      | 必填 | 说明                 |
| ---------- | ----------------------------------------- | ---- | -------------------- |
| `fallback` | `(error, reset, retryCount) => ReactNode` | 是   | 错误回退 UI 渲染函数 |
| `options`  | `object`                                  | 否   | 配置选项             |

### Options

| 属性         | 类型                    | 说明         |
| ------------ | ----------------------- | ------------ |
| `maxRetries` | `number`                | 最大重试次数 |
| `onError`    | `(error, info) => void` | 错误捕获回调 |

### 返回值

| 属性            | 类型              | 说明         |
| --------------- | ----------------- | ------------ |
| `ErrorBoundary` | `Component`       | 错误边界组件 |
| `error`         | `Error \| null`   | 当前错误     |
| `errorLogs`     | `ErrorLog[]`      | 错误日志历史 |
| `resetError`    | `() => void`      | 重置错误状态 |
| `triggerError`  | `(error) => void` | 手动触发错误 |

---

更多 Hook 的详细使用示例请参考各组件的文档页面。
