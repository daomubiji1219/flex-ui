# DataTable 数据表格组件

一个功能强大的企业级数据表格组件，支持排序、筛选、分页、行选择和虚拟滚动等特性，适用于展示和操作大量结构化数据。采用现代化的 CSS-in-JS 架构，提供卓越的性能和用户体验。

## 🚀 核心特性

### 数据处理能力

- ✅ **智能排序**: 支持单列和多列排序，自动处理不同数据类型
- ✅ **实时筛选**: 支持列级筛选，实时搜索匹配
- ✅ **灵活分页**: 可配置页面大小，支持大数据集分页
- ✅ **行选择**: 支持单选/多选，提供选择状态回调

### 性能优化

- ✅ **虚拟滚动**: 集成 VirtualList 组件，轻松处理 10万+ 数据
- ✅ **智能渲染**: 只渲染可视区域，极致性能优化
- ✅ **内存管理**: 高效的状态管理和内存使用
- ✅ **防抖节流**: 优化用户交互响应

### 开发体验

- ✅ **TypeScript 泛型**: 完整的类型安全支持
- ✅ **CSS-in-JS**: Emotion 样式系统，主题化支持
- ✅ **组件化设计**: 模块化架构，易于扩展
- ✅ **测试覆盖**: 完整的单元测试和集成测试

## 安装

```bash
pnpm add flexi-ui
```

## 功能演示

### 基础用法

<DemoContainer title="基础用法">
  <ReactDemo name="DataTable" />
</DemoContainer>

### 行选择

<DemoContainer title="行选择">
  <ReactDemo name="DataTable" variant="selection" />
</DemoContainer>

### 虚拟滚动（1000条数据）

<DemoContainer title="虚拟滚动">
  <ReactDemo name="DataTable" variant="virtual" />
</DemoContainer>

## 代码示例

### 基础用法

```tsx
import { DataTable, type Column } from 'flexi-ui';
import type { ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  salary: number;
  status: 'active' | 'inactive';
  joinDate: string;
}

const users: User[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25,
    department: '技术部',
    salary: 15000,
    status: 'active',
    joinDate: '2023-01-15',
  },
  // ...更多数据
];

const columns: Column<User>[] = [
  {
    key: 'id',
    title: 'ID',
    width: 80,
    sortable: true,
  },
  {
    key: 'name',
    title: '姓名',
    width: 120,
    sortable: true,
    filterable: true,
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200,
    filterable: true,
  },
  // ...更多列
];

function App() {
  return (
    <DataTable
      data={users}
      columns={columns}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
      }}
    />
  );
}
```

### 行选择

```tsx
function SelectableTable() {
  const handleRowSelect = (selectedRows: User[]) => {
    console.log('选中的行:', selectedRows);
  };

  return (
    <DataTable
      data={users}
      columns={columns}
      rowKey="id"
      selectable
      onRowSelect={handleRowSelect}
    />
  );
}
```

### 虚拟滚动（大数据量）

对于超过 100 条的数据，建议启用虚拟滚动以获得更好的性能：

```tsx
<DataTable
  data={largeDataSet}
  columns={columns}
  rowKey="id"
  virtualScroll
  pagination={{
    pageSize: 100, // 增大页面大小以充分利用虚拟滚动
  }}
/>
```

### 自定义列渲染

```tsx
const columnsWithRender = [
  {
    key: 'status',
    title: '状态',
    render: (value, record) => (
      <span className={`status-${record.status}`}>
        {record.status === 'active' ? '活跃' : '非活跃'}
      </span>
    ),
  },
  {
    key: 'actions',
    title: '操作',
    render: (_, record) => (
      <div className="action-buttons">
        <button onClick={() => handleEdit(record.id)}>编辑</button>
      </div>
    ),
  },
];
```

## API

### DataTable`<T>`

| 属性          | 类型                                              | 默认值  | 说明             |
| ------------- | ------------------------------------------------- | ------- | ---------------- |
| data          | `T[]`                                             | -       | 表格数据数组     |
| columns       | `Column<T>[]`                                     | -       | 列配置数组       |
| rowKey        | `keyof T`                                         | -       | 行唯一标识字段   |
| pagination    | `{ pageSize: number, showSizeChanger?: boolean }` | -       | 分页配置         |
| loading       | `boolean`                                         | `false` | 是否显示加载状态 |
| onRowSelect   | `(selectedRows: T[]) => void`                     | -       | 行选择回调函数   |
| virtualScroll | `boolean`                                         | `false` | 是否启用虚拟滚动 |
| selectable    | `boolean`                                         | `false` | 是否支持行选择   |

### Column`<T>`

| 属性       | 类型                                                            | 默认值  | 说明           |
| ---------- | --------------------------------------------------------------- | ------- | -------------- |
| key        | `keyof T`                                                       | -       | 列数据字段名   |
| title      | `string`                                                        | -       | 列标题         |
| width      | `number`                                                        | -       | 列宽度         |
| sortable   | `boolean`                                                       | `false` | 是否可排序     |
| filterable | `boolean`                                                       | `false` | 是否可筛选     |
| render     | `(value: unknown, record: T, index: number) => React.ReactNode` | -       | 自定义渲染函数 |

## 样式定制

组件使用 CSS 类名进行样式控制，主要类名包括：

- `.data-table` - 表格容器
- `.table-header` - 表头
- `.table-row` - 表格行
- `.table-cell` - 表格单元格
- `.table-skeleton` - 骨架屏
- `.pagination` - 分页器

## 注意事项

1. **rowKey 必须唯一**: 确保 `rowKey` 指定的字段在数据中是唯一的
2. **虚拟滚动限制**: 启用虚拟滚动时，行高应该相对固定
3. **性能考虑**: 大量数据时建议启用虚拟滚动和分页
4. **自定义渲染**: `render` 函数应该是纯函数，避免副作用

## 兼容性

- React 18+
- TypeScript 4.0+
- 现代浏览器
