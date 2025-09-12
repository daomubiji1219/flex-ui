# VirtualList 虚拟列表组件

一个极致性能的虚拟滚动列表组件，专为处理海量数据而设计。通过智能的可视区域渲染和动态高度计算，轻松处理百万级数据而不卡顿，是现代 Web 应用处理大数据集的最佳选择。

## 🚀 核心特性

### 性能优势

- ✅ **虚拟滚动**: 只渲染可见区域，支持百万级数据流畅滚动
- ✅ **动态高度**: 自动检测和适配不同高度的列表项
- ✅ **智能缓冲**: 可配置的 overscan 缓冲区，优化滚动体验
- ✅ **内存优化**: 极低的内存占用，高效的 DOM 复用
- ✅ **节流优化**: 内置滚动事件节流，避免性能抖动

### 开发体验

- ✅ **TypeScript 泛型**: 完整的类型安全和智能提示
- ✅ **灵活渲染**: 支持自定义渲染函数和 key 生成
- ✅ **CSS-in-JS**: Emotion 样式系统，完美的样式隔离
- ✅ **响应式设计**: 自适应容器尺寸变化
- ✅ **易于集成**: 简洁的 API 设计，快速上手

### 技术亮点

- ✅ **高精度计算**: 精确的滚动位置和可视区域计算
- ✅ **实时高度更新**: 支持内容高度动态变化
- ✅ **平滑滚动**: 优化的滚动算法，提供丝滑体验

## 📦 安装

```bash
pnpm add flexi-ui
```

## 🚀 快速开始

### 基础用法

<DemoContainer title="基础用法（实时演示）">
  <ReactDemo name="VirtualList" />
</DemoContainer>

```tsx
import { VirtualList } from 'flexi-ui';
import type { ReactNode } from 'react';

interface ListItem {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'inactive';
  createTime: string;
}

// 生成大量数据 - 轻松处理 10万+ 数据
const data: ListItem[] = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  title: `项目 ${i}`,
  description: `这是第 ${i} 个项目的详细描述信息，包含更多内容...`,
  status: i % 3 === 0 ? 'inactive' : 'active',
  createTime: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
}));

function App() {
  return (
    <VirtualList
      data={data}
      containerHeight={500}
      itemHeight={80}
      overscan={5}
      getKey={item => item.id}
      renderItem={(item, index) => (
        <div
          style={{
            height: '80px',
            padding: '16px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
          }}
        >
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
              {item.title}
            </h4>
            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
              {item.description}
            </p>
            <div style={{ marginTop: '4px', fontSize: '12px', color: '#999' }}>
              <span className={`status-${item.status}`}>
                {item.status === 'active' ? '✅ 活跃' : '⏸️ 非活跃'}
              </span>
              <span style={{ marginLeft: '12px' }}>
                创建时间: {new Date(item.createTime).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
```

### 动态高度支持

```tsx
function DynamicHeightExample() {
  const items = Array.from({ length: 50000 }, (_, i) => ({
    id: i,
    title: `动态内容 ${i}`,
    content: `内容 ${i} `.repeat(Math.floor(Math.random() * 20) + 1),
  }));

  return (
    <VirtualList
      data={items}
      containerHeight={600}
      itemHeight={60} // 初始预估高度
      overscan={3}
      getKey={item => item.id}
      renderItem={item => (
        <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ margin: '0 0 8px 0' }}>{item.title}</h3>
          <p style={{ margin: 0, lineHeight: 1.5 }}>{item.content}</p>
        </div>
      )}
    />
  );
}
```

## 📚 API 文档

### VirtualListProps`<T>`

