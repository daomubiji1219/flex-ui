import React, { useMemo, useState } from 'react';
import { VirtualList } from '../components/VirtualList/VirtualList';
import { Button } from '../components/Button/Button';

// 示例数据类型
interface ListItem {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

// 生成示例数据
const generateSampleData = (count: number): ListItem[] => {
  const categories = ['工作', '学习', '生活', '娱乐', '健康'];
  const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `任务 ${index + 1}`,
    description: `这是第 ${index + 1} 个任务的详细描述，包含了一些重要的信息和说明。`,
    category: categories[Math.floor(Math.random() * categories.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    createdAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString('zh-CN'),
  }));
};

const VirtualListExample: React.FC = () => {
  const [itemCount, setItemCount] = useState(1000);
  const [containerHeight, setContainerHeight] = useState(400);
  const [itemHeight, setItemHeight] = useState(80);

  const data = useMemo(() => generateSampleData(itemCount), [itemCount]);

  // 渲染列表项
  const renderItem = (item: ListItem, index?: number) => {
    const priorityColors = {
      high: '#ff4d4f',
      medium: '#faad14',
      low: '#52c41a',
    };

    return (
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: index && index % 2 === 0 ? '#fafafa' : '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
            {item.title}
          </h4>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                backgroundColor: priorityColors[item.priority],
                color: 'white',
              }}
            >
              {item.priority === 'high'
                ? '高'
                : item.priority === 'medium'
                  ? '中'
                  : '低'}
            </span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {item.category}
            </span>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: '#666',
            lineHeight: '1.4',
          }}
        >
          {item.description}
        </p>
        <div style={{ fontSize: '11px', color: '#999' }}>
          创建时间: {item.createdAt} | ID: {item.id}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>VirtualList 虚拟列表示例</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        虚拟列表组件可以高效渲染大量数据，只渲染可视区域内的元素，提升性能。
      </p>

      {/* 控制面板 */}
      <div
        style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div>
          <label style={{ fontSize: '14px', marginRight: '8px' }}>
            数据量:
          </label>
          <select
            value={itemCount}
            onChange={e => setItemCount(Number(e.target.value))}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
            }}
          >
            <option value={100}>100 条</option>
            <option value={1000}>1,000 条</option>
            <option value={5000}>5,000 条</option>
            <option value={10000}>10,000 条</option>
            <option value={50000}>50,000 条</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '14px', marginRight: '8px' }}>
            容器高度:
          </label>
          <select
            value={containerHeight}
            onChange={e => setContainerHeight(Number(e.target.value))}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
            }}
          >
            <option value={300}>300px</option>
            <option value={400}>400px</option>
            <option value={500}>500px</option>
            <option value={600}>600px</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '14px', marginRight: '8px' }}>
            项目高度:
          </label>
          <select
            value={itemHeight}
            onChange={e => setItemHeight(Number(e.target.value))}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
            }}
          >
            <option value={60}>60px</option>
            <option value={80}>80px</option>
            <option value={100}>100px</option>
            <option value={120}>120px</option>
          </select>
        </div>

        <Button
          onClick={() => setItemCount(Math.floor(Math.random() * 10000) + 1000)}
          variant="outline"
          size="sm"
        >
          随机数据量
        </Button>
      </div>

      {/* 信息展示 */}
      <div
        style={{
          marginBottom: '16px',
          fontSize: '14px',
          color: '#666',
          display: 'flex',
          gap: '16px',
        }}
      >
        <span>
          总数据量: <strong>{data.length.toLocaleString()}</strong> 条
        </span>
        <span>
          容器高度: <strong>{containerHeight}px</strong>
        </span>
        <span>
          项目高度: <strong>{itemHeight}px</strong>
        </span>
        <span>
          预计可见项目:{' '}
          <strong>{Math.ceil(containerHeight / itemHeight)}</strong> 个
        </span>
      </div>

      {/* 虚拟列表 */}
      <div
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <VirtualList
          data={data}
          containerHeight={containerHeight}
          itemHeight={itemHeight}
          overscan={5}
          getKey={item => item.id}
          renderItem={renderItem}
        />
      </div>

      {/* 性能说明 */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#e6f7ff',
          borderRadius: '8px',
          fontSize: '14px',
        }}
      >
        <h4 style={{ margin: '0 0 8px 0', color: '#1890ff' }}>性能优势</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
          <li>只渲染可视区域内的元素，大幅减少 DOM 节点数量</li>
          <li>支持动态高度和固定高度两种模式</li>
          <li>内置节流优化，减少滚动时的重复计算</li>
          <li>支持预渲染（overscan）提升滚动体验</li>
          <li>适用于大数据量列表场景，如数据表格、聊天记录等</li>
        </ul>
      </div>
    </div>
  );
};

export default VirtualListExample;
