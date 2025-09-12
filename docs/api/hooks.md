# Hooks API

本页面提供 Flexi-UI 自定义 React Hooks 的详细 API 说明。

## useForm 表单管理

用于管理表单状态、验证和提交的 Hook。

### 基本用法

```typescript
import { useForm } from '@daomu/flexi-ui';

const { values, errors, handleChange, handleSubmit, reset } = useForm({
  initialValues: { name: '', email: '' },
  validate: values => {
    const errors: any = {};
    if (!values.name) errors.name = '姓名不能为空';
    if (!values.email) errors.email = '邮箱不能为空';
    return errors;
  },
  onSubmit: values => {
    console.log('提交数据:', values);
  },
});
```

### 参数

| 参数               | 类型                                   | 必填 | 说明               |
| ------------------ | -------------------------------------- | ---- | ------------------ |
| `initialValues`    | `T`                                    | 是   | 表单初始值         |
| `validate`         | `(values: T) => Partial<T>`            | 否   | 验证函数           |
| `onSubmit`         | `(values: T) => void \| Promise<void>` | 是   | 提交处理函数       |
| `validateOnChange` | `boolean`                              | 否   | 是否在值变化时验证 |
| `validateOnBlur`   | `boolean`                              | 否   | 是否在失焦时验证   |

### 返回值

| 属性            | 类型                                     | 说明           |
| --------------- | ---------------------------------------- | -------------- |
| `values`        | `T`                                      | 当前表单值     |
| `errors`        | `Partial<T>`                             | 验证错误信息   |
| `touched`       | `Partial<Record<keyof T, boolean>>`      | 字段是否被触摸 |
| `isSubmitting`  | `boolean`                                | 是否正在提交   |
| `isValid`       | `boolean`                                | 表单是否有效   |
| `handleChange`  | `(name: keyof T, value: any) => void`    | 处理值变化     |
| `handleBlur`    | `(name: keyof T) => void`                | 处理失焦事件   |
| `handleSubmit`  | `(e?: FormEvent) => void`                | 处理表单提交   |
| `setFieldValue` | `(name: keyof T, value: any) => void`    | 设置字段值     |
| `setFieldError` | `(name: keyof T, error: string) => void` | 设置字段错误   |
| `reset`         | `() => void`                             | 重置表单       |

### 类型定义

```typescript
interface UseFormConfig<T> {
  initialValues: T;
  validate?: (values: T) => Partial<T>;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (name: keyof T, value: any) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (e?: FormEvent) => void;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  reset: () => void;
}
```

---

## useLocalStorage 本地存储

用于在 localStorage 中持久化状态的 Hook。

### 基本用法

```typescript
import { useLocalStorage } from '@daomu/flexi-ui';

const [value, setValue, removeValue] = useLocalStorage(
  'my-key',
  'default-value'
);
```

### 参数

| 参数           | 类型            | 必填 | 说明              |
| -------------- | --------------- | ---- | ----------------- |
| `key`          | `string`        | 是   | localStorage 键名 |
| `initialValue` | `T`             | 否   | 初始值            |
| `serializer`   | `Serializer<T>` | 否   | 自定义序列化器    |

### 返回值

返回一个包含三个元素的数组：

| 索引 | 类型                 | 说明         |
| ---- | -------------------- | ------------ |
| `0`  | `T \| undefined`     | 当前存储的值 |
| `1`  | `(value: T) => void` | 设置值的函数 |
| `2`  | `() => void`         | 移除值的函数 |

### 类型定义

```typescript
interface Serializer<T> {
  parse: (value: string) => T;
  stringify: (value: T) => string;
}

type UseLocalStorageReturn<T> = [T | undefined, (value: T) => void, () => void];
```

### 高级用法

```typescript
// 自定义序列化器
const dateSerializer: Serializer<Date> = {
  parse: (value: string) => new Date(value),
  stringify: (value: Date) => value.toISOString(),
};

const [date, setDate] = useLocalStorage(
  'selected-date',
  new Date(),
  dateSerializer
);
```

---

## useTheme 主题管理

用于管理应用主题的 Hook。

### 基本用法

```typescript
import { useTheme } from '@daomu/flexi-ui';

const { theme, setTheme, toggleTheme, isDark } = useTheme();
```

### 返回值