| 属性              | 类型                                           | 默认值                | 必填 | 说明                               |
| ----------------- | ---------------------------------------------- | --------------------- | ---- | ---------------------------------- |
| `data`            | `T[]`                                          | -                     | ✅   | 要渲染的数据数组                   |
| `renderItem`      | `(item: T, index: number) => ReactNode`        | -                     | ✅   | 渲染每个列表项的函数               |
| `containerHeight` | `number`                                       | -                     | ✅   | 容器的固定高度（像素）             |
| `itemHeight`      | `number \| ((index: number) => number)`        | -                     | ✅   | 每项的高度，可以是固定值或计算函数 |
| `overscan`        | `number`                                       | `5`                   | ❌   | 可视区域外额外渲染的项目数量       |
| `getKey`          | `(item: T, index: number) => string \| number` | `(_, index) => index` | ❌   | 获取每项唯一标识的函数             |
| `className`       | `string`                                       | -                     | ❌   | 容器的 CSS 类名                    |
| `style`           | `CSSProperties`                                | -                     | ❌   | 容器的内联样式                     |

### 核心属性详解

#### `data: T[]`

数据源数组，支持任意类型的数据。组件会根据数据长度和 `itemHeight` 计算总高度。

#### `renderItem: (item: T, index: number) => ReactNode`

渲染函数，接收当前项数据和索引，返回 React 节点。为了最佳性能，建议使用 `React.memo` 包装复杂的渲染组件。

#### `containerHeight: number`

容器的固定高度，决定了可视区域的大小。这是虚拟滚动的关键参数。

#### `itemHeight: number | ((index: number) => number)`

- **固定高度**: 传入数字，所有项使用相同高度
- **动态高度**: 传入函数，可以为不同项返回不同高度

#### `overscan: number`

缓冲区大小，在可视区域上下额外渲染的项目数。增加此值可以减少快速滚动时的白屏，但会增加 DOM 节点数量。

#### `getKey: (item: T, index: number) => string | number`

为每个列表项生成唯一标识，用于 React 的 key 属性。对于包含 `id` 字段的数据，建议使用 `item => item.id`。

## 🔧 高级用法

### 与其他组件集成

#### 在 DataTable 中启用虚拟滚动

```tsx
import { DataTable, VirtualList } from 'flexi-ui';
import type { ColumnDef } from 'flexi-ui';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

const columns: ColumnDef<User>[] = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '姓名', width: 120 },
  { key: 'email', title: '邮箱', width: 200 },
  { key: 'role', title: '角色', width: 100 },
  { key: 'lastLogin', title: '最后登录', width: 150 },
];

function UserTable() {
  const users: User[] = Array.from({ length: 100000 }, (_, i) => ({
    id: i,
    name: `用户 ${i}`,
    email: `user${i}@example.com`,
    role: ['admin', 'user', 'guest'][i % 3],
    lastLogin: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  }));

  return (
    <DataTable
      data={users}
      columns={columns}
      height={600}
      virtualScroll // 启用虚拟滚动
      rowHeight={48}
    />
  );
}
```

### 复杂数据结构处理

```tsx
interface ComplexItem {
  id: string;
  type: 'text' | 'image' | 'video' | 'file';
  title: string;
  content: string;
  metadata: {
    size?: number;
    duration?: number;
    dimensions?: { width: number; height: number };
  };
  tags: string[];
  createdAt: Date;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

function ComplexList() {
  const items: ComplexItem[] = generateComplexData(50000);

  const renderComplexItem = (item: ComplexItem, index: number) => {
    const baseHeight = 80;
    const contentHeight = Math.min(item.content.length / 2, 60);
    const tagsHeight = Math.ceil(item.tags.length / 3) * 24;

    return (
      <div
        className="complex-item"
        style={{
          minHeight: baseHeight + contentHeight + tagsHeight,
          padding: '16px',
          borderBottom: '1px solid #eee',
        }}
      >
        <div className="item-header">
          <img
            src={item.author.avatar}
            alt={item.author.name}
            className="avatar"
          />
          <div className="item-info">
            <h3>{item.title}</h3>
            <span className="author">{item.author.name}</span>
            <span className="type-badge">{item.type}</span>
          </div>
        </div>

        <div className="item-content">{item.content}</div>

        <div className="item-tags">
          {item.tags.map(tag => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>

        <div className="item-meta">
          <span>{item.createdAt.toLocaleDateString()}</span>
          {item.metadata.size && (
            <span>{formatFileSize(item.metadata.size)}</span>
          )}
        </div>
      </div>
    );
  };

  const getItemHeight = (index: number) => {
    const item = items[index];
    const baseHeight = 80;
    const contentHeight = Math.min(item.content.length / 2, 60);
    const tagsHeight = Math.ceil(item.tags.length / 3) * 24;
    return baseHeight + contentHeight + tagsHeight;
  };

  return (
    <VirtualList
      data={items}
      containerHeight={700}
      itemHeight={getItemHeight}
      overscan={3}
      getKey={item => item.id}
      renderItem={renderComplexItem}
    />
  );
}
```

