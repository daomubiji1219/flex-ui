# VirtualList 组件

一个高性能的虚拟滚动列表组件，专为处理大量数据而设计，支持动态高度和自适应渲染。

## 特性

- 🚀 高性能虚拟滚动，支持万级数据
- 📏 支持固定和动态行高
- 🎯 智能预渲染（overscan）
- 🔄 自动高度检测和缓存
- 📱 响应式设计
- 🎭 完全的 TypeScript 支持
- ⚡ 节流滚动优化
- 🎨 灵活的渲染函数

## 基础用法

<DemoContainer title="基础用法（实时演示）">
  <ReactDemo name="VirtualList" />
</DemoContainer>

```tsx
import { VirtualList } from '@flexi-ui/components';

const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

function App() {
  return (
    <VirtualList
      items={items}
      height={400}
      itemHeight={40}
      renderItem={(item, index) => (
        <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>
          {index + 1}. {item}
        </div>
      )}
    />
  );
}
```

## 自定义行高

```tsx
<VirtualList
  items={items}
  height={500}
  itemHeight={index => (index % 2 === 0 ? 40 : 60)}
  renderItem={item => <div>{item}</div>}
/>
```

## 滚动到指定项

```tsx
const ref = useRef<{ scrollTo: (index: number) => void }>(null)

<button onClick={() => ref.current?.scrollTo(500)}>滚动到第 500 项</button>

<VirtualList ref={ref} items={items} height={400} itemHeight={40} renderItem={(item) => <div>{item}</div>} />
```

## API

- items: unknown[] 数据源
- height: number 容器高度
- itemHeight: number | (index: number) => number 行高或计算函数
- renderItem: (item: unknown, index: number) => React.ReactNode 行渲染函数
- overscan?: number 预渲染行数

```tsx
import { VirtualList } from '@flexi-ui/components';

interface Item {
  id: number;
  name: string;
  description: string;
}

function App() {
  const data = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `Description for item ${i}`,
  }));

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
