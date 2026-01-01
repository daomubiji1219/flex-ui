# 类型定义 API

本页面提供 Flexi-UI 的 TypeScript 类型定义和接口说明。

## 基础类型

### ThemeMode 主题模式

定义应用的主题模式。

```typescript
type ThemeMode = 'light' | 'dark';
```

**使用场景**: `ThemeProvider`, `useTheme`.

### Theme 主题对象

定义完整的主题对象结构。

```typescript
interface Theme {
  tokens: typeof designTokens;
  mode: ThemeMode;
  isDark: boolean;
  colors: typeof designTokens.colors & {
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

**使用场景**: `useTheme` Hook 返回的 `theme` 对象。

---

## 组件属性类型

### ButtonProps 按钮属性

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}
```

**扩展**: 继承原生 `button` 元素的所有属性。

---

### DataTableProps 数据表格属性

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T;
  pagination?: {
    pageSize: number;
    showSizeChanger?: boolean;
  };
  loading?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  virtualScroll?: boolean;
  selectable?: boolean;
  className?: string;
}
```

**泛型**: `T` 表示数据行的类型。

---

### VirtualListProps 虚拟列表属性

```typescript
interface VirtualListProps<T> {
  data: T[];
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  getKey?: (item: T) => number | string;
  renderItem: (item: T, index?: number) => ReactNode;
  className?: string;
}
```

**泛型**: `T` 表示列表项的数据类型。

---

### FileUploaderProps 文件上传属性

```typescript
interface FileUploaderProps {
  action: string;
  urls?: {
    check: string; // 检查已上传分片的接口URL
    chunk: string; // 上传分片的接口URL
    merge: string; // 合并分片的接口URL
  };
  multiple?: boolean;
  chunkSize?: number;
  maxConcurrent?: number;
  accept?: string;
  maxSize?: number;
  onProgress?: (file: UploadFile, progress: number) => void;
  onSuccess?: (file: UploadFile, response: unknown) => void;
  onError?: (file: UploadFile, error: Error) => void;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  className?: string;
}
```

---

## 数据结构类型

### Column 表格列配置

```typescript
interface Column<T> {
  key: keyof T;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  sortDirection?: 'asc' | 'desc';
  filterValue?: unknown;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}
```

**泛型**: `T` 表示数据行的类型。

---

### UploadFile 上传文件

```typescript
interface UploadFile {
  uid: string;
  name: string;
  size: number;
  type: string;
  status: 'ready' | 'uploading' | 'success' | 'error' | 'paused';
  progress: number;
  file: File;
  chunks?: Blob[];
  uploadedChunks?: boolean[];
  hash?: string;
}
```

---

## 表单类型

### FormState 表单状态

```typescript
interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isDirty: boolean;
}
```

---

### FormConfig 表单配置

```typescript
interface FormConfig<T = Record<string, unknown>> {
  initialValues: T;
  validationSchema?: Record<keyof T, IValidator>;
  debounceMs?: number;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}
```

---

### IFormContext 表单上下文

```typescript
interface IFormContext<T = Record<string, unknown>> {
  state: FormState<T>;
  setFieldValue: (name: keyof T, value: unknown) => Promise<void>;
  setFieldError: (name: keyof T, error: string) => void;
  clearFieldError: (name: keyof T) => void;
  validateField: (name: keyof T) => Promise<ValidationResult>;
  validateForm: () => Promise<Record<keyof T, ValidationResult>>;
  resetForm: () => void;
  subscribe: (observer: IFormObserver) => () => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  canUndo: () => boolean;
  canRedo: () => boolean;
}
```

---

### ValidationResult 验证结果

```typescript
interface ValidationResult {
  isValid: boolean;
  message?: string;
}
```

---

### IValidator 验证器接口

```typescript
interface IValidator {
  validate(value: unknown): Promise<ValidationResult> | ValidationResult;
}
```

---

### IFormObserver 表单观察者

```typescript
interface IFormObserver {
  onFieldChange(fieldName: string, value: unknown): void;
  onFieldError(fieldName: string, error: string): void;
  onFormSubmit(values: Record<string, unknown>): void;
}
```

---

## 工具类型

### ThrottledFunction 节流函数

```typescript
type ThrottledFunction<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
  cancel: () => void;
  flush: () => void;
};
```

**使用场景**: `throttle` 工具函数。

---

## 类型导入

### 按需导入

```typescript
// 导入特定类型
import type { ButtonProps, DataTableProps } from '@daomu/flexi-ui';

// 导入所有类型
import type * as FlexiTypes from '@daomu/flexi-ui';
```

---

所有类型定义都经过严格的 TypeScript 检查，确保类型安全和开发体验。更多类型使用示例请参考各组件的文档和源码。