### 搜索和筛选

```tsx
function SearchableList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const allItems = useMemo(
    () =>
      Array.from({ length: 100000 }, (_, i) => ({
        id: i,
        title: `项目 ${i}`,
        description: `描述 ${i} 包含关键词 ${Math.random() > 0.5 ? 'React' : 'Vue'}`,
        status: i % 3 === 0 ? 'inactive' : ('active' as const),
      })),
    []
  );

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [allItems, searchTerm, filterStatus]);

  return (
    <div>
      <div className="search-controls">
        <input
          type="text"
          placeholder="搜索项目..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="filter-select"
        >
          <option value="all">全部状态</option>
          <option value="active">活跃</option>
          <option value="inactive">非活跃</option>
        </select>
        <span className="result-count">
          找到 {filteredItems.length.toLocaleString()} 个结果
        </span>
      </div>

      <VirtualList
        data={filteredItems}
        containerHeight={500}
        itemHeight={80}
        overscan={5}
        getKey={item => item.id}
        renderItem={(item, index) => (
          <div className="search-result-item">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <span className={`status ${item.status}`}>{item.status}</span>
          </div>
        )}
      />
    </div>
  );
}
```

### 无限滚动集成

```tsx
function InfiniteScrollList() {
  const [items, setItems] = useState<Array<{ id: number; title: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 初始加载
  useEffect(() => {
    loadMoreItems();
  }, []);

  const loadMoreItems = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newItems = Array.from({ length: 50 }, (_, i) => ({
      id: items.length + i,
      title: `动态加载项目 ${items.length + i}`,
    }));

    setItems(prev => [...prev, ...newItems]);
    setLoading(false);

    // 模拟数据加载完毕
    if (items.length + newItems.length >= 1000) {
      setHasMore(false);
    }
  };

  const handleScroll = useCallback(
    (scrollTop: number, containerHeight: number, totalHeight: number) => {
      // 当滚动到底部附近时加载更多
      const scrollPercentage = (scrollTop + containerHeight) / totalHeight;
      if (scrollPercentage > 0.8 && hasMore && !loading) {
        loadMoreItems();
      }
    },
    [hasMore, loading, loadMoreItems]
  );

  return (
    <div>
      <VirtualList
        data={items}
        containerHeight={600}
        itemHeight={60}
        overscan={10}
        getKey={item => item.id}
        onScroll={handleScroll}
        renderItem={item => (
          <div
            style={{
              height: 60,
              padding: '16px',
              borderBottom: '1px solid #eee',
            }}
          >
            {item.title}
          </div>
        )}
      />

      {loading && (
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <span>加载中...</span>
        </div>
      )}

      {!hasMore && (
        <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
          没有更多数据了
        </div>
      )}
    </div>
  );
}
```

    ## 🎨 样式定制

### CSS-in-JS 样式

```tsx
import styled from '@emotion/styled';
import { VirtualList } from 'flexi-ui';

const StyledVirtualList = styled(VirtualList)`
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: #ffffff;

  .virtual-list-container {
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 #f1f1f1;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;

      &:hover {
        background: #a1a1a1;
      }
    }
  }
`;

const ListItem = styled.div<{ isEven: boolean }>`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: ${props => (props.isEven ? '#fafafa' : '#ffffff')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

function StyledExample() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    title: `项目 ${i}`,
  }));

  return (
    <StyledVirtualList
      data={items}
      containerHeight={500}
      itemHeight={60}
      getKey={item => item.id}
      renderItem={(item, index) => (
        <ListItem isEven={index % 2 === 0}>
          <h4>{item.title}</h4>
        </ListItem>
      )}
    />
  );
}
```

### 主题支持

```tsx
import { ThemeProvider } from '@emotion/react';

