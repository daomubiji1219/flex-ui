# Flexi-UI Hooks 使用说明文档

## 概述

Flexi-UI 提供了一套完整的 React Hooks 集合，涵盖主题管理、表单处理、本地存储等常见场景。这些 hooks 遵循 React 最佳实践，提供类型安全、高性能的解决方案。

## 核心 Hooks

### 1. useTheme Hook

#### 功能特性

- **主题状态管理**：获取当前主题模式和完整主题对象
- **主题切换**：提供便捷的主题切换方法
- **类型安全**：完整的 TypeScript 类型支持
- **Context 集成**：与 ThemeProvider 深度集成

#### 技术实现

```typescript
import { useContext } from 'react';
import { ThemeContext } from '../providers/ThemeProvider';
import type { Theme, ThemeMode } from '../theme/tokens';

export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

#### 使用示例

```tsx
import { useTheme } from 'flexi-ui';

const MyComponent: React.FC = () => {
  const { theme, mode, toggleMode, setMode } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary,
      }}
    >
      <p>当前主题: {mode}</p>
      <button onClick={toggleMode}>
        切换到 {mode === 'light' ? '暗色' : '亮色'} 主题
      </button>
      <button onClick={() => setMode('dark')}>设置为暗色主题</button>
    </div>
  );
};

// 在应用根部使用 ThemeProvider
import { ThemeProvider } from 'flexi-ui';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
};
```

#### API 接口

```typescript
interface ThemeContextValue {
  theme: Theme; // 完整的主题对象
  mode: ThemeMode; // 当前主题模式 'light' | 'dark'
  toggleMode: () => void; // 切换主题模式
  setMode: (mode: ThemeMode) => void; // 设置特定主题模式
}

type ThemeMode = 'light' | 'dark';

interface Theme {
  tokens: typeof designTokens;
  mode: ThemeMode;
  isDark: boolean;
  colors: {
    // 基础颜色系统
    primary: ColorScale;
    secondary: ColorScale;
    // 语义化颜色
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    border: string;
  };
}
```

### 2. useLocalStorage Hook

#### 功能特性

- **持久化存储**：自动同步状态到 localStorage
- **类型安全**：支持泛型类型约束
- **错误处理**：优雅处理存储异常
- **SSR 兼容**：服务端渲染安全

#### 技术实现

```typescript
import { useState } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // 尝试从 localStorage 读取值
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('LocalStorage error:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 支持函数式更新
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // 同步到 localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  };

  return [storedValue, setValue] as const;
};
```

#### 使用示例

```tsx
import { useLocalStorage } from 'flexi-ui';

interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

const SettingsComponent: React.FC = () => {
  // 基础类型使用
  const [count, setCount] = useLocalStorage<number>('count', 0);

  // 复杂对象类型使用
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'userPreferences',
    {
      theme: 'light',
      language: 'zh-CN',
      notifications: true,
    }
  );

  const updateTheme = (newTheme: 'light' | 'dark') => {
    setPreferences(prev => ({
      ...prev,
      theme: newTheme,
    }));
  };

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>

      <p>当前主题: {preferences.theme}</p>
      <button onClick={() => updateTheme('dark')}>切换到暗色主题</button>

      <label>
        <input
          type="checkbox"
          checked={preferences.notifications}
          onChange={e =>
            setPreferences(prev => ({
              ...prev,
              notifications: e.target.checked,
            }))
          }
        />
        启用通知
      </label>
    </div>
  );
};
```

#### API 接口

```typescript
function useLocalStorage<T>(
  key: string, // localStorage 键名
  initialValue: T // 初始值
): [
  T, // 当前值
  (value: T | ((val: T) => T)) => void, // 设置值的函数
];
```

### 3. useForm Hook（基础版本）

#### 功能特性

- **表单状态管理**：统一管理表单值、错误、提交状态
- **字段验证**：支持异步验证和自定义验证规则
- **防抖优化**：避免频繁验证影响性能
- **类型安全**：完整的 TypeScript 支持

#### 基础实现（简化版）

```typescript
interface ValidationRule {
  validate: (value: unknown) => Promise<void> | void;
}

type ValidationSchema<T> = Partial<Record<keyof T, ValidationRule>>;

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
}

