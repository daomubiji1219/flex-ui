# 组件 API

本页面提供 Flexi-UI 所有组件的详细 API 说明。

## Button 按钮

### 属性

| 属性        | 类型                                               | 默认值      | 说明             |
| ----------- | -------------------------------------------------- | ----------- | ---------------- |
| `variant`   | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | 按钮样式变体     |
| `size`      | `'small' \| 'medium' \| 'large'`                   | `'medium'`  | 按钮尺寸         |
| `disabled`  | `boolean`                                          | `false`     | 是否禁用         |
| `loading`   | `boolean`                                          | `false`     | 是否显示加载状态 |
| `children`  | `ReactNode`                                        | -           | 按钮内容         |
| `onClick`   | `(event: MouseEvent) => void`                      | -           | 点击事件处理函数 |
| `className` | `string`                                           | -           | 自定义 CSS 类名  |
| `style`     | `CSSProperties`                                    | -           | 自定义样式       |

### 类型定义

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: CSSProperties;
}
```

---

## DataTable 数据表格

### 属性

| 属性                | 类型                              | 默认值  | 说明             |
| ------------------- | --------------------------------- | ------- | ---------------- |
| `data`              | `T[]`                             | `[]`    | 表格数据         |
| `columns`           | `Column<T>[]`                     | -       | 列配置           |
| `loading`           | `boolean`                         | `false` | 是否显示加载状态 |
| `pagination`        | `PaginationConfig`                | -       | 分页配置         |
| `sortable`          | `boolean`                         | `true`  | 是否支持排序     |
| `selectable`        | `boolean`                         | `false` | 是否支持行选择   |
| `onRowClick`        | `(row: T, index: number) => void` | -       | 行点击事件       |
| `onSelectionChange` | `(selectedRows: T[]) => void`     | -       | 选择变化事件     |

### 列配置类型

```typescript
interface Column<T> {
  key: keyof T;
  title: string;
  width?: number | string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}
```

---

## VirtualList 虚拟列表

### 属性

| 属性              | 类型                                     | 默认值 | 说明               |
| ----------------- | ---------------------------------------- | ------ | ------------------ |
| `data`            | `T[]`                                    | `[]`   | 列表数据           |
| `itemHeight`      | `number`                                 | `50`   | 列表项高度（像素） |
| `containerHeight` | `number`                                 | `400`  | 容器高度（像素）   |
| `overscan`        | `number`                                 | `3`    | 预渲染项目数量     |
| `renderItem`      | `(item: T, index?: number) => ReactNode` | -      | 渲染列表项的函数   |
| `getKey`          | `(item: T) => string \| number`          | -      | 获取列表项唯一键值 |
| `onScroll`        | `(scrollTop: number) => void`            | -      | 滚动事件处理函数   |

### 类型定义

```typescript
interface VirtualListProps<T> {
  data: T[];
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  renderItem: (item: T, index?: number) => ReactNode;
  getKey?: (item: T) => string | number;
  onScroll?: (scrollTop: number) => void;
}
```

---

## FileUploader 文件上传

### 属性

| 属性           | 类型                               | 默认值  | 说明                 |
| -------------- | ---------------------------------- | ------- | -------------------- |
| `accept`       | `string`                           | -       | 接受的文件类型       |
| `multiple`     | `boolean`                          | `false` | 是否支持多文件上传   |
| `maxSize`      | `number`                           | -       | 最大文件大小（字节） |
| `maxFiles`     | `number`                           | -       | 最大文件数量         |
| `disabled`     | `boolean`                          | `false` | 是否禁用             |
| `onFileSelect` | `(files: File[]) => void`          | -       | 文件选择事件         |
| `onUpload`     | `(files: File[]) => Promise<void>` | -       | 文件上传处理函数     |
| `onError`      | `(error: Error) => void`           | -       | 错误处理函数         |
| `children`     | `ReactNode`                        | -       | 自定义上传区域内容   |

### 类型定义

```typescript
interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  onFileSelect?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  onError?: (error: Error) => void;
  children?: ReactNode;
}

interface UploadFile {
  uid: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
  response?: any;
  error?: Error;
}
```

---

## 通用属性

所有组件都支持以下通用属性：

| 属性        | 类型            | 说明            |
| ----------- | --------------- | --------------- |
| `className` | `string`        | 自定义 CSS 类名 |
| `style`     | `CSSProperties` | 自定义内联样式  |
| `id`        | `string`        | 元素 ID         |
| `data-*`    | `string`        | 数据属性        |
| `aria-*`    | `string`        | 无障碍属性      |

## 事件处理

### 鼠标事件

```typescript
type MouseEventHandler<T = Element> = (event: MouseEvent<T>) => void;
```

### 键盘事件

```typescript
type KeyboardEventHandler<T = Element> = (event: KeyboardEvent<T>) => void;
```

### 表单事件

```typescript
type ChangeEventHandler<T = Element> = (event: ChangeEvent<T>) => void;
type FormEventHandler<T = Element> = (event: FormEvent<T>) => void;
```

## 样式定制

所有组件都支持通过 CSS 变量进行样式定制：

```css
:root {
  /* 主色调 */
  --flexi-primary-color: #1890ff;
  --flexi-primary-hover: #40a9ff;
  --flexi-primary-active: #096dd9;

  /* 尺寸 */
  --flexi-border-radius: 6px;
  --flexi-font-size-sm: 12px;
  --flexi-font-size-base: 14px;
  --flexi-font-size-lg: 16px;

  /* 间距 */
  --flexi-spacing-xs: 4px;
  --flexi-spacing-sm: 8px;
  --flexi-spacing-md: 16px;
  --flexi-spacing-lg: 24px;
}
```

## 无障碍支持

所有组件都遵循 WAI-ARIA 规范，支持：

- 键盘导航
- 屏幕阅读器
- 高对比度模式
- 焦点管理
- 语义化标签

## 浏览器兼容性

- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88
- 移动端浏览器支持

---

更多详细信息请参考各组件的具体文档页面。
