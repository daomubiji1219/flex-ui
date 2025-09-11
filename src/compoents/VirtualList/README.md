# VirtualList 虚拟列表组件

一个高性能的虚拟滚动列表组件，专为处理大量数据而设计，通过只渲染可见区域的元素来实现极致的性能优化。

## 特性

- ✅ 虚拟滚动技术，支持海量数据渲染
- ✅ 自动高度检测和动态高度支持
- ✅ 可配置的缓冲区（overscan）
- ✅ 高性能滚动处理
- ✅ TypeScript 泛型支持
- ✅ 灵活的渲染函数和自定义key函数
- ✅ 响应式设计
- ✅ 内存占用优化
- ✅ 内置样式和Tailwind CSS支持

## 安装

```bash
pnpm add flexi-ui
```

## 基础用法

```tsx
import { VirtualList } from 'flexi-ui';
import type { ReactNode } from 'react';

interface ListItem {
  id: number;
  title: string;
  description: string;
}

// 生成大量数据
const data: ListItem[] = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  title: `项目 ${i}`,
  description: `这是第 ${i} 个项目的描述信息`,
}));

function App() {
  return (
    <VirtualList
      data={data}
      containerHeight={400}
      itemHeight={60}
      getKey={item => item.id}
      renderItem={(item, index) => (
        <div
          style={{
            height: '60px',
            padding: '16px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        </div>
      )}
    />
  );
}
```

## API

### VirtualListProps<T>

| 属性            | 类型                                     | 默认值 | 说明                                         |
| --------------- | ---------------------------------------- | ------ | -------------------------------------------- |
| data            | `T[]`                                    | -      | 列表数据数组                                 |
| containerHeight | `number`                                 | `1000` | 容器高度（px）                               |
| itemHeight      | `number`                                 | `50`   | 项目高度（px）                               |
| renderItem      | `(item: T, index?: number) => ReactNode` | -      | 项目渲染函数                                 |
| overscan        | `number`                                 | `3`    | 缓冲区项目数量                               |
| getKey          | `(item: T) => number \| string`          | -      | 获取项目唯一标识的函数，如果不提供则使用索引 |

## 高级用法

### 动态高度

VirtualList 组件支持自动高度检测。组件会自动测量每个项目的实际高度，并相应地调整虚拟滚动计算。

```tsx
function DynamicHeightList() {
  const items = Array.from({ length: 5000 }, (_, i) => ({
    id: i,
    title: `项目 ${i}`,
    content: `内容 ${i}`.repeat(Math.floor(Math.random() * 10) + 1),
  }));

  return (
    <VirtualList
      data={items}
      containerHeight={500}
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
```

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
```

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
