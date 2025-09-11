# DataTable 数据表格组件

一个功能强大的数据表格组件，支持排序、筛选、分页、行选择和虚拟滚动等特性，适用于展示和操作大量结构化数据。

## 特性

- ✅ 数据排序（单列、多列）
- ✅ 数据筛选
- ✅ 分页功能
- ✅ 行选择功能
- ✅ 虚拟滚动（大数据量优化）
- ✅ 加载状态
- ✅ 自定义列渲染
- ✅ 响应式设计
- ✅ TypeScript 泛型支持
- ✅ 性能优化

## 安装

```bash
pnpm add flexi-ui
```

## 基础用法

```tsx
import { DataTable } from 'flexi-ui';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const users: User[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25 },
  { id: 2, name: '李四', email: 'lisi@example.com', age: 30 },
  // 更多数据...
];

const columns = [
  {
    key: 'id' as keyof User,
    title: 'ID',
    width: 80,
    sortable: true,
  },
  {
    key: 'name' as keyof User,
    title: '姓名',
    width: 120,
    sortable: true,
    filterable: true,
  },
  {
    key: 'email' as keyof User,
    title: '邮箱',
    width: 200,
  },
  {
    key: 'age' as keyof User,
    title: '年龄',
    width: 80,
    sortable: true,
  },
];

function App() {
  return <DataTable data={users} columns={columns} rowKey="id" />;
}
```

## API

### DataTableProps<T>

| 属性          | 类型                                              | 默认值  | 说明             |
| ------------- | ------------------------------------------------- | ------- | ---------------- |
| data          | `T[]`                                             | -       | 表格数据数组     |
| columns       | `Column<T>[]`                                     | -       | 列配置数组       |
| rowKey        | `keyof T`                                         | -       | 行唯一标识字段   |
| pagination    | `{ pageSize: number, showSizeChanger?: boolean }` | -       | 分页配置         |
| loading       | `boolean`                                         | `false` | 是否显示加载状态 |
| onRowSelect   | `(selectedRows: T[]) => void`                     | -       | 行选择回调函数   |
| virtualScroll | `boolean`                                         | `false` | 是否启用虚拟滚动 |

### Column<T>

| 属性       | 类型                                                            | 默认值  | 说明           |
| ---------- | --------------------------------------------------------------- | ------- | -------------- |
| key        | `keyof T`                                                       | -       | 列数据字段名   |
| title      | `string`                                                        | -       | 列标题         |
| width      | `number`                                                        | -       | 列宽度         |
| sortable   | `boolean`                                                       | `false` | 是否可排序     |
| filterable | `boolean`                                                       | `false` | 是否可筛选     |
| render     | `(value: unknown, record: T, index: number) => React.ReactNode` | -       | 自定义渲染函数 |

## 高级用法

### 分页

```tsx
<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  pagination={{ pageSize: 10, showSizeChanger: true }}
/>
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
      onRowSelect={handleRowSelect}
    />
  );
}
```

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

### 动态列配置

```tsx
function DynamicColumnsTable() {
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    email: true,
    age: true,
  });

  const filteredColumns = columns.filter(
    col => visibleColumns[col.key as string]
  );

  return (
    <div>
      <div className="column-toggles">
        {columns.map(col => (
          <label key={col.key as string}>
            <input
              type="checkbox"
              checked={visibleColumns[col.key as string]}
              onChange={() => {
                setVisibleColumns(prev => ({
                  ...prev,
                  [col.key]: !prev[col.key as string],
                }));
              }}
            />
            {col.title}
          </label>
        ))}
      </div>

      <DataTable data={users} columns={filteredColumns} rowKey="id" />
    </div>
  );
}
```

### 服务端数据处理

```tsx
function ServerSideTable() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorting, setSorting] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, sorting, filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortField: sorting?.key,
        sortOrder: sorting?.direction,
        ...filters,
      };

      const response = await fetch('/api/users?' + new URLSearchParams(params));
      const result = await response.json();

      setData(result.data);
      setPagination(prev => ({ ...prev, total: result.total }));
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSorting({ key, direction });
  };

  const handleFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  // 自定义列配置，添加排序和筛选处理
  const enhancedColumns = columns.map(col => ({
    ...col,
    onSort: col.sortable ? handleSort : undefined,
    onFilter: col.filterable ? handleFilter : undefined,
  }));

  return (
    <DataTable
      data={data}
      columns={enhancedColumns}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: pagination.pageSize,
        current: pagination.current,
        total: pagination.total,
        onChange: handlePageChange,
      }}
    />
  );
}
```

## 样式定制

### CSS 变量

```css
:root {
  --datatable-border-color: #e5e7eb;
  --datatable-header-bg: #f9fafb;
  --datatable-row-hover-bg: #f3f4f6;
  --datatable-selected-row-bg: #e5edff;
  --datatable-pagination-active-bg: #1890ff;
}
```