| 属性            | 类型                            | 说明                                    |
| --------------- | ------------------------------- | --------------------------------------- |
| `theme`         | `'light' \| 'dark' \| 'system'` | 当前主题                                |
| `resolvedTheme` | `'light' \| 'dark'`             | 解析后的主题（system 会解析为具体主题） |
| `setTheme`      | `(theme: Theme) => void`        | 设置主题                                |
| `toggleTheme`   | `() => void`                    | 切换主题（light/dark）                  |
| `isDark`        | `boolean`                       | 是否为暗色主题                          |
| `isLight`       | `boolean`                       | 是否为亮色主题                          |
| `systemTheme`   | `'light' \| 'dark'`             | 系统主题                                |

### 类型定义

```typescript
type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  systemTheme: ResolvedTheme;
}
```

---

## useDebounce 防抖

用于防抖处理的 Hook。

### 基本用法

```typescript
import { useDebounce } from '@daomu/flexi-ui';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 300);

// 使用防抖后的值进行搜索
useEffect(() => {
  if (debouncedSearchTerm) {
    performSearch(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

### 参数

| 参数    | 类型     | 必填 | 说明             |
| ------- | -------- | ---- | ---------------- |
| `value` | `T`      | 是   | 需要防抖的值     |
| `delay` | `number` | 是   | 延迟时间（毫秒） |

### 返回值

返回防抖后的值。

---

## useThrottle 节流

用于节流处理的 Hook。

### 基本用法

```typescript
import { useThrottle } from '@daomu/flexi-ui';

const [scrollY, setScrollY] = useState(0);
const throttledScrollY = useThrottle(scrollY, 100);

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### 参数

| 参数       | 类型     | 必填 | 说明             |
| ---------- | -------- | ---- | ---------------- |
| `value`    | `T`      | 是   | 需要节流的值     |
| `interval` | `number` | 是   | 节流间隔（毫秒） |

### 返回值

返回节流后的值。

---

## usePrevious 获取前一个值

用于获取状态的前一个值。

### 基本用法

```typescript
import { usePrevious } from '@daomu/flexi-ui';

const [count, setCount] = useState(0);
const prevCount = usePrevious(count);

console.log(`当前值: ${count}, 前一个值: ${prevCount}`);
```

### 参数

| 参数    | 类型 | 必填 | 说明   |
| ------- | ---- | ---- | ------ |
| `value` | `T`  | 是   | 当前值 |

### 返回值

返回前一个值，首次渲染时为 `undefined`。

---

## useToggle 切换状态

用于管理布尔状态的切换。

### 基本用法

```typescript
import { useToggle } from '@daomu/flexi-ui';

const [isOpen, toggle, setIsOpen] = useToggle(false);

// 切换状态
toggle();

// 设置特定状态
setIsOpen(true);
```

### 参数

| 参数           | 类型      | 必填 | 说明                   |
| -------------- | --------- | ---- | ---------------------- |
| `initialValue` | `boolean` | 否   | 初始值，默认为 `false` |

### 返回值

返回一个包含三个元素的数组：

| 索引 | 类型                       | 说明           |
| ---- | -------------------------- | -------------- |
| `0`  | `boolean`                  | 当前状态       |
| `1`  | `() => void`               | 切换状态的函数 |
| `2`  | `(value: boolean) => void` | 设置状态的函数 |

---

## 使用注意事项

### 1. Hook 规则

- 只能在函数组件或自定义 Hook 中使用
- 不能在循环、条件或嵌套函数中调用
- 确保 Hook 的调用顺序一致

### 2. 性能优化

```typescript
// ✅ 使用 useMemo 优化复杂计算
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ 使用 useCallback 优化函数引用
const handleClick = useCallback(() => {
  // 处理点击事件
}, [dependency]);
```

### 3. 错误处理

```typescript
// ✅ 在 Hook 中处理错误
const { data, error, loading } = useAsyncData(fetchData);

if (error) {
  return <ErrorComponent error={error} />;
}
```

### 4. 类型安全

```typescript
// ✅ 使用泛型确保类型安全
interface User {
  id: number;
  name: string;
  email: string;
}

const { values, handleChange } = useForm<User>({
  initialValues: { id: 0, name: '', email: '' },
  // ...
});
```

---

更多 Hook 的详细使用示例请参考各组件的文档页面。