const theme = {
  colors: {
    primary: '#1890ff',
    background: '#ffffff',
    border: '#d9d9d9',
    text: '#262626',
    textSecondary: '#8c8c8c',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
};

function ThemedVirtualList() {
  return (
    <ThemeProvider theme={theme}>
      <VirtualList
        data={data}
        containerHeight={500}
        itemHeight={80}
        renderItem={(item, index) => (
          <div
            style={{
              padding: theme.spacing.md,
              borderBottom: `1px solid ${theme.colors.border}`,
              backgroundColor:
                index % 2 === 0 ? theme.colors.background : '#fafafa',
            }}
          >
            <h4 style={{ color: theme.colors.text, margin: 0 }}>
              {item.title}
            </h4>
            <p
              style={{ color: theme.colors.textSecondary, margin: '4px 0 0 0' }}
            >
              {item.description}
            </p>
          </div>
        )}
      />
    </ThemeProvider>
  );
}
```

## ⚡ 性能优化

### 合理设置 overscan

```tsx
// 根据使用场景调整 overscan 值
function OptimizedList() {
  return (
    <VirtualList
      data={largeDataset}
      containerHeight={600}
      itemHeight={50}
      overscan={5} // 快速滚动场景建议 3-10
      renderItem={renderItem}
    />
  );
}
```

### 优化渲染函数

```tsx
// ❌ 避免在 renderItem 中创建复杂对象
function BadExample() {
  return (
    <VirtualList
      renderItem={(item, index) => (
        <div
          style={
            {
              /* 每次都创建新对象 */
            }
          }
        >
          {item.title}
        </div>
      )}
    />
  );
}

// ✅ 预计算样式和使用样式复用
const itemStyles = {
  base: {
    padding: '16px',
    borderBottom: '1px solid #eee',
  },
  even: {
    backgroundColor: '#fafafa',
  },
  odd: {
    backgroundColor: '#ffffff',
  },
};

const ItemComponent = React.memo<{ item: any; index: number }>(
  ({ item, index }) => {
    const style = {
      ...itemStyles.base,
      ...(index % 2 === 0 ? itemStyles.even : itemStyles.odd),
    };

    return (
      <div style={style}>
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </div>
    );
  }
);

function GoodExample() {
  return (
    <VirtualList
      data={data}
      containerHeight={500}
      itemHeight={80}
      renderItem={(item, index) => <ItemComponent item={item} index={index} />}
    />
  );
}
```

### 稳定的 key 函数

```tsx
// ✅ 使用唯一标识
function StableKeyExample() {
  return (
    <VirtualList
      data={items}
      getKey={item => item.id} // 使用稳定的唯一标识
      renderItem={renderItem}
    />
  );
}

// ✅ 复合 key（当单一字段不唯一时）
function CompositeKeyExample() {
  return (
    <VirtualList
      data={items}
      getKey={item => `${item.category}-${item.id}`}
      renderItem={renderItem}
    />
  );
}
```

### 性能监控

```tsx
function PerformanceMonitoredList() {
  const [renderCount, setRenderCount] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

  const handleRender = useCallback((startIndex: number, endIndex: number) => {
    setRenderCount(prev => prev + 1);
    setVisibleRange({ start: startIndex, end: endIndex });
  }, []);

  return (
    <div>
      <div className="performance-info">
        <span>渲染次数: {renderCount}</span>
        <span>
          可见范围: {visibleRange.start} - {visibleRange.end}
        </span>
      </div>

      <VirtualList
        data={data}
        containerHeight={500}
        itemHeight={60}
        onRender={handleRender}
        renderItem={renderItem}
      />
    </div>
  );
}
```

### 最佳实践

```tsx
function BestPracticeExample() {
  // ✅ 使用 useMemo 缓存数据
  const processedData = useMemo(() => {
    return rawData.map(item => ({
      ...item,
      displayName: `${item.firstName} ${item.lastName}`,
      formattedDate: formatDate(item.createdAt),
    }));
  }, [rawData]);

  // ✅ 使用 useCallback 缓存渲染函数
  const renderItem = useCallback(
    (item: ProcessedItem, index: number) => (
      <OptimizedItemComponent item={item} index={index} />
    ),
    []
  );

  // ✅ 合理设置缓冲区
  const overscan = useMemo(() => {
    // 根据设备性能动态调整
    return navigator.hardwareConcurrency > 4 ? 10 : 5;
  }, []);

  return (
    <VirtualList
      data={processedData}
      containerHeight={600}
      itemHeight={calculateItemHeight}
      overscan={overscan}
      getKey={item => item.id}
      renderItem={renderItem}
    />
  );
}
```

## 🎯 注意事项

### 避免常见陷阱

1. **不要在渲染函数中进行复杂计算**

   ```tsx
   // ❌ 错误做法
   renderItem={item => (
     <div>
       {expensiveCalculation(item)} {/* 每次渲染都会重新计算 */}
     </div>
   )}

   // ✅ 正确做法
   const processedItems = useMemo(() =>
     items.map(item => ({ ...item, computed: expensiveCalculation(item) })),
     [items]
   );
   ```

2. **确保 itemHeight 的准确性**

   ```tsx
   // 动态高度时，确保计算函数返回准确值
   const getItemHeight = (index: number) => {
     const item = items[index];
     // 基于实际内容计算高度
     return calculateRealHeight(item);
   };
   ```

3. **合理使用 overscan**
   ```tsx
   // 根据场景调整，不是越大越好
   overscan={fastScrolling ? 10 : 3}
   ```

### 兼容性说明

- **React 版本**: 需要 React 16.8+ (Hooks 支持)
- **浏览器支持**: 现代浏览器 (IE11+)
- **TypeScript**: 完整类型支持，建议使用 4.0+

### 调试技巧

```tsx
// 开发环境下启用调试信息
function DebugVirtualList() {
  const [debugInfo, setDebugInfo] = useState({});

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-panel">
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}

      <VirtualList
        data={data}
        containerHeight={500}
        itemHeight={60}
        onDebug={setDebugInfo} // 自定义调试回调
        renderItem={renderItem}
      />
    </>
  );
}


  return (
    <VirtualList
      data={data}
      containerHeight={400}
      itemHeight={60}
      renderItem={item => (
        <div className="p-4 border-b">
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-gray-600">{item.description}</p>
        </div>
      )}
    />
  );
}
```

## 动态高度

```tsx
// 支持不同高度的列表项
const renderItem = (item: Item) => (
  <div className="p-4 border-b">
    <h3 className="font-medium">{item.name}</h3>
    <p className="text-gray-600">{item.description}</p>
    {item.hasDetails && (
      <div className="mt-2 p-2 bg-gray-100 rounded">
        <p>额外的详细信息...</p>
        <p>这会导致不同的行高</p>
      </div>
    )}
  </div>
)

