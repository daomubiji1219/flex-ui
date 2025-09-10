# DataTable 组件

一个功能强大的数据表格组件，支持排序、筛选、分页、行选择和虚拟滚动等高级特性。

## 特性

- 📊 灵活的列配置和自定义渲染
- 🔍 内置排序和筛选功能
- 📄 分页支持
- ✅ 行选择功能
- 🚀 虚拟滚动优化大数据性能
- 💀 骨架屏加载状态
- 🎯 完全的 TypeScript 支持
- 🎨 响应式设计

## 基础用法

<DemoContainer title="基础用法（实时演示）">
  <ReactDemo name="DataTable" />
</DemoContainer>

```tsx
import { DataTable } from '@flexi-ui/components'
import type { Column } from '@flexi-ui/components'

interface User {
  id: number
  name: string
  email: string
  age: number
  status: 'active' | 'inactive'
}

const columns: Column<User>[] = [
  {
    key: 'id',
    title: 'ID',
    width: 80,
    sortable: true
  },
  {
    key: 'name',
    title: '姓名',
    sortable: true,
    filterable: true
  },
  {
    key: 'email',
    title: '邮箱',
    filterable: true
  },
  {
    key: 'age',
    title: '年龄',
    width: 100,
    sortable: true
  },
  {
    key: 'status',
    title: '状态',
    render: (value) => (
      <span className={`status ${value}`}>
        {value === 'active' ? '活跃' : '非活跃'}
      </span>
    )
  }
]

const data: User[] = [
  { id: 1, name: '张三', email: 'zhang@example.com', age: 25, status: 'active' },
  { id: 2, name: '李四', email: 'li@example.com', age: 30, status: 'inactive' },
  // ... 更多数据
]

function App() {
  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey="id"
    />
  )
}
```

## 分页功能

```tsx
<DataTable
  data={data}
  columns={columns}
  rowKey="id"
  pagination={{
    pageSize: 10,
    showSizeChanger: true
  }}
/>
```

## 行选择

```tsx
function SelectableTable() {
  const handleRowSelect = (selectedRows: User[]) => {
    console.log('选中的行:', selectedRows)
  }

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey="id"
      selectable
      onRowSelect={handleRowSelect}
    />
  )
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
    pageSize: 100
  }}
/>
```

## 加载状态

```tsx
function LoadingTable() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData().then(result => {
      setData(result)
      setLoading(false)
    })
  }, [])

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey="id"
      loading={loading}
    />
  )
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
    )
  },
  {
    key: 'name',
    title: '用户信息',
    render: (value, record) => (
      <div>
        <div className="font-medium">{record.name}</div>
        <div className="text-sm text-gray-500">{record.email}</div>
      </div>
    )
  },
  {
    key: 'actions',
    title: '操作',
    render: (_, record) => (
      <div className="space-x-2">
        <button onClick={() => editUser(record.id)}>编辑</button>
        <button onClick={() => deleteUser(record.id)}>删除</button>
      </div>
    )
  }
]
```

## API

### DataTableProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| data | `T[]` | `[]` | 表格数据 |
| columns | `Column<T>[]` | `[]` | 列配置 |
| rowKey | `keyof T` | - | 行唯一标识字段 |
| pagination | `PaginationConfig` | - | 分页配置 |
| loading | `boolean` | `false` | 加载状态 |
| onRowSelect | `(selectedRows: T[]) => void` | - | 行选择回调 |
| virtualScroll | `boolean` | `false` | 是否启用虚拟滚动 |
| selectable | `boolean` | `false` | 是否可选择行 |

### Column

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| key | `keyof T` | - | 列数据字段 |
| title | `string` | - | 列标题 |
| width | `number` | - | 列宽度 |
| sortable | `boolean` | `false` | 是否可排序 |
| filterable | `boolean` | `false` | 是否可筛选 |
| render | `(value: unknown, record: T, index: number) => React.ReactNode` | - | 自定义渲染函数 |

### PaginationConfig

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| pageSize | `number` | `10` | 每页条数 |
| showSizeChanger | `boolean` | `false` | 是否显示页面大小选择器 |

## 高级用法

### 复杂筛选

```tsx
const columns: Column<User>[] = [
  {
    key: 'status',
    title: '状态',
    filterable: true,
    render: (value) => {
      const statusMap = {
        active: { text: '活跃', color: 'green' },
        inactive: { text: '非活跃', color: 'red' }
      }
      const status = statusMap[value as keyof typeof statusMap]
      return (
        <span className={`px-2 py-1 rounded text-${status.color}-600 bg-${status.color}-100`}>
          {status.text}
        </span>
      )
    }
  }
]
```

### 多级排序

```tsx
// 组件内部支持多级排序
// 用户可以按住 Shift 键点击多个列标题进行多级排序
<DataTable
  data={data}
  columns={columns.map(col => ({ ...col, sortable: true }))}
  rowKey="id"
/>
```

### 响应式列

```tsx
const responsiveColumns: Column<User>[] = [
  {
    key: 'name',
    title: '姓名',
    width: window.innerWidth > 768 ? 200 : 150
  },
  {
    key: 'email',
    title: '邮箱',
    render: (value) => (
      <div className="truncate max-w-xs" title={value as string}>
        {value as string}
      </div>
    )
  }
]
```

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
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 })

  const fetchData = async (page: number, size: number) => {
    setLoading(true)
    try {
      const result = await api.getData({ page, size })
      setData(result.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey="id"
      loading={loading}
      virtualScroll
      pagination={{
        pageSize: pagination.pageSize
      }}
    />
  )
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