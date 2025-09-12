# 类型定义 API

本页面提供 Flexi-UI 的 TypeScript 类型定义和接口说明。

## 基础类型

### Size 尺寸类型

定义组件的尺寸规格。

```typescript
type Size = 'small' | 'medium' | 'large';
```

**使用场景**: Button、Input、Select 等组件的 `size` 属性。

---

### Variant 变体类型

定义组件的样式变体。

```typescript
type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
```

**使用场景**: Button、Badge、Alert 等组件的 `variant` 属性。

---

### Theme 主题类型

定义应用主题。

```typescript
type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';
```

**使用场景**: ThemeProvider、useTheme Hook。

---

### Status 状态类型

定义组件或操作的状态。

```typescript
type Status = 'idle' | 'loading' | 'success' | 'error';
```

**使用场景**: 异步操作、表单验证、文件上传等。

---

## 组件属性类型

### ButtonProps 按钮属性

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**扩展**: 继承原生 `button` 元素的所有属性。

---

### DataTableProps 数据表格属性

```typescript
interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pagination?: PaginationConfig;
  sortable?: boolean;
  selectable?: boolean;
  rowKey?: keyof T | ((record: T) => string | number);
  onRowClick?: (record: T, index: number) => void;
  onSelectionChange?: (
    selectedRows: T[],
    selectedRowKeys: (string | number)[]
  ) => void;
  className?: string;
  style?: React.CSSProperties;
}
```

**泛型**: `T` 表示数据行的类型。

---

### VirtualListProps 虚拟列表属性

```typescript
interface VirtualListProps<T = any> {
  data: T[];
  itemHeight?: number | ((index: number) => number);
  containerHeight?: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  className?: string;
  style?: React.CSSProperties;
}
```

**泛型**: `T` 表示列表项的数据类型。

---

### FileUploaderProps 文件上传属性

```typescript
interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  directory?: boolean;
  onFileSelect?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<UploadResponse[]>;
  onProgress?: (progress: UploadProgress) => void;
  onError?: (error: UploadError) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
```

---

## 数据结构类型

### Column 表格列配置

```typescript
interface Column<T = any> {
  key: keyof T;
  title: React.ReactNode;
  dataIndex?: keyof T;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  fixed?: 'left' | 'right';
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: (a: T, b: T) => number;
  filters?: FilterOption[];
  onFilter?: (value: any, record: T) => boolean;
  ellipsis?: boolean;
  className?: string;
}
```

**泛型**: `T` 表示数据行的类型。

---

### PaginationConfig 分页配置

```typescript
interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  pageSizeOptions?: string[];
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
}
```

---

### FilterOption 筛选选项

```typescript
interface FilterOption {
  text: React.ReactNode;
  value: any;
  children?: FilterOption[];
}
```

---

### UploadFile 上传文件

```typescript
interface UploadFile {
  uid: string;
  name: string;
  size: number;
  type: string;
  status: UploadStatus;
  progress?: number;
  response?: any;
  error?: UploadError;
  url?: string;
  thumbUrl?: string;
  originFileObj?: File;
}

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error' | 'removed';
```

---

### UploadResponse 上传响应

```typescript
interface UploadResponse {
  success: boolean;
  data?: any;
  message?: string;
  url?: string;
}
```

---

### UploadProgress 上传进度

```typescript
interface UploadProgress {
  file: UploadFile;
  percent: number;
  loaded: number;
  total: number;
}
```

---

### UploadError 上传错误

```typescript
interface UploadError {
  file: UploadFile;
  error: Error;
  message: string;
}
```

---

## 表单类型

### FormValues 表单值

```typescript
type FormValues = Record<string, any>;
```

---

### FormErrors 表单错误

```typescript
type FormErrors<T = FormValues> = Partial<Record<keyof T, string>>;
```

---

### FormTouched 表单触摸状态

```typescript
type FormTouched<T = FormValues> = Partial<Record<keyof T, boolean>>;
```

---

### ValidationRule 验证规则

```typescript
interface ValidationRule<T = any> {
  required?: boolean;
  message?: string;
  validator?: (value: T, values: FormValues) => string | undefined;
  pattern?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
}
```

---

### FieldConfig 字段配置

```typescript
interface FieldConfig<T = any> {
  name: string;
  label?: React.ReactNode;
  initialValue?: T;
  rules?: ValidationRule<T>[];
  dependencies?: string[];
  normalize?: (value: T, prevValue: T, values: FormValues) => T;
  getValueFromEvent?: (...args: any[]) => T;
}
```

---

## 事件类型

### MouseEventHandler 鼠标事件处理器

```typescript
type MouseEventHandler<T = Element> = (event: React.MouseEvent<T>) => void;
```

