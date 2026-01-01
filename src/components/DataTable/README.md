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

## 📦 安装

```bash
pnpm add flexi-ui
# 或
npm install flexi-ui
# 或
yarn add flexi-ui
```

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
| selectable    | `boolean`                                         | `false` | 是否启用行选择   |
| className     | `string`                                          | -       | 自定义 CSS 类名  |

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

### 自定义样式

#### 使用 className

你可以通过 `className` 属性为表格添加自定义样式：

```tsx
// 基础用法
<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  className="my-custom-table"
/>

// 结合 CSS 模块
<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  className={styles.specialTable}
/>

// 结合 styled-components 或其他 CSS-in-JS 库
const CustomStyledTable = styled.div`
  .custom-data-table {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .table-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .table-row:nth-child(even) {
      background-color: #f8f9fa;
    }

    .table-row:hover {
      background-color: #e3f2fd;
      transform: translateY(-1px);
      transition: all 0.2s ease;
    }
  }
`;

function MyComponent() {
  return (
    <CustomStyledTable>
      <DataTable
        data={users}
        columns={columns}
        rowKey="id"
        className="custom-data-table"
      />
    </CustomStyledTable>
  );
}
```

#### 响应式表格

```tsx
<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  className="responsive-table w-full overflow-x-auto"
/>
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

### CSS-in-JS 架构

DataTable 组件现已完全迁移到 CSS-in-JS 架构，使用 styled-components 提供更好的样式隔离和主题支持。

#### 主题系统

组件支持通过 ThemeProvider 进行主题定制：

```tsx
import { ThemeProvider } from 'styled-components';
import { DataTable } from 'flexi-ui';

const customTheme = {
  colors: {
    primary: '#1890ff',
    border: '#e5e7eb',
    background: '#ffffff',
    text: '#333333',
    hover: '#f3f4f6',
    selected: '#e5edff',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
  borderRadius: '6px',
  fontSize: {
    sm: '12px',
    md: '14px',
    lg: '16px',
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <DataTable data={data} columns={columns} rowKey="id" />
    </ThemeProvider>
  );
}
```

#### 样式组件

组件内部使用了以下样式组件，可以通过主题进行定制：

- `TableContainer`: 表格容器
- `TableWrapper`: 表格包装器
- `StyledTable`: 主表格元素
- `TableHeader`: 表头容器
- `HeaderCell`: 表头单元格
- `TableBody`: 表体容器
- `TableRow`: 表格行
- `TableCell`: 表格单元格
- `LoadingOverlay`: 加载遮罩
- `EmptyState`: 空状态显示
- `PaginationWrapper`: 分页容器

### CSS 变量（已弃用）

> ⚠️ 注意：CSS 变量方式已被 CSS-in-JS 主题系统替代，建议使用新的主题系统。

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

### v1.3.0 (最新)

- 🎉 **重大更新**: 完全迁移到 CSS-in-JS 架构
- ✨ 新增主题系统支持，可通过 ThemeProvider 自定义样式
- 🔧 重构样式组件，提供更好的样式隔离
- 📱 组件已成功集成到演示应用中
- 🧪 所有测试用例已更新并通过
- 📚 文档全面更新，包含 CSS-in-JS 使用指南
- 🚀 性能优化，减少样式重复计算
- 🎨 改进视觉设计，更现代的 UI 风格

### v1.2.0

- 添加虚拟滚动支持
- 优化性能
- 改进可访问性

### v1.1.0

- 添加排序和筛选功能
- 添加分页支持

### v1.0.0

- 初始版本发布
- 支持基础表格功能

## 相关组件

- [VirtualList](../VirtualList/README.md) - 虚拟列表组件
- [Pagination](../Pagination/README.md) - 分页组件
- [TableFilter](../TableFilter/README.md) - 表格筛选组件

## 许可证

MIT License