<VirtualList
  data={data}
  containerHeight={500}
  // 不设置 itemHeight，让组件自动检测
  renderItem={renderItem}
  overscan={5}  // 预渲染更多项以适应高度变化
/>
```

## 自定义键值

```tsx
<VirtualList
  data={data}
  containerHeight={400}
  itemHeight={80}
  getKey={item => item.id} // 使用自定义键值
  renderItem={(item, index) => (
    <div className="flex items-center p-4 border-b">
      <span className="w-12 text-gray-500">#{index}</span>
      <div>
        <h3>{item.name}</h3>
        <p className="text-sm text-gray-600">{item.email}</p>
      </div>
    </div>
  )}
/>
```

## 复杂列表项

```tsx
interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  posts: number;
  followers: number;
}

const UserList = () => {
  const users: User[] = generateUsers(50000); // 5万用户数据

  const renderUser = (user: User, index?: number) => (
    <div className="flex items-center p-4 hover:bg-gray-50 border-b">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-12 h-12 rounded-full mr-4"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{user.name}</h3>
          <span className="text-sm text-gray-500">#{index}</span>
        </div>
        <p className="text-gray-600">{user.email}</p>
        <div className="flex space-x-4 mt-1 text-sm text-gray-500">
          <span>{user.posts} 帖子</span>
          <span>{user.followers} 关注者</span>
        </div>
      </div>
      <button className="ml-4 px-3 py-1 bg-blue-500 text-white rounded text-sm">
        关注
      </button>
    </div>
  );

  return (
    <VirtualList
      data={users}
      containerHeight={600}
      itemHeight={88} // 固定高度便于性能优化
      overscan={3}
      renderItem={renderUser}
      getKey={user => user.id}
    />
  );
};
```

## 响应式高度

```tsx
function ResponsiveVirtualList() {
  const [containerHeight, setContainerHeight] = useState(400);

  useEffect(() => {
    const updateHeight = () => {
      // 根据窗口大小调整容器高度
      const height = window.innerHeight - 200;
      setContainerHeight(Math.max(300, height));
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <VirtualList
      data={data}
      containerHeight={containerHeight}
      itemHeight={60}
      renderItem={renderItem}
    />
  );
}
```

## API

### VirtualListProps

| 属性            | 类型                                     | 默认值 | 描述               |
| --------------- | ---------------------------------------- | ------ | ------------------ |
| data            | `T[]`                                    | `[]`   | 列表数据           |
| itemHeight      | `number`                                 | `50`   | 列表项高度（像素） |
| containerHeight | `number`                                 | `1000` | 容器高度（像素）   |
| overscan        | `number`                                 | `3`    | 预渲染项目数量     |
| getKey          | `(item: T) => number \| string`          | -      | 获取列表项唯一键值 |
| renderItem      | `(item: T, index?: number) => ReactNode` | -      | 渲染列表项的函数   |

### 类型定义

```tsx
interface VirtualListProps<T> {
  data: T[]; // 数据数组
  itemHeight?: number; // 项目高度
  containerHeight?: number; // 容器高度
  overscan?: number; // 预渲染数量
  getKey?: (item: T) => number | string; // 键值获取函数
  renderItem: (item: T, index?: number) => ReactNode; // 渲染函数
}
```

## 性能优化

### 1. 固定高度 vs 动态高度

```tsx
// ✅ 推荐：固定高度（最佳性能）
<VirtualList
  data={data}
  itemHeight={60}  // 固定高度
  containerHeight={400}
  renderItem={renderItem}
/>

// ⚠️ 谨慎使用：动态高度（性能较低但更灵活）
<VirtualList
  data={data}
  // 不设置 itemHeight
  containerHeight={400}
  renderItem={renderDynamicItem}
  overscan={5}  // 增加预渲染数量
/>
```

### 2. 渲染函数优化

````tsx
// ✅ 好的做法：使用 React.memo 优化渲染
const ListItem = React.memo<{ item: Item; index: number }>(({ item, index }) => (
  <div className="p-4 border-b">
    <h3>{item.name}</h3>
    <p>{item.description}</p>
  </div>
))

const renderItem = useCallback((item: Item, index?: number) => (
  <ListItem item={item} index={index ?? 0} />
), [])

```tsx
<VirtualList
  data={data}
  renderItem={renderItem}
  // ... 其他属性
/>
````

### 3. 大数据集处理

```tsx
// 处理超大数据集（10万+）
function MassiveDataList() {
  const [data] = useState(() => generateMassiveData(100000));

  const renderItem = useCallback(
    (item: Item) => (
      <div className="p-2 border-b text-sm">
        <span className="font-medium">{item.name}</span>
        <span className="ml-2 text-gray-500">{item.id}</span>
      </div>
    ),
    []
  );

  return (
    <VirtualList
      data={data}
      containerHeight={500}
      itemHeight={40} // 较小的行高
      overscan={2} // 较少的预渲染
      renderItem={renderItem}
      getKey={item => item.id}
    />
  );
}
```

## 高级用法

### 1. 嵌套虚拟列表

```tsx
interface Category {
  id: number;
  name: string;
  items: Item[];
}

const NestedVirtualList = () => {
  const categories: Category[] = generateCategories();

  const renderCategory = (category: Category) => (
    <div className="mb-4">
      <h2 className="text-lg font-bold p-4 bg-gray-100">{category.name}</h2>
      <VirtualList
        data={category.items}
        containerHeight={200}
        itemHeight={40}
        renderItem={item => (
          <div className="p-2 pl-8 border-b">{item.name}</div>
        )}
      />
    </div>
  );

  return (
    <VirtualList
      data={categories}
      containerHeight={600}
      renderItem={renderCategory}
    />
  );
};
```

### 2. 搜索和筛选

```tsx
function SearchableVirtualList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allData] = useState(generateLargeDataset());

  const filteredData = useMemo(() => {
    if (!searchTerm) return allData;
    return allData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allData, searchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="搜索..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <VirtualList
        data={filteredData}
        containerHeight={400}
        itemHeight={60}
        renderItem={item => (
          <div className="p-4 border-b">
            <h3>{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        )}
      />
    </div>
  );
}
```

### 3. 无限滚动

```tsx
function InfiniteVirtualList() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newData = await fetchMoreData(data.length);
      setData(prev => [...prev, ...newData]);
      setHasMore(newData.length > 0);
    } finally {
      setLoading(false);
    }
  }, [data.length, loading, hasMore]);

  const renderItem = useCallback(
    (item: Item, index?: number) => {
      // 在接近末尾时触发加载
      if (index === data.length - 10) {
        loadMore();
      }

      return (
        <div className="p-4 border-b">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      );
    },
    [data.length, loadMore]
  );

  return (
    <VirtualList
      data={data}
      containerHeight={500}
      itemHeight={80}
      renderItem={renderItem}
    />
  );
}
```

## 样式定制

```css
/* 容器样式 */
.virtual-list-container {
  overflow-y: auto;
  background-color: #f9fafb;
}

/* 列表项样式 */
.virtual-list-item {
  border-bottom: 1px solid #e5e7eb;
  padding: 16px;
  background-color: white;
  transition: background-color 0.2s ease;
}

.virtual-list-item:hover {
  background-color: #f3f4f6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .virtual-list-item {
    padding: 12px;
    font-size: 14px;
  }
}
```

## 最佳实践

### 1. 数据准备

```tsx
// ✅ 预处理数据，避免在渲染时计算
const processedData = useMemo(
  () =>
    rawData.map(item => ({
      ...item,
      displayName: `${item.firstName} ${item.lastName}`,
      formattedDate: formatDate(item.createdAt),
    })),
  [rawData]
);
```

### 2. 键值优化

```tsx
// ✅ 使用稳定的唯一键值
<VirtualList
  data={data}
  getKey={item => item.id} // 使用数据库ID
  // 避免使用索引作为键值
/>
```

### 3. 内存管理

```tsx
// ✅ 大数据集时考虑分页加载
const CHUNK_SIZE = 1000;

function ChunkedVirtualList() {
  const [visibleData, setVisibleData] = useState([]);

  // 只保持可见区域附近的数据在内存中
  const updateVisibleData = useCallback(
    (startIndex: number) => {
      const start = Math.max(0, startIndex - CHUNK_SIZE);
      const end = Math.min(allData.length, startIndex + CHUNK_SIZE * 2);
      setVisibleData(allData.slice(start, end));
    },
    [allData]
  );

  return (
    <VirtualList
      data={visibleData}
      // ... 其他属性
    />
  );
}
```

## 注意事项

1. **固定高度性能最佳**: 尽量使用固定的 `itemHeight` 以获得最佳性能
2. **动态高度的限制**: 动态高度会影响性能，适合数据量较小的场景
3. **键值的重要性**: 提供稳定的 `getKey` 函数有助于 React 优化渲染
4. **滚动节流**: 组件内置滚动节流，无需额外处理
5. **内存使用**: 超大数据集时考虑服务端分页或数据分块

## 兼容性

- React 16.8+
- TypeScript 4.0+
- 现代浏览器 (支持 Intersection Observer)
- 移动端友好

## 相关组件

- [DataTable](./DataTable.md) - 数据表格组件
- [List](./List.md) - 普通列表组件
- [ScrollArea](./ScrollArea.md) - 滚动区域组件