---

### KeyboardEventHandler 键盘事件处理器

```typescript
type KeyboardEventHandler<T = Element> = (
  event: React.KeyboardEvent<T>
) => void;
```

---

### ChangeEventHandler 变化事件处理器

```typescript
type ChangeEventHandler<T = Element> = (event: React.ChangeEvent<T>) => void;
```

---

### FocusEventHandler 焦点事件处理器

```typescript
type FocusEventHandler<T = Element> = (event: React.FocusEvent<T>) => void;
```

---

## 样式类型

### CSSProperties CSS 属性

```typescript
type CSSProperties = React.CSSProperties;
```

---

### ClassName 类名

```typescript
type ClassName = string | string[] | Record<string, boolean> | undefined;
```

---

### StyleObject 样式对象

```typescript
interface StyleObject {
  [key: string]: string | number | StyleObject;
}
```

---

## 工具类型

### Serializer 序列化器

```typescript
interface Serializer<T> {
  parse: (value: string) => T;
  stringify: (value: T) => string;
}
```

**使用场景**: useLocalStorage Hook。

---

### Debounced 防抖函数

```typescript
interface Debounced<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}
```

---

### Throttled 节流函数

```typescript
interface Throttled<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}
```

---

### DeepPartial 深度可选

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

**使用场景**: 配置对象的部分更新。

---

### DeepRequired 深度必需

```typescript
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};
```

---

### Omit 排除属性

```typescript
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

**使用场景**: 从现有类型中排除某些属性。

---

### Override 覆盖属性

```typescript
type Override<T, U> = Omit<T, keyof U> & U;
```

**使用场景**: 覆盖现有类型的某些属性。

---

## 泛型约束

### ComponentProps 组件属性约束

```typescript
type ComponentProps<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
> =
  T extends React.JSXElementConstructor<infer P>
    ? P
    : T extends keyof JSX.IntrinsicElements
      ? JSX.IntrinsicElements[T]
      : never;
```

**使用场景**: 获取组件的属性类型。

---

### ElementRef 元素引用约束

```typescript
type ElementRef<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
> = T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T] extends React.DetailedHTMLProps<any, infer E>
    ? E
    : never
  : T extends React.JSXElementConstructor<any>
    ? React.ComponentRef<T>
    : never;
```

**使用场景**: 获取组件的引用类型。

---

## 条件类型

### IsFunction 函数类型检查

```typescript
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;
```

---

### IsArray 数组类型检查

```typescript
type IsArray<T> = T extends readonly any[] ? true : false;
```

---

### IsObject 对象类型检查

```typescript
type IsObject<T> = T extends object
  ? T extends any[]
    ? false
    : T extends Function
      ? false
      : true
  : false;
```

---

## 使用示例

### 组件开发

```typescript
import type { ButtonProps, Size, Variant } from '@daomu/flexi-ui';

// 扩展按钮组件
interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: Variant | 'custom';
  customColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = props => {
  // 组件实现
};
```

### 表格数据类型

```typescript
import type { DataTableProps, Column } from '@daomu/flexi-ui';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

const columns: Column<User>[] = [
  {
    key: 'name',
    title: '姓名',
    sortable: true,
  },
  {
    key: 'email',
    title: '邮箱',
  },
  {
    key: 'role',
    title: '角色',
    render: (role: User['role']) => (
      <Badge variant={role === 'admin' ? 'primary' : 'secondary'}>
        {role}
      </Badge>
    ),
  },
];

const UserTable: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <DataTable<User>
      data={users}
      columns={columns}
      rowKey="id"
    />
  );
};
```

### 表单类型安全

```typescript
import type { FormValues, ValidationRule } from '@daomu/flexi-ui';

interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

const validationRules: Record<keyof LoginForm, ValidationRule[]> = {
  username: [
    { required: true, message: '请输入用户名' },
    { minLength: 3, message: '用户名至少3个字符' },
  ],
  password: [
    { required: true, message: '请输入密码' },
    { minLength: 6, message: '密码至少6个字符' },
  ],
  remember: [],
};
```

---

## 类型导入

### 按需导入

```typescript
// 导入特定类型
import type { ButtonProps, DataTableProps } from '@daomu/flexi-ui';

// 导入所有类型
import type * as FlexiTypes from '@daomu/flexi-ui';
```

### 重新导出

```typescript
// 在你的项目中重新导出类型
export type {
  ButtonProps,
  DataTableProps,
  VirtualListProps,
  FileUploaderProps,
} from '@daomu/flexi-ui';
```

---

所有类型定义都经过严格的 TypeScript 检查，确保类型安全和开发体验。更多类型使用示例请参考各组件的文档和源码。