export const useForm = <T extends Record<string, unknown>>(
  initialValues: T,
  validationSchema?: ValidationSchema<T>
) => {
  const [state, setState] = useReducer(formReducer<T>, {
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  // 字段验证
  const validateField = useCallback(
    async (name: keyof T, value: unknown): Promise<string | null> => {
      if (!validationSchema?.[name]) return null;

      try {
        await validationSchema[name]!.validate(value);
        return null;
      } catch (error: unknown) {
        return (error as Error).message || '验证失败';
      }
    },
    [validationSchema]
  );

  // 防抖验证
  const debouncedValidate = useMemo(
    () => debounce(validateField, 300),
    [validateField]
  );

  // 设置字段值
  const setFieldValue = useCallback(
    async (name: keyof T, value: unknown) => {
      setState({ type: 'SET_FIELD_VALUE', payload: { name, value } });

      // 触发验证
      const error = await debouncedValidate(name, value);
      if (error) {
        setState({ type: 'SET_FIELD_ERROR', payload: { name, error } });
      } else {
        setState({ type: 'CLEAR_FIELD_ERROR', payload: { name } });
      }
    },
    [debouncedValidate]
  );

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    setFieldValue,
    // ... 其他方法
  };
};
```

#### 使用示例

```tsx
import { useForm } from 'flexi-ui';

interface LoginForm {
  email: string;
  password: string;
}

const LoginComponent: React.FC = () => {
  const form = useForm<LoginForm>(
    {
      email: '',
      password: '',
    },
    {
      email: {
        validate: value => {
          if (!value || typeof value !== 'string') {
            throw new Error('邮箱不能为空');
          }
          if (!/\S+@\S+\.\S+/.test(value)) {
            throw new Error('邮箱格式不正确');
          }
        },
      },
      password: {
        validate: value => {
          if (!value || typeof value !== 'string') {
            throw new Error('密码不能为空');
          }
          if (value.length < 6) {
            throw new Error('密码至少6位');
          }
        },
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await form.validateForm();
    if (isValid) {
      // 提交表单
      console.log('提交数据:', form.values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          placeholder="邮箱"
          value={form.values.email}
          onChange={e => form.setFieldValue('email', e.target.value)}
        />
        {form.errors.email && (
          <span className="error">{form.errors.email}</span>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="密码"
          value={form.values.password}
          onChange={e => form.setFieldValue('password', e.target.value)}
        />
        {form.errors.password && (
          <span className="error">{form.errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? '登录中...' : '登录'}
      </button>
    </form>
  );
};
```

### 4. useFormRefactored Hook（高级版本）

#### 功能特性

- **设计模式集成**：应用了外观模式、命令模式、观察者模式等
- **状态管理优化**：使用状态机模式管理复杂状态
- **性能优化**：LRU 缓存、防抖验证、批量操作
- **撤销重做**：支持表单操作的撤销和重做
- **观察者系统**：支持字段变化监听

#### 核心架构

```typescript
// 外观模式 - 简化复杂的表单操作接口
export class FormFacade<T extends Record<string, unknown>> {
  private stateContext: FormStateContext;
  private observerManager: FormObserverManager;
  private commandInvoker: FormCommandInvoker;
  private validationCache: LRUCache<string, ValidationResult>;

  constructor(config: FormConfig<T>) {
    this.config = config;
    this.observerManager = new FormObserverManager();
    this.commandInvoker = new FormCommandInvoker();
    this.validationCache = new LRUCache<string, ValidationResult>(100);

    // 初始化状态
    const initialState: FormState<T> = {
      values: deepClone(config.initialValues),
      errors: {},
      touched: {},
      isSubmitting: false,
      isDirty: false,
    };

    this.stateContext = new FormStateContext(initialState, new IdleFormState());
    this.setupDebouncedValidators();
  }

  // 设置字段值（命令模式）
  async setFieldValue(fieldName: keyof T, value: unknown): Promise<void> {
    const command = new SetFieldValueCommand(
      this.stateContext,
      String(fieldName),
      value
    );

    await this.commandInvoker.execute(command);

    // 通知观察者
    this.observerManager.notifyFieldChange(String(fieldName), value);

    // 触发验证
    if (this.config.validateOnChange !== false) {
      const debouncedValidator = this.debouncedValidators.get(fieldName);
      if (debouncedValidator) {
        await debouncedValidator(value);
      }
    }
  }

  // 批量设置字段值
  async batchSetFieldValues(values: Partial<T>): Promise<void> {
    const command = new BatchSetFieldValuesCommand(this.stateContext, values);
    await this.commandInvoker.execute(command);

    // 批量通知观察者
    Object.entries(values).forEach(([key, value]) => {
      this.observerManager.notifyFieldChange(key, value);
    });
  }

  // 撤销操作
  async undo(): Promise<void> {
    await this.commandInvoker.undo();
  }

  // 重做操作
  async redo(): Promise<void> {
    await this.commandInvoker.redo();
  }
}
```

#### 使用示例

```tsx
import { useFormRefactored, FormRefactored } from 'flexi-ui';

interface UserProfile {
  name: string;
  email: string;
  age: number;
  bio: string;
}

// 方式1：使用 Hook
const ProfileFormWithHook: React.FC = () => {
  const form = useFormRefactored<UserProfile>({
    initialValues: {
      name: '',
      email: '',
      age: 0,
      bio: '',
    },
    validationSchema: {
      name: {
        validate: async value => {
          if (!value || typeof value !== 'string' || value.length < 2) {
            return { isValid: false, message: '姓名至少2个字符' };
          }
          return { isValid: true };
        },
      },
      email: {
        validate: async value => {
          if (!value || typeof value !== 'string') {
            return { isValid: false, message: '邮箱不能为空' };
          }
          if (!/\S+@\S+\.\S+/.test(value)) {
            return { isValid: false, message: '邮箱格式不正确' };
          }
          return { isValid: true };
        },
      },
    },
    validateOnChange: true,
    debounceMs: 300,
  });

  // 监听字段变化
  React.useEffect(() => {
    const unsubscribe = form.subscribe({
      onFieldChange: (fieldName, value) => {
        console.log(`字段 ${fieldName} 变更为:`, value);
      },
      onFieldError: (fieldName, error) => {
        console.log(`字段 ${fieldName} 验证错误:`, error);
      },
    });

    return unsubscribe;
  }, [form]);

  return (
    <div>
      <input
        value={form.values.name}
        onChange={e => form.setFieldValue('name', e.target.value)}
        placeholder="姓名"
      />
      {form.errors.name && <span>{form.errors.name}</span>}

      <input
        value={form.values.email}
        onChange={e => form.setFieldValue('email', e.target.value)}
        placeholder="邮箱"
      />
      {form.errors.email && <span>{form.errors.email}</span>}

      <div>
        <button onClick={() => form.undo()} disabled={!form.canUndo()}>
          撤销
        </button>
        <button onClick={() => form.redo()} disabled={!form.canRedo()}>
          重做
        </button>
      </div>

      <button onClick={() => form.validateForm()}>验证表单</button>
    </div>
  );
};

// 方式2：使用 FormRefactored 组件
const ProfileFormWithComponent: React.FC = () => {
  const handleSubmit = async (values: UserProfile) => {
    console.log('提交数据:', values);
    // 处理提交逻辑
  };

  return (
    <FormRefactored
      config={{
        initialValues: {
          name: '',
          email: '',
          age: 0,
          bio: '',
        },
        validationSchema: {
          // 验证规则...
        },
      }}
      onSubmit={handleSubmit}
    >
      {/* 表单内容 */}
    </FormRefactored>
  );
};
```

#### API 接口

```typescript
interface FormConfig<T> {
  initialValues: T;
  validationSchema?: Record<keyof T, IValidator>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

interface IValidator {
  validate: (value: unknown) => Promise<ValidationResult> | ValidationResult;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

interface IFormContext<T = Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isDirty: boolean;
  setFieldValue: (name: keyof T, value: unknown) => Promise<void>;
  validateField: (name: keyof T) => Promise<ValidationResult>;
  validateForm: () => Promise<Record<keyof T, ValidationResult>>;
  resetForm: () => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  canUndo: () => boolean;
  canRedo: () => boolean;
}
```

## 工具 Hooks

### 1. throttle 工具函数

#### 功能特性

- **性能优化**：限制函数调用频率
- **灵活配置**：支持 leading 和 trailing 选项
- **取消和立即执行**：提供 cancel 和 flush 方法
- **TypeScript 支持**：完整的类型定义

#### 实现细节

```typescript
export interface ThrottleOptions {
  leading?: boolean; // 是否在开始时立即执行
  trailing?: boolean; // 是否在结束时执行
}

export type ThrottledFunction<TArgs extends unknown[]> = ((
  ...args: TArgs
) => void) & {
  cancel: () => void; // 取消待执行的函数
  flush: () => void; // 立即执行待执行的函数
};

export function throttle<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  wait: number,
  options: ThrottleOptions = {}
): ThrottledFunction<TArgs> {
  const leading = options.leading !== undefined ? options.leading : true;
  const trailing = options.trailing !== undefined ? options.trailing : true;

  let lastCallTime: number | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: TArgs | undefined;

  const throttled = function (this: unknown, ...args: TArgs) {
    const now = Date.now();

    if (lastCallTime === null && leading === false) {
      lastCallTime = now;
    }

    const remaining = wait - (now - (lastCallTime || 0));
    lastArgs = args;

    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCallTime = now;
      fn.apply(this, args);
      lastArgs = undefined;
    } else if (!timer && trailing !== false) {
      timer = setTimeout(() => {
        lastCallTime = leading === false ? null : Date.now();
        timer = null;
        if (lastArgs) {
          fn.apply(this, lastArgs);
          lastArgs = undefined;
        }
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastCallTime = null;
    lastArgs = undefined;
  };

  throttled.flush = () => {
    if (timer && lastArgs) {
      clearTimeout(timer);
      timer = null;
      lastCallTime = Date.now();
      fn.apply(this, lastArgs);
      lastArgs = undefined;
    }
  };

  return throttled as ThrottledFunction<TArgs>;
}
```

#### 使用示例

```tsx
import { throttle } from 'flexi-ui';

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // 节流搜索函数
  const throttledSearch = useMemo(
    () =>
      throttle(
        async (searchQuery: string) => {
          if (searchQuery.trim()) {
            const response = await fetch(`/api/search?q=${searchQuery}`);
            const data = await response.json();
            setResults(data);
          }
        },
        300,
        { leading: false, trailing: true }
      ),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    throttledSearch(value);
  };

  // 清理函数
  useEffect(() => {
    return () => {
      throttledSearch.cancel();
    };
  }, [throttledSearch]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="搜索..."
      />
      <button onClick={() => throttledSearch.flush()}>立即搜索</button>
      <ul>
        {results.map((item, index) => (
          <li key={index}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};
```

## 设计模式应用

### 1. 外观模式（Facade Pattern）

在 `useFormRefactored` 中使用外观模式简化复杂的表单操作：

```typescript
// FormFacade 类提供简化的接口
class FormFacade<T> {
  // 隐藏复杂的内部实现
  private stateContext: FormStateContext;
  private observerManager: FormObserverManager;
  private commandInvoker: FormCommandInvoker;

  // 提供简单的公共接口
  async setFieldValue(fieldName: keyof T, value: unknown) {
    // 内部协调多个子系统
  }
}
```

### 2. 命令模式（Command Pattern）

用于实现撤销/重做功能：

```typescript
// 命令接口
interface ICommand {
  execute(): Promise<void>;
  undo(): Promise<void>;
}

// 具体命令实现
class SetFieldValueCommand implements ICommand {
  constructor(
    private context: FormStateContext,
    private fieldName: string,
    private newValue: unknown,
    private oldValue?: unknown
  ) {}

  async execute(): Promise<void> {
    this.oldValue = this.context.getFieldValue(this.fieldName);
    this.context.setFieldValue(this.fieldName, this.newValue);
  }

  async undo(): Promise<void> {
    if (this.oldValue !== undefined) {
      this.context.setFieldValue(this.fieldName, this.oldValue);
    }
  }
}
```

### 3. 观察者模式（Observer Pattern）

用于监听表单字段变化：

```typescript
interface IFormObserver {
  onFieldChange?: (fieldName: string, value: unknown) => void;
  onFieldError?: (fieldName: string, error: string) => void;
}

class FormObserverManager {
  private observers: IFormObserver[] = [];

  subscribe(observer: IFormObserver): () => void {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  notifyFieldChange(fieldName: string, value: unknown): void {
    this.observers.forEach(observer => {
      observer.onFieldChange?.(fieldName, value);
    });
  }
}
```

### 4. 状态模式（State Pattern）

用于管理表单的不同状态：

```typescript
abstract class FormState {
  abstract handleSubmit(context: FormStateContext): Promise<void>;
  abstract handleValidation(context: FormStateContext): Promise<void>;
}

class IdleFormState extends FormState {
  async handleSubmit(context: FormStateContext): Promise<void> {
    context.setState(new SubmittingFormState());
    // 处理提交逻辑
  }
}

class SubmittingFormState extends FormState {
  async handleSubmit(context: FormStateContext): Promise<void> {
    // 提交中状态不允许再次提交
    console.warn('表单正在提交中...');
  }
}
```

## 性能优化策略

### 1. 缓存机制

```typescript
// LRU 缓存用于验证结果
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)!;
      // 移到最后（最近使用）
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 删除最久未使用的项
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

### 2. 防抖优化

```typescript
// 防抖函数实现
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

// 在表单中使用防抖验证
const debouncedValidator = useMemo(
  () =>
    debounce(async (fieldName: string, value: unknown) => {
      await validateField(fieldName, value);
    }, 300),
  []
);
```

### 3. 批量操作

```typescript
// 批量设置字段值，减少重渲染
const batchSetFieldValues = useCallback(async (values: Partial<T>) => {
  // 使用 unstable_batchedUpdates 或 React 18 的自动批处理
  const updates = Object.entries(values).map(([key, value]) => ({
    type: 'SET_FIELD_VALUE',
    payload: { name: key, value },
  }));

  // 批量分发 actions
  updates.forEach(action => dispatch(action));
}, []);
```

## 最佳实践

### 1. Hook 使用原则

```tsx
// ✅ 推荐：在组件顶层使用 hooks
const MyComponent: React.FC = () => {
  const { theme } = useTheme();
  const [settings, setSettings] = useLocalStorage('settings', defaultSettings);

  // 组件逻辑...
};

// ❌ 避免：在条件语句中使用 hooks
const BadComponent: React.FC = ({ condition }) => {
  if (condition) {
    const { theme } = useTheme(); // 错误！
  }
};
```

### 2. 类型安全

```tsx
// ✅ 推荐：使用泛型确保类型安全
interface UserForm {
  name: string;
  email: string;
  age: number;
}

const form = useFormRefactored<UserForm>({
  initialValues: {
    name: '',
    email: '',
    age: 0,
  },
});

// TypeScript 会检查字段名和类型
form.setFieldValue('name', 'John'); // ✅ 正确
form.setFieldValue('invalid', 'value'); // ❌ 类型错误

// ❌ 避免：使用 any 类型
const badForm = useFormRefactored<any>({
  initialValues: {},
});
```

### 3. 性能优化

```tsx
// ✅ 推荐：使用 useMemo 缓存复杂计算
const ExpensiveComponent: React.FC = () => {
  const { theme } = useTheme();

  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(theme);
  }, [theme]);

  return <div>{expensiveValue}</div>;
};

// ✅ 推荐：使用 useCallback 缓存函数
const FormComponent: React.FC = () => {
  const form = useFormRefactored(config);

  const handleSubmit = useCallback(async (values: FormData) => {
    await submitForm(values);
  }, []);

  return <form onSubmit={handleSubmit}>...</form>;
};
```

### 4. 错误处理

```tsx
// ✅ 推荐：优雅处理错误
const SafeComponent: React.FC = () => {
  try {
    const { theme } = useTheme();
    return <div style={{ color: theme.colors.text.primary }}>内容</div>;
  } catch (error) {
    console.error('主题获取失败:', error);
    return <div>加载中...</div>;
  }
};

// ✅ 推荐：使用错误边界
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MyComponent />
      </ThemeProvider>
    </ErrorBoundary>
  );
};
```

## 总结

Flexi-UI 的 Hooks 系统提供了完整的状态管理和工具函数解决方案，通过应用现代设计模式和性能优化技术，为开发者提供了高效、类型安全、易于使用的 React Hooks 集合。这些 hooks 不仅解决了常见的开发需求，还展示了如何在 React 应用中应用高级设计模式和最佳实践。
