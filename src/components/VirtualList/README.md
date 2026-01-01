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
# 或
npm install flexi-ui
# 或
yarn add flexi-ui
```

## 🚀 快速开始

### 基础用法

```tsx
import { VirtualList } from 'flexi-ui';
import type { ReactNode } from 'react';

interface ListItem {
  id: number;
  title: string;
  description: string;
  avatar?: string;
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

### VirtualListProps<T>

| 属性            | 类型                                     | 默认值 | 必填 | 说明                                            |
| --------------- | ---------------------------------------- | ------ | ---- | ----------------------------------------------- |
| data            | `T[]`                                    | -      | ✅   | 列表数据数组，支持任意类型的数据结构            |
| renderItem      | `(item: T, index?: number) => ReactNode` | -      | ✅   | 项目渲染函数，接收数据项和索引，返回 React 节点 |
| containerHeight | `number`                                 | `1000` | ❌   | 容器高度（px），决定可视区域大小                |
| itemHeight      | `number`                                 | `50`   | ❌   | 项目预估高度（px），用于初始计算和性能优化      |
| overscan        | `number`                                 | `3`    | ❌   | 缓冲区项目数量，增加可提升滚动流畅度            |
| getKey          | `(item: T) => number \| string`          | -      | ❌   | 获取项目唯一标识的函数，优化渲染性能            |
| className       | `string`                                 | -      | ❌   | 自定义 CSS 类名，用于样式定制                   |

### 属性详解

#### data

- **类型**: `T[]`
- **说明**: 要渲染的数据数组，支持任意数据结构
- **性能**: 组件会自动优化大数据集的渲染，支持百万级数据

#### renderItem

- **类型**: `(item: T, index?: number) => ReactNode`
- **说明**: 自定义渲染函数，用于定义每个列表项的展示方式
- **参数**:
  - `item`: 当前数据项
  - `index`: 当前项在原始数据中的索引（可选）
- **返回**: React 节点

#### containerHeight

- **类型**: `number`
- **默认值**: `1000`
- **说明**: 虚拟列表容器的高度，决定可视区域大小
- **建议**: 根据实际布局需求设置，过小会影响用户体验

#### itemHeight

- **类型**: `number`
- **默认值**: `50`
- **说明**: 列表项的预估高度，用于初始渲染计算
- **注意**: 组件支持动态高度，会自动调整实际高度

#### overscan

- **类型**: `number`
- **默认值**: `3`
- **说明**: 可视区域外额外渲染的项目数量
- **性能**: 适当增加可提升滚动流畅度，但会增加内存占用

#### getKey

- **类型**: `(item: T) => number | string`
- **说明**: 生成列表项唯一标识的函数
- **优化**: 提供稳定的 key 可以优化 React 的 diff 算法性能
- **默认**: 如不提供，将使用数组索引作为 key

## 🔧 高级用法

### 与其他组件集成

#### 在 DataTable 中使用

```tsx
import { DataTable, VirtualList } from 'flexi-ui';

// DataTable 会自动在数据量大于 100 条时启用虚拟滚动
function LargeDataTable() {
  const data = Array.from({ length: 50000 }, (_, i) => ({
    id: i,
    name: `用户 ${i}`,
    email: `user${i}@example.com`,
    department: `部门 ${i % 10}`,
  }));

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey="id"
      virtualScroll // 启用虚拟滚动
      pagination={{ pageSize: 50 }}
    />
  );
}
```

### 复杂数据结构处理

```tsx
interface ComplexItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  content: {
    title: string;
    body: string;
    tags: string[];
    attachments?: File[];
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    views: number;
  };
}

function ComplexVirtualList() {
  const complexData: ComplexItem[] = generateComplexData(100000);

  return (
    <VirtualList
      data={complexData}
      containerHeight={600}
      itemHeight={120}
      overscan={5}
      getKey={item => item.id}
      renderItem={item => (
        <div className="complex-item">
          <div className="user-info">
            <img src={item.user.avatar} alt={item.user.name} />
            <div>
              <h4>{item.user.name}</h4>
              <span className="role">{item.user.role}</span>
            </div>
          </div>
          <div className="content">
            <h3>{item.content.title}</h3>
            <p>{item.content.body}</p>
            <div className="tags">
              {item.content.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="metadata">
            <span>创建: {item.metadata.createdAt.toLocaleDateString()}</span>
            <span>浏览: {item.metadata.views}</span>
          </div>
        </div>
      )}
    />
  );
}
```

## ⚡ 性能优化

### 自定义样式

#### 使用 className

```tsx
import { VirtualList } from 'flexi-ui';

// 基础用法
<VirtualList data={data} renderItem={renderItem} className="my-virtual-list" />;

// 结合 CSS Modules
import styles from './VirtualList.module.css';

<VirtualList
  data={data}
  renderItem={renderItem}
  className={styles.customList}
/>;

// 结合 styled-components
import styled from 'styled-components';

const StyledVirtualList = styled(VirtualList)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /* 自定义滚动条 */
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
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

<StyledVirtualList data={data} renderItem={renderItem} />;
```

#### 响应式虚拟列表

```tsx
import { useState, useEffect } from 'react';
import { VirtualList } from 'flexi-ui';

function ResponsiveVirtualList() {
  const [containerHeight, setContainerHeight] = useState(400);

  useEffect(() => {
    const updateHeight = () => {
      const height = window.innerHeight * 0.6; // 60% 视口高度
      setContainerHeight(height);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <VirtualList
      data={data}
      renderItem={renderItem}
      containerHeight={containerHeight}
      className="responsive-virtual-list"
    />
  );
}

/* CSS 样式 */
.responsive-virtual-list {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 0 16px;
  }
}
```

### 最佳实践

#### 1. 合理设置 overscan

```tsx
// 根据滚动速度调整缓冲区大小
<VirtualList
  data={data}
  overscan={3} // 慢速滚动场景
  // overscan={8} // 快速滚动场景
/>
```

#### 2. 优化渲染函数

```tsx
// ❌ 避免在 renderItem 中创建复杂对象
const BadExample = () => (
  <VirtualList
    data={data}
    renderItem={item => (
      <div
        style={
          {
            /* 复杂样式对象 */
          }
        }
      >
        {/* 复杂计算 */}
        {expensiveCalculation(item)}
      </div>
    )}
  />
);

// ✅ 推荐做法：预计算和样式复用
const itemStyle = { padding: '16px', borderBottom: '1px solid #eee' };
const GoodExample = () => {
  const processedData = useMemo(
    () =>
      data.map(item => ({
        ...item,
        displayValue: expensiveCalculation(item),
      })),
    [data]
  );

  return (
    <VirtualList
      data={processedData}
      renderItem={item => <div style={itemStyle}>{item.displayValue}</div>}
    />
  );
};
```

#### 3. 稳定的 key 函数

```tsx
// ✅ 使用稳定的唯一标识
<VirtualList
  data={data}
  getKey={item => item.id} // 推荐
  // getKey={item => `${item.type}-${item.id}`} // 复合 key
/>
```

### 性能监控

```tsx
function PerformanceMonitoredList() {
  const [renderTime, setRenderTime] = useState(0);

  const handleRender = useCallback(() => {
    const start = performance.now();

    // 渲染完成后测量时间
    requestAnimationFrame(() => {
      setRenderTime(performance.now() - start);
    });
  }, []);

  return (
    <div>
      <div>渲染时间: {renderTime.toFixed(2)}ms</div>
      <VirtualList
        data={data}
        containerHeight={400}
        renderItem={item => {
          handleRender();
          return <div>{item.title}</div>;
        }}
      />
    </div>
  );
}
```

## 🎨 样式定制

### CSS-in-JS 样式

```tsx
import styled from '@emotion/styled';

const StyledVirtualList = styled(VirtualList)`
  .virtual-list-container {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .virtual-list-item {
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f5f5f5;
    }
  }
`;
```

### 主题支持

```tsx
import { ThemeProvider } from '@emotion/react';

const theme = {
  virtualList: {
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    hoverColor: '#f5f5f5',
    scrollbarColor: '#c0c0c0',
  },
};

function ThemedApp() {
  return (
    <ThemeProvider theme={theme}>
      <VirtualList
        data={data}
        renderItem={item => (
          <div
            css={theme => ({
              backgroundColor: theme.virtualList.backgroundColor,
              '&:hover': {
                backgroundColor: theme.virtualList.hoverColor,
              },
            })}
          >
            {item.title}
          </div>
        )}
      />
    </ThemeProvider>
  );
}
```