### 自定义样式

```tsx
<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  className="custom-table"
  style={{ maxHeight: '500px' }}
/>
```

```css
.custom-table .data-table-header {
  background-color: #f0f8ff;
  font-weight: 600;
}

.custom-table .data-table-row:nth-child(even) {
  background-color: #f9f9f9;
}

.custom-table .data-table-row:hover {
  background-color: #e6f7ff;
}
```

## 可访问性

组件遵循 WAI-ARIA 标准：

- 使用正确的表格语义结构
- 支持键盘导航
- 适当的 ARIA 属性
- 高对比度颜色

```tsx
<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  aria-label="用户数据表格"
  aria-describedby="table-description"
/>
<div id="table-description" className="sr-only">
  此表格显示了系统中的所有用户信息，包括ID、姓名、邮箱和年龄。
</div>
```

## 性能优化

### 大数据量处理

```tsx
// 启用虚拟滚动
<DataTable
  data={largeDataSet}
  columns={columns}
  rowKey="id"
  virtualScroll={true}
/>

// 或使用分页
<DataTable
  data={largeDataSet}
  columns={columns}
  rowKey="id"
  pagination={{ pageSize: 50 }}
/>
```

### 避免不必要的重渲染

```tsx
// 使用 useMemo 优化列配置
const memoizedColumns = useMemo(() => {
  return columns.map(col => ({
    ...col,
    render: col.render ? col.render : undefined,
  }));
}, [columns]);

// 使用 useMemo 优化数据
const memoizedData = useMemo(() => {
  return processData(rawData);
}, [rawData]);

<DataTable data={memoizedData} columns={memoizedColumns} rowKey="id" />;
```

## 测试

```tsx
import { render, screen, fireEvent, within } from '@testing-library/react';
import { DataTable } from './DataTable';

const mockData = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25 },
  { id: 2, name: '李四', email: 'lisi@example.com', age: 30 },
];

const mockColumns = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'email', title: '邮箱', width: 200 },
  { key: 'age', title: '年龄', width: 80 },
];

test('renders table with correct data', () => {
  render(<DataTable data={mockData} columns={mockColumns} rowKey="id" />);

  // 检查表头
  expect(screen.getByText('ID')).toBeInTheDocument();
  expect(screen.getByText('姓名')).toBeInTheDocument();
  expect(screen.getByText('邮箱')).toBeInTheDocument();
  expect(screen.getByText('年龄')).toBeInTheDocument();

  // 检查数据行
  expect(screen.getByText('张三')).toBeInTheDocument();
  expect(screen.getByText('李四')).toBeInTheDocument();
  expect(screen.getByText('zhangsan@example.com')).toBeInTheDocument();
  expect(screen.getByText('lisi@example.com')).toBeInTheDocument();
  expect(screen.getByText('25')).toBeInTheDocument();
  expect(screen.getByText('30')).toBeInTheDocument();
});

test('handles row selection', () => {
  const handleRowSelect = jest.fn();

  render(
    <DataTable
      data={mockData}
      columns={mockColumns}
      rowKey="id"
      onRowSelect={handleRowSelect}
    />
  );

  // 选择第一行
  const rows = screen.getAllByRole('row');
  const firstRowCheckbox = within(rows[1]).getByRole('checkbox');

  fireEvent.click(firstRowCheckbox);

  expect(handleRowSelect).toHaveBeenCalledWith([mockData[0]]);
});
```

## 故障排除

### 常见问题

**Q: 表格数据不显示？**
A: 检查 `data` 和 `columns` 属性是否正确配置，以及 `rowKey` 是否指定了有效的唯一标识字段。

**Q: 排序功能不生效？**
A: 确保在列配置中设置了 `sortable: true`。

**Q: 虚拟滚动性能不佳？**
A: 检查数据项是否有唯一的 `key`，以及是否为表格设置了固定高度。

**Q: TypeScript 类型错误？**
A: 确保正确使用泛型，例如 `DataTable<User>`，并且列的 `key` 属性使用 `keyof User` 类型。

### 调试技巧

```tsx
// 添加调试信息
<DataTable
  data={data}
  columns={columns}
  rowKey="id"
  onRowSelect={selectedRows => {
    console.log('选中的行:', selectedRows);
  }}
  // 添加自定义属性以便在开发工具中识别
  data-testid="user-table"
/>
```

## 更新日志

### v1.0.0

- 初始版本发布
- 支持基础表格功能

### v1.1.0

- 添加排序和筛选功能
- 添加分页支持

### v1.2.0

- 添加虚拟滚动支持
- 优化性能
- 改进可访问性

## 相关组件

- [VirtualList](../VirtualList/README.md) - 虚拟列表组件
- [Pagination](../Pagination/README.md) - 分页组件
- [TableFilter](../TableFilter/README.md) - 表格筛选组件

## 许可证

MIT License
