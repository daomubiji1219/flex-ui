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

## 组件状态

✅ **已完成迁移**: DataTable 组件已完全迁移到 CSS-in-JS 架构  
✅ **已集成应用**: 组件已成功挂载到演示应用中  
✅ **测试通过**: 所有单元测试和集成测试均已通过  
✅ **文档更新**: API 文档和使用示例已更新

### 在演示应用中查看

组件现已集成到演示应用中，你可以通过以下方式查看：

1. 启动开发服务器：`pnpm run dev`
2. 在浏览器中打开应用
3. 点击导航栏中的 "DataTable" 标签
4. 查看完整的功能演示，包括排序、筛选、分页、行选择等特性

演示应用包含：

- 100 条示例用户数据
- 完整的列配置（ID、姓名、邮箱、年龄、部门、薪资、状态、入职日期）
- 交互式功能展示
- 实时选择状态显示
- 数据统计面板

## 🚀 快速开始

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
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    age: 30,
    department: '产品部',
    salary: 18000,
    status: 'active',
    joinDate: '2022-08-20',
  },
  // 更多数据...
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
  {
    key: 'age',
    title: '年龄',
    width: 80,
    sortable: true,
  },
  {
    key: 'department',
    title: '部门',
    width: 100,
    sortable: true,
    filterable: true,
  },
  {
    key: 'salary',
    title: '薪资',
    width: 100,
    sortable: true,
    render: (value: unknown) => `¥${Number(value).toLocaleString()}`,
  },
  {
    key: 'status',
    title: '状态',
    width: 80,
    render: (value: unknown) => (
      <span className={`status-${value}`}>
        {value === 'active' ? '在职' : '离职'}
      </span>
    ),
  },
];

function App() {
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
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
      }}
    />
  );
}
```

<DemoContainer title="基础用法（实时演示）">
  <ReactDemo name="DataTable" />
</DemoContainer>

## 分页功能

```tsx
<DataTable
  data={data}
  columns={columns}
  rowKey="id"
  pagination={{
    pageSize: 10,
    showSizeChanger: true,
  }}
/>
```

## 行选择

```tsx
function SelectableTable() {
  const handleRowSelect = (selectedRows: User[]) => {
    console.log('选中的行:', selectedRows);
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey="id"
      selectable
      onRowSelect={handleRowSelect}
    />
  );
}
```

## 虚拟滚动

```tsx
// 适用于大量数据的场景
<DataTable
  data={largeDataSet} // 10000+ 条数据
  columns={columns}
  rowKey="id"
  virtualScroll
  pagination={{
    pageSize: 100,
  }}
/>
```

## 加载状态

```tsx
function LoadingTable() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return (
    <DataTable data={data} columns={columns} rowKey="id" loading={loading} />
  );
}
```

## 自定义渲染

```tsx
const columns: Column<User>[] = [
  {
    key: 'avatar',
    title: '头像',
    render: (value, record) => (
      <img
        src={record.avatar}
        alt={record.name}
        className="w-8 h-8 rounded-full"
      />
    ),
  },
  {
    key: 'name',
    title: '用户信息',
    render: (value, record) => (
      <div>
        <div className="font-medium">{record.name}</div>
        <div className="text-sm text-gray-500">{record.email}</div>
      </div>
    ),
  },
  {
    key: 'actions',
    title: '操作',
    render: (_, record) => (
      <div className="space-x-2">
        <button onClick={() => editUser(record.id)}>编辑</button>
        <button onClick={() => deleteUser(record.id)}>删除</button>
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

## 高级用法

### 自定义列渲染

```tsx
const columnsWithRender = [
  // 其他列...
  {
    key: 'status' as keyof UserWithStatus,
    title: '状态',
    width: 100,
    render: (value: unknown, record: UserWithStatus) => (
      <span className={`status-${record.status}`}>
        {record.status === 'active' ? '活跃' : '非活跃'}
      </span>
    ),
  },
  {
    key: 'actions' as keyof UserWithStatus,
    title: '操作',
    width: 150,
    render: (_, record: UserWithStatus) => (
      <div className="action-buttons">
        <button onClick={() => handleEdit(record.id)}>编辑</button>
        <button onClick={() => handleDelete(record.id)}>删除</button>
      </div>
    ),
  },
];
```

### 虚拟滚动（大数据量）

```tsx
// 生成大量数据
const largeDataSet = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  email: `user${i + 1}@example.com`,
  age: 20 + Math.floor(Math.random() * 50),
}));

<DataTable
  data={largeDataSet}
  columns={columns}
  rowKey="id"
  virtualScroll={true}
/>;
```

### 加载状态

```tsx
function LoadingTable() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return (
    <DataTable data={data} columns={columns} rowKey="id" loading={loading} />
  );
}
```

## 性能优化

### 虚拟滚动

对于大量数据（10,000+ 条记录），建议启用虚拟滚动：

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

### 内存管理

- 组件内部使用 `useMemo` 和 `useCallback` 优化性能
- 虚拟滚动只渲染可视区域的行
- 智能的状态管理避免不必要的重新渲染

## 注意事项

1. **rowKey 必须唯一**: 确保 `rowKey` 指定的字段在数据中是唯一的
2. **虚拟滚动限制**: 启用虚拟滚动时，某些 CSS 样式可能受限
3. **性能考虑**: 对于大量数据，建议使用服务端分页而非客户端分页
4. **类型安全**: 使用 TypeScript 泛型确保类型安全
   columns={columns.map(col => ({ ...col, sortable: true }))}
   rowKey="id"
   />

````

### 响应式列

```tsx
const responsiveColumns: Column<User>[] = [
  {
    key: 'name',
    title: '姓名',
    width: window.innerWidth > 768 ? 200 : 150,
  },
  {
    key: 'email',
    title: '邮箱',
    render: value => (
      <div className="truncate max-w-xs" title={value as string}>
        {value as string}
      </div>
    ),
  },
];
````

## 性能优化

### 虚拟滚动最佳实践

```tsx
// 当数据量超过 100 条时建议启用虚拟滚动
const shouldUseVirtualScroll = data.length > 100

<DataTable
  data={data}
  columns={columns}
  rowKey="id"
  virtualScroll={shouldUseVirtualScroll}
  pagination={{
    pageSize: shouldUseVirtualScroll ? 50 : 10
  }}
/>
```

### 大数据处理

```tsx
// 对于超大数据集，建议结合服务端分页
function BigDataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });

  const fetchData = async (page: number, size: number) => {
    setLoading(true);
    try {
      const result = await api.getData({ page, size });
      setData(result.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey="id"
      loading={loading}
      virtualScroll
      pagination={{
        pageSize: pagination.pageSize,
      }}
    />
  );
}
```

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
5. **筛选功能**: 目前支持简单的文本筛选，复杂筛选需要自定义实现

## 兼容性

- React 16.8+
- TypeScript 4.0+
- 现代浏览器 (IE11+)

## 相关组件

- [VirtualList](./VirtualList.md) - 虚拟滚动列表
- [Pagination](./Pagination.md) - 分页器
- [Button](./Button.md) - 按钮组件