      itemHeight={80} // 初始估计高度，组件会自动调整
      getKey={item => item.id}
      renderItem={(item, index) => (
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #eee',
            boxSizing: 'border-box',
          }}
        >
          <h4>{item.title}</h4>
          <p style={{ wordWrap: 'break-word' }}>{item.content}</p>
        </div>
      )}
    />

);
}

````

> **注意**: `itemHeight` 属性用作初始估计值。组件会在渲染时自动测量每个项目的实际高度，并更新内部高度缓存以确保准确的滚动计算。

### 复杂项目渲染

```tsx
interface ComplexItem {
  id: number;
  avatar: string;
  name: string;
  email: string;
  status: 'online' | 'offline';
  lastSeen: Date;
  tags: string[];
}

function ComplexItemList() {
  const items: ComplexItem[] = generateComplexItems(10000);

  return (
    <VirtualList
      data={items}
      containerHeight={600}
      itemHeight={120}
      getKey={item => item.id}
      renderItem={(item, index) => (
        <div
          className="complex-item"
          style={{
            height: '120px',
            padding: '16px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: index % 2 === 0 ? '#f9fafb' : '#ffffff',
          }}
        >
          <img
            src={item.avatar}
            alt={item.name}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              marginRight: '16px',
            }}
          />

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <h4 style={{ margin: 0, marginRight: '8px' }}>{item.name}</h4>
              <span
                className={`status-indicator ${item.status}`}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor:
                    item.status === 'online' ? '#10b981' : '#6b7280',
                }}
              />
            </div>

            <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
              {item.email}
            </p>

            <div style={{ display: 'flex', gap: '4px' }}>
              {item.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '2px 8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#374151',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{ textAlign: 'right', color: '#6b7280', fontSize: '12px' }}
          >
            {item.status === 'online'
              ? '在线'
              : `最后在线: ${formatDate(item.lastSeen)}`}
          </div>
        </div>
      )}
    />
  );
}
````

### 搜索和筛选

```tsx
function SearchableVirtualList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const allItems = useMemo(() => generateItems(10000), []);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || item.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [allItems, searchTerm, filter]);

  return (
    <div>
      <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <input
          type="text"
          placeholder="搜索项目..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '300px',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            marginRight: '16px',
          }}
        />

        <select
          value={filter}
          onChange={e => setFilter(e.target.value as any)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
          }}
        >
          <option value="all">全部</option>
          <option value="active">活跃</option>
          <option value="inactive">非活跃</option>
        </select>

        <span style={{ marginLeft: '16px', color: '#6b7280' }}>
          共 {filteredItems.length} 项
        </span>
      </div>

      <VirtualList
        data={filteredItems}
        containerHeight={400}
        itemHeight={60}
        getKey={item => item.id}
        renderItem={(item, index) => (
          <div
            style={{
              height: '60px',
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h4 style={{ margin: 0 }}>{item.title}</h4>
              <p style={{ margin: 0, color: '#6b7280' }}>{item.description}</p>
            </div>
            <span className={`status ${item.status}`}>
              {item.status === 'active' ? '活跃' : '非活跃'}
            </span>
          </div>
        )}
      />
    </div>
  );
}
```

### 无限滚动

```tsx
function InfiniteScrollList() {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchItems(items.length, 50);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
    } finally {
      setLoading(false);
    }
  }, [items.length, loading, hasMore]);

  useEffect(() => {
    loadMoreItems(); // 初始加载
  }, []);

  const handleScroll = useCallback(
    (scrollTop: number, containerHeight: number, totalHeight: number) => {
      // 当滚动到底部附近时加载更多
      if (scrollTop + containerHeight >= totalHeight - 200) {
        loadMoreItems();
      }
    },
    [loadMoreItems]
  );

  return (
    <VirtualList
      data={items}
      containerHeight={500}
      itemHeight={80}
      getKey={item => item.id}
      renderItem={(item, index) => (
        <div
          style={{
            height: '80px',
            padding: '16px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
          {index === items.length - 1 && loading && (
            <div style={{ marginLeft: 'auto' }}>加载中...</div>
          )}
        </div>
      )}
    />
  );
}
```

### 性能监控

```tsx
function PerformanceMonitoredList() {
  const [renderCount, setRenderCount] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

  const items = useMemo(() => generateItems(50000), []);

  const renderItem = useCallback(
    (item: ListItem, index: number) => {
      // 监控渲染次数
      useEffect(() => {
        setRenderCount(prev => prev + 1);
      }, []);

      return (
        <div
          key={item.id}
          style={{
            height: '60px',
            padding: '16px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h4>{item.title}</h4>
            <p>索引: {index}</p>
          </div>
          <small>渲染次数: {renderCount}</small>
        </div>
      );
    },
    [renderCount]
  );

  return (
    <div>
      <div style={{ padding: '16px', backgroundColor: '#f3f4f6' }}>
        <p>总项目数: {items.length}</p>
        <p>
          可见范围: {visibleRange.start} - {visibleRange.end}
        </p>
        <p>渲染的项目数: {visibleRange.end - visibleRange.start}</p>
        <p>总渲染次数: {renderCount}</p>
      </div>

      <VirtualList
        data={items}
        containerHeight={400}
        itemHeight={60}
        getKey={item => item.id}
        renderItem={renderItem}
      />
    </div>
  );
}
```

## 性能优化

### 最佳实践

```tsx
// ✅ 使用 useMemo 缓存数据
const memoizedItems = useMemo(() => {
  return processItems(rawData);
}, [rawData]);

// ✅ 使用 useCallback 缓存渲染函数
const renderItem = useCallback((item: ListItem, index: number) => {
  return <div key={item.id}>{/* 项目内容 */}</div>;
}, []);

// ✅ 合理设置缓冲区大小
<VirtualList
  data={memoizedItems}
  containerHeight={400}
  itemHeight={60}
  overscan={5} // 不要设置过大
  getKey={item => item.id}
  renderItem={renderItem}
/>;
```

### 避免常见性能问题

```tsx
// ❌ 避免在渲染函数中创建新对象
const badRenderItem = (item: ListItem, index: number) => (
  <div
    key={item.id}
    style={{ height: '60px', padding: '16px' }} // 每次都创建新对象
  >
    {item.title}
  </div>
);

// ✅ 预定义样式对象
const itemStyle = { height: '60px', padding: '16px' };
const goodRenderItem = (item: ListItem, index: number) => (
  <div key={item.id} style={itemStyle}>
    {item.title}
  </div>
);

// ❌ 避免在渲染函数中进行复杂计算
const badRenderItem2 = (item: ListItem, index: number) => (
  <div key={item.id}>
    {expensiveCalculation(item)} {/* 每次渲染都计算 */}
  </div>
);

// ✅ 预计算或使用 useMemo
const processedItems = useMemo(() => {
  return items.map(item => ({
    ...item,
    processedValue: expensiveCalculation(item),
  }));
}, [items]);
```

## 样式定制

### 内置样式

VirtualList 组件使用 Tailwind CSS 提供默认样式：

- 容器：`overflow-y-auto bg-gray-50`
- 项目：`border-b p-4 text-center bg-white hover:bg-blue-50 transition-colors`

### 自定义样式

你可以通过以下方式自定义样式：

1. **在 renderItem 中添加自定义样式**：

```tsx
<VirtualList
  data={items}
  containerHeight={400}
  itemHeight={60}
  getKey={item => item.id}
  renderItem={(item, index) => (
    <div
      className="custom-item-class"
      style={{
        backgroundColor: index % 2 === 0 ? '#f9fafb' : '#ffffff',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      {/* 项目内容 */}
    </div>
  )}
/>
```

2. **使用 CSS 覆盖默认样式**：

```css
/* 自定义容器样式 */
.virtual-list-container {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

/* 自定义滚动条 */
.virtual-list-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.virtual-list-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.virtual-list-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
```

## 可访问性

```tsx
<VirtualList
  data={items}
  containerHeight={400}
  itemHeight={60}
  getKey={item => item.id}
  renderItem={(item, index) => (
    <div
      role="listitem"
      aria-label={`项目 ${index + 1}: ${item.title}`}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleItemClick(item);
        }
      }}
    >
      {item.title}
    </div>
  )}
/>
```

## 测试

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { VirtualList } from './VirtualList';

const mockData = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
  description: `Description for item ${i}`,
}));

test('renders only visible items', () => {
  const { container } = render(
    <VirtualList
      data={mockData}
      containerHeight={200}
      itemHeight={50}
      getKey={item => item.id}
      renderItem={item => <div data-testid="list-item">{item.name}</div>}
    />
  );

  // 应该只渲染可见的元素，而不是1000个
  const renderedItems = container.querySelectorAll('[data-testid="list-item"]');
  expect(renderedItems.length).toBeLessThan(20);
  expect(renderedItems.length).toBeGreaterThan(0);
});

test('handles scroll events', () => {
  const { container } = render(
    <VirtualList
      data={mockData}
      containerHeight={200}
      itemHeight={50}
      getKey={item => item.id}
      renderItem={item => <div data-testid="list-item">{item.name}</div>}
    />
  );

  const scrollContainer = container.firstChild as HTMLElement;

  // 模拟滚动
  fireEvent.scroll(scrollContainer, { target: { scrollTop: 250 } });

  // 验证滚动后的状态
  expect(scrollContainer.scrollTop).toBe(250);
});
```

## 故障排除

### 常见问题

**Q: 列表项目闪烁或跳跃？**
A: 确保为每个项目提供稳定的 `key` 属性，避免使用数组索引作为 key。

**Q: 动态高度计算不准确？**
A: 确保 `itemHeight` 函数返回的高度与实际渲染的高度一致。

**Q: 滚动性能不佳？**
A: 检查 `renderItem` 函数是否进行了不必要的计算，使用 `useCallback` 和 `useMemo` 进行优化。

**Q: 内存占用过高？**
A: 减少 `overscan` 值，避免在渲染函数中创建大量对象。

### 调试技巧

```tsx
// 添加调试信息
<VirtualList
  data={items}
  containerHeight={400}
  itemHeight={60}
  getKey={item => item.id}
  renderItem={(item, index) => {
    console.log(`渲染项目 ${index}:`, item);
    return (
      <div>
        {item.title} (索引: {index})
      </div>
    );
  }}
/>
```

## 更新日志

### v1.0.0

- 初始版本发布
- 支持固定高度虚拟滚动

### v1.1.0

- 添加动态高度支持
- 优化滚动性能

### v1.2.0

- 添加缓冲区配置
- 改进内存管理
- 修复边界情况

## 相关组件

- [DataTable](../DataTable/README.md) - 数据表格组件
- [InfiniteScroll](../InfiniteScroll/README.md) - 无限滚动组件
- [LazyList](../LazyList/README.md) - 懒加载列表组件

## 许可证

MIT License
